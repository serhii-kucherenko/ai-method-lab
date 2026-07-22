import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Store } from "./store.js";
import {
  addMember,
  assertAccess,
  auditToCsv,
  createEntry,
  createOrg,
  createStore,
  findUserByEmail,
  getCashImpact,
  getEntry,
  getOrg,
  issueToken,
  listAudit,
  listEntries,
  patchEntry,
  registerUser,
  resolveToken,
  runBatchForecast,
  runForecast,
} from "./store.js";
import { listMigrations, migrationCount, type OrgRole } from "./db.js";
import type { ForecastInput } from "./domain/forecast.js";

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

async function readBody(req: IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks);
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

function orgDenied(
  store: Store,
  orgId: string,
  userId: string,
  mode: "read" | "write" | "forecast",
  res: ServerResponse,
): boolean {
  if (!assertAccess(store.db, orgId, userId, mode)) {
    send(res, getOrg(store.db, orgId) ? 403 : 404, {
      error: getOrg(store.db, orgId) ? "forbidden" : "not found",
    });
    return true;
  }
  return false;
}

function servePublic(path: string, res: ServerResponse): boolean {
  const file = join(publicDir, path);
  if (!existsSync(file)) return false;
  const body = readFileSync(file);
  res.writeHead(200, {
    "content-type": MIME[extname(path)] ?? "application/octet-stream",
    "content-length": body.length,
  });
  res.end(body);
  return true;
}

function parseForecastOverride(body: Json): Partial<ForecastInput> {
  const out: Partial<ForecastInput> = {};
  if ("deposit_rate" in body) out.deposit_rate = Number(body.deposit_rate);
  if ("assessed_rate" in body) {
    out.assessed_rate =
      body.assessed_rate === null ? null : Number(body.assessed_rate);
  }
  if ("entered_value" in body) out.entered_value = Number(body.entered_value);
  if ("order_published_on" in body) {
    out.order_published_on = String(body.order_published_on);
  }
  if ("liquidated_on" in body) out.liquidated_on = String(body.liquidated_on);
  if ("interest_annual_rate" in body) {
    out.interest_annual_rate =
      body.interest_annual_rate === null ? null : Number(body.interest_annual_rate);
  }
  if ("skip_interest" in body) out.skip_interest = Boolean(body.skip_interest);
  if ("order_type" in body) out.order_type = String(body.order_type);
  if ("rate_class" in body) out.rate_class = String(body.rate_class);
  return out;
}

