import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import type { Entry, Store } from "./store.js";
import { createStore } from "./store.js";

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
  return store.tokens.get(token) ?? null;
}

export function createApp(store: Store = createStore()) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const method = req.method ?? "GET";
    const path = url.pathname;

    try {
      if (method === "GET" && path === "/health") {
        send(res, 200, { ok: true, service: "ledgerlite" });
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
        for (const user of store.users.values()) {
          if (user.email === email) {
            send(res, 409, { error: "email already registered" });
            return;
          }
        }
        const id = randomUUID();
        store.users.set(id, { id, email, password });
        const token = randomUUID();
        store.tokens.set(token, id);
        send(res, 201, { token, user: { id, email } });
        return;
      }

      if (method === "POST" && path === "/auth/login") {
        const body = await readBody(req);
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";
        let found: { id: string; email: string } | null = null;
        for (const user of store.users.values()) {
          if (user.email === email && user.password === password) {
            found = { id: user.id, email: user.email };
            break;
          }
        }
        if (!found) {
          send(res, 401, { error: "invalid credentials" });
          return;
        }
        const token = randomUUID();
        store.tokens.set(token, found.id);
        send(res, 200, { token, user: found });
        return;
      }

      if (path === "/entries" || path.startsWith("/entries/")) {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }

        if (method === "GET" && path === "/entries") {
          const items = [...store.entries.values()].filter((e) => e.userId === userId);
          send(res, 200, { entries: items });
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
          const item: Entry = {
            id: randomUUID(),
            userId,
            memo,
            amount,
          };
          store.entries.set(item.id, item);
          send(res, 201, { entry: item });
          return;
        }

        const match = /^\/entries\/([^/]+)$/.exec(path);
        if (match) {
          const entryId = match[1];
          const item = store.entries.get(entryId);
          if (!item || item.userId !== userId) {
            send(res, 404, { error: "not found" });
            return;
          }

          if (method === "GET") {
            send(res, 200, { entry: item });
            return;
          }

          if (method === "PATCH" || method === "PUT") {
            const body = await readBody(req);
            if (typeof body.memo === "string") {
              item.memo = body.memo.trim() || item.memo;
            }
            if (typeof body.amount === "number" && Number.isFinite(body.amount)) {
              item.amount = body.amount;
            }
            store.entries.set(item.id, item);
            send(res, 200, { entry: item });
            return;
          }

          if (method === "DELETE") {
            store.entries.delete(entryId);
            send(res, 204, {});
            return;
          }
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
