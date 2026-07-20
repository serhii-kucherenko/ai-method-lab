import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Store } from "./store.js";
import {
  createRequest,
  createStore,
  deleteRequest,
  findUserByEmail,
  getRequest,
  issueToken,
  listAudit,
  listRequests,
  registerUser,
  resolveToken,
  transitionRequest,
  updateRequest,
} from "./store.js";
import {
  canDeleteProject,
  canManageMembers,
  canMutateComments,
  canMutateTasks,
  canReadProject,
  getProjectRole,
} from "./rbac.js";
import { migrationCount } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

type Json = Record<string, unknown>;

async function readRaw(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function readBody(req: IncomingMessage): Promise<Json> {
  const raw = await readRaw(req);
  if (raw.length === 0) return {};
  try {
    return JSON.parse(raw.toString("utf8")) as Json;
  } catch {
    return {};
  }
}

function send(res: ServerResponse, status: number, body: unknown): void {
  const payload = status === 204 ? "" : JSON.stringify(body);
  const headers: Record<string, string | number> = {};
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
    const url = new URL(req.url ?? "/", "http://localhost");
    const method = req.method ?? "GET";
    const path = url.pathname;

    try {
      if (method === "GET" && path === "/health") {
        send(res, 200, { ok: true, service: "clearpath", migrations: migrationCount(store.db) });
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
        send(res, 201, {
          payment: { id, amount, providerId: result.id },
        });
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

      // --- Smoke: personal requests ---
      if (path === "/requests" || path.startsWith("/requests/")) {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }

        if (method === "GET" && path === "/requests") {
          send(res, 200, { requests: listRequests(store.db, userId) });
          return;
        }

        if (method === "POST" && path === "/requests") {
          const body = await readBody(req);
          const title = typeof body.title === "string" ? body.title.trim() : "";
          const text = typeof body.body === "string" ? body.body : "";
          if (!title) {
            send(res, 400, { error: "title required" });
            return;
          }
          const item = createRequest(store.db, userId, title, text);
          send(res, 201, { request: item });
          return;
        }

        const transitionMatch = /^\/requests\/([^/]+)\/transition$/.exec(path);
        if (method === "POST" && transitionMatch) {
          const body = await readBody(req);
          const result = transitionRequest(
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
          send(res, 200, { request: result.request });
          return;
        }

        const auditMatch = /^\/requests\/([^/]+)\/audit$/.exec(path);
        if (method === "GET" && auditMatch) {
          const entries = listAudit(store.db, auditMatch[1], userId);
          if (!entries) {
            send(res, 404, { error: "not found" });
            return;
          }
          send(res, 200, { entries });
          return;
        }

        const match = /^\/requests\/([^/]+)$/.exec(path);
        if (match) {
          const requestId = match[1];
          const item = getRequest(store.db, requestId, userId);
          if (!item) {
            send(res, 404, { error: "not found" });
            return;
          }

          if (method === "GET") {
            send(res, 200, { request: item });
            return;
          }

          if (method === "PATCH" || method === "PUT") {
            const body = await readBody(req);
            const updated = updateRequest(store.db, requestId, userId, {
              title: typeof body.title === "string" ? body.title.trim() : undefined,
              body: typeof body.body === "string" ? body.body : undefined,
            });
            send(res, 200, { request: updated });
            return;
          }

          if (method === "DELETE") {
            if (!deleteRequest(store.db, requestId, userId)) {
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

      // --- CRUD: projects ---
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
        const projectId = randomUUID();
        store.db.prepare("INSERT INTO projects (id, name, owner_id) VALUES (?, ?, ?)").run(
          projectId,
          name,
          userId,
        );
        store.db
          .prepare(
            "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, 'owner')",
          )
          .run(projectId, userId);
        send(res, 201, { project: { id: projectId, name, ownerId: userId } });
        return;
      }

      if (method === "GET" && path === "/projects") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const projects = store.db
          .prepare(
            `SELECT p.id, p.name, p.owner_id AS ownerId, pm.role
             FROM projects p
             JOIN project_members pm ON pm.project_id = p.id
             WHERE pm.user_id = ?`,
          )
          .all(userId);
        send(res, 200, { projects });
        return;
      }

      const projectMatch = /^\/projects\/([^/]+)(?:\/(.+))?$/.exec(path);
      if (projectMatch && userId) {
        const projectId = projectMatch[1];
        const sub = projectMatch[2] ?? "";
        const role = getProjectRole(store.db, projectId, userId);

        if (sub === "members" && method === "POST") {
          if (!canManageMembers(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const email = typeof body.email === "string" ? body.email.trim() : "";
          const memberRole = body.role === "viewer" || body.role === "member" ? body.role : "member";
          const invitee = findUserByEmail(store.db, email);
          if (!invitee) {
            send(res, 404, { error: "user not found" });
            return;
          }
          store.db
            .prepare(
              `INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)
               ON CONFLICT(project_id, user_id) DO UPDATE SET role = excluded.role`,
            )
            .run(projectId, invitee.id, memberRole);
          send(res, 201, { member: { userId: invitee.id, email, role: memberRole } });
          return;
        }

        if (sub === "tasks" && method === "GET") {
          if (!canReadProject(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const tasks = store.db
            .prepare(
              "SELECT id, project_id AS projectId, title, body, created_by AS createdBy, status, priority FROM tasks WHERE project_id = ?",
            )
            .all(projectId);
          send(res, 200, { tasks });
          return;
        }

        if (sub === "tasks" && method === "POST") {
          if (!canMutateTasks(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const title = typeof body.title === "string" ? body.title.trim() : "";
          if (!title) {
            send(res, 400, { error: "title required" });
            return;
          }
          const taskId = randomUUID();
          const text = typeof body.body === "string" ? body.body : "";
          store.db
            .prepare(
              "INSERT INTO tasks (id, project_id, title, body, created_by, status, priority) VALUES (?, ?, ?, ?, ?, 'open', 0)",
            )
            .run(taskId, projectId, title, text, userId);
          send(res, 201, {
            task: { id: taskId, projectId, title, body: text, createdBy: userId, status: "open", priority: 0 },
          });
          return;
        }

        if (!sub && method === "GET") {
          if (!canReadProject(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const project = store.db
            .prepare("SELECT id, name, owner_id AS ownerId FROM projects WHERE id = ?")
            .get(projectId);
          if (!project) {
            send(res, 404, { error: "not found" });
            return;
          }
          send(res, 200, { project, role });
          return;
        }

        if (!sub && method === "DELETE") {
          if (!canDeleteProject(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          store.db.prepare("DELETE FROM projects WHERE id = ?").run(projectId);
          send(res, 204, {});
          return;
        }
      }

      const taskMatch = /^\/tasks\/([^/]+)(?:\/(.+))?$/.exec(path);
      if (taskMatch && userId) {
        const taskId = taskMatch[1];
        const sub = taskMatch[2] ?? "";
        const task = store.db
          .prepare("SELECT id, project_id AS projectId, title, body, created_by AS createdBy, status, priority FROM tasks WHERE id = ?")
          .get(taskId) as { projectId: string } | undefined;
        if (!task) {
          send(res, 404, { error: "not found" });
          return;
        }
        const role = getProjectRole(store.db, task.projectId, userId);

        if (sub === "comments" && method === "GET") {
          if (!canReadProject(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const comments = store.db
            .prepare(
              "SELECT id, task_id AS taskId, author_id AS authorId, body FROM comments WHERE task_id = ?",
            )
            .all(taskId);
          send(res, 200, { comments });
          return;
        }

        if (sub === "comments" && method === "POST") {
          if (!canMutateComments(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const text = typeof body.body === "string" ? body.body.trim() : "";
          if (!text) {
            send(res, 400, { error: "body required" });
            return;
          }
          const commentId = randomUUID();
          store.db
            .prepare("INSERT INTO comments (id, task_id, author_id, body) VALUES (?, ?, ?, ?)")
            .run(commentId, taskId, userId, text);
          send(res, 201, { comment: { id: commentId, taskId, authorId: userId, body: text } });
          return;
        }

        if (!sub && method === "PATCH") {
          if (!canMutateTasks(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const title = typeof body.title === "string" ? body.title.trim() : undefined;
          const text = typeof body.body === "string" ? body.body : undefined;
          const priority = typeof body.priority === "number" ? body.priority : undefined;
          if (title) {
            store.db.prepare("UPDATE tasks SET title = ? WHERE id = ?").run(title, taskId);
          }
          if (text !== undefined) {
            store.db.prepare("UPDATE tasks SET body = ? WHERE id = ?").run(text, taskId);
          }
          if (priority !== undefined) {
            store.db.prepare("UPDATE tasks SET priority = ? WHERE id = ?").run(priority, taskId);
          }
          const updated = store.db
            .prepare(
              "SELECT id, project_id AS projectId, title, body, created_by AS createdBy, status, priority FROM tasks WHERE id = ?",
            )
            .get(taskId);
          send(res, 200, { task: updated });
          return;
        }

        if (!sub && method === "DELETE") {
          if (!canMutateTasks(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          store.db.prepare("DELETE FROM tasks WHERE id = ?").run(taskId);
          send(res, 204, {});
          return;
        }
      }

      const commentMatch = /^\/comments\/([^/]+)$/.exec(path);
      if (commentMatch && userId) {
        const commentId = commentMatch[1];
        const comment = store.db
          .prepare("SELECT c.id, c.task_id AS taskId, t.project_id AS projectId FROM comments c JOIN tasks t ON t.id = c.task_id WHERE c.id = ?")
          .get(commentId) as { projectId: string } | undefined;
        if (!comment) {
          send(res, 404, { error: "not found" });
          return;
        }
        const role = getProjectRole(store.db, comment.projectId, userId);

        if (method === "PATCH") {
          if (!canMutateComments(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const text = typeof body.body === "string" ? body.body.trim() : "";
          if (!text) {
            send(res, 400, { error: "body required" });
            return;
          }
          store.db.prepare("UPDATE comments SET body = ? WHERE id = ?").run(text, commentId);
          send(res, 200, { comment: { id: commentId, body: text } });
          return;
        }

        if (method === "DELETE") {
          if (!canMutateComments(role)) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          store.db.prepare("DELETE FROM comments WHERE id = ?").run(commentId);
          send(res, 204, {});
          return;
        }
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
  opts?: { dep?: DepClient; webhookSecret?: string },
): Promise<T> {
  const { server, store } = createApp(
    createStore({
      dep: opts?.dep,
      webhookSecret: opts?.webhookSecret,
    }),
  );
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") {
    server.close();
    throw new Error("failed to bind server");
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