export function createApp(opts: { store?: Store; rateLimit?: number } = {}) {
  const store = opts.store ?? createStore({ rateLimit: opts.rateLimit });

  const server = createServer(async (req, res) => {
    try {
      const method = req.method ?? "GET";
      const url = new URL(req.url ?? "/", "http://localhost");
      const path = url.pathname;

      if (method === "GET") {
        if (path === "/" || path === "/index.html") {
          if (servePublic("money-honesty.html", res)) return;
        }
        const staticPages = [
          "/money-honesty.html",
          "/entries.html",
          "/entry-detail.html",
          "/batch.html",
          "/cash-impact.html",
          "/audit.html",
          "/goldens.html",
          "/settings.html",
          "/styles.css",
        ];
        if (staticPages.includes(path) && servePublic(path.slice(1), res)) return;
      }

      if (method === "GET" && path === "/health") {
        send(res, 200, {
          ok: true,
          product: "depositgap",
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

      if (method === "POST" && path === "/orgs") {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const name = String((await readBody(req)).name ?? "").trim();
        if (!name) {
          send(res, 400, { error: "name required" });
          return;
        }
        send(res, 201, { org: createOrg(store.db, userId, name) });
        return;
      }

      const entriesMatch = path.match(/^\/orgs\/([^/]+)\/entries$/);
      if (entriesMatch) {
        const orgId = entriesMatch[1]!;
        if (method === "GET") {
          if (!userId) {
            send(res, 401, { error: "unauthorized" });
            return;
          }
          if (orgDenied(store, orgId, userId, "read", res)) return;
          const limitRaw = url.searchParams.get("limit");
          const offsetRaw = url.searchParams.get("offset");
          const listed = listEntries(store.db, orgId, {
            limit: limitRaw !== null ? Number(limitRaw) : undefined,
            offset: offsetRaw !== null ? Number(offsetRaw) : undefined,
          });
          send(res, 200, listed);
          return;
        }
        if (method === "POST") {
          if (!userId) {
            send(res, 401, { error: "unauthorized" });
            return;
          }
          if (orgDenied(store, orgId, userId, "write", res)) return;
          const body = await readBody(req);
          const result = createEntry(store.db, orgId, {
            por: body.por !== undefined ? String(body.por) : undefined,
            order_type: String(body.order_type ?? "AD"),
            rate_class: String(body.rate_class ?? "exporter_specific"),
            deposit_rate: Number(body.deposit_rate),
            assessed_rate:
              body.assessed_rate === undefined || body.assessed_rate === null
                ? null
                : Number(body.assessed_rate),
            entered_value: Number(body.entered_value),
            order_published_on: String(body.order_published_on ?? ""),
            liquidated_on: String(body.liquidated_on ?? ""),
            interest_annual_rate:
              body.interest_annual_rate === undefined || body.interest_annual_rate === null
                ? null
                : Number(body.interest_annual_rate),
            skip_interest: Boolean(body.skip_interest),
          });
          if (!result.ok) {
            send(res, result.status, { error: result.error });
            return;
          }
          send(res, 201, { entry: result.value });
          return;
        }
      }

      const entryOneMatch = path.match(/^\/orgs\/([^/]+)\/entries\/([^/]+)$/);
      if (entryOneMatch) {
        const orgId = entryOneMatch[1]!;
        const entryId = entryOneMatch[2]!;
        if (method === "GET") {
          if (!userId) {
            send(res, 401, { error: "unauthorized" });
            return;
          }
          if (orgDenied(store, orgId, userId, "read", res)) return;
          const entry = getEntry(store.db, entryId);
          if (!entry || entry.orgId !== orgId) {
            send(res, 404, { error: "not found" });
            return;
          }
          send(res, 200, { entry });
          return;
        }
        if (method === "PATCH") {
          if (!userId) {
            send(res, 401, { error: "unauthorized" });
            return;
          }
          if (orgDenied(store, orgId, userId, "write", res)) return;
          const entry = getEntry(store.db, entryId);
          if (!entry || entry.orgId !== orgId) {
            send(res, 404, { error: "not found" });
            return;
          }
          const body = await readBody(req);
          const result = patchEntry(store.db, entryId, {
            por: body.por !== undefined ? String(body.por) : undefined,
            order_type: body.order_type !== undefined ? String(body.order_type) : undefined,
            rate_class: body.rate_class !== undefined ? String(body.rate_class) : undefined,
            deposit_rate:
              body.deposit_rate !== undefined ? Number(body.deposit_rate) : undefined,
            assessed_rate:
              body.assessed_rate === undefined
                ? undefined
                : body.assessed_rate === null
                  ? null
                  : Number(body.assessed_rate),
            entered_value:
              body.entered_value !== undefined ? Number(body.entered_value) : undefined,
            order_published_on:
              body.order_published_on !== undefined
                ? String(body.order_published_on)
                : undefined,
            liquidated_on:
              body.liquidated_on !== undefined ? String(body.liquidated_on) : undefined,
            interest_annual_rate:
              body.interest_annual_rate === undefined
                ? undefined
                : body.interest_annual_rate === null
                  ? null
                  : Number(body.interest_annual_rate),
            skip_interest:
              body.skip_interest !== undefined ? Boolean(body.skip_interest) : undefined,
          });
          if (!result.ok) {
            send(res, result.status, { error: result.error });
            return;
          }
          send(res, 200, { entry: result.value });
          return;
        }
      }

      const membersMatch = path.match(/^\/orgs\/([^/]+)\/members$/);
      if (method === "POST" && membersMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const orgId = membersMatch[1]!;
        const role = assertAccess(store.db, orgId, userId, "read");
        if (role !== "admin") {
          send(res, getOrg(store.db, orgId) ? 403 : 404, {
            error: getOrg(store.db, orgId) ? "admin_required" : "not found",
          });
          return;
        }
        const body = await readBody(req);
        const memberRole = String(body.role ?? "auditor") as OrgRole;
        if (!["analyst", "auditor", "admin"].includes(memberRole)) {
          send(res, 400, { error: "invalid_role" });
          return;
        }
        const result = addMember(store.db, orgId, String(body.userId), memberRole);
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        send(res, 201, { member: result.value });
        return;
      }

      const forecastMatch = path.match(/^\/orgs\/([^/]+)\/entries\/([^/]+)\/forecast$/);
      if (method === "POST" && forecastMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const orgId = forecastMatch[1]!;
        const entryId = forecastMatch[2]!;
        if (orgDenied(store, orgId, userId, "forecast", res)) return;
        const entry = getEntry(store.db, entryId);
        if (!entry || entry.orgId !== orgId) {
          send(res, 404, { error: "not found" });
          return;
        }
        const body = await readBody(req);
        const result = runForecast(store.db, entryId, parseForecastOverride(body));
        if (!result.ok) {
          send(res, result.status, { error: result.error });
          return;
        }
        const forecast = result.value;
        if (forecast.status === "reject") {
          send(res, 422, forecast);
          return;
        }
        send(res, 200, forecast);
        return;
      }

      const batchMatch = path.match(/^\/orgs\/([^/]+)\/batch\/forecast$/);
      if (method === "POST" && batchMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const orgId = batchMatch[1]!;
        if (orgDenied(store, orgId, userId, "forecast", res)) return;
        const body = await readBody(req);
        const rawIds = body.entryIds;
        if (!Array.isArray(rawIds) || rawIds.length === 0) {
          send(res, 400, { error: "entryIds required" });
          return;
        }
        const entryIds = rawIds.map((id) => String(id));
        const batch = runBatchForecast(
          store.db,
          orgId,
          entryIds,
          parseForecastOverride(body),
        );
        send(res, 200, batch);
        return;
      }

      const cashMatch = path.match(/^\/orgs\/([^/]+)\/cash-impact$/);
      if (method === "GET" && cashMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const orgId = cashMatch[1]!;
        if (orgDenied(store, orgId, userId, "read", res)) return;
        send(res, 200, getCashImpact(store.db, orgId));
        return;
      }

      const auditMatch = path.match(/^\/orgs\/([^/]+)\/audit$/);
      if (method === "GET" && auditMatch) {
        if (!userId) {
          send(res, 401, { error: "unauthorized" });
          return;
        }
        const orgId = auditMatch[1]!;
        if (orgDenied(store, orgId, userId, "read", res)) return;
        const limitRaw = url.searchParams.get("limit");
        const offsetRaw = url.searchParams.get("offset");
        const listed = listAudit(store.db, orgId, {
          entryId: url.searchParams.get("entryId") ?? undefined,
          status: url.searchParams.get("status") ?? undefined,
          limit: limitRaw !== null ? Number(limitRaw) : undefined,
          offset: offsetRaw !== null ? Number(offsetRaw) : undefined,
        });
        if (url.searchParams.get("format") === "csv") {
          const csv = auditToCsv(listed.events);
          res.writeHead(200, {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": 'attachment; filename="audit.csv"',
            "content-length": Buffer.byteLength(csv),
          });
          res.end(csv);
          return;
        }
        send(res, 200, listed);
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
