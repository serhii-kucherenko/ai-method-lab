import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertAccess,
  createCitation,
  createOrg,
  createStore,
  findUserByEmail,
  getCitation,
  getOrg,
  issueToken,
  listCitations,
  registerUser,
  resolveToken,
  runForecast,
  type Store,
} from "./store.js";
import { listGoldenCards } from "./goldens.js";
import type { OrgRole } from "./db.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
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
  return resolveToken(store.db, token);
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

export function createApp(opts: { dbPath?: string; rateLimit?: number; store?: Store } = {}) {
  const store = opts.store ?? createStore({ dbPath: opts.dbPath, rateLimit: opts.rateLimit });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;

    if (method === "GET" && (path === "/" || path.endsWith(".html"))) {
      if (serveStatic(res, path)) return;
    }

    if (method === "GET" && path === "/health") {
      return send(res, 200, { ok: true, product: "oshamult" });
    }

    if (!checkRateLimit(store, req, res)) return;

    if (method === "POST" && path === "/auth/register") {
      const body = await readBody(req);
      const email = String(body.email ?? "");
      const password = String(body.password ?? "");
      if (!email || !password) return send(res, 400, { error: "email_password_required" });
      if (findUserByEmail(store.db, email)) return send(res, 409, { error: "email_taken" });
      const user = registerUser(store.db, email, password);
      const token = issueToken(store.db, user.id);
      return send(res, 201, { user, token });
    }

    if (method === "POST" && path === "/orgs") {
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const body = await readBody(req);
      const name = String(body.name ?? "").trim();
      if (!name) return send(res, 400, { error: "name_required" });
      const org = createOrg(store.db, userId, name);
      return send(res, 201, { org });
    }

    const citationsList = path.match(/^\/orgs\/([^/]+)\/citations$/);
    if (citationsList) {
      const orgId = citationsList[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store.db, orgId)) return send(res, 404, { error: "org_not_found" });

      if (method === "GET") {
        const role = assertAccess(store.db, orgId, userId, [
          "analyst",
          "auditor",
          "admin",
        ] as OrgRole[]);
        if (!role) return send(res, 403, { error: "forbidden" });
        const limit = url.searchParams.get("limit");
        const offset = url.searchParams.get("offset");
        return send(
          res,
          200,
          listCitations(store.db, orgId, {
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
          }),
        );
      }

      if (method === "POST") {
        const role = assertAccess(store.db, orgId, userId, ["analyst", "admin"] as OrgRole[]);
        if (!role) return send(res, 403, { error: "forbidden" });
        const body = await readBody(req);
        const citation = createCitation(store.db, orgId, {
          classification: String(body.classification ?? "serious"),
          gravity_tier: String(body.gravity_tier ?? "low"),
          gbp_amount: Number(body.gbp_amount),
          size_pct: Number(body.size_pct ?? 0),
          history_pct: Number(body.history_pct ?? 0),
          good_faith_pct: Number(body.good_faith_pct ?? 0),
          quick_fix_pct: Number(body.quick_fix_pct ?? 0),
          use_statutory_max: body.use_statutory_max === true,
          additive_cheat: body.additive_cheat === true,
        });
        return send(res, 201, { citation });
      }
    }

    const citationOne = path.match(/^\/orgs\/([^/]+)\/citations\/([^/]+)$/);
    if (method === "GET" && citationOne) {
      const orgId = citationOne[1]!;
      const citationId = citationOne[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const role = assertAccess(store.db, orgId, userId, [
        "analyst",
        "auditor",
        "admin",
      ] as OrgRole[]);
      if (!role) return send(res, 403, { error: "forbidden" });
      const citation = getCitation(store.db, orgId, citationId);
      if (!citation) return send(res, 404, { error: "citation_not_found" });
      return send(res, 200, { citation });
    }

    const forecastPath = path.match(/^\/orgs\/([^/]+)\/citations\/([^/]+)\/forecast$/);
    if (method === "POST" && forecastPath) {
      const orgId = forecastPath[1]!;
      const citationId = forecastPath[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const role = assertAccess(store.db, orgId, userId, ["analyst", "admin"] as OrgRole[]);
      if (!role) return send(res, 403, { error: "forbidden" });
      const got = runForecast(store.db, orgId, citationId);
      if (!got.ok) return send(res, got.status, { error: got.error });
      if (got.result.status === "reject") {
        return send(res, 422, got.result);
      }
      return send(res, 200, got.result);
    }

    const goldensPath = path.match(/^\/orgs\/([^/]+)\/goldens$/);
    if (method === "GET" && goldensPath) {
      const orgId = goldensPath[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store.db, orgId)) return send(res, 404, { error: "org_not_found" });
      const role = assertAccess(store.db, orgId, userId, [
        "analyst",
        "auditor",
        "admin",
      ] as OrgRole[]);
      if (!role) return send(res, 403, { error: "forbidden" });
      return send(res, 200, listGoldenCards());
    }

    return send(res, 404, { error: "not_found" });
  });

  return { server, store };
}
