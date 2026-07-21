import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addMember,
  assertAccess,
  createPlant,
  createStore,
  findUserByEmail,
  getPlant,
  issueToken,
  listBlastMembers,
  loadGraph,
  openRecall,
  recordWebhook,
  registerUser,
  resolveToken,
  writeReceiving,
  writeShipping,
  writeTransform,
} from "./store.js";
import { forwardBlast } from "./blast.js";
import { listMigrations, migrationCount, type PlantRole } from "./db.js";
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
  if (!token) return null;
  return resolveToken(store.db, token);
}

function checkRateLimit(store: Store, req: IncomingMessage, res: ServerResponse): boolean {
  const key = getToken(req) ?? req.socket.remoteAddress ?? "anon";
  const n = (store.rateCounts.get(key) ?? 0) + 1;
  store.rateCounts.set(key, n);
  if (n > store.rateLimit) {
    send(res, 429, { error: "rate limit exceeded" });
    return false;
  }
  return true;
}

function plantDenied(
  store: Store,
  plantId: string,
  userId: string,
  mode: "read" | "write" | "recall",
  res: ServerResponse,
): boolean {
  if (!assertAccess(store.db, plantId, userId, mode)) {
    send(res, getPlant(store.db, plantId) ? 403 : 404, {
      error: getPlant(store.db, plantId) ? "forbidden" : "not found",
    });
    return true;
  }
  return false;
}

export function createApp(
  opts: {
    store?: Store;
    dep?: DepClient;
    webhookSecret?: string;
    rateLimit?: number;
  } = {},
) {
  const store =
    opts.store ??
    createStore({
      dep: opts.dep ?? createMockDep(),
      webhookSecret: opts.webhookSecret,
      rateLimit: opts.rateLimit,
    });

  const server = createServer(async (req, res) => {
    try {
      const method = req.method ?? "GET";
      const url = new URL(req.url ?? "/", "http://localhost");
      const path = url.pathname;

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
          migrations: migrationCount(store.db),
          applied: listMigrations(store.db),
        });
        return;
      }

      if (method === "POST" && path === "/auth/register") {
        const body = await readBody(req);
        const email = String(body.email ?? "").trim();
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

      if (method === "POST" && path === "/plants") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const name = String((await readBody(req)).name ?? "").trim();
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { plant: createPlant(store.db, userId, name) });
        return;
      }

      const memberMatch = path.match(/^\/plants\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const plantId = memberMatch[1]!;
        if (plantDenied(store, plantId, userId, "write", res)) return;
        const body = await readBody(req);
        const role = String(body.role ?? "") as PlantRole;
        if (!["ops", "qa", "recall_admin"].includes(role)) {
          send(res, 400, { error: "role required" });
          return;
        }
        addMember(store.db, plantId, String(body.userId ?? ""), role);
        send(res, 201, { ok: true });
        return;
      }

      const recvMatch = path.match(/^\/plants\/([^/]+)\/receiving$/);
      if (method === "POST" && recvMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const plantId = recvMatch[1]!;
        if (plantDenied(store, plantId, userId, "write", res)) return;
        const result = writeReceiving(store.db, plantId, await readBody(req));
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { receiving: result.value });
        return;
      }

      const xfMatch = path.match(/^\/plants\/([^/]+)\/transformations$/);
      if (method === "POST" && xfMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const plantId = xfMatch[1]!;
        if (plantDenied(store, plantId, userId, "write", res)) return;
        const result = writeTransform(store.db, plantId, await readBody(req));
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { transformation: result.value });
        return;
      }

      const shipMatch = path.match(/^\/plants\/([^/]+)\/shipments$/);
      if (method === "POST" && shipMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const plantId = shipMatch[1]!;
        if (plantDenied(store, plantId, userId, "write", res)) return;
        const result = writeShipping(store.db, plantId, await readBody(req));
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { shipment: result.value });
        return;
      }

      const blastMatch = path.match(/^\/plants\/([^/]+)\/blast$/);
      if (method === "GET" && blastMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const plantId = blastMatch[1]!;
        if (plantDenied(store, plantId, userId, "read", res)) return;
        const suspect = String(url.searchParams.get("suspect") ?? "").trim();
        if (!suspect) {
          send(res, 400, { error: "suspect required" });
          return;
        }
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        const graph = loadGraph(store.db, plantId);
        const blast = forwardBlast(graph, suspect);
        const page = listBlastMembers(store.db, plantId, suspect, limit, offset);
        send(res, 200, {
          blast: {
            finished_tlcs: blast.finished_tlcs,
            shipment_ids: blast.shipment_ids,
            notify_partners: blast.notify_partners,
            units_in_channel: blast.units_in_channel,
          },
          members: page.members,
          total: page.total,
          limit,
          offset,
        });
        return;
      }

      const recallMatch = path.match(/^\/plants\/([^/]+)\/recalls$/);
      if (method === "POST" && recallMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const plantId = recallMatch[1]!;
        if (plantDenied(store, plantId, userId, "recall", res)) return;
        const suspect = String((await readBody(req)).suspect_tlc ?? "").trim();
        if (!suspect) {
          send(res, 400, { error: "suspect_tlc required" });
          return;
        }
        const result = openRecall(store.db, plantId, suspect);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        store.sideEffects += 1;
        const payload = {
          recall_id: result.value.recall_id,
          suspect_tlc: suspect,
          plant_id: plantId,
        };
        recordWebhook(store.db, "recall.opened", result.value.recall_id, payload);
        try {
          await store.dep.notify("recall.opened", payload);
        } catch (err) {
          logEvent("dep.notify.fail", {
            error: err instanceof Error ? err.message : String(err),
          });
        }
        send(res, 201, { export: result.value });
        return;
      }

      if (method === "POST" && path === "/webhooks/inbound") {
        const raw = await readRaw(req);
        const sig = String(req.headers["x-signature"] ?? "");
        const expected = createHmac("sha256", store.webhookSecret).update(raw).digest("hex");
        const a = Buffer.from(sig);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          send(res, 401, { error: "invalid signature" });
          return;
        }
        send(res, 200, { ok: true });
        return;
      }

      send(res, 404, { error: "not found" });
    } catch (err) {
      logEvent("request.error", { error: err instanceof Error ? err.message : String(err) });
      send(res, 500, { error: "internal" });
    }
  });

  return { server, store };
}
