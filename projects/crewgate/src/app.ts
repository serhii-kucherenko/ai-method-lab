import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addApproval,
  addMember,
  assertAccess,
  createCrew,
  createShift,
  createSite,
  createStore,
  findUserByEmail,
  getCrew,
  getSite,
  issueToken,
  listCrews,
  recordWebhook,
  registerUser,
  resolveToken,
  siteIdForShift,
  transitionShift,
} from "./store.js";
import { listMigrations, migrationCount, type SiteRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import type { ShiftState } from "./rules.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};
type Json = Record<string, unknown>;

function logEvent(event: string, fields: Record<string, unknown>): void {
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, ...fields }));
}

async function readRaw(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function readBody(req: IncomingMessage): Promise<Json> {
  const raw = await readRaw(req);
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
  return token ? resolveToken(store.db, token) : null;
}

function checkRateLimit(store: Store, req: IncomingMessage, res: ServerResponse): boolean {
  const token = getToken(req);
  if (!token) return true;
  const count = (store.rateCounts.get(token) ?? 0) + 1;
  store.rateCounts.set(token, count);
  if (count > store.rateLimit) {
    send(res, 429, { error: "rate limit exceeded" }, { "retry-after": "1" });
    return false;
  }
  return true;
}

function verifyHmac(secret: string, raw: Buffer, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createApp(store: Store = createStore()) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;
    try {
      if (method === "GET" && (path === "/" || path === "/index.html")) {
        const file = join(publicDir, "index.html");
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
      if (method === "GET" && (path === "/styles.css" || path === "/app.js")) {
        const file = join(publicDir, path.slice(1));
        if (existsSync(file)) {
          const body = readFileSync(file);
          res.writeHead(200, {
            "content-type": MIME[extname(path)] ?? "application/octet-stream",
            "content-length": body.length,
          });
          res.end(body);
          return;
        }
      }
      if (method === "GET" && path === "/health") {
        send(res, 200, {
          ok: true,
          service: "crewgate",
          migrations: listMigrations(store.db),
          migrationCount: migrationCount(store.db),
        });
        return;
      }
      if (method === "POST" && path === "/auth/register") {
        const body = await readBody(req);
        const email = String(body.email ?? "");
        const password = String(body.password ?? "");
        if (!email || !password) {
          send(res, 400, { error: "email and password required" });
          return;
        }
        if (findUserByEmail(store.db, email)) {
          send(res, 409, { error: "email taken" });
          return;
        }
        const user = registerUser(store.db, email, password);
        send(res, 201, { user, token: issueToken(store.db, user.id) });
        return;
      }
      if (method === "POST" && path === "/auth/login") {
        const body = await readBody(req);
        const user = findUserByEmail(store.db, String(body.email ?? ""));
        if (!user || user.password !== String(body.password ?? "")) {
          send(res, 401, { error: "invalid credentials" });
          return;
        }
        send(res, 200, {
          user: { id: user.id, email: user.email },
          token: issueToken(store.db, user.id),
        });
        return;
      }
      if (!checkRateLimit(store, req, res)) return;
      const userId = authUserId(store, req);

      if (method === "POST" && path === "/sites") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const body = await readBody(req);
        const name = String(body.name ?? "").trim();
        const overtimeLimitHours = Number(body.overtimeLimitHours ?? 8);
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { site: createSite(store.db, userId, name, overtimeLimitHours) });
        return;
      }

      const memberMatch = /^\/sites\/([^/]+)\/members$/.exec(path);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const siteId = memberMatch[1]!;
        if (!assertAccess(store.db, siteId, userId, "own")) {
          send(res, getSite(store.db, siteId) ? 403 : 404, {
            error: getSite(store.db, siteId) ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const role = String(body.role ?? "") as SiteRole;
        if (!["supervisor", "lead", "worker"].includes(role)) {
          send(res, 400, { error: "role required" });
          return;
        }
        addMember(store.db, siteId, String(body.userId ?? ""), role);
        send(res, 201, { ok: true });
        return;
      }

      const crewsMatch = /^\/sites\/([^/]+)\/crews$/.exec(path);
      if (crewsMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const siteId = crewsMatch[1]!;
        if (method === "GET") {
          if (!assertAccess(store.db, siteId, userId, "read")) {
            send(res, getSite(store.db, siteId) ? 403 : 404, {
              error: getSite(store.db, siteId) ? "forbidden" : "not found",
            });
            return;
          }
          const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
          const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
          send(res, 200, { crews: listCrews(store.db, siteId, limit, offset) });
          return;
        }
        if (method === "POST") {
          if (!assertAccess(store.db, siteId, userId, "write")) {
            send(res, getSite(store.db, siteId) ? 403 : 404, {
              error: getSite(store.db, siteId) ? "forbidden" : "not found",
            });
            return;
          }
          const name = String((await readBody(req)).name ?? "").trim();
          if (!name) {
            send(res, 400, { error: "name required" });
            return;
          }
          send(res, 201, { crew: createCrew(store.db, siteId, name) });
          return;
        }
      }

      const shiftsMatch = /^\/crews\/([^/]+)\/shifts$/.exec(path);
      if (method === "POST" && shiftsMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const crew = getCrew(store.db, shiftsMatch[1]!);
        if (!crew || !assertAccess(store.db, crew.siteId, userId, "write")) {
          send(res, crew ? 403 : 404, { error: crew ? "forbidden" : "not found" });
          return;
        }
        const body = await readBody(req);
        const title = String(body.title ?? "").trim();
        const hours = Number(body.hours ?? 0);
        if (!title) {
          send(res, 400, { error: "title required" });
          return;
        }
        const result = createShift(store.db, crew.id, title, hours);
        if (!result.ok) {
          send(res, 400, { error: result.error });
          return;
        }
        send(res, 201, { shift: result.shift });
        return;
      }

      const approveMatch = /^\/shifts\/([^/]+)\/approve$/.exec(path);
      if (method === "POST" && approveMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const siteId = siteIdForShift(store.db, approveMatch[1]!);
        if (!siteId || !assertAccess(store.db, siteId, userId, "approve")) {
          send(res, siteId ? 403 : 404, { error: siteId ? "forbidden" : "not found" });
          return;
        }
        const result = addApproval(store.db, approveMatch[1]!, userId);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 200, { ok: true, approvalCount: result.approvalCount });
        return;
      }

      const trMatch = /^\/shifts\/([^/]+)\/transition$/.exec(path);
      if (method === "POST" && trMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const siteId = siteIdForShift(store.db, trMatch[1]!);
        const body = await readBody(req);
        const to = String(body.to ?? "") as ShiftState;
        const mode = to === "closed" ? "own" : "write";
        if (!siteId || !assertAccess(store.db, siteId, userId, mode)) {
          send(res, siteId ? 403 : 404, { error: siteId ? "forbidden" : "not found" });
          return;
        }
        const result = transitionShift(
          store.db,
          trMatch[1]!,
          userId,
          to,
          Number(body.version),
        );
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        if (result.shift.state === "closed") {
          store.sideEffects += 1;
          const payload = {
            shiftId: result.shift.id,
            state: result.shift.state,
            overtime: result.shift.overtime,
          };
          recordWebhook(store.db, "shift.closed", result.shift.id, payload);
          try {
            await store.dep.notify("shift.closed", payload);
          } catch (err) {
            logEvent("dep.notify.fail", {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
        send(res, 200, { shift: result.shift });
        return;
      }

      if (method === "POST" && path === "/webhooks/inbound") {
        const raw = await readRaw(req);
        if (
          !verifyHmac(
            store.webhookSecret,
            raw,
            req.headers["x-signature"] as string | undefined,
          )
        ) {
          send(res, 401, { error: "invalid signature" });
          return;
        }
        send(res, 200, { ok: true, received: true });
        return;
      }

      send(res, 404, { error: "not found" });
    } catch (err) {
      logEvent("request.error", {
        error: err instanceof Error ? err.message : String(err),
        path,
      });
      send(res, 500, { error: "internal error" });
    }
  });
  return { server, store };
}

export async function withServer<T>(
  fn: (baseUrl: string, store: Store) => Promise<T>,
  opts?: { dep?: DepClient; webhookSecret?: string; rateLimit?: number },
): Promise<T> {
  const { server, store } = createApp(
    createStore({
      dep: opts?.dep,
      webhookSecret: opts?.webhookSecret,
      rateLimit: opts?.rateLimit,
    }),
  );
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") {
    server.close();
    throw new Error("bind failed");
  }
  try {
    return await fn(`http://127.0.0.1:${addr.port}`, store);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

export { createMockDep };
export type { DepClient };
