import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertAccess,
  createOrg,
  createStore,
  createViolation,
  findUserByEmail,
  getOrg,
  getViolation,
  issueToken,
  listViolations,
  registerUser,
  resolveToken,
  runForecast,
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

function send(res: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
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
    send(res, 429, { error: "rate_limit_exceeded" });
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

    if (method === "POST" && path === "/orgs") {
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const body = await readBody(req);
      const name = String(body.name ?? "").trim();
      if (!name) return send(res, 400, { error: "name_required" });
      const org = createOrg(store, userId, name);
      return send(res, 201, { org });
    }

    if (method === "GET" && path === "/goldens") {
      return send(res, 200, listGoldenCards());
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

      if (method === "POST" && violationId && forecast) {
        if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
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
