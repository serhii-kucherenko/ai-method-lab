import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addRinkMember,
  createComment,
  createRink,
  createPass,
  createStore,
  createTask,
  deletePass,
  findUserByEmail,
  getRink,
  getPass,
  getRole,
  getTaskRinkId,
  issueToken,
  listPassAudit,
  listPasss,
  registerUser,
  resolveToken,
  transitionPass,
  updatePass,
} from "./store.js";
import { listMigrations, migrationCount } from "./db.js";
import type { Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

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
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
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
  extraHeaders: Record<string, string> = {},
): void {
  if (status === 204) {
    res.writeHead(204, extraHeaders);
    res.end();
    return;
  }
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
    ...extraHeaders,
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

function checkRateLimit(
  store: Store,
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
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

function verifyHmac(
  secret: string,
  raw: Buffer,
  signature: string | undefined,
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
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
            "content-type": MIME[extname(file)] ?? "application/octet-stream",
            "content-length": body.length,
          });
          res.end(body);
          return;
        }
      }

      if (method === "GET" && path === "/health") {
        send(res, 200, {
          ok: true,
          service: "rinkpass",
          migrations: migrationCount(store.db),
        });
        logEvent("http", { method, path, status: 200 });
        return;
      }

      if (method === "POST" && path === "/auth/register") {
        const body = await readBody(req);
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";
        if (!email || !password) {
          send(res, 400, { error: "email and password required" });
          return;
        }
        if (findUserByEmail(store.db, email)) {
          send(res, 409, { error: "email taken" });
          return;
        }
        const user = registerUser(store.db, email, password);
        const token = issueToken(store.db, user.id);
        send(res, 201, { token, user });
        logEvent("http", { method, path, status: 201 });
        return;
      }

      if (method === "POST" && path === "/auth/login") {
        const body = await readBody(req);
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const user = findUserByEmail(store.db, email);
        if (!user || user.password !== password) {
          send(res, 401, { error: "invalid credentials" });
          return;
        }
        const token = issueToken(store.db, user.id);
        send(res, 200, { token, user: { id: user.id, email: user.email } });
        logEvent("http", { method, path, status: 200 });
        return;
      }

      if (method === "POST" && path === "/payments") {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const body = await readBody(req);
        const amount = Number(body.amount);
        if (!Number.isFinite(amount)) {
          send(res, 400, { error: "amount required" });
          return;
        }
        let result: Awaited<ReturnType<DepClient["charge"]>>;
        try {
          result = await store.dep.charge(amount);
        } catch (err) {
          send(res, 502, {
            error: err instanceof Error ? err.message : "dependency failed",
          });
          return;
        }
        if (!result.ok) {
          send(res, 502, { error: result.error });
          return;
        }
        const id = randomUUID();
        store.db
          .prepare(
            "INSERT INTO payments (id, user_id, amount, provider_id) VALUES (?, ?, ?, ?)",
          )
          .run(id, userId, amount, result.id);
        send(res, 201, { payment: { id, amount, providerId: result.id } });
        return;
      }

      if (method === "POST" && path === "/webhooks/payment") {
        const raw = await readRaw(req);
        const sigHeader = req.headers["x-signature"];
        const signature = Array.isArray(sigHeader) ? sigHeader[0] : sigHeader;
        if (!verifyHmac(store.webhookSecret, raw, signature)) {
          send(res, 401, { error: "invalid signature" });
          return;
        }
        let body: Json = {};
        try {
          body = JSON.parse(raw.toString("utf8") || "{}") as Json;
        } catch {
          send(res, 400, { error: "invalid json" });
          return;
        }
        const eventId = typeof body.eventId === "string" ? body.eventId : "";
        if (!eventId) {
          send(res, 400, { error: "eventId required" });
          return;
        }
        const existing = store.db
          .prepare("SELECT event_id FROM webhook_events WHERE event_id = ?")
          .get(eventId);
        if (existing) {
          send(res, 200, { duplicate: true, sideEffects: store.sideEffects });
          return;
        }
        store.db
          .prepare(
            "INSERT INTO webhook_events (event_id, processed_at) VALUES (?, ?)",
          )
          .run(eventId, new Date().toISOString());
        store.sideEffects += 1;
        send(res, 200, { duplicate: false, sideEffects: store.sideEffects });
        return;
      }

      if (path === "/passes" || path.startsWith("/passes/")) {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          logEvent("http", { method, path, status: 401 });
          return;
        }

        if (method === "GET" && path === "/passes") {
          if (!checkRateLimit(store, req, res)) return;
          const limitRaw = url.searchParams.get("limit");
          const limit = limitRaw ? Number(limitRaw) : undefined;
          const cursor = url.searchParams.get("cursor");
          const page = listPasss(store.db, userId, {
            limit,
            cursor,
          });
          send(res, 200, page);
          logEvent("http", { method, path, status: 200 });
          return;
        }

        if (method === "POST" && path === "/passes") {
          const body = await readBody(req);
          const title = typeof body.title === "string" ? body.title.trim() : "";
          const bodyText = typeof body.body === "string" ? body.body : "";
          if (!title) {
            send(res, 400, { error: "title required" });
            return;
          }
          const created = createPass(store.db, userId, title, bodyText);
          send(res, 201, { pass: created });
          logEvent("http", { method, path, status: 201 });
          return;
        }

        const m = /^\/passes\/([^/]+)$/.exec(path);
        if (m) {
          const pass = getPass(store.db, m[1]!);
          if (!pass || pass.userId !== userId) {
            send(res, 404, { error: "not found" });
            logEvent("http", { method, path, status: 404 });
            return;
          }

          if (method === "GET") {
            send(res, 200, { pass });
            return;
          }

          if (method === "PATCH" || method === "PUT") {
            const body = await readBody(req);
            const patch: { title?: string; body?: string } = {};
            if (typeof body.title === "string") patch.title = body.title.trim();
            if (typeof body.body === "string") patch.body = body.body;
            const updated = updatePass(store.db, pass.id, patch);
            send(res, 200, { pass: updated });
            logEvent("http", { method, path, status: 200 });
            return;
          }

          if (method === "DELETE") {
            deletePass(store.db, pass.id);
            send(res, 204, {});
            logEvent("http", { method, path, status: 204 });
            return;
          }
        }

        const transitionMatch = /^\/passes\/([^/]+)\/transition$/.exec(path);
        if (method === "POST" && transitionMatch) {
          const body = await readBody(req);
          const result = transitionPass(
            store.db,
            transitionMatch[1]!,
            userId,
            body.to,
            body.version,
          );
          if (!result.ok) {
            send(res, result.status, { error: result.error });
            return;
          }
          send(res, 200, { request: result.request, pass: result.request });
          return;
        }

        const auditMatch = /^\/passes\/([^/]+)\/audit$/.exec(path);
        if (method === "GET" && auditMatch) {
          const entries = listPassAudit(store.db, auditMatch[1]!, userId);
          if (!entries) {
            send(res, 404, { error: "not found" });
            return;
          }
          send(res, 200, { entries });
          return;
        }
      }

      if (path === "/meta/migrations" || path.startsWith("/rinks") || path.startsWith("/tasks")) {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }

        if (method === "GET" && path === "/meta/migrations") {
          send(res, 200, { applied: listMigrations(store.db) });
          return;
        }

        if (method === "POST" && path === "/rinks") {
          const body = await readBody(req);
          const name = typeof body.name === "string" ? body.name.trim() : "";
          if (!name) {
            send(res, 400, { error: "name required" });
            return;
          }
          const rink = createRink(store.db, userId, name);
          send(res, 201, { rink, project: rink });
          return;
        }

        const rinkGet = /^\/rinks\/([^/]+)$/.exec(path);
        if (method === "GET" && rinkGet) {
          const rinkId = rinkGet[1]!;
          const role = getRole(store.db, rinkId, userId);
          const rink = getRink(store.db, rinkId);
          if (!role || !rink) {
            send(res, 404, { error: "not found" });
            return;
          }
          send(res, 200, { rink, project: rink, role });
          return;
        }

        const membersMatch = /^\/rinks\/([^/]+)\/members$/.exec(path);
        if (method === "POST" && membersMatch) {
          const rinkId = membersMatch[1]!;
          const role = getRole(store.db, rinkId, userId);
          if (role !== "owner") {
            send(res, role ? 403 : 404, { error: role ? "forbidden" : "not found" });
            return;
          }
          const body = await readBody(req);
          const email = typeof body.email === "string" ? body.email.trim() : "";
          const memberRole = body.role as Role;
          if (
            !email ||
            (memberRole !== "owner" &&
              memberRole !== "member" &&
              memberRole !== "viewer")
          ) {
            send(res, 400, { error: "email and role required" });
            return;
          }
          const member = findUserByEmail(store.db, email);
          if (!member) {
            send(res, 404, { error: "user not found" });
            return;
          }
          addRinkMember(store.db, rinkId, member.id, memberRole);
          send(res, 201, { member: { userId: member.id, email, role: memberRole } });
          return;
        }

        const tasksMatch = /^\/rinks\/([^/]+)\/tasks$/.exec(path);
        if (method === "POST" && tasksMatch) {
          const rinkId = tasksMatch[1]!;
          const role = getRole(store.db, rinkId, userId);
          if (!role) {
            send(res, 404, { error: "not found" });
            return;
          }
          if (role === "viewer") {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const title = typeof body.title === "string" ? body.title.trim() : "";
          const notes = typeof body.notes === "string" ? body.notes : "";
          if (!title) {
            send(res, 400, { error: "title required" });
            return;
          }
          const task = createTask(store.db, rinkId, userId, title, notes);
          send(res, 201, { task });
          return;
        }

        const commentsMatch = /^\/tasks\/([^/]+)\/comments$/.exec(path);
        if (method === "POST" && commentsMatch) {
          const taskId = commentsMatch[1]!;
          const rinkId = getTaskRinkId(store.db, taskId);
          if (!rinkId) {
            send(res, 404, { error: "not found" });
            return;
          }
          const role = getRole(store.db, rinkId, userId);
          if (!role) {
            send(res, 404, { error: "not found" });
            return;
          }
          if (role === "viewer") {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const text = typeof body.body === "string" ? body.body.trim() : "";
          if (!text) {
            send(res, 400, { error: "body required" });
            return;
          }
          const comment = createComment(store.db, taskId, userId, text);
          send(res, 201, { comment });
          return;
        }
      }

      send(res, 404, { error: "not found" });
    } catch (err) {
      send(res, 500, {
        error: err instanceof Error ? err.message : "server error",
      });
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
  const baseUrl = `http://127.0.0.1:${addr.port}`;
  try {
    return await fn(baseUrl, store);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

export { createMockDep };
export type { DepClient };
