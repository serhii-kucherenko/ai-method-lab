import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  createStatus,
  createStore,
  deleteStatus,
  findUserByEmail,
  getRole,
  getStatus,
  issueToken,
  listStatusAudit,
  listStatuses,
  registerUser,
  resolveToken,
  transitionStatus,
  updateStatus,
} from "./store.js";
import { listMigrations, migrationCount } from "./db.js";
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
  extra: Record<string, string> = {},
): void {
  const payload = status === 204 ? "" : JSON.stringify(body);
  const headers: Record<string, string | number> = { ...extra };
  if (status !== 204) {
    headers["content-type"] = "application/json";
    headers["content-length"] = Buffer.byteLength(payload);
  }
  res.writeHead(status, headers);
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

function canWrite(role: string | null): boolean {
  return role === "owner" || role === "member";
}

export function createApp(store: Store = createStore()) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const method = req.method ?? "GET";
    const path = url.pathname;
    const started = Date.now();
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
          logEvent("http", { method, path, status: 200, ms: Date.now() - started });
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
          service: "signalboard",
          migrations: migrationCount(store.db),
        });
        logEvent("http", { method, path, status: 200, ms: Date.now() - started });
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
          send(res, 409, { error: "email already registered" });
          return;
        }
        const user = registerUser(store.db, email, password);
        const token = issueToken(store.db, user.id);
        send(res, 201, { token, user: { id: user.id, email: user.email } });
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
          send(res, 200, {
            ok: true,
            duplicate: true,
            sideEffects: store.sideEffects,
          });
          return;
        }
        store.db
          .prepare(
            "INSERT INTO webhook_events (event_id, processed_at) VALUES (?, ?)",
          )
          .run(eventId, new Date().toISOString());
        store.sideEffects += 1;
        send(res, 200, {
          ok: true,
          duplicate: false,
          sideEffects: store.sideEffects,
        });
        return;
      }

      if (method === "GET" && path === "/meta/migrations") {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        send(res, 200, { applied: listMigrations(store.db) });
        return;
      }

      if (path === "/statuses" || path.startsWith("/statuses/")) {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        if (!checkRateLimit(store, req, res)) return;

        if (method === "GET" && path === "/statuses") {
          const limitRaw = url.searchParams.get("limit");
          const limit = limitRaw ? Number(limitRaw) : undefined;
          const cursor = url.searchParams.get("cursor");
          const page = listStatuses(store.db, userId, { limit, cursor });
          send(res, 200, {
            statuses: page.statuses,
            nextCursor: page.nextCursor,
            limit: page.limit,
          });
          return;
        }
        if (method === "POST" && path === "/statuses") {
          const body = await readBody(req);
          const title = typeof body.title === "string" ? body.title.trim() : "";
          const text = typeof body.body === "string" ? body.body : "";
          if (!title) {
            send(res, 400, { error: "title required" });
            return;
          }
          send(res, 201, {
            status: createStatus(store.db, userId, title, text),
          });
          return;
        }

        const transitionMatch = /^\/statuses\/([^/]+)\/transition$/.exec(path);
        if (method === "POST" && transitionMatch) {
          const body = await readBody(req);
          const result = transitionStatus(
            store.db,
            transitionMatch[1],
            userId,
            body.to,
            body.version,
          );
          if (!result.ok) {
            send(res, result.status, { error: result.error });
            return;
          }
          send(res, 200, { request: result.request, status: result.request });
          return;
        }

        const auditMatch = /^\/statuses\/([^/]+)\/audit$/.exec(path);
        if (method === "GET" && auditMatch) {
          const entries = listStatusAudit(store.db, auditMatch[1], userId);
          if (!entries) {
            send(res, 404, { error: "not found" });
            return;
          }
          send(res, 200, { entries });
          return;
        }

        const match = /^\/statuses\/([^/]+)$/.exec(path);
        if (match) {
          const item = getStatus(store.db, match[1], userId);
          if (!item) {
            send(res, 404, { error: "not found" });
            return;
          }
          if (method === "GET") {
            send(res, 200, { status: item });
            return;
          }
          if (method === "PATCH" || method === "PUT") {
            const body = await readBody(req);
            const updated = updateStatus(store.db, match[1], userId, {
              title: typeof body.title === "string" ? body.title.trim() : undefined,
              body: typeof body.body === "string" ? body.body : undefined,
            });
            send(res, 200, { status: updated });
            return;
          }
          if (method === "DELETE") {
            if (!deleteStatus(store.db, match[1], userId)) {
              send(res, 404, { error: "not found" });
              return;
            }
            send(res, 204, {});
            return;
          }
        }
        send(res, 404, { error: "not found" });
        return;
      }

      const userId = authUserId(store, req);

      if (method === "POST" && path === "/projects") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const body = await readBody(req);
        const name = typeof body.name === "string" ? body.name.trim() : "";
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        const id = randomUUID();
        store.db.exec("BEGIN");
        try {
          store.db
            .prepare("INSERT INTO projects (id, name, created_by) VALUES (?, ?, ?)")
            .run(id, name, userId);
          store.db
            .prepare(
              "INSERT INTO memberships (project_id, user_id, role) VALUES (?, ?, 'owner')",
            )
            .run(id, userId);
          store.db.exec("COMMIT");
        } catch (err) {
          store.db.exec("ROLLBACK");
          throw err;
        }
        send(res, 201, { project: { id, name, createdBy: userId } });
        return;
      }

      const projectGet = /^\/projects\/([^/]+)$/.exec(path);
      if (method === "GET" && projectGet) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const projectId = projectGet[1];
        const role = getRole(store.db, projectId, userId);
        if (!role) {
          send(res, 404, { error: "not found" });
          return;
        }
        const project = store.db
          .prepare(
            "SELECT id, name, created_by AS createdBy FROM projects WHERE id = ?",
          )
          .get(projectId);
        send(res, 200, { project, role });
        return;
      }

      const membersMatch = /^\/projects\/([^/]+)\/members$/.exec(path);
      if (method === "POST" && membersMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const projectId = membersMatch[1];
        const role = getRole(store.db, projectId, userId);
        if (!role) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (role !== "owner") {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const body = await readBody(req);
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const inviteRole =
          body.role === "member" || body.role === "viewer" ? body.role : null;
        if (!email || !inviteRole) {
          send(res, 400, { error: "email and role required" });
          return;
        }
        const invitee = findUserByEmail(store.db, email);
        if (!invitee) {
          send(res, 404, { error: "user not found" });
          return;
        }
        store.db
          .prepare(
            "INSERT INTO memberships (project_id, user_id, role) VALUES (?, ?, ?)",
          )
          .run(projectId, invitee.id, inviteRole);
        send(res, 201, {
          membership: { projectId, userId: invitee.id, role: inviteRole },
        });
        return;
      }

      const tasksMatch = /^\/projects\/([^/]+)\/tasks$/.exec(path);
      if (method === "POST" && tasksMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const projectId = tasksMatch[1];
        const role = getRole(store.db, projectId, userId);
        if (!role) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!canWrite(role)) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const body = await readBody(req);
        const title = typeof body.title === "string" ? body.title.trim() : "";
        if (!title) {
          send(res, 400, { error: "title required" });
          return;
        }
        const severity =
          typeof body.severity === "string" && body.severity.trim()
            ? body.severity.trim()
            : "normal";
        const id = randomUUID();
        store.db
          .prepare(
            "INSERT INTO tasks (id, project_id, title, severity) VALUES (?, ?, ?, ?)",
          )
          .run(id, projectId, title, severity);
        send(res, 201, { task: { id, projectId, title, severity } });
        return;
      }

      const commentsMatch = /^\/tasks\/([^/]+)\/comments$/.exec(path);
      if (method === "POST" && commentsMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const taskId = commentsMatch[1];
        const task = store.db
          .prepare("SELECT project_id AS projectId FROM tasks WHERE id = ?")
          .get(taskId) as { projectId: string } | undefined;
        if (!task) {
          send(res, 404, { error: "not found" });
          return;
        }
        const role = getRole(store.db, task.projectId, userId);
        if (!role) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!canWrite(role)) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const body = await readBody(req);
        const text = typeof body.body === "string" ? body.body : "";
        if (!text.trim()) {
          send(res, 400, { error: "body required" });
          return;
        }
        const id = randomUUID();
        store.db
          .prepare(
            "INSERT INTO comments (id, task_id, author_id, body) VALUES (?, ?, ?, ?)",
          )
          .run(id, taskId, userId, text);
        send(res, 201, {
          comment: { id, taskId, authorId: userId, body: text },
        });
        return;
      }

      send(res, 404, { error: "not found" });
    } catch (err) {
      send(res, 500, { error: err instanceof Error ? err.message : "server error" });
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
      server.close((e) => (e ? reject(e) : resolve()));
    });
  }
}

export { createMockDep };
export type { DepClient };
