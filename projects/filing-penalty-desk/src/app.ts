import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import {
  assertAccess,
  createOrg,
  createStore,
  createTimeline,
  findUserByEmail,
  getOrg,
  getTimeline,
  issueToken,
  registerUser,
  resolveToken,
  runForecast,
  type Store,
} from "./store.js";

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

export function createApp(opts: { rateLimit?: number; store?: Store } = {}) {
  const store = opts.store ?? createStore({ rateLimit: opts.rateLimit });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;

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

    const timelinesMatch = path.match(/^\/orgs\/([^/]+)\/timelines$/);
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

    const timelineGet = path.match(/^\/orgs\/([^/]+)\/timelines\/([^/]+)$/);
    if (timelineGet && method === "GET") {
      const orgId = timelineGet[1]!;
      const timelineId = timelineGet[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const timeline = getTimeline(store, orgId, timelineId);
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
