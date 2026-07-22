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
  createTransaction,
  findUserByEmail,
  getOrg,
  getTransaction,
  issueToken,
  listAudit,
  listTransactions,
  patchTransaction,
  registerUser,
  resolveToken,
  runBatchForecast,
  runForecast,
  type OrgRole,
  type Store,
} from "./store.js";
import { listGoldenCards } from "./goldens.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

type Json = Record<string, unknown>;

async function readBody(req: IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString("utf8")) as Json;
  } catch {
    return {};
  }
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

function transactionInputFromBody(body: Json) {
  const out: {
    label?: string;
    amount_involved?: number;
    year_parts?: number;
    corrected?: boolean;
    fmv_a?: number;
    fmv_b?: number;
    use_fmv_greater_of?: boolean;
    understate_amount?: boolean;
    flat_excise_cheat?: boolean;
    dual_approver_cheat?: boolean;
    skip_additional_tax?: boolean;
  } = {};
  if (body.label !== undefined) out.label = String(body.label);
  if (body.amount_involved !== undefined) out.amount_involved = Number(body.amount_involved);
  if (body.year_parts !== undefined) out.year_parts = Number(body.year_parts);
  if (body.corrected !== undefined) out.corrected = body.corrected === true;
  if (body.fmv_a !== undefined) out.fmv_a = Number(body.fmv_a);
  if (body.fmv_b !== undefined) out.fmv_b = Number(body.fmv_b);
  if (body.use_fmv_greater_of !== undefined) {
    out.use_fmv_greater_of = body.use_fmv_greater_of === true;
  }
  if (body.understate_amount !== undefined) {
    out.understate_amount = body.understate_amount === true;
  }
  if (body.flat_excise_cheat !== undefined) {
    out.flat_excise_cheat = body.flat_excise_cheat === true;
  }
  if (body.dual_approver_cheat !== undefined) {
    out.dual_approver_cheat = body.dual_approver_cheat === true;
  }
  if (body.skip_additional_tax !== undefined) {
    out.skip_additional_tax = body.skip_additional_tax === true;
  }
  return out;
}

export function createApp(opts: { rateLimit?: number; store?: Store } = {}) {
  const store = opts.store ?? createStore({ rateLimit: opts.rateLimit });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;

    if (method === "GET" && path === "/try.html") {
      const file = join(projectRoot, "try.html");
      if (existsSync(file)) {
        const body = readFileSync(file);
        res.writeHead(200, {
          "content-type": "text/html; charset=utf-8",
          "content-length": body.length,
        });
        res.end(body);
        return;
      }
    }

    if (method === "GET" && (path === "/" || path.endsWith(".html") || path.endsWith(".css"))) {
      if (serveStatic(res, path)) return;
    }

    if (method === "GET" && path === "/health") {
      return send(res, 200, { ok: true, product: "ptax4975" });
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
      const ids = Array.isArray(body.transactionIds)
        ? body.transactionIds.map(String)
        : Array.isArray(body.transaction_ids)
          ? body.transaction_ids.map(String)
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
        transactionId: url.searchParams.get("transactionId") ?? undefined,
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

    const txMatch = path.match(
      /^\/orgs\/([^/]+)\/transactions(?:\/([^/]+))?(?:\/(forecast))?$/,
    );
    if (txMatch) {
      const orgId = txMatch[1]!;
      const transactionId = txMatch[2];
      const action = txMatch[3];
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store, orgId)) return send(res, 404, { error: "org_not_found" });

      if (method === "GET" && !transactionId) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const limit = url.searchParams.get("limit");
        const offset = url.searchParams.get("offset");
        const listed = listTransactions(store, orgId, {
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
        });
        return send(res, 200, listed);
      }

      if (method === "POST" && !transactionId) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        const transaction = createTransaction(
          store,
          orgId,
          transactionInputFromBody(body),
          userId,
        );
        return send(res, 201, { transaction });
      }

      if (method === "GET" && transactionId && !action) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const transaction = getTransaction(store, orgId, transactionId);
        if (!transaction) return send(res, 404, { error: "not_found" });
        return send(res, 200, { transaction });
      }

      if (method === "PATCH" && transactionId && !action) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        const patched = patchTransaction(
          store,
          orgId,
          transactionId,
          transactionInputFromBody(body),
          userId,
        );
        if (!patched) return send(res, 404, { error: "not_found" });
        return send(res, 200, { transaction: patched });
      }

      if (method === "POST" && transactionId && action === "forecast") {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const result = runForecast(store, orgId, transactionId, userId);
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
