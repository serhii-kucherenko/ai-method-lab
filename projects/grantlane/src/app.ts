import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  activateApplication,
  addProgramMember,
  addSignOff,
  assertProgramAccess,
  clawbackMilestone,
  closeApplication,
  createApplication,
  createMilestone,
  createProgram,
  createStore,
  findUserByEmail,
  getApplication,
  getProgram,
  getMilestone,
  issueToken,
  listApplications,
  listAudit,
  listMilestones,
  payMilestone,
  recordWebhook,
  registerUser,
  resolveToken,
  waiveMilestone,
} from "./store.js";
import { listMigrations, migrationCount, type ProgramRole } from "./db.js";
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
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
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
  extraHeaders: Record<string, string> = {},
): void {
  if (status === 204) {
    res.writeHead(204, extraHeaders);
    res.end();
    return;
  }
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
    ...extraHeaders,
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

function checkRateLimit(
  store: Store,
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  const token = getToken(req);
  if (!token) return true;
  const count = (store.rateCounts.get(token) ?? 0) + 1;
  store.rateCounts.set(token, count);
  if (count > store.rateLimit) {
    send(res, 429, { error: "rate limit exceeded" }, { "retry-after": "1" });
    return false;
  }
  return true;
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

function parseLimitOffset(url: URL): { limit: number; offset: number } {
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
  return { limit, offset };
}

async function notifySideEffect(
  store: Store,
  event: string,
  applicationId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  store.sideEffects += 1;
  recordWebhook(store.db, event, applicationId, payload);
  try {
    await store.dep.notify(event, payload);
  } catch (err) {
    logEvent("dep.notify.fail", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export function createApp(store: Store = createStore()) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;

    try {
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
          service: "grantlane",
          migrations: listMigrations(store.db),
          migrationCount: migrationCount(store.db),
        });
        return;
      }

      if (method === "POST" && path === "/auth/register") {
        const body = await readBody(req);
        const email = String(body.email ?? "");
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
        const token = issueToken(store.db, user.id);
        logEvent("auth.register", { userId: user.id });
        send(res, 201, { user, token });
        return;
      }

      if (method === "POST" && path === "/auth/login") {
        const body = await readBody(req);
        const user = findUserByEmail(store.db, String(body.email ?? ""));
        if (!user || user.password !== String(body.password ?? "")) {
          send(res, 401, { error: "invalid credentials" });
          return;
        }
        const token = issueToken(store.db, user.id);
        send(res, 200, { user: { id: user.id, email: user.email }, token });
        return;
      }

      if (!checkRateLimit(store, req, res)) return;
      const userId = authUserId(store, req);

      if (method === "POST" && path === "/programs") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const body = await readBody(req);
        const name = String(body.name ?? "").trim();
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { program: createProgram(store.db, userId, name) });
        return;
      }

      const memberMatch = path.match(/^\/programs\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const programId = memberMatch[1]!;
        if (!assertProgramAccess(store.db, programId, userId, "write")) {
          send(res, getProgram(store.db, programId) ? 403 : 404, {
            error: getProgram(store.db, programId) ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const memberId = String(body.userId ?? "");
        const role = String(body.role ?? "") as ProgramRole;
        if (!memberId || !["admin", "officer", "reviewer"].includes(role)) {
          send(res, 400, { error: "userId and role required" });
          return;
        }
        addProgramMember(store.db, programId, memberId, role);
        send(res, 201, { ok: true });
        return;
      }

      const appsMatch = path.match(/^\/programs\/([^/]+)\/applications$/);
      if (appsMatch) {
        const programId = appsMatch[1]!;
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        if (method === "GET") {
          if (!assertProgramAccess(store.db, programId, userId, "read")) {
            send(res, getProgram(store.db, programId) ? 403 : 404, {
              error: getProgram(store.db, programId) ? "forbidden" : "not found",
            });
            return;
          }
          const { limit, offset } = parseLimitOffset(url);
          send(res, 200, {
            applications: listApplications(store.db, programId, limit, offset),
          });
          return;
        }
        if (method === "POST") {
          if (!assertProgramAccess(store.db, programId, userId, "write")) {
            send(res, getProgram(store.db, programId) ? 403 : 404, {
              error: getProgram(store.db, programId) ? "forbidden" : "not found",
            });
            return;
          }
          const body = await readBody(req);
          const orgName = String(body.orgName ?? "").trim();
          const amountRequested = Number(body.amountRequested);
          if (!orgName || Number.isNaN(amountRequested) || amountRequested <= 0) {
            send(res, 400, { error: "orgName and amountRequested required" });
            return;
          }
          send(res, 201, {
            application: createApplication(
              store.db,
              programId,
              orgName,
              amountRequested,
            ),
          });
          return;
        }
      }

      const appMatch = path.match(/^\/applications\/([^/]+)$/);
      if (method === "GET" && appMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = appMatch[1]!;
        const app = getApplication(store.db, applicationId);
        if (!app) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!assertProgramAccess(store.db, app.programId, userId, "read")) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        send(res, 200, {
          application: app,
          milestones: listMilestones(store.db, applicationId),
        });
        return;
      }

      const signOffMatch = path.match(/^\/applications\/([^/]+)\/sign-off$/);
      if (method === "POST" && signOffMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = signOffMatch[1]!;
        const app = getApplication(store.db, applicationId);
        if (!app) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!assertProgramAccess(store.db, app.programId, userId, "read")) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const result = addSignOff(store.db, applicationId, userId);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 200, { application: getApplication(store.db, applicationId) });
        return;
      }

      const activateMatch = path.match(/^\/applications\/([^/]+)\/activate$/);
      if (method === "POST" && activateMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = activateMatch[1]!;
        const app = getApplication(store.db, applicationId);
        if (!app) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!assertProgramAccess(store.db, app.programId, userId, "write")) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const body = await readBody(req);
        const approvedAmount = Number(body.approvedAmount);
        const version = Number(body.version);
        const result = activateApplication(
          store.db,
          applicationId,
          userId,
          approvedAmount,
          version,
        );
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        const payload = {
          applicationId,
          approvedAmount: result.application.approvedAmount,
          orgName: result.application.orgName,
        };
        await notifySideEffect(store, "application.activated", applicationId, payload);
        send(res, 200, { application: result.application });
        return;
      }

      const closeMatch = path.match(/^\/applications\/([^/]+)\/close$/);
      if (method === "POST" && closeMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = closeMatch[1]!;
        const app = getApplication(store.db, applicationId);
        if (!app) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!assertProgramAccess(store.db, app.programId, userId, "write")) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const body = await readBody(req);
        const version = Number(body.version);
        const result = closeApplication(store.db, applicationId, userId, version);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        const payload = {
          applicationId,
          paidTotal: result.application.paidTotal,
        };
        await notifySideEffect(store, "application.closed", applicationId, payload);
        send(res, 200, { application: result.application });
        return;
      }

      const milestonesMatch = path.match(/^\/applications\/([^/]+)\/milestones$/);
      if (method === "POST" && milestonesMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = milestonesMatch[1]!;
        const app = getApplication(store.db, applicationId);
        if (!app) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!assertProgramAccess(store.db, app.programId, userId, "write")) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const body = await readBody(req);
        const label = String(body.label ?? "").trim();
        const amount = Number(body.amount);
        if (!label || Number.isNaN(amount) || amount <= 0) {
          send(res, 400, { error: "label and amount required" });
          return;
        }
        const milestone = createMilestone(store.db, applicationId, label, amount);
        if (!milestone) {
          send(res, 400, { error: "milestones require active application" });
          return;
        }
        send(res, 201, { milestone });
        return;
      }

      const payMatch = path.match(/^\/milestones\/([^/]+)\/pay$/);
      if (method === "POST" && payMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const milestoneId = payMatch[1]!;
        const existing = getMilestone(store.db, milestoneId);
        if (!existing) {
          send(res, 404, { error: "not found" });
          return;
        }
        const payApp = getApplication(store.db, existing.applicationId);
        if (!payApp || !assertProgramAccess(store.db, payApp.programId, userId, "write")) {
          send(res, payApp ? 403 : 404, { error: payApp ? "forbidden" : "not found" });
          return;
        }
        const ms = payMilestone(store.db, milestoneId, userId);
        if (!ms.ok) {
          send(res, ms.status, { error: ms.error });
          return;
        }
        send(res, 200, { milestone: ms.milestone, application: ms.application });
        return;
      }

      const waiveMatch = path.match(/^\/milestones\/([^/]+)\/waive$/);
      if (method === "POST" && waiveMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const milestoneId = waiveMatch[1]!;
        const existing = getMilestone(store.db, milestoneId);
        if (!existing) {
          send(res, 404, { error: "not found" });
          return;
        }
        const waiveApp = getApplication(store.db, existing.applicationId);
        if (!waiveApp || !assertProgramAccess(store.db, waiveApp.programId, userId, "write")) {
          send(res, waiveApp ? 403 : 404, { error: waiveApp ? "forbidden" : "not found" });
          return;
        }
        const result = waiveMilestone(store.db, milestoneId, userId);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 200, { milestone: result.milestone });
        return;
      }

      const clawbackMatch = path.match(/^\/milestones\/([^/]+)\/clawback$/);
      if (method === "POST" && clawbackMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const milestoneId = clawbackMatch[1]!;
        const existing = getMilestone(store.db, milestoneId);
        if (!existing) {
          send(res, 404, { error: "not found" });
          return;
        }
        const clawApp = getApplication(store.db, existing.applicationId);
        if (!clawApp || !assertProgramAccess(store.db, clawApp.programId, userId, "write")) {
          send(res, clawApp ? 403 : 404, { error: clawApp ? "forbidden" : "not found" });
          return;
        }
        const result = clawbackMilestone(store.db, milestoneId, userId);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        const app = result.application;
        const payload = {
          applicationId: app.id,
          milestoneId,
          amount: result.milestone.amount,
          paidTotal: app.paidTotal,
        };
        await notifySideEffect(store, "milestone.clawed_back", app.id, payload);
        send(res, 200, { milestone: result.milestone, application: app });
        return;
      }

      const auditMatch = path.match(/^\/applications\/([^/]+)\/audit$/);
      if (method === "GET" && auditMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = auditMatch[1]!;
        const app = getApplication(store.db, applicationId);
        if (!app) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!assertProgramAccess(store.db, app.programId, userId, "read")) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        send(res, 200, { audit: listAudit(store.db, applicationId) });
        return;
      }

      if (method === "POST" && path === "/webhooks/inbound") {
        const raw = await readRaw(req);
        const signature = req.headers["x-signature"] as string | undefined;
        if (!verifyHmac(store.webhookSecret, raw, signature)) {
          send(res, 401, { error: "invalid signature" });
          return;
        }
        let body: Json = {};
        try {
          body = JSON.parse(raw.toString("utf8")) as Json;
        } catch {
          send(res, 400, { error: "invalid json" });
          return;
        }
        logEvent("webhook.inbound", {
          event: body.event,
          idempotencyKey: String(
            req.headers["idempotency-key"] ?? body.idempotencyKey ?? "",
          ) || null,
        });
        send(res, 200, { ok: true, received: true });
        return;
      }

      send(res, 404, { error: "not found" });
    } catch (err) {
      logEvent("request.error", {
        error: err instanceof Error ? err.message : String(err),
        path,
      });
      send(res, 500, { error: "internal error" });
    }
  });

  return { server, store };
}

export async function withServer<T>(
  fn: (baseUrl: string, store: Store) => Promise<T>,
  opts?: { dep?: DepClient; webhookSecret?: string; rateLimit?: number },
): Promise<T> {
  const { server, store } = createApp(
    createStore({
      dep: opts?.dep,
      webhookSecret: opts?.webhookSecret,
      rateLimit: opts?.rateLimit,
    }),
  );
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

export { createMockDep };
export type { DepClient };
