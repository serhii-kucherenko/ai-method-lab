import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addMember,
  assertAccess,
  countBlocked,
  countScripts,
  createPharmacy,
  createScript,
  createStore,
  findUserByEmail,
  getPharmacy,
  getScript,
  issueToken,
  listBlocked,
  listScriptAudit,
  listScripts,
  recordWebhook,
  registerUser,
  resolveToken,
  transitionScript,
} from "./store.js";
import { listMigrations, migrationCount, type PharmacyRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import type { SwapInput } from "./te.js";
import type { ScriptState } from "./rules.js";

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

function pharmacyDenied(
  store: Store,
  pharmacyId: string,
  userId: string,
  mode: "read" | "write" | "dispense" | "notify",
  res: ServerResponse,
): boolean {
  if (!assertAccess(store.db, pharmacyId, userId, mode)) {
    send(res, getPharmacy(store.db, pharmacyId) ? 403 : 404, {
      error: getPharmacy(store.db, pharmacyId) ? "forbidden" : "not found",
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

      if (method === "POST" && path === "/pharmacies") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const name = String((await readBody(req)).name ?? "").trim();
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { pharmacy: createPharmacy(store.db, userId, name) });
        return;
      }

      const memberMatch = path.match(/^\/pharmacies\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const pharmacyId = memberMatch[1]!;
        if (pharmacyDenied(store, pharmacyId, userId, "write", res)) return;
        const body = await readBody(req);
        const role = String(body.role ?? "") as PharmacyRole;
        if (!["pharmacist", "rph_manager", "payer_ops"].includes(role)) {
          send(res, 400, { error: "role required" });
          return;
        }
        addMember(store.db, pharmacyId, String(body.userId ?? ""), role);
        send(res, 201, { ok: true });
        return;
      }

      const scriptMatch = path.match(/^\/pharmacies\/([^/]+)\/scripts$/);
      if (method === "POST" && scriptMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const pharmacyId = scriptMatch[1]!;
        if (pharmacyDenied(store, pharmacyId, userId, "write", res)) return;
        const body = await readBody(req);
        const input: SwapInput = {
          prescribed_ndc: String(body.prescribed_ndc ?? ""),
          candidate_ndc: String(body.candidate_ndc ?? ""),
          te_code_prescribed: String(body.te_code_prescribed ?? ""),
          te_code_candidate: String(body.te_code_candidate ?? ""),
          same_ingredient_strength_form: Boolean(body.same_ingredient_strength_form),
          daw: Number(body.daw ?? 0),
          brand_medically_necessary: Boolean(body.brand_medically_necessary),
        };
        const result = createScript(store.db, pharmacyId, input);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { script: result.value });
        return;
      }

      if (method === "GET" && scriptMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const pharmacyId = scriptMatch[1]!;
        if (pharmacyDenied(store, pharmacyId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          scripts: listScripts(store.db, pharmacyId, limit, offset),
          total: countScripts(store.db, pharmacyId),
          limit,
          offset,
        });
        return;
      }

      const blockedMatch = path.match(/^\/pharmacies\/([^/]+)\/blocked$/);
      if (method === "GET" && blockedMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const pharmacyId = blockedMatch[1]!;
        if (pharmacyDenied(store, pharmacyId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          scripts: listBlocked(store.db, pharmacyId, limit, offset),
          total: countBlocked(store.db, pharmacyId),
          limit,
          offset,
        });
        return;
      }

      const trMatch = path.match(/^\/scripts\/([^/]+)\/transition$/);
      if (method === "POST" && trMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const script = getScript(store.db, trMatch[1]!);
        if (!script) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (pharmacyDenied(store, script.pharmacyId, userId, "dispense", res)) return;
        const body = await readBody(req);
        const to = String(body.to ?? "") as ScriptState;
        const version = Number(body.version ?? script.version);
        if (to === "dispensed") {
          if (!script.allowSub) {
            send(res, 400, { error: "cannot dispense blocked substitution" });
            return;
          }
          const payload = { script_id: script.id, pharmacy_id: script.pharmacyId };
          try {
            await store.dep.notify("script.dispensed", payload);
          } catch (err) {
            logEvent("dep.notify.fail", {
              error: err instanceof Error ? err.message : String(err),
            });
            send(res, 502, { error: "dependency failed" });
            return;
          }
          store.sideEffects += 1;
          recordWebhook(store.db, "script.dispensed", script.pharmacyId, payload);
        }
        const result = transitionScript(store.db, script.id, userId, to, version);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 200, {
          script: result.value,
          audit: listScriptAudit(store.db, script.id),
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
