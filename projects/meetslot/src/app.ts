import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { Store } from "./store.js";
import {
  createBooking,
  createStore,
  deleteBooking,
  findUserByEmail,
  getBooking,
  issueToken,
  listBookings,
  registerUser,
  resolveToken,
  updateBooking,
} from "./store.js";
import { migrationCount } from "./db.js";

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
        send(res, 200, {
          ok: true,
          service: "meetslot",
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
        send(res, 201, { token: issueToken(store.db, user.id), user });
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
        send(res, 200, {
          token: issueToken(store.db, user.id),
          user: { id: user.id, email: user.email },
        });
        return;
      }

      if (path === "/bookings" || path.startsWith("/bookings/")) {
        const userId = authUserId(store, req);
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }

        if (method === "GET" && path === "/bookings") {
          send(res, 200, { bookings: listBookings(store.db, userId) });
          return;
        }

        if (method === "POST" && path === "/bookings") {
          const body = await readBody(req);
          const roomName =
            typeof body.roomName === "string"
              ? body.roomName.trim()
              : typeof body.title === "string"
                ? body.title.trim()
                : "";
          const note = typeof body.note === "string" ? body.note : "";
          if (!roomName) {
            send(res, 400, { error: "roomName required" });
            return;
          }
          send(res, 201, { booking: createBooking(store.db, userId, roomName, note) });
          return;
        }

        const m = /^\/bookings\/([^/]+)$/.exec(path);
        if (m) {
          const booking = getBooking(store.db, m[1]!);
          if (!booking || booking.userId !== userId) {
            send(res, 404, { error: "not found" });
            return;
          }
          if (method === "GET") {
            send(res, 200, { booking });
            return;
          }
          if (method === "PATCH" || method === "PUT") {
            const body = await readBody(req);
            const patch: { roomName?: string; note?: string; status?: string } = {};
            if (typeof body.roomName === "string") patch.roomName = body.roomName.trim();
            if (typeof body.title === "string" && !patch.roomName) {
              patch.roomName = body.title.trim();
            }
            if (typeof body.note === "string") patch.note = body.note;
            if (typeof body.status === "string") patch.status = body.status;
            send(res, 200, { booking: updateBooking(store.db, booking.id, patch) });
            return;
          }
          if (method === "DELETE") {
            deleteBooking(store.db, booking.id);
            send(res, 204, {});
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
  try {
    return await fn(`http://127.0.0.1:${addr.port}`, store);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}
