import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { Store } from "./store.js";
import {
  createLoan,
  createStore,
  deleteLoan,
  findUserByEmail,
  getLoan,
  issueToken,
  listLoans,
  registerUser,
  resolveToken,
  updateLoan,
} from "./store.js";

type Json = Record<string, unknown>;

function logEvent(event: string, fields: Record<string, unknown>): void {
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, ...fields }));
}

async function readBody(req: IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Json;
  } catch {
    return {};
  }
}

function send(res: ServerResponse, status: number, body: unknown): void {
  if (status === 204) {
    res.writeHead(204);
    res.end();
    return;
  }
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
  return resolveToken(store.db, token);
}

export function createApp(store: Store = createStore()) {
  const server = createServer(async (req, res) => {
    const method = req.method ?? "GET";
    const path = new URL(req.url ?? "/", "http://127.0.0.1").pathname;

    try {
      if (method === "GET" && path === "/health") {
        send(res, 200, { ok: true });
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

      if (path === "/loans" || path.startsWith("/loans/")) {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          logEvent("http", { method, path, status: 401 });
          return;
        }

        if (method === "GET" && path === "/loans") {
          send(res, 200, { loans: listLoans(store.db, userId) });
          logEvent("http", { method, path, status: 200 });
          return;
        }

        if (method === "POST" && path === "/loans") {
          const body = await readBody(req);
          const itemName =
            typeof body.itemName === "string"
              ? body.itemName.trim()
              : typeof body.title === "string"
                ? body.title.trim()
                : "";
          const note = typeof body.note === "string" ? body.note : "";
          if (!itemName) {
            send(res, 400, { error: "itemName required" });
            return;
          }
          const loan = createLoan(store.db, userId, itemName, note);
          send(res, 201, { loan });
          logEvent("http", { method, path, status: 201 });
          return;
        }

        const m = /^\/loans\/([^/]+)$/.exec(path);
        if (m) {
          const loan = getLoan(store.db, m[1]!);
          if (!loan || loan.userId !== userId) {
            send(res, 404, { error: "not found" });
            logEvent("http", { method, path, status: 404 });
            return;
          }

          if (method === "GET") {
            send(res, 200, { loan });
            return;
          }

          if (method === "PATCH" || method === "PUT") {
            const body = await readBody(req);
            const patch: { itemName?: string; note?: string; status?: string } = {};
            if (typeof body.itemName === "string") patch.itemName = body.itemName.trim();
            if (typeof body.title === "string" && !patch.itemName) {
              patch.itemName = body.title.trim();
            }
            if (typeof body.note === "string") patch.note = body.note;
            if (typeof body.status === "string") patch.status = body.status;
            if (typeof body.done === "boolean") {
              patch.status = body.done ? "closed" : "open";
            }
            const updated = updateLoan(store.db, loan.id, patch);
            send(res, 200, { loan: updated });
            logEvent("http", { method, path, status: 200 });
            return;
          }

          if (method === "DELETE") {
            deleteLoan(store.db, loan.id);
            send(res, 204, {});
            logEvent("http", { method, path, status: 204 });
            return;
          }
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
): Promise<T> {
  const { server, store } = createApp();
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
