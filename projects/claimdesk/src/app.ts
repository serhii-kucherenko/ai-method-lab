import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addDeskMember,
  addEvidence,
  assertDeskAccess,
  createClaim,
  createDesk,
  createPolicy,
  createStore,
  deskIdForClaim,
  findUserByEmail,
  getClaim,
  getDesk,
  getPolicy,
  issueToken,
  listAudit,
  listClaims,
  listPolicies,
  recordWebhook,
  registerUser,
  resolveToken,
  setReserve,
  transitionClaim,
} from "./store.js";
import { listMigrations, migrationCount, type DeskRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import type { WorkflowState } from "./rules.js";

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
          service: "claimdesk",
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

      if (method === "POST" && path === "/desks") {
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
        send(res, 201, { desk: createDesk(store.db, userId, name) });
        return;
      }

      const memberMatch = path.match(/^\/desks\/([^/]+)\/members$/);
      if (method === "POST" && memberMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const deskId = memberMatch[1]!;
        if (!assertDeskAccess(store.db, deskId, userId, "write")) {
          send(res, getDesk(store.db, deskId) ? 403 : 404, {
            error: getDesk(store.db, deskId) ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const memberId = String(body.userId ?? "");
        const role = String(body.role ?? "") as DeskRole;
        if (
          !memberId ||
          !["supervisor", "adjuster", "claimant"].includes(role)
        ) {
          send(res, 400, { error: "userId and role required" });
          return;
        }
        addDeskMember(store.db, deskId, memberId, role);
        send(res, 201, { ok: true });
        return;
      }

      const policiesMatch = path.match(/^\/desks\/([^/]+)\/policies$/);
      if (policiesMatch) {
        const deskId = policiesMatch[1]!;
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        if (method === "GET") {
          if (!assertDeskAccess(store.db, deskId, userId, "read")) {
            send(res, getDesk(store.db, deskId) ? 403 : 404, {
              error: getDesk(store.db, deskId) ? "forbidden" : "not found",
            });
            return;
          }
          const { limit, offset } = parseLimitOffset(url);
          send(res, 200, {
            policies: listPolicies(store.db, deskId, limit, offset),
          });
          return;
        }
        if (method === "POST") {
          if (!assertDeskAccess(store.db, deskId, userId, "write")) {
            send(res, getDesk(store.db, deskId) ? 403 : 404, {
              error: getDesk(store.db, deskId) ? "forbidden" : "not found",
            });
            return;
          }
          const body = await readBody(req);
          const number = String(body.number ?? "").trim();
          const holder = String(body.holder ?? "").trim();
          if (!number || !holder) {
            send(res, 400, { error: "number and holder required" });
            return;
          }
          send(res, 201, {
            policy: createPolicy(store.db, deskId, number, holder),
          });
          return;
        }
      }

      const claimsMatch = path.match(/^\/policies\/([^/]+)\/claims$/);
      if (claimsMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const policyId = claimsMatch[1]!;
        const policy = getPolicy(store.db, policyId);
        if (!policy) {
          send(res, 404, { error: "not found" });
          return;
        }
        if (method === "GET") {
          if (!assertDeskAccess(store.db, policy.deskId, userId, "read")) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const { limit, offset } = parseLimitOffset(url);
          send(res, 200, {
            claims: listClaims(store.db, policyId, limit, offset),
          });
          return;
        }
        if (method === "POST") {
          if (!assertDeskAccess(store.db, policy.deskId, userId, "write")) {
            send(res, 403, { error: "forbidden" });
            return;
          }
          const body = await readBody(req);
          const title = String(body.title ?? "").trim();
          if (!title) {
            send(res, 400, { error: "title required" });
            return;
          }
          send(res, 201, { claim: createClaim(store.db, policyId, title) });
          return;
        }
      }

      const reserveMatch = path.match(/^\/claims\/([^/]+)\/reserve$/);
      if (method === "POST" && reserveMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const claimId = reserveMatch[1]!;
        const deskId = deskIdForClaim(store.db, claimId);
        if (!deskId || !assertDeskAccess(store.db, deskId, userId, "write")) {
          send(res, deskId ? 403 : 404, {
            error: deskId ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const amount = Number(body.amount);
        if (Number.isNaN(amount) || amount < 0) {
          send(res, 400, { error: "amount required" });
          return;
        }
        send(res, 200, { claim: setReserve(store.db, claimId, amount) });
        return;
      }

      const evidenceMatch = path.match(/^\/claims\/([^/]+)\/evidence$/);
      if (method === "POST" && evidenceMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const claimId = evidenceMatch[1]!;
        const deskId = deskIdForClaim(store.db, claimId);
        if (!deskId || !assertDeskAccess(store.db, deskId, userId, "read")) {
          send(res, deskId ? 403 : 404, {
            error: deskId ? "forbidden" : "not found",
          });
          return;
        }
        const claim = getClaim(store.db, claimId)!;
        if (claim.state === "settled") {
          send(res, 400, { error: "cannot add evidence after settle" });
          return;
        }
        const body = await readBody(req);
        const label = String(body.label ?? "").trim();
        if (!label) {
          send(res, 400, { error: "label required" });
          return;
        }
        const evidence = addEvidence(
          store.db,
          claimId,
          label,
          String(body.kind ?? "note"),
          userId,
        );
        send(res, 201, { evidence, claim: getClaim(store.db, claimId) });
        return;
      }

      const transitionMatch = path.match(/^\/claims\/([^/]+)\/transition$/);
      if (method === "POST" && transitionMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const claimId = transitionMatch[1]!;
        const deskId = deskIdForClaim(store.db, claimId);
        if (!deskId || !assertDeskAccess(store.db, deskId, userId, "write")) {
          send(res, deskId ? 403 : 404, {
            error: deskId ? "forbidden" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const to = String(body.to ?? "") as WorkflowState;
        const version = Number(body.version);
        const payout =
          body.payout === undefined || body.payout === null
            ? null
            : Number(body.payout);
        const result = transitionClaim(
          store.db,
          claimId,
          userId,
          to,
          version,
          payout,
        );
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        if (result.claim.state === "settled") {
          store.sideEffects += 1;
          const payload = {
            claimId,
            payout: result.claim.payoutAmount,
            reserve: result.claim.reserveAmount,
          };
          recordWebhook(store.db, "claim.settled", claimId, payload);
          try {
            await store.dep.notify("claim.settled", payload);
          } catch (err) {
            logEvent("dep.notify.fail", {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
        send(res, 200, { claim: result.claim });
        return;
      }

      const auditMatch = path.match(/^\/claims\/([^/]+)\/audit$/);
      if (method === "GET" && auditMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const claimId = auditMatch[1]!;
        const deskId = deskIdForClaim(store.db, claimId);
        if (!deskId || !assertDeskAccess(store.db, deskId, userId, "read")) {
          send(res, deskId ? 403 : 404, {
            error: deskId ? "forbidden" : "not found",
          });
          return;
        }
        send(res, 200, { audit: listAudit(store.db, claimId) });
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
