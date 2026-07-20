import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import type { Store } from "./store.js";
import {
  createEntry,
  createStore,
  deleteEntry,
  findUserByEmail,
  getEntry,
  getRole,
  issueToken,
  listEntries,
  registerUser,
  resolveToken,
  updateEntry,
} from "./store.js";
import { listMigrations, migrationCount } from "./db.js";

type Json = Record<string, unknown>;

async function readBody(req: IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Json;
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

function canWrite(role: string | null): boolean {
  return role === "owner" || role === "member";
}

export function createApp(store: Store = createStore()) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const method = req.method ?? "GET";
    const path = url.pathname;

    try {
      if (method === "GET" && path === "/health") {
        send(res, 200, {
          ok: true,
          service: "ledgerlite",
          migrations: migrationCount(store.db),
        });
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

      if (method === "GET" && path === "/meta/migrations") {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        send(res, 200, { applied: listMigrations(store.db) });
        return;
      }

      if (path === "/entries" || path.startsWith("/entries/")) {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }

        if (method === "GET" && path === "/entries") {
          send(res, 200, { entries: listEntries(store.db, userId) });
          return;
        }

        if (method === "POST" && path === "/entries") {
          const body = await readBody(req);
          const memo = typeof body.memo === "string" ? body.memo.trim() : "";
          const amount = Number(body.amount);
          if (!memo || !Number.isFinite(amount)) {
            send(res, 400, { error: "memo and amount required" });
            return;
          }
          send(res, 201, { entry: createEntry(store.db, userId, memo, amount) });
          return;
        }

        const match = /^\/entries\/([^/]+)$/.exec(path);
        if (match) {
          const entryId = match[1];
          const item = getEntry(store.db, entryId, userId);
          if (!item) {
            send(res, 404, { error: "not found" });
            return;
          }
          if (method === "GET") {
            send(res, 200, { entry: item });
            return;
          }
          if (method === "PATCH" || method === "PUT") {
            const body = await readBody(req);
            const updated = updateEntry(store.db, entryId, userId, {
              memo: typeof body.memo === "string" ? body.memo.trim() : undefined,
              amount:
                typeof body.amount === "number" && Number.isFinite(body.amount)
                  ? body.amount
                  : undefined,
            });
            send(res, 200, { entry: updated });
            return;
          }
          if (method === "DELETE") {
            if (!deleteEntry(store.db, entryId, userId)) {
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
            .prepare("INSERT INTO ledgers (id, name, created_by) VALUES (?, ?, ?)")
            .run(id, name, userId);
          store.db
            .prepare(
              "INSERT INTO memberships (ledger_id, user_id, role) VALUES (?, ?, 'owner')",
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
          .prepare("SELECT id, name, created_by AS createdBy FROM ledgers WHERE id = ?")
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
          send(res, 400, { error: "email and role (member|viewer) required" });
          return;
        }
        const invitee = findUserByEmail(store.db, email);
        if (!invitee) {
          send(res, 404, { error: "user not found" });
          return;
        }
        store.db
          .prepare(
            "INSERT INTO memberships (ledger_id, user_id, role) VALUES (?, ?, ?)",
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
        const notes = typeof body.notes === "string" ? body.notes : "";
        const id = randomUUID();
        store.db
          .prepare(
            "INSERT INTO tasks (id, ledger_id, title, notes) VALUES (?, ?, ?, ?)",
          )
          .run(id, projectId, title, notes);
        send(res, 201, {
          task: { id, projectId, title, notes },
        });
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
          .prepare("SELECT ledger_id AS projectId FROM tasks WHERE id = ?")
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
): Promise<T> {
  const { server, store } = createApp();
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
