import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addBoardMember,
  addCriterion,
  assertBoardAccess,
  boardIdForApplication,
  createApplication,
  createBoard,
  createCandidate,
  createJob,
  createStore,
  findUserByEmail,
  getApplication,
  getBoard,
  getCandidate,
  getJob,
  issueToken,
  listApplications,
  listAudit,
  listCriteria,
  listJobs,
  recordWebhook,
  registerUser,
  resolveToken,
  transitionApplication,
  upsertScore,
} from "./store.js";
import { listMigrations, migrationCount, type BoardRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import { meetsHireThreshold, type WorkflowState } from "./scoring.js";

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
          service: "screenlane",
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

      if (method === "POST" && path === "/boards") {
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
        const board = createBoard(store.db, userId, name);
        send(res, 201, { board });
        return;
      }

      const memberMatch = path.match(/^\/boards\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const boardId = memberMatch[1]!;
        if (!assertBoardAccess(store.db, boardId, userId, "write")) {
          send(res, getBoard(store.db, boardId) ? 403 : 404, {
            error: getBoard(store.db, boardId) ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const memberId = String(body.userId ?? "");
        const role = String(body.role ?? "") as BoardRole;
        if (!memberId || !["owner", "recruiter", "reviewer"].includes(role)) {
          send(res, 400, { error: "userId and role required" });
          return;
        }
        addBoardMember(store.db, boardId, memberId, role);
        send(res, 201, { ok: true });
        return;
      }

      const jobsMatch = path.match(/^\/boards\/([^/]+)\/jobs$/);
      if (jobsMatch) {
        const boardId = jobsMatch[1]!;
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        if (method === "GET") {
          if (!assertBoardAccess(store.db, boardId, userId, "read")) {
            send(res, getBoard(store.db, boardId) ? 403 : 404, {
              error: getBoard(store.db, boardId) ? "forbidden" : "not found",
            });
            return;
          }
          const { limit, offset } = parseLimitOffset(url);
          send(res, 200, { jobs: listJobs(store.db, boardId, limit, offset) });
          return;
        }
        if (method === "POST") {
          if (!assertBoardAccess(store.db, boardId, userId, "write")) {
            send(res, getBoard(store.db, boardId) ? 403 : 404, {
              error: getBoard(store.db, boardId) ? "forbidden" : "not found",
            });
            return;
          }
          const body = await readBody(req);
          const title = String(body.title ?? "").trim();
          if (!title) {
            send(res, 400, { error: "title required" });
            return;
          }
          const job = createJob(
            store.db,
            boardId,
            title,
            String(body.description ?? ""),
          );
          send(res, 201, { job });
          return;
        }
      }

      const candidatesMatch = path.match(/^\/boards\/([^/]+)\/candidates$/);
      if (method === "POST" && candidatesMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const boardId = candidatesMatch[1]!;
        if (!assertBoardAccess(store.db, boardId, userId, "write")) {
          send(res, getBoard(store.db, boardId) ? 403 : 404, {
            error: getBoard(store.db, boardId) ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const name = String(body.name ?? "").trim();
        const email = String(body.email ?? "").trim();
        if (!name || !email) {
          send(res, 400, { error: "name and email required" });
          return;
        }
        const candidate = createCandidate(store.db, boardId, name, email);
        send(res, 201, { candidate });
        return;
      }

      const criteriaMatch = path.match(/^\/jobs\/([^/]+)\/criteria$/);
      if (criteriaMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const jobId = criteriaMatch[1]!;
        const job = getJob(store.db, jobId);
        if (!job) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (method === "GET") {
          if (!assertBoardAccess(store.db, job.boardId, userId, "read")) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          send(res, 200, { criteria: listCriteria(store.db, jobId) });
          return;
        }
        if (method === "POST") {
          if (!assertBoardAccess(store.db, job.boardId, userId, "write")) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const label = String(body.label ?? "").trim();
          if (!label) {
            send(res, 400, { error: "label required" });
            return;
          }
          const weight = Number(body.weight ?? 1);
          const criterion = addCriterion(store.db, jobId, label, weight);
          send(res, 201, { criterion });
          return;
        }
      }

      const appsForJob = path.match(/^\/jobs\/([^/]+)\/applications$/);
      if (appsForJob) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const jobId = appsForJob[1]!;
        const job = getJob(store.db, jobId);
        if (!job) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (method === "GET") {
          if (!assertBoardAccess(store.db, job.boardId, userId, "read")) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const { limit, offset } = parseLimitOffset(url);
          send(res, 200, {
            applications: listApplications(store.db, jobId, limit, offset),
          });
          return;
        }
        if (method === "POST") {
          if (!assertBoardAccess(store.db, job.boardId, userId, "write")) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const candidateId = String(body.candidateId ?? "");
          const candidate = getCandidate(store.db, candidateId);
          if (!candidate || candidate.boardId !== job.boardId) {
            send(res, 400, { error: "candidate must belong to job board" });
            return;
          }
          try {
            const application = createApplication(store.db, jobId, candidateId);
            send(res, 201, { application });
          } catch {
            send(res, 409, { error: "application exists" });
          }
          return;
        }
      }

      const scoreMatch = path.match(/^\/applications\/([^/]+)\/scores$/);
      if (method === "POST" && scoreMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = scoreMatch[1]!;
        const boardId = boardIdForApplication(store.db, applicationId);
        if (!boardId) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!assertBoardAccess(store.db, boardId, userId, "review")) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const app = getApplication(store.db, applicationId)!;
        if (app.state !== "screening") {
          send(res, 400, { error: "scores only while screening" });
          return;
        }
        const body = await readBody(req);
        const criterionId = String(body.criterionId ?? "");
        const value = Number(body.value);
        if (!criterionId || Number.isNaN(value) || value < 0 || value > 5) {
          send(res, 400, { error: "criterionId and value 0-5 required" });
          return;
        }
        const score = upsertScore(
          store.db,
          applicationId,
          criterionId,
          userId,
          value,
        );
        send(res, 201, {
          score,
          application: getApplication(store.db, applicationId),
          hireHint: meetsHireThreshold(
            getApplication(store.db, applicationId)?.scoreAverage ?? null,
          ),
        });
        return;
      }

      const transitionMatch = path.match(/^\/applications\/([^/]+)\/transition$/);
      if (method === "POST" && transitionMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = transitionMatch[1]!;
        const boardId = boardIdForApplication(store.db, applicationId);
        if (!boardId) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (!assertBoardAccess(store.db, boardId, userId, "write")) {
          send(res, 403, { error: "forbidden" });
          return;
        }
        const body = await readBody(req);
        const to = String(body.to ?? "") as WorkflowState;
        const version = Number(body.version);
        const decision =
          body.decision === "hired" || body.decision === "rejected"
            ? body.decision
            : null;
        const result = transitionApplication(
          store.db,
          applicationId,
          userId,
          to,
          version,
          decision,
        );
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        if (result.application.state === "decided") {
          store.sideEffects += 1;
          const payload = {
            applicationId,
            decision: result.application.decision,
            scoreAverage: result.application.scoreAverage,
          };
          recordWebhook(store.db, "application.decided", applicationId, payload);
          try {
            await store.dep.notify("application.decided", payload);
          } catch (err) {
            logEvent("dep.notify.fail", {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
        send(res, 200, { application: result.application });
        return;
      }

      const auditMatch = path.match(/^\/applications\/([^/]+)\/audit$/);
      if (method === "GET" && auditMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const applicationId = auditMatch[1]!;
        const boardId = boardIdForApplication(store.db, applicationId);
        if (!boardId || !assertBoardAccess(store.db, boardId, userId, "read")) {
          send(res, boardId ? 403 : 404, {
            error: boardId ? "forbidden" : "not found",
          });
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
        const idempotencyKey = String(
          req.headers["idempotency-key"] ?? body.idempotencyKey ?? "",
        );
        logEvent("webhook.inbound", {
          event: body.event,
          idempotencyKey: idempotencyKey || null,
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
