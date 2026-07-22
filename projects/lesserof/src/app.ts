import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  addMember,
  assertAccess,
  auditToCsv,
  createClaimLine,
  createOrg,
  createStore,
  findUserByEmail,
  getClaimLine,
  getOrg,
  issueToken,
  listAudit,
  listClaimLines,
  patchClaimLine,
  registerUser,
  resolveToken,
  runBatchRecover,
  runRecover,
  type Store,
} from "./store.js";
import type { OrgRole } from "./db.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

type Json = Record<string, unknown>;

async function readBody(req: IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Json;
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
  return resolveToken(store.db, token);
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

export function createApp(opts: { dbPath?: string } = {}) {
  const store = createStore(opts);

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;

    if (method === "GET" && (path === "/" || path.endsWith(".html"))) {
      if (serveStatic(res, path)) return;
    }

    if (method === "GET" && path === "/health") {
      return send(res, 200, { ok: true, product: "lesserof" });
    }

    if (method === "POST" && path === "/auth/register") {
      const body = await readBody(req);
      const email = String(body.email ?? "");
      const password = String(body.password ?? "");
      if (!email || !password) return send(res, 400, { error: "email_password_required" });
      if (findUserByEmail(store.db, email)) return send(res, 409, { error: "email_taken" });
      const user = registerUser(store.db, email, password);
      const token = issueToken(store.db, user.id);
      return send(res, 201, { user, token });
    }

    if (method === "POST" && path === "/orgs") {
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const body = await readBody(req);
      const name = String(body.name ?? "").trim();
      if (!name) return send(res, 400, { error: "name_required" });
      const org = createOrg(store.db, userId, name);
      return send(res, 201, { org });
    }

    const membersMatch = path.match(/^\/orgs\/([^/]+)\/members$/);
    if (membersMatch && method === "POST") {
      const orgId = membersMatch[1];
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store.db, orgId, userId, ["admin"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const role = String(body.role ?? "auditor") as OrgRole;
      if (!["admin", "analyst", "auditor"].includes(role)) {
        return send(res, 400, { error: "bad_role" });
      }
      const result = addMember(store.db, orgId, String(body.userId ?? ""), role);
      if (!result.ok) return send(res, 400, { error: result.error });
      return send(res, 201, { ok: true });
    }

    const claimMatch = path.match(/^\/orgs\/([^/]+)\/claim-lines(?:\/([^/]+))?(?:\/(recover))?$/);
    if (claimMatch) {
      const orgId = claimMatch[1];
      const lineId = claimMatch[2];
      const action = claimMatch[3];
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store.db, orgId)) return send(res, 404, { error: "org_not_found" });

      if (method === "GET" && !lineId) {
        if (!assertAccess(store.db, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const lines = listClaimLines(store.db, orgId);
        return send(res, 200, { claim_lines: lines, total: lines.length });
      }

      if (method === "POST" && !lineId) {
        if (!assertAccess(store.db, orgId, userId, ["admin", "analyst"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        const line = createClaimLine(store.db, orgId, {
          claim_type: String(body.claim_type ?? ""),
          duties_paid: Number(body.duties_paid),
          substitute_basis: Number(body.substitute_basis),
          apply_usmca_lesser_of: body.apply_usmca_lesser_of === true,
          usmca_partner_duty:
            typeof body.usmca_partner_duty === "number" ? body.usmca_partner_duty : undefined,
          basket_other_ineligible: body.basket_other_ineligible === true,
          force_lesser_of: body.force_lesser_of === true,
          skip_lesser_of: body.skip_lesser_of === true,
          relabel_from_substitution: body.relabel_from_substitution === true,
        });
        return send(res, 201, { claim_line: line });
      }

      if (method === "GET" && lineId && !action) {
        if (!assertAccess(store.db, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const line = getClaimLine(store.db, orgId, lineId);
        if (!line) return send(res, 404, { error: "not_found" });
        return send(res, 200, { claim_line: line });
      }

      if (method === "PATCH" && lineId && !action) {
        if (!assertAccess(store.db, orgId, userId, ["admin", "analyst"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const body = await readBody(req);
        const patched = patchClaimLine(store.db, orgId, lineId, {
          claim_type: body.claim_type !== undefined ? String(body.claim_type) : undefined,
          duties_paid: body.duties_paid !== undefined ? Number(body.duties_paid) : undefined,
          substitute_basis:
            body.substitute_basis !== undefined ? Number(body.substitute_basis) : undefined,
          apply_usmca_lesser_of:
            body.apply_usmca_lesser_of !== undefined
              ? body.apply_usmca_lesser_of === true
              : undefined,
          usmca_partner_duty:
            body.usmca_partner_duty !== undefined
              ? typeof body.usmca_partner_duty === "number"
                ? body.usmca_partner_duty
                : undefined
              : undefined,
          basket_other_ineligible:
            body.basket_other_ineligible !== undefined
              ? body.basket_other_ineligible === true
              : undefined,
        });
        if (!patched) return send(res, 404, { error: "not_found" });
        return send(res, 200, { claim_line: patched });
      }

      if (method === "POST" && lineId && action === "recover") {
        if (!assertAccess(store.db, orgId, userId, ["admin", "analyst", "auditor"])) {
          return send(res, 403, { error: "forbidden" });
        }
        const result = runRecover(store.db, orgId, lineId);
        if (!result) return send(res, 404, { error: "not_found" });
        return send(res, 200, result);
      }
    }

    const batchMatch = path.match(/^\/orgs\/([^/]+)\/batch\/recover$/);
    if (batchMatch && method === "POST") {
      const orgId = batchMatch[1];
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store.db, orgId)) return send(res, 404, { error: "org_not_found" });
      if (!assertAccess(store.db, orgId, userId, ["admin", "analyst"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const rawIds = body.claim_line_ids;
      const lineIds = Array.isArray(rawIds)
        ? rawIds.map((id) => String(id))
        : [];
      const batch = runBatchRecover(store.db, orgId, lineIds);
      return send(res, 200, batch);
    }

    const auditMatch = path.match(/^\/orgs\/([^/]+)\/audit$/);
    if (auditMatch && method === "GET") {
      const orgId = auditMatch[1];
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!getOrg(store.db, orgId)) return send(res, 404, { error: "org_not_found" });
      if (!assertAccess(store.db, orgId, userId, ["admin", "analyst", "auditor"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const limit = url.searchParams.get("limit");
      const offset = url.searchParams.get("offset");
      const listed = listAudit(store.db, orgId, {
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });
      if (url.searchParams.get("format") === "csv") {
        const csv = auditToCsv(listed.events);
        res.writeHead(200, {
          "content-type": "text/csv; charset=utf-8",
          "content-length": Buffer.byteLength(csv),
        });
        res.end(csv);
        return;
      }
      return send(res, 200, listed);
    }

    return send(res, 404, { error: "not_found" });
  });

  return { server, store };
}
