import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  addMember,
  assertAccess,
  auditToCsv,
  createOrg,
  createStore,
  createViolation,
  findUserByEmail,
  getOrg,
  getOrgSettings,
  getViolation,
  ingestWebhookViolation,
  issueToken,
  listAudit,
  listViolations,
  patchOrgSettings,
  patchViolation,
  registerUser,
  resolveToken,
  rotateWebhookSecret,
  runBatchForecast,
  runForecast,
  type OrgRole,
  type Store,
} from "./store.js";
import { listGoldenCards } from "./goldens.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

type Json = Record<string, unknown>;

async function readRawBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function readBody(req: IncomingMessage): Promise<Json> {
  const raw = await readRawBody(req);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString("utf8")) as Json;
  } catch {
    return {};
  }
}

function verifyHmac(secret: string, raw: Buffer, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.trim());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function send(
  res: ServerResponse,
  status: number,
  body: unknown,
  extra: Record<string, string> = {},
) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
    ...extra,
  });
  res.end(payload);
}

function getToken(req: IncomingMessage): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function authUserId(store: Store, req: IncomingMessage): string | null {
  const token = getToken(req);
  if (!token) return null;
  return resolveToken(store, token);
}

function checkRateLimit(store: Store, req: IncomingMessage, res: ServerResponse): boolean {
  const key = getToken(req) ?? req.socket.remoteAddress ?? "anon";
  const n = (store.rateCounts.get(key) ?? 0) + 1;
  store.rateCounts.set(key, n);
  if (n > store.rateLimit) {
    send(res, 429, { error: "rate_limit_exceeded" }, { "retry-after": "1" });
    return false;
  }
  return true;
}

