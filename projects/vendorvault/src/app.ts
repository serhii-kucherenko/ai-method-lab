import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addMember,
  addQuestion,
  assertAccess,
  attestVendor,
  createFinding,
  createStore,
  createVendor,
  createWorkspace,
  findUserByEmail,
  getFinding,
  getVendor,
  getWorkspace,
  issueToken,
  listVendors,
  recordWebhook,
  registerUser,
  resolveToken,
  scoreQuestion,
  transitionFinding,
  vendorAverage,
  workspaceIdForFinding,
} from "./store.js";
import { listMigrations, migrationCount, type WorkspaceRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import type { FindingState, Severity } from "./rules.js";

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
  extra: Record<string, string> = {},
): void {
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

function verifyHmac(secret: string, raw: Buffer, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
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
          service: "vendorvault",
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

      if (method === "POST" && path === "/workspaces") {
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
        send(res, 201, { workspace: createWorkspace(store.db, userId, name) });
        return;
      }

      const memberMatch = path.match(/^\/workspaces\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const wsId = memberMatch[1]!;
        if (!assertAccess(store.db, wsId, userId, "accept")) {
          send(res, getWorkspace(store.db, wsId) ? 403 : 404, {
            error: getWorkspace(store.db, wsId) ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const role = String(body.role ?? "") as WorkspaceRole;
        if (!["owner", "analyst", "viewer"].includes(role)) {
          send(res, 400, { error: "role required" });
          return;
        }
        addMember(store.db, wsId, String(body.userId ?? ""), role);
        send(res, 201, { ok: true });
        return;
      }

      const vendorsMatch = path.match(/^\/workspaces\/([^/]+)\/vendors$/);
      if (vendorsMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const wsId = vendorsMatch[1]!;
        if (method === "GET") {
          if (!assertAccess(store.db, wsId, userId, "read")) {
            send(res, getWorkspace(store.db, wsId) ? 403 : 404, {
              error: getWorkspace(store.db, wsId) ? "forbidden" : "not found",
            });
            return;
          }
          const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
          const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
          send(res, 200, { vendors: listVendors(store.db, wsId, limit, offset) });
          return;
        }
        if (method === "POST") {
          if (!assertAccess(store.db, wsId, userId, "write")) {
            send(res, getWorkspace(store.db, wsId) ? 403 : 404, {
              error: getWorkspace(store.db, wsId) ? "forbidden" : "not found",
            });
            return;
          }
          const body = await readBody(req);
          const name = String(body.name ?? "").trim();
          if (!name) {
            send(res, 400, { error: "name required" });
            return;
          }
          send(res, 201, {
            vendor: createVendor(store.db, wsId, name, String(body.tier ?? "standard")),
          });
          return;
        }
      }

      const attestMatch = path.match(/^\/vendors\/([^/]+)\/attest$/);
      if (method === "POST" && attestMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const vendor = getVendor(store.db, attestMatch[1]!);
        if (!vendor || !assertAccess(store.db, vendor.workspaceId, userId, "accept")) {
          send(res, vendor ? 403 : 404, { error: vendor ? "forbidden" : "not found" });
          return;
        }
        const body = await readBody(req);
        const until = String(body.until ?? "").trim();
        if (!until) {
          send(res, 400, { error: "until required (YYYY-MM-DD)" });
          return;
        }
        send(res, 200, { vendor: attestVendor(store.db, vendor.id, until) });
        return;
      }

      const qMatch = path.match(/^\/vendors\/([^/]+)\/questions$/);
      if (method === "POST" && qMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const vendor = getVendor(store.db, qMatch[1]!);
        if (!vendor || !assertAccess(store.db, vendor.workspaceId, userId, "write")) {
          send(res, vendor ? 403 : 404, { error: vendor ? "forbidden" : "not found" });
          return;
        }
        const body = await readBody(req);
        const prompt = String(body.prompt ?? "").trim();
        if (!prompt) {
          send(res, 400, { error: "prompt required" });
          return;
        }
        send(res, 201, { question: addQuestion(store.db, vendor.id, prompt) });
        return;
      }

      const scoreMatch = path.match(/^\/questions\/([^/]+)\/score$/);
      if (method === "POST" && scoreMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const body = await readBody(req);
        const value = Number(body.value);
        if (Number.isNaN(value) || value < 0 || value > 5) {
          send(res, 400, { error: "value 0-5 required" });
          return;
        }
        send(res, 201, { score: scoreQuestion(store.db, scoreMatch[1]!, value) });
        return;
      }

      const findingsMatch = path.match(/^\/vendors\/([^/]+)\/findings$/);
      if (method === "POST" && findingsMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const vendor = getVendor(store.db, findingsMatch[1]!);
        if (!vendor || !assertAccess(store.db, vendor.workspaceId, userId, "write")) {
          send(res, vendor ? 403 : 404, { error: vendor ? "forbidden" : "not found" });
          return;
        }
        const body = await readBody(req);
        const title = String(body.title ?? "").trim();
        const severity = String(body.severity ?? "medium") as Severity;
        if (!title || !["low", "medium", "high", "critical"].includes(severity)) {
          send(res, 400, { error: "title and severity required" });
          return;
        }
        send(res, 201, { finding: createFinding(store.db, vendor.id, title, severity) });
        return;
      }

      const avgMatch = path.match(/^\/vendors\/([^/]+)\/average$/);
      if (method === "GET" && avgMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const vendor = getVendor(store.db, avgMatch[1]!);
        if (!vendor || !assertAccess(store.db, vendor.workspaceId, userId, "read")) {
          send(res, vendor ? 403 : 404, { error: vendor ? "forbidden" : "not found" });
          return;
        }
        send(res, 200, { average: vendorAverage(store.db, vendor.id) });
        return;
      }

      const transitionMatch = path.match(/^\/findings\/([^/]+)\/transition$/);
      if (method === "POST" && transitionMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const findingId = transitionMatch[1]!;
        const wsId = workspaceIdForFinding(store.db, findingId);
        const body = await readBody(req);
        const to = String(body.to ?? "") as FindingState;
        const mode = to === "accepted" ? "accept" : "write";
        if (!wsId || !assertAccess(store.db, wsId, userId, mode)) {
          send(res, wsId ? 403 : 404, { error: wsId ? "forbidden" : "not found" });
          return;
        }
        const result = transitionFinding(
          store,
          findingId,
          userId,
          to,
          Number(body.version),
          body.remediation_note != null ? String(body.remediation_note) : null,
        );
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        if (result.finding.state === "accepted") {
          store.sideEffects += 1;
          const payload = { findingId, severity: result.finding.severity };
          recordWebhook(store.db, "finding.accepted", findingId, payload);
          try {
            await store.dep.notify("finding.accepted", payload);
          } catch (err) {
            logEvent("dep.notify.fail", {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
        send(res, 200, { finding: result.finding });
        return;
      }

      if (method === "POST" && path === "/webhooks/inbound") {
        const raw = await readRaw(req);
        if (!verifyHmac(store.webhookSecret, raw, req.headers["x-signature"] as string | undefined)) {
          send(res, 401, { error: "invalid signature" });
          return;
        }
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
  opts?: {
    dep?: DepClient;
    webhookSecret?: string;
    rateLimit?: number;
    nowIso?: string;
  },
): Promise<T> {
  const { server, store } = createApp(
    createStore({
      dep: opts?.dep,
      webhookSecret: opts?.webhookSecret,
      rateLimit: opts?.rateLimit,
      nowIso: opts?.nowIso,
    }),
  );
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

export { createMockDep };
export type { DepClient };
