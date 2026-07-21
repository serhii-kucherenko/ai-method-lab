import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addMember,
  assertAccess,
  countImportant,
  createStore,
  createStudy,
  createSubject,
  findUserByEmail,
  getStudy,
  getVisit,
  issueToken,
  listImportant,
  listSubjects,
  countSubjects,
  listVisits,
  countVisits,
  listVisitAudit,
  lockVisit,
  publishVersion,
  recordVisit,
  recordWebhook,
  registerUser,
  resolveToken,
  setImportantCodes,
} from "./store.js";
import { listMigrations, migrationCount, type StudyRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import type { ProtocolVersion } from "./window.js";

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

function studyDenied(
  store: Store,
  studyId: string,
  userId: string,
  mode: "read" | "write" | "publish" | "lock",
  res: ServerResponse,
): boolean {
  if (!assertAccess(store.db, studyId, userId, mode)) {
    send(res, getStudy(store.db, studyId) ? 403 : 404, {
      error: getStudy(store.db, studyId) ? "forbidden" : "not found",
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

      if (method === "POST" && path === "/studies") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const name = String((await readBody(req)).name ?? "").trim();
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { study: createStudy(store.db, userId, name) });
        return;
      }

      const memberMatch = path.match(/^\/studies\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const studyId = memberMatch[1]!;
        if (studyDenied(store, studyId, userId, "write", res)) return;
        const body = await readBody(req);
        const role = String(body.role ?? "") as StudyRole;
        if (!["cra", "cdm", "sponsor"].includes(role)) {
          send(res, 400, { error: "role required" });
          return;
        }
        addMember(store.db, studyId, String(body.userId ?? ""), role);
        send(res, 201, { ok: true });
        return;
      }

      const importantCodesMatch = path.match(/^\/studies\/([^/]+)\/important-codes$/);
      if (method === "PUT" && importantCodesMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const studyId = importantCodesMatch[1]!;
        if (studyDenied(store, studyId, userId, "publish", res)) return;
        const codes = (await readBody(req)).codes;
        if (!Array.isArray(codes)) {
          send(res, 400, { error: "codes array required" });
          return;
        }
        setImportantCodes(store.db, studyId, codes.map(String));
        send(res, 200, { ok: true });
        return;
      }

      const verMatch = path.match(/^\/studies\/([^/]+)\/versions$/);
      if (method === "POST" && verMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const studyId = verMatch[1]!;
        if (studyDenied(store, studyId, userId, "publish", res)) return;
        const body = await readBody(req);
        const version = body.version as ProtocolVersion | undefined;
        if (!version?.id || !version.effective_at || !version.visits) {
          send(res, 400, { error: "version required" });
          return;
        }
        const result = publishVersion(store.db, studyId, version);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        const payload = { study_id: studyId, version_id: version.id };
        try {
          await store.dep.notify("amendment.published", payload);
        } catch (err) {
          logEvent("dep.notify.fail", {
            error: err instanceof Error ? err.message : String(err),
          });
          send(res, 502, { error: "dependency failed" });
          return;
        }
        store.sideEffects += 1;
        recordWebhook(store.db, "amendment.published", studyId, payload);
        send(res, 201, { version: result.value });
        return;
      }

      const subjMatch = path.match(/^\/studies\/([^/]+)\/subjects$/);
      if (method === "POST" && subjMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const studyId = subjMatch[1]!;
        if (studyDenied(store, studyId, userId, "write", res)) return;
        const enrollment = String((await readBody(req)).enrollment ?? "");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(enrollment)) {
          send(res, 400, { error: "enrollment YYYY-MM-DD required" });
          return;
        }
        send(res, 201, { subject: createSubject(store.db, studyId, enrollment) });
        return;
      }

      const visitMatch = path.match(/^\/studies\/([^/]+)\/visits$/);
      if (method === "POST" && visitMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const studyId = visitMatch[1]!;
        if (studyDenied(store, studyId, userId, "write", res)) return;
        const body = await readBody(req);
        const result = recordVisit(
          store.db,
          studyId,
          String(body.subject_id ?? ""),
          String(body.code ?? ""),
          body.actual === null || body.actual === undefined ? null : String(body.actual),
          body.as_of_missed !== undefined ? String(body.as_of_missed) : undefined,
        );
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { visit: result.value });
        return;
      }

      const lockMatch = path.match(/^\/visits\/([^/]+)\/lock$/);
      if (method === "POST" && lockMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const visit = getVisit(store.db, lockMatch[1]!);
        if (!visit) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (studyDenied(store, visit.studyId, userId, "lock", res)) return;
        const body = await readBody(req);
        const version = Number(body.version ?? visit.version);
        const result = lockVisit(store.db, visit.id, userId, version);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 200, {
          visit: result.value,
          audit: listVisitAudit(store.db, visit.id),
        });
        return;
      }

      const impMatch = path.match(/^\/studies\/([^/]+)\/important$/);
      if (method === "GET" && impMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const studyId = impMatch[1]!;
        if (studyDenied(store, studyId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          visits: listImportant(store.db, studyId, limit, offset),
          total: countImportant(store.db, studyId),
          limit,
          offset,
        });
        return;
      }

      const listSubj = path.match(/^\/studies\/([^/]+)\/subjects$/);
      if (method === "GET" && listSubj) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const studyId = listSubj[1]!;
        if (studyDenied(store, studyId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          subjects: listSubjects(store.db, studyId, limit, offset),
          total: countSubjects(store.db, studyId),
          limit,
          offset,
        });
        return;
      }

      const listVis = path.match(/^\/studies\/([^/]+)\/visits$/);
      if (method === "GET" && listVis) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const studyId = listVis[1]!;
        if (studyDenied(store, studyId, userId, "read", res)) return;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
        send(res, 200, {
          visits: listVisits(store.db, studyId, limit, offset),
          total: countVisits(store.db, studyId),
          limit,
          offset,
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
