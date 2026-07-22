import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  addMember,
  assertAccess,
  auditToCsv,
  createCitation,
  createOrg,
  createStore,
  findUserByEmail,
  getCitation,
  getOrg,
  getOrgSettings,
  ingestWebhookCitation,
  issueToken,
  listAudit,
  listCitations,
  patchCitation,
  patchOrgSettings,
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

function citationInputFromBody(body: Json) {
  return {
    classification: String(body.classification ?? ""),
    gravity_tier: String(body.gravity_tier ?? "moderate"),
    gbp_amount: Number(body.gbp_amount),
    size_pct: Number(body.size_pct ?? 0),
    history_pct: Number(body.history_pct ?? 0),
    good_faith_pct: Number(body.good_faith_pct ?? 0),
    quick_fix_pct: Number(body.quick_fix_pct ?? 0),
    use_statutory_max: body.use_statutory_max === true,
    additive_cheat: body.additive_cheat === true,
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
      return send(res, 200, { ok: true, product: "oshamult" });
    }

    if (!checkRateLimit(store, req, res)) return;

    if (method === "POST" && path === "/webhooks/citations") {
      const raw = await readRawBody(req);
      let body: Json = {};
      try {
        body = raw.length ? (JSON.parse(raw.toString("utf8")) as Json) : {};
      } catch {
        return send(res, 400, { error: "invalid_json" });
      }
      const orgId = String(body.orgId ?? body.org_id ?? "");
      if (!orgId) return send(res, 400, { error: "orgId_required" });
      const settings = getOrgSettings(store, orgId);
      if (!settings) return send(res, 404, { error: "org_not_found" });
      const signature =
        (req.headers["x-signature"] as string | undefined) ??
        (req.headers["x-hub-signature-256"] as string | undefined);
      if (!verifyHmac(settings.webhook_secret, raw, signature)) {
        return send(res, 401, { error: "invalid_signature" });
      }
      const idempotencyKey = String(
        req.headers["idempotency-key"] ?? body.idempotency_key ?? "",
      ).trim();
      if (!idempotencyKey) return send(res, 400, { error: "idempotency_key_required" });
      const ingested = ingestWebhookCitation(
        store,
        orgId,
        citationInputFromBody(body),
        idempotencyKey,
      );
      if ("error" in ingested) return send(res, 400, { error: ingested.error });
      return send(res, ingested.replay ? 200 : 201, {
        citation: ingested.citation,
        replay: ingested.replay,
      });
    }

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

    const batchMatch = path.match(/^\/orgs\/([^/]+)\/batch\/forecast$/);
    if (method === "POST" && batchMatch) {
      const orgId = batchMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store, orgId)) return send(res, 404, { error: "org_not_found" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const ids = Array.isArray(body.citationIds)
        ? body.citationIds.map(String)
        : Array.isArray(body.citation_ids)
          ? body.citation_ids.map(String)
          : [];
      const batch = runBatchForecast(store, orgId, ids, userId);
      return send(res, 200, batch);
    }

    const auditMatch = path.match(/^\/orgs\/([^/]+)\/audit$/);
    if (method === "GET" && auditMatch) {
      const orgId = auditMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store, orgId)) return send(res, 404, { error: "org_not_found" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const listed = listAudit(store, orgId, {
        citationId: url.searchParams.get("citationId") ?? undefined,
        status: url.searchParams.get("status") ?? undefined,
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
          "content-disposition": 'attachment; filename="audit.csv"',
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
      if (!getOrg(store, orgId)) return send(res, 404, { error: "org_not_found" });

      if (method === "GET") {
        const role = assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"]);
        if (!role) return send(res, 403, { error: "forbidden" });
        const settings = getOrgSettings(store, orgId);
        if (!settings) return send(res, 404, { error: "org_not_found" });
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
        if (!assertAccess(store, orgId, userId, ["admin"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        if (body.rotate_webhook_secret === true || body.rotateWebhookSecret === true) {
          const rotated = rotateWebhookSecret(store, orgId);
          if (!rotated.ok) return send(res, 400, { error: rotated.error });
          return send(res, 200, { settings: rotated.value });
        }
        const patch: { webhook_secret?: string; tokens_note?: string } = {};
        if (body.webhook_secret !== undefined) patch.webhook_secret = String(body.webhook_secret);
        if (body.tokens_note !== undefined) patch.tokens_note = String(body.tokens_note);
        if (Object.keys(patch).length === 0) {
          return send(res, 400, {
            error: "webhook_secret, tokens_note, or rotate_webhook_secret required",
          });
        }
        const patched = patchOrgSettings(store, orgId, patch);
        if (!patched.ok) return send(res, 400, { error: patched.error });
        return send(res, 200, { settings: patched.value });
      }
    }

    const citationMatch = path.match(
      /^\/orgs\/([^/]+)\/citations(?:\/([^/]+))?(?:\/(forecast))?$/,
    );
    if (citationMatch) {
      const orgId = citationMatch[1]!;
      const citationId = citationMatch[2];
      const action = citationMatch[3];
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store, orgId)) return send(res, 404, { error: "org_not_found" });

      if (method === "GET" && !citationId) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const limit = url.searchParams.get("limit");
        const offset = url.searchParams.get("offset");
        const listed = listCitations(store, orgId, {
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
        });
        return send(res, 200, listed);
      }

      if (method === "POST" && !citationId) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        const citation = createCitation(store, orgId, citationInputFromBody(body), userId);
        return send(res, 201, { citation });
      }

      if (method === "GET" && citationId && !action) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const citation = getCitation(store, orgId, citationId);
        if (!citation) return send(res, 404, { error: "not_found" });
        return send(res, 200, { citation });
      }

      if (method === "PATCH" && citationId && !action) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        const patched = patchCitation(
          store,
          orgId,
          citationId,
          {
            classification:
              body.classification !== undefined ? String(body.classification) : undefined,
            gravity_tier: body.gravity_tier !== undefined ? String(body.gravity_tier) : undefined,
            gbp_amount: body.gbp_amount !== undefined ? Number(body.gbp_amount) : undefined,
            size_pct: body.size_pct !== undefined ? Number(body.size_pct) : undefined,
            history_pct: body.history_pct !== undefined ? Number(body.history_pct) : undefined,
            good_faith_pct:
              body.good_faith_pct !== undefined ? Number(body.good_faith_pct) : undefined,
            quick_fix_pct:
              body.quick_fix_pct !== undefined ? Number(body.quick_fix_pct) : undefined,
            use_statutory_max:
              body.use_statutory_max !== undefined ? body.use_statutory_max === true : undefined,
            additive_cheat:
              body.additive_cheat !== undefined ? body.additive_cheat === true : undefined,
          },
          userId,
        );
        if (!patched) return send(res, 404, { error: "not_found" });
        return send(res, 200, { citation: patched });
      }

      if (method === "POST" && citationId && action === "forecast") {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const result = runForecast(store, orgId, citationId, userId);
        if (!result) return send(res, 404, { error: "not_found" });
        if (result.status === "reject") return send(res, 422, result);
        return send(res, 200, result);
      }
    }

    const goldensMatch = path.match(/^\/orgs\/([^/]+)\/goldens$/);
    if (goldensMatch && method === "GET") {
      const orgId = goldensMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store, orgId)) return send(res, 404, { error: "org_not_found" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      return send(res, 200, listGoldenCards());
    }

    return send(res, 404, { error: "not_found" });
  });

  return { server, store };
}
