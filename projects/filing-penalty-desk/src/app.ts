import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  addMember,
  assertAccess,
  createOrg,
  createStore,
  createTimeline,
  findUserByEmail,
  getOrg,
  getTimeline,
  issueToken,
  listTimelines,
  patchTimeline,
  registerUser,
  resolveToken,
  runForecast,
  type OrgRole,
  type Store,
  type TimelineCreate,
} from "./store.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

type Json = Record<string, unknown>;

async function readBody(req: IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString("utf8")) as Json;
  } catch {
    return {};
  }
}

function send(res: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
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
  return resolveToken(store, token);
}

function checkRateLimit(store: Store, req: IncomingMessage, res: ServerResponse): boolean {
  const key = getToken(req) ?? req.socket.remoteAddress ?? "anon";
  const n = (store.rateCounts.get(key) ?? 0) + 1;
  store.rateCounts.set(key, n);
  if (n > store.rateLimit) {
    send(res, 429, { error: "rate_limit_exceeded" });
    return false;
  }
  return true;
}

function serveStatic(res: ServerResponse, urlPath: string): boolean {
  const clean = urlPath === "/" ? "/honesty.html" : urlPath;
  const filePath = join(publicDir, clean.replace(/^\//, ""));
  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) return false;
  const body = readFileSync(filePath);
  res.writeHead(200, {
    "content-type": MIME[extname(filePath)] ?? "application/octet-stream",
    "content-length": body.length,
  });
  res.end(body);
  return true;
}

function timelineInputFromBody(body: Json) {
  const netDue = body.net_amount_due;
  return {
    label: body.label !== undefined ? String(body.label) : undefined,
    net_amount_due:
      typeof netDue === "number" || typeof netDue === "string" ? netDue : undefined,
    unpaid_by_month: Array.isArray(body.unpaid_by_month)
      ? (body.unpaid_by_month as number[])
      : undefined,
    unfiled_months: body.unfiled_months !== undefined ? Number(body.unfiled_months) : undefined,
    levy_bump_after_month:
      body.levy_bump_after_month === null
        ? null
        : body.levy_bump_after_month !== undefined
          ? Number(body.levy_bump_after_month)
          : undefined,
    min_floor: body.min_floor !== undefined ? Number(body.min_floor) : undefined,
    apply_minimum: body.apply_minimum === true,
    flat_55_cheat: body.flat_55_cheat === true,
    dual_approver_cheat: body.dual_approver_cheat === true,
    interest_as_penalty: body.interest_as_penalty === true,
    installment_025_silent: body.installment_025_silent === true,
    partnership_6698_cheat: body.partnership_6698_cheat === true,
    scorp_6699_cheat: body.scorp_6699_cheat === true,
    c1_after_ftf_cap_cheat: body.c1_after_ftf_cap_cheat === true,
    min_undercut_cheat: body.min_undercut_cheat === true,
  };
}

function timelinePatchFromBody(body: Json): Partial<TimelineCreate> {
  const patch: Partial<TimelineCreate> = {};
  if (body.label !== undefined) patch.label = String(body.label);
  if (body.net_amount_due !== undefined) {
    const netDue = body.net_amount_due;
    if (typeof netDue === "number" || typeof netDue === "string") {
      patch.net_amount_due = netDue;
    }
  }
  if (Array.isArray(body.unpaid_by_month)) {
    patch.unpaid_by_month = body.unpaid_by_month as number[];
  }
  if (body.unfiled_months !== undefined) patch.unfiled_months = Number(body.unfiled_months);
  if (body.levy_bump_after_month !== undefined) {
    patch.levy_bump_after_month =
      body.levy_bump_after_month === null ? null : Number(body.levy_bump_after_month);
  }
  if (body.min_floor !== undefined) patch.min_floor = Number(body.min_floor);
  if (body.apply_minimum !== undefined) patch.apply_minimum = body.apply_minimum === true;
  if (body.flat_55_cheat !== undefined) patch.flat_55_cheat = body.flat_55_cheat === true;
  if (body.dual_approver_cheat !== undefined) {
    patch.dual_approver_cheat = body.dual_approver_cheat === true;
  }
  if (body.interest_as_penalty !== undefined) {
    patch.interest_as_penalty = body.interest_as_penalty === true;
  }
  if (body.installment_025_silent !== undefined) {
    patch.installment_025_silent = body.installment_025_silent === true;
  }
  if (body.partnership_6698_cheat !== undefined) {
    patch.partnership_6698_cheat = body.partnership_6698_cheat === true;
  }
  if (body.scorp_6699_cheat !== undefined) patch.scorp_6699_cheat = body.scorp_6699_cheat === true;
  if (body.c1_after_ftf_cap_cheat !== undefined) {
    patch.c1_after_ftf_cap_cheat = body.c1_after_ftf_cap_cheat === true;
  }
  if (body.min_undercut_cheat !== undefined) {
    patch.min_undercut_cheat = body.min_undercut_cheat === true;
  }
  return patch;
}

export function createApp(opts: { rateLimit?: number; store?: Store } = {}) {
  const store = opts.store ?? createStore({ rateLimit: opts.rateLimit });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;

    if (method === "GET" && (path === "/" || path.endsWith(".html") || path.endsWith(".css"))) {
      if (serveStatic(res, path)) return;
    }

    if (method === "GET" && path === "/health") {
      return send(res, 200, {
        ok: true,
        product: "filing-penalty-desk",
        display_name: "Filing Penalty Desk",
      });
    }

    if (!checkRateLimit(store, req, res)) return;

    if (method === "POST" && path === "/auth/register") {
      const body = await readBody(req);
      const email = String(body.email ?? "");
      const password = String(body.password ?? "");
      if (!email || !password) return send(res, 400, { error: "email_password_required" });
      if (findUserByEmail(store, email)) return send(res, 409, { error: "email_taken" });
      const user = registerUser(store, email, password);
      const token = issueToken(store, user.id);
      return send(res, 201, { user, token });
    }

    if (method === "POST" && path === "/orgs") {
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const body = await readBody(req);
      const name = String(body.name ?? "").trim();
      if (!name) return send(res, 400, { error: "name_required" });
      const org = createOrg(store, userId, name);
      return send(res, 201, { org });
    }

    const orgMatch = path.match(/^\/orgs\/([^/]+)$/);
    if (orgMatch && method === "GET") {
      const orgId = orgMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const org = getOrg(store, orgId);
      if (!org) return send(res, 404, { error: "org_not_found" });
      return send(res, 200, { org });
    }

    const membersMatch = path.match(/^\/orgs\/([^/]+)\/members$/);
    if (membersMatch && method === "POST") {
      const orgId = membersMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const role = String(body.role ?? "auditor") as OrgRole;
      if (!["admin", "analyst", "auditor"].includes(role)) {
        return send(res, 400, { error: "bad_role" });
      }
      const result = addMember(store, orgId, String(body.userId ?? ""), role);
      if (!result.ok) return send(res, 400, { error: result.error });
      return send(res, 201, { ok: true });
    }

    const timelinesMatch = path.match(/^\/orgs\/([^/]+)\/timelines$/);
    if (timelinesMatch && method === "GET") {
      const orgId = timelinesMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const listed = listTimelines(store, orgId, {
        limit: url.searchParams.get("limit")
          ? Number(url.searchParams.get("limit"))
          : undefined,
        offset: url.searchParams.get("offset")
          ? Number(url.searchParams.get("offset"))
          : undefined,
        q: url.searchParams.get("q") ?? undefined,
      });
      return send(res, 200, listed);
    }

    if (timelinesMatch && method === "POST") {
      const orgId = timelinesMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const timeline = createTimeline(store, orgId, timelineInputFromBody(body));
      return send(res, 201, { timeline });
    }

    const timelineOne = path.match(/^\/orgs\/([^/]+)\/timelines\/([^/]+)$/);
    if (timelineOne && method === "GET") {
      const orgId = timelineOne[1]!;
      const timelineId = timelineOne[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const timeline = getTimeline(store, orgId, timelineId);
      if (!timeline) return send(res, 404, { error: "timeline_not_found" });
      return send(res, 200, { timeline });
    }

    if (timelineOne && method === "PATCH") {
      const orgId = timelineOne[1]!;
      const timelineId = timelineOne[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const timeline = patchTimeline(store, orgId, timelineId, timelinePatchFromBody(body));
      if (!timeline) return send(res, 404, { error: "timeline_not_found" });
      return send(res, 200, { timeline });
    }

    const forecastMatch = path.match(/^\/orgs\/([^/]+)\/timelines\/([^/]+)\/forecast$/);
    if (forecastMatch && method === "POST") {
      const orgId = forecastMatch[1]!;
      const timelineId = forecastMatch[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const outcome = runForecast(store, orgId, timelineId);
      if (outcome.status === "reject" && outcome.reason === "timeline_not_found") {
        return send(res, 404, outcome);
      }
      if (outcome.status === "reject") {
        return send(res, 422, outcome);
      }
      return send(res, 200, outcome);
    }

    return send(res, 404, { error: "not_found" });
  });

  return { server, store };
}