function serveStatic(res: ServerResponse, urlPath: string): boolean {
  const clean = urlPath === "/" ? "/money-honesty.html" : urlPath;
  const filePath = join(publicDir, clean.replace(/^\//, ""));
  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) return false;
  const body = readFileSync(filePath);
  res.writeHead(200, {
    "content-type": MIME[extname(filePath)] ?? "application/octet-stream",
    "content-length": body.length,
  });
  res.end(body);
  return true;
}

function violationInputFromBody(body: Json) {
  return {
    label: body.label !== undefined ? String(body.label) : undefined,
    culpability: body.culpability !== undefined ? String(body.culpability) : undefined,
    duty_loss: body.duty_loss !== undefined ? Number(body.duty_loss) : undefined,
    domestic_value: body.domestic_value !== undefined ? Number(body.domestic_value) : undefined,
    dutiable_value: body.dutiable_value !== undefined ? Number(body.dutiable_value) : undefined,
    flat_2x_cheat: body.flat_2x_cheat === true,
    dual_approver_cheat: body.dual_approver_cheat === true,
    ignore_domestic_cap: body.ignore_domestic_cap === true,
  };
}

export function createApp(opts: { rateLimit?: number; store?: Store } = {}) {
  const store = opts.store ?? createStore({ rateLimit: opts.rateLimit });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;

    if (method === "GET" && (path === "/" || path.endsWith(".html") || path.endsWith(".css"))) {
      if (serveStatic(res, path)) return;
    }

    if (method === "GET" && path === "/health") {
      return send(res, 200, { ok: true, product: "c1592" });
    }

    if (!checkRateLimit(store, req, res)) return;

    if (method === "POST" && path === "/auth/register") {
      const body = await readBody(req);
      const email = String(body.email ?? "");
      const password = String(body.password ?? "");
      if (!email || !password) return send(res, 400, { error: "email_password_required" });
      if (findUserByEmail(store, email)) return send(res, 409, { error: "email_taken" });
      const user = registerUser(store, email, password);
      const token = issueToken(store, user.id);
      return send(res, 201, { user, token });
    }

    if (method === "POST" && path === "/webhooks/violations") {
      const raw = await readRawBody(req);
      let body: Json = {};
      try {
        body = raw.length ? (JSON.parse(raw.toString("utf8")) as Json) : {};
      } catch {
        return send(res, 400, { error: "invalid_json" });
      }
      const orgId = String(body.orgId ?? body.org_id ?? "").trim();
      if (!orgId) return send(res, 400, { error: "org_id_required" });
      const settings = getOrgSettings(store, orgId);
      if (!settings) return send(res, 404, { error: "org_not_found" });
      const signature =
        (req.headers["x-c1592-signature"] as string | undefined) ??
        (req.headers["x-signature"] as string | undefined);
      if (!verifyHmac(settings.webhook_secret, raw, signature)) {
        return send(res, 401, { error: "invalid_signature" });
      }
      const idempotencyKey = String(
        req.headers["idempotency-key"] ?? body.idempotency_key ?? "",
      ).trim();
      const vBody = (
        body.violation && typeof body.violation === "object"
          ? (body.violation as Json)
          : body
      ) as Json;
      const result = ingestWebhookViolation(
        store,
        orgId,
        idempotencyKey,
        violationInputFromBody(vBody),
      );
      if (!result.ok) return send(res, result.status, { error: result.error });
      return send(res, result.status, {
        violation: result.violation,
        replay: result.replay,
      });
    }

    if (method === "POST" && path === "/orgs") {
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const body = await readBody(req);
      const name = String(body.name ?? "").trim();
      if (!name) return send(res, 400, { error: "name_required" });
      const org = createOrg(store, userId, name);
      return send(res, 201, { org });
    }

    const membersMatch = path.match(/^\/orgs\/([^/]+)\/members$/);
    if (membersMatch && method === "POST") {
      const orgId = membersMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const role = String(body.role ?? "auditor") as OrgRole;
      if (!["admin", "analyst", "auditor"].includes(role)) {
        return send(res, 400, { error: "bad_role" });
      }
      const result = addMember(store, orgId, String(body.userId ?? ""), role);
      if (!result.ok) return send(res, 400, { error: result.error });
      return send(res, 201, { ok: true });
    }

    if (method === "GET" && path === "/goldens") {
      return send(res, 200, listGoldenCards());
    }

    const goldensMatch = path.match(/^\/orgs\/([^/]+)\/goldens$/);
    if (goldensMatch && method === "GET") {
      const orgId = goldensMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const cards = listGoldenCards();
      return send(res, 200, {
        ...cards,
        total: Array.isArray(cards.cards) ? cards.cards.length : cards.total,
        all_pass: cards.all_pass ?? true,
      });
    }

    const batchMatch = path.match(/^\/orgs\/([^/]+)\/batch\/forecast$/);
    if (batchMatch && method === "POST") {
      const orgId = batchMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store, orgId)) return send(res, 404, { error: "org_not_found" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const ids = Array.isArray(body.violation_ids)
        ? body.violation_ids.map((id) => String(id))
        : [];
      const batch = runBatchForecast(store, orgId, ids, userId);
      return send(res, 200, batch);
    }

    const auditMatch = path.match(/^\/orgs\/([^/]+)\/audit$/);
    if (auditMatch && method === "GET") {
      const orgId = auditMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const listed = listAudit(store, orgId, {
        limit: url.searchParams.get("limit")
          ? Number(url.searchParams.get("limit"))
          : undefined,
        offset: url.searchParams.get("offset")
          ? Number(url.searchParams.get("offset"))
          : undefined,
      });
      if (url.searchParams.get("format") === "csv") {
        const csv = auditToCsv(listed.events);
        res.writeHead(200, {
          "content-type": "text/csv; charset=utf-8",
          "content-length": Buffer.byteLength(csv),
        });
        res.end(csv);
        return;
      }
      return send(res, 200, listed);
    }

    const settingsMatch = path.match(/^\/orgs\/([^/]+)\/settings$/);
    if (settingsMatch) {
      const orgId = settingsMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const role = assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"]);
      if (!role) return send(res, 403, { error: "forbidden" });

      if (method === "GET") {
        const settings = getOrgSettings(store, orgId);
        if (!settings) return send(res, 404, { error: "not_found" });
        if (role === "admin") {
          return send(res, 200, { settings });
        }
        return send(res, 200, {
          settings: {
            orgId: settings.orgId,
            webhook_secret: null,
            tokens_note: null,
            updated_at: settings.updated_at,
            note: "webhook secret and tokens note visible to admin only",
          },
        });
      }

      if (method === "PATCH") {
        if (role !== "admin") return send(res, 403, { error: "forbidden" });
        const body = await readBody(req);
        if (body.rotate_webhook_secret === true || body.rotateWebhookSecret === true) {
          const rotated = rotateWebhookSecret(store, orgId);
          return send(res, 200, { settings: rotated });
        }
        const patch: { webhook_secret?: string; tokens_note?: string } = {};
        if (body.webhook_secret !== undefined) patch.webhook_secret = String(body.webhook_secret);
        if (body.tokens_note !== undefined) patch.tokens_note = String(body.tokens_note);
        if (!Object.keys(patch).length) {
          return send(res, 400, {
            error: "webhook_secret, tokens_note, or rotate_webhook_secret required",
          });
        }
        const updated = patchOrgSettings(store, orgId, patch);
        return send(res, 200, { settings: updated });
      }
    }

    const vMatch = path.match(
      /^\/orgs\/([^/]+)\/violations(?:\/([^/]+))?(?:\/(forecast))?$/,
    );
    if (vMatch) {
      const orgId = vMatch[1]!;
      const violationId = vMatch[2];
      const forecast = vMatch[3] === "forecast";
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store, orgId)) return send(res, 404, { error: "org_not_found" });

      if (method === "GET" && !violationId) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        return send(
          res,
          200,
          listViolations(store, orgId, {
            limit: url.searchParams.get("limit")
              ? Number(url.searchParams.get("limit"))
              : undefined,
            offset: url.searchParams.get("offset")
              ? Number(url.searchParams.get("offset"))
              : undefined,
          }),
        );
      }

      if (method === "POST" && !violationId) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        const violation = createViolation(store, orgId, violationInputFromBody(body), userId);
        return send(res, 201, { violation });
      }

      if (method === "GET" && violationId && !forecast) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const violation = getViolation(store, orgId, violationId);
        if (!violation) return send(res, 404, { error: "not_found" });
        return send(res, 200, { violation });
      }

      if (method === "PATCH" && violationId && !forecast) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        const violation = patchViolation(
          store,
          orgId,
          violationId,
          violationInputFromBody(body),
          userId,
        );
        if (!violation) return send(res, 404, { error: "not_found" });
        return send(res, 200, { violation });
      }

      if (method === "POST" && violationId && forecast) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const outcome = runForecast(store, orgId, violationId, userId);
        if (!outcome) return send(res, 404, { error: "not_found" });
        if (outcome.status === "reject") return send(res, 422, outcome);
        return send(res, 200, outcome);
      }
    }

    send(res, 404, { error: "not_found" });
  });

  return { server, store };
}
