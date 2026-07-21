import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addMember,
  assertAccess,
  countExceptions,
  countBills,
  createAccount,
  createStore,
  createBill,
  findUserByEmail,
  getAccount,
  getBill,
  issueToken,
  listExceptions,
  listBillAudit,
  listBills,
  recordWebhook,
  registerUser,
  resolveToken,
  transitionBill,
} from "./store.js";
import { listMigrations, migrationCount, type AccountRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import type { BillInput, RateBlock } from "./bill.js";
import type { BillState } from "./rules.js";

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
    send(res, 429, { error: "rate limit exceeded" }, { "retry-after": "1" });
    return false;
  }
  return true;
}

function accountDenied(
  store: Store,
  accountId: string,
  userId: string,
  mode: "read" | "write" | "post" | "notify",
  res: ServerResponse,
): boolean {
  if (!assertAccess(store.db, accountId, userId, mode)) {
    send(res, getAccount(store.db, accountId) ? 403 : 404, {
      error: getAccount(store.db, accountId) ? "forbidden" : "not found",
    });
    return true;
  }
  return false;
}

function parseBillBody(body: Json): BillInput {
  const rawBlocks = Array.isArray(body.blocks) ? body.blocks : [];
  const blocks: RateBlock[] = rawBlocks.map((b) => {
    const row = b as Record<string, unknown>;
    return {
      up_to_kwh: row.up_to_kwh === null || row.up_to_kwh === undefined ? null : Number(row.up_to_kwh),
      rate: Number(row.rate ?? 0),
    };
  });
  return {
    total_kwh: Number(body.total_kwh ?? 0),
    current_peak_kw: Number(body.current_peak_kw ?? 0),
    prior_peak_kw: Number(body.prior_peak_kw ?? 0),
    ratchet_pct: Number(body.ratchet_pct ?? 0),
    demand_rate: Number(body.demand_rate ?? 0),
    blocks,
  };
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

      if (!checkRateLimit(store, req, res)) return;
      const userId = authUserId(store, req);

      if (method === "POST" && path === "/accounts") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const name = String((await readBody(req)).name ?? "").trim();
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { account: createAccount(store.db, userId, name) });
        return;
      }

      const memberMatch = path.match(/^\/accounts\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const accountId = memberMatch[1]!;
        if (accountDenied(store, accountId, userId, "write", res)) return;
        const body = await readBody(req);
        const role = String(body.role ?? "") as AccountRole;
        if (!["analyst", "poster", "ops_admin"].includes(role)) {
          send(res, 400, { error: "role required" });
          return;
        }
        addMember(store.db, accountId, String(body.userId ?? ""), role);
        send(res, 201, { ok: true });
        return;
      }

      const billMatch = path.match(/^\/accounts\/([^/]+)\/bills$/);
      if (method === "POST" && billMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const accountId = billMatch[1]!;
        if (accountDenied(store, accountId, userId, "write", res)) return;
        const result = createBill(store.db, accountId, parseBillBody(await readBody(req)));
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { bill: result.value });
        return;
      }

      if (method === "GET" && billMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const accountId = billMatch[1]!;
        if (accountDenied(store, accountId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          bills: listBills(store.db, accountId, limit, offset),
          total: countBills(store.db, accountId),
          limit,
          offset,
        });
        return;
      }

      const excMatch = path.match(/^\/accounts\/([^/]+)\/exceptions$/);
      if (method === "GET" && excMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const accountId = excMatch[1]!;
        if (accountDenied(store, accountId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          bills: listExceptions(store.db, accountId, limit, offset),
          total: countExceptions(store.db, accountId),
          limit,
          offset,
        });
        return;
      }

      const trMatch = path.match(/^\/bills\/([^/]+)\/transition$/);
      if (method === "POST" && trMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const bill = getBill(store.db, trMatch[1]!);
        if (!bill) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (accountDenied(store, bill.accountId, userId, "post", res)) return;
        const body = await readBody(req);
        const to = String(body.to ?? "") as BillState;
        const version = Number(body.version ?? bill.version);
        if (to === "posted") {
          if (!bill.ok) {
            send(res, 400, { error: "cannot post rejected bill" });
            return;
          }
          const payload = { bill_id: bill.id, account_id: bill.accountId };
          try {
            await store.dep.notify("bill.posted", payload);
          } catch (err) {
            logEvent("dep.notify.fail", {
              error: err instanceof Error ? err.message : String(err),
            });
            send(res, 502, { error: "dependency failed" });
            return;
          }
          store.sideEffects += 1;
          recordWebhook(store.db, "bill.posted", bill.accountId, payload);
        }
        const result = transitionBill(store.db, bill.id, userId, to, version);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 200, {
          bill: result.value,
          audit: listBillAudit(store.db, bill.id),
        });
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
          .prepare("INSERT INTO webhook_events (event_id, processed_at) VALUES (?, ?)")
          .run(eventId, new Date().toISOString());
        store.sideEffects += 1;
        send(res, 200, { duplicate: false, sideEffects: store.sideEffects });
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
