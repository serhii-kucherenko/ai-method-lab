import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addMember,
  assertAccess,
  countIllegal,
  countPairings,
  createCarrier,
  createPairing,
  createStore,
  findUserByEmail,
  getCarrier,
  getPairing,
  issueToken,
  listIllegal,
  listPairingAudit,
  listPairings,
  recordWebhook,
  registerUser,
  resolveToken,
  transitionPairing,
} from "./store.js";
import { listMigrations, migrationCount, type CarrierRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import type { PairingInput } from "./legality.js";
import type { PairingState } from "./rules.js";

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

function carrierDenied(
  store: Store,
  carrierId: string,
  userId: string,
  mode: "read" | "write" | "release" | "notify",
  res: ServerResponse,
): boolean {
  if (!assertAccess(store.db, carrierId, userId, mode)) {
    send(res, getCarrier(store.db, carrierId) ? 403 : 404, {
      error: getCarrier(store.db, carrierId) ? "forbidden" : "not found",
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

      if (!checkRateLimit(store, req, res)) return;
      const userId = authUserId(store, req);

      if (method === "POST" && path === "/carriers") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const name = String((await readBody(req)).name ?? "").trim();
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { carrier: createCarrier(store.db, userId, name) });
        return;
      }

      const memberMatch = path.match(/^\/carriers\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const carrierId = memberMatch[1]!;
        if (carrierDenied(store, carrierId, userId, "write", res)) return;
        const body = await readBody(req);
        const role = String(body.role ?? "") as CarrierRole;
        if (!["scheduler", "legal", "ops_admin"].includes(role)) {
          send(res, 400, { error: "role required" });
          return;
        }
        addMember(store.db, carrierId, String(body.userId ?? ""), role);
        send(res, 201, { ok: true });
        return;
      }

      const pairMatch = path.match(/^\/carriers\/([^/]+)\/pairings$/);
      if (method === "POST" && pairMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const carrierId = pairMatch[1]!;
        if (carrierDenied(store, carrierId, userId, "write", res)) return;
        const body = await readBody(req);
        const input: PairingInput = {
          report_local: String(body.report_local ?? ""),
          segments: Number(body.segments ?? 0),
          acclimated: Boolean(body.acclimated),
          fdp_hours: Number(body.fdp_hours ?? 0),
          rest_hours: body.rest_hours === undefined ? undefined : Number(body.rest_hours),
          max_consecutive_off_in_168h:
            body.max_consecutive_off_in_168h === undefined
              ? undefined
              : Number(body.max_consecutive_off_in_168h),
          claims_augmented: body.claims_augmented === true,
          has_rest_facility: body.has_rest_facility === true,
          pic_extension_hours:
            body.pic_extension_hours === undefined
              ? undefined
              : Number(body.pic_extension_hours),
          pic_consent: body.pic_consent === true,
          flight_segments:
            body.flight_segments === undefined ? undefined : Number(body.flight_segments),
          deadhead_segments:
            body.deadhead_segments === undefined ? undefined : Number(body.deadhead_segments),
        };
        const result = createPairing(store.db, carrierId, input);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { pairing: result.value });
        return;
      }

      if (method === "GET" && pairMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const carrierId = pairMatch[1]!;
        if (carrierDenied(store, carrierId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          pairings: listPairings(store.db, carrierId, limit, offset),
          total: countPairings(store.db, carrierId),
          limit,
          offset,
        });
        return;
      }

      const illegalMatch = path.match(/^\/carriers\/([^/]+)\/illegal$/);
      if (method === "GET" && illegalMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const carrierId = illegalMatch[1]!;
        if (carrierDenied(store, carrierId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          pairings: listIllegal(store.db, carrierId, limit, offset),
          total: countIllegal(store.db, carrierId),
          limit,
          offset,
        });
        return;
      }

      const trMatch = path.match(/^\/pairings\/([^/]+)\/transition$/);
      if (method === "POST" && trMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const pairing = getPairing(store.db, trMatch[1]!);
        if (!pairing) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (carrierDenied(store, pairing.carrierId, userId, "release", res)) return;
        const body = await readBody(req);
        const to = String(body.to ?? "") as PairingState;
        const version = Number(body.version ?? pairing.version);
        if (to === "released") {
          if (!pairing.legal) {
            send(res, 400, { error: "cannot release illegal pairing" });
            return;
          }
          const payload = { pairing_id: pairing.id, carrier_id: pairing.carrierId };
          try {
            await store.dep.notify("pairing.released", payload);
          } catch (err) {
            logEvent("dep.notify.fail", {
              error: err instanceof Error ? err.message : String(err),
            });
            send(res, 502, { error: "dependency failed" });
            return;
          }
          store.sideEffects += 1;
          recordWebhook(store.db, "pairing.released", pairing.carrierId, payload);
        }
        const result = transitionPairing(store.db, pairing.id, userId, to, version);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 200, {
          pairing: result.value,
          audit: listPairingAudit(store.db, pairing.id),
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
