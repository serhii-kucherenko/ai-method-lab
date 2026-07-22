import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertAccess,
  createOrg,
  createStore,
  createTransaction,
  findUserByEmail,
  getOrg,
  getTransaction,
  issueToken,
  listTransactions,
  registerUser,
  resolveToken,
  runForecast,
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
  return {
    label: body.label !== undefined ? String(body.label) : undefined,
    amount_involved:
      body.amount_involved !== undefined ? Number(body.amount_involved) : undefined,
    year_parts: body.year_parts !== undefined ? Number(body.year_parts) : undefined,
    corrected: body.corrected === true,
    fmv_a: body.fmv_a !== undefined ? Number(body.fmv_a) : undefined,
    fmv_b: body.fmv_b !== undefined ? Number(body.fmv_b) : undefined,
    use_fmv_greater_of: body.use_fmv_greater_of === true,
    understate_amount: body.understate_amount === true,
    flat_excise_cheat: body.flat_excise_cheat === true,
    dual_approver_cheat: body.dual_approver_cheat === true,
    skip_additional_tax: body.skip_additional_tax === true,
  };
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
