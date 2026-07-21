import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addArchiveApproval,
  addEvidence,
  addMember,
  assertAccess,
  createFirm,
  createMatter,
  createStore,
  findUserByEmail,
  getFirm,
  getMatter,
  issueToken,
  listMatters,
  recordWebhook,
  registerUser,
  resolveToken,
  transitionMatter,
} from "./store.js";
import { listMigrations, migrationCount, type FirmRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import type { MatterState } from "./rules.js";

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
  return token ? resolveToken(store.db, token) : null;
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
  return a.length === b.length && timingSafeEqual(a, b);
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
          service: "safecase",
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

      if (method === "POST" && path === "/firms") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const name = String((await readBody(req)).name ?? "").trim();
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { firm: createFirm(store.db, userId, name) });
        return;
      }

      const memberMatch = /^\/firms\/([^/]+)\/members$/.exec(path);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const firmId = memberMatch[1]!;
        if (!assertAccess(store.db, firmId, userId, "own")) {
          send(res, getFirm(store.db, firmId) ? 403 : 404, {
            error: getFirm(store.db, firmId) ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const role = String(body.role ?? "") as FirmRole;
        if (!["counsel", "paralegal", "viewer"].includes(role)) {
          send(res, 400, { error: "role required" });
          return;
        }
        addMember(store.db, firmId, String(body.userId ?? ""), role);
        send(res, 201, { ok: true });
        return;
      }

      const mattersMatch = /^\/firms\/([^/]+)\/matters$/.exec(path);
      if (mattersMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const firmId = mattersMatch[1]!;
        if (method === "GET") {
          if (!assertAccess(store.db, firmId, userId, "read")) {
            send(res, getFirm(store.db, firmId) ? 403 : 404, {
              error: getFirm(store.db, firmId) ? "forbidden" : "not found",
            });
            return;
          }
          const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 20), 1), 100);
          const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
          send(res, 200, { matters: listMatters(store.db, firmId, limit, offset) });
          return;
        }
        if (method === "POST") {
          if (!assertAccess(store.db, firmId, userId, "write")) {
            send(res, getFirm(store.db, firmId) ? 403 : 404, {
              error: getFirm(store.db, firmId) ? "forbidden" : "not found",
            });
            return;
          }
          const body = await readBody(req);
          const title = String(body.title ?? "").trim();
          const retentionDays = Number(body.retentionDays ?? 30);
          if (!title) {
            send(res, 400, { error: "title required" });
            return;
          }
          send(res, 201, {
            matter: createMatter(
              store.db,
              firmId,
              title,
              retentionDays,
              store.nowIso(),
            ),
          });
          return;
        }
      }

      const evidenceMatch = /^\/matters\/([^/]+)\/evidence$/.exec(path);
      if (method === "POST" && evidenceMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const matter = getMatter(store.db, evidenceMatch[1]!);
        if (!matter || !assertAccess(store.db, matter.firmId, userId, "write")) {
          send(res, matter ? 403 : 404, { error: matter ? "forbidden" : "not found" });
          return;
        }
        const body = await readBody(req);
        const result = addEvidence(
          store.db,
          matter.id,
          String(body.label ?? ""),
          store.nowIso(),
        );
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { matter: result.matter });
        return;
      }

      const approveMatch = /^\/matters\/([^/]+)\/approve$/.exec(path);
      if (method === "POST" && approveMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const matter = getMatter(store.db, approveMatch[1]!);
        if (!matter || !assertAccess(store.db, matter.firmId, userId, "archive")) {
          send(res, matter ? 403 : 404, { error: matter ? "forbidden" : "not found" });
          return;
        }
        const result = addArchiveApproval(store.db, matter.id, userId);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 200, { ok: true, approvalCount: result.approvalCount });
        return;
      }

      const trMatch = /^\/matters\/([^/]+)\/transition$/.exec(path);
      if (method === "POST" && trMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const matter = getMatter(store.db, trMatch[1]!);
        const body = await readBody(req);
        const to = String(body.to ?? "") as MatterState;
        const mode = to === "archived" ? "own" : "write";
        if (!matter || !assertAccess(store.db, matter.firmId, userId, mode)) {
          send(res, matter ? 403 : 404, { error: matter ? "forbidden" : "not found" });
          return;
        }
        const result = transitionMatter(
          store.db,
          matter.id,
          userId,
          to,
          Number(body.version),
          store.nowIso(),
        );
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        if (result.matter.state === "archived") {
          store.sideEffects += 1;
          const payload = { matterId: result.matter.id, state: result.matter.state };
          recordWebhook(store.db, "matter.archived", result.matter.id, payload);
          try {
            await store.dep.notify("matter.archived", payload);
          } catch (err) {
            logEvent("dep.notify.fail", {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
        send(res, 200, { matter: result.matter });
        return;
      }

      if (method === "POST" && path === "/webhooks/inbound") {
        const raw = await readRaw(req);
        if (
          !verifyHmac(
            store.webhookSecret,
            raw,
            req.headers["x-signature"] as string | undefined,
          )
        ) {
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
    nowIso?: () => string;
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
