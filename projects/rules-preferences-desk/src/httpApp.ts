import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describeClaim } from "./claim.js";
import { listGoldenCards } from "./goldens.js";
import {
  addMember,
  assertAccess,
  auditToCsv,
  batchTransitionJobs,
  createJob,
  createOrg,
  createProject,
  createStore,
  deleteJob,
  deleteProject,
  findUserByEmail,
  getJob,
  getOrg,
  getOrgSettings,
  getProject,
  ingestWebhookJob,
  isChecklistJobStatus,
  issueToken,
  listAudit,
  listJobs,
  listProjects,
  patchJob,
  patchProject,
  registerUser,
  resolveToken,
  rotateWebhookSecret,
  scenarioCompare,
  schemaInfo,
  transitionJob,
  updateOrgSettings,
  type BatchTransitionItem,
  type JobCreate,
  type JobPatch,
  type OrgRole,
  type ProjectCreate,
  type ChecklistJobStatus,
  type Store,
} from "./store.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

type Json = Record<string, unknown>;

export type DepFetcher = (
  url: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string },
) => Promise<{ ok: boolean; status: number; json: Json }>;

const PAPER_CLAIM = {
  paperId: "2607.15562",
  title:
    "constrained personalization: A Deep Learning-based LLM-Powered Agentic AI Framework for Controlling Rules Preferencess",
  codeUrl: null,
  buildClaim:
    "Safer agentic hard-rule gated preference selection versus a naive preference-only baseline; adapted here as a desk experiment, not the authors' constrained personalization system.",
};

const HONESTY =
  "Method-lab experiment inspired by the paper — not a replacement for the authors' packing checklist system. Not a commercial travel packing product. Never brand as FlyEnJoy or RLO.";

async function readRawBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function readBody(req: IncomingMessage): Promise<Json> {
  const raw = await readRawBody(req);
  if (!raw.length) return {};
  try {
    return JSON.parse(raw.toString("utf8")) as Json;
  } catch {
    return {};
  }
}

function verifyHmac(secret: string, raw: Buffer, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.trim());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function send(
  res: ServerResponse,
  status: number,
  body: unknown,
  extra: Record<string, string> = {},
) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    ...extra,
  });
  res.end(payload);
}

function sendText(
  res: ServerResponse,
  status: number,
  body: string,
  contentType: string,
) {
  res.writeHead(status, {
    "content-type": contentType,
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
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
    send(res, 429, { error: "rate_limit_exceeded" }, { "retry-after": "1" });
    return false;
  }
  return true;
}

function serveStatic(res: ServerResponse, urlPath: string): boolean {
  const clean = urlPath === "/" ? "/index.html" : urlPath;
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

function projectFromBody(body: Json): ProjectCreate {
  return {
    name: String(body.name ?? "").trim(),
    plant_label:
      body.plant_label !== undefined ? String(body.plant_label) : undefined,
    risk_budget:
      body.risk_budget !== undefined ? Number(body.risk_budget) : undefined,
    notes: body.notes !== undefined ? String(body.notes) : undefined,
    orchestrator_prompt:
      body.orchestrator_prompt !== undefined ? String(body.orchestrator_prompt) : undefined,
  };
}

function jobFromBody(body: Json): JobCreate {
  const statusRaw = body.status !== undefined ? String(body.status) : undefined;
  return {
    label: body.label !== undefined ? String(body.label) : undefined,
    status:
      statusRaw && isChecklistJobStatus(statusRaw)
        ? (statusRaw as ChecklistJobStatus)
        : statusRaw
          ? (statusRaw as ChecklistJobStatus)
          : undefined,
    query: body.query !== undefined ? String(body.query) : undefined,
    plan_depth: body.plan_depth !== undefined ? Number(body.plan_depth) : undefined,
    notes: body.notes !== undefined ? String(body.notes) : undefined,
  };
}

function jobPatchFromBody(body: Json): JobPatch {
  const patch: JobPatch = jobFromBody(body);
  if (body.expected_version !== undefined) {
    patch.expected_version = Number(body.expected_version);
  }
  return patch;
}

const defaultDepFetch: DepFetcher = async (url, init) => {
  try {
    const res = await fetch(url, {
      method: init?.method ?? "GET",
      headers: init?.headers,
      body: init?.body,
      signal: AbortSignal.timeout(3_000),
    });
    let json: Json = {};
    try {
      json = (await res.json()) as Json;
    } catch {
      json = {};
    }
    return { ok: res.ok, status: res.status, json };
  } catch (err) {
    return {
      ok: false,
      status: 504,
      json: { error: "dependency_timeout", detail: String(err) },
    };
  }
};

export function createApp(
  opts: {
    rateLimit?: number;
    store?: Store;
    depBaseUrl?: string;
    depFetch?: DepFetcher;
  } = {},
) {
  const store = opts.store ?? createStore({ rateLimit: opts.rateLimit });
  const depBaseUrl = (opts.depBaseUrl ?? process.env.HRD_DEP_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const depFetch = opts.depFetch ?? defaultDepFetch;

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const method = req.method ?? "GET";
    const path = url.pathname;

    if (
      method === "GET" &&
      (path === "/" || path.endsWith(".html") || path.endsWith(".css"))
    ) {
      if (serveStatic(res, path)) return;
    }

    if (method === "GET" && path === "/health") {
      return send(res, 200, {
        ok: true,
        product: "rules-preferences-desk",
        display_name: "Rules Preferences Desk",
        schema: schemaInfo(store),
      });
    }

    if (method === "GET" && path === "/claim") {
      const claim = describeClaim(PAPER_CLAIM);
      return send(res, 200, {
        product: "Rules Preferences Desk",
        claim,
        honesty: HONESTY,
      });
    }

    if (method === "POST" && path === "/webhooks/jobs") {
      const raw = await readRawBody(req);
      let body: Json = {};
      try {
        body = raw.length ? (JSON.parse(raw.toString("utf8")) as Json) : {};
      } catch {
        return send(res, 400, { error: "invalid_json" });
      }
      const orgId = String(body.orgId ?? body.org_id ?? "").trim();
      if (!orgId) return send(res, 400, { error: "org_id_required" });
      const settings = getOrgSettings(store, orgId);
      if (!settings) return send(res, 404, { error: "org_not_found" });
      const signature =
        (req.headers["x-dsd-signature"] as string | undefined) ??
        (req.headers["x-signature"] as string | undefined);
      if (!verifyHmac(settings.webhook_secret, raw, signature)) {
        return send(res, 401, { error: "invalid_signature" });
      }
      const idempotencyKey = String(
        req.headers["idempotency-key"] ?? body.idempotency_key ?? "",
      ).trim();
      const projectId = String(body.project_id ?? body.projectId ?? "").trim();
      if (!projectId) return send(res, 400, { error: "project_id_required" });
      const jobBody = (
        body.job && typeof body.job === "object" ? (body.job as Json) : body
      ) as Json;
      const result = ingestWebhookJob(
        store,
        orgId,
        projectId,
        idempotencyKey,
        jobFromBody(jobBody),
      );
      if (!result.ok) return send(res, result.status, { error: result.error });
      return send(res, result.status, { job: result.job, replay: result.replay });
    }

    if (!checkRateLimit(store, req, res)) return;

    if (method === "POST" && path === "/auth/register") {
      const body = await readBody(req);
      const email = String(body.email ?? "").trim();
      const password = String(body.password ?? "");
      if (!email || !password) {
        return send(res, 400, { error: "email_password_required" });
      }
      if (findUserByEmail(store, email)) {
        return send(res, 409, { error: "email_taken" });
      }
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
      if (!assertAccess(store, orgId, userId, ["admin", "operator", "viewer"])) {
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
      const role = String(body.role ?? "viewer") as OrgRole;
      if (!["admin", "operator", "viewer"].includes(role)) {
        return send(res, 400, { error: "bad_role" });
      }
      const result = addMember(store, orgId, String(body.userId ?? ""), role);
      if (!result.ok) return send(res, 400, { error: result.error });
      return send(res, 201, { ok: true });
    }

    const settingsMatch = path.match(/^\/orgs\/([^/]+)\/settings$/);
    if (settingsMatch) {
      const orgId = settingsMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      const role = assertAccess(store, orgId, userId, ["admin", "operator", "viewer"]);
      if (!role) return send(res, 403, { error: "forbidden" });

      if (method === "GET") {
        const settings = getOrgSettings(store, orgId);
        if (!settings) return send(res, 404, { error: "not_found" });
        if (role === "admin") {
          return send(res, 200, { settings });
        }
        return send(res, 200, {
          settings: {
            orgId: settings.orgId,
            webhook_secret: null,
            tokens_note: null,
            updated_at: settings.updated_at,
            note: "webhook secret and tokens note visible to admin only",
          },
        });
      }

      if (method === "PATCH") {
        if (role !== "admin") return send(res, 403, { error: "forbidden" });
        const body = await readBody(req);
        if (body.rotate_webhook_secret === true || body.rotateWebhookSecret === true) {
          const rotated = rotateWebhookSecret(store, orgId);
          return send(res, 200, { settings: rotated });
        }
        const patch: { webhook_secret?: string; tokens_note?: string } = {};
        if (body.webhook_secret !== undefined) {
          patch.webhook_secret = String(body.webhook_secret);
        }
        if (body.tokens_note !== undefined) patch.tokens_note = String(body.tokens_note);
        if (Object.keys(patch).length === 0) {
          return send(res, 400, {
            error: "webhook_secret, tokens_note, or rotate_webhook_secret required",
          });
        }
        const updated = updateOrgSettings(store, orgId, patch);
        return send(res, 200, { settings: updated });
      }
    }

    const auditMatch = path.match(/^\/orgs\/([^/]+)\/audit$/);
    if (auditMatch && method === "GET") {
      const orgId = auditMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator", "viewer"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const listed = listAudit(store, orgId, {
        limit: url.searchParams.get("limit")
          ? Number(url.searchParams.get("limit"))
          : undefined,
        offset: url.searchParams.get("offset")
          ? Number(url.searchParams.get("offset"))
          : undefined,
        job_id: url.searchParams.get("job_id") ?? undefined,
      });
      if (url.searchParams.get("format") === "csv") {
        return sendText(res, 200, auditToCsv(listed.entries), "text/csv; charset=utf-8");
      }
      return send(res, 200, listed);
    }

    const batchMatch = path.match(/^\/orgs\/([^/]+)\/batch\/jobs\/transition$/);
    if (batchMatch && method === "POST") {
      const orgId = batchMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const raw = Array.isArray(body.transitions) ? body.transitions : [];
      const items: BatchTransitionItem[] = raw.map((row) => {
        const r = row as Record<string, unknown>;
        const toRaw = String(r.to ?? "");
        return {
          project_id: String(r.project_id ?? ""),
          job_id: String(r.job_id ?? ""),
          to: (isChecklistJobStatus(toRaw) ? toRaw : toRaw) as ChecklistJobStatus,
          expected_version:
            r.expected_version !== undefined
              ? Number(r.expected_version)
              : undefined,
        };
      });
      return send(res, 200, batchTransitionJobs(store, orgId, items, userId));
    }

    const projectsMatch = path.match(/^\/orgs\/([^/]+)\/projects$/);
    if (projectsMatch && method === "GET") {
      const orgId = projectsMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator", "viewer"])) {
        return send(res, 403, { error: "forbidden" });
      }
      return send(
        res,
        200,
        listProjects(store, orgId, {
          limit: url.searchParams.get("limit")
            ? Number(url.searchParams.get("limit"))
            : undefined,
          offset: url.searchParams.get("offset")
            ? Number(url.searchParams.get("offset"))
            : undefined,
          q: url.searchParams.get("q") ?? undefined,
        }),
      );
    }

    if (projectsMatch && method === "POST") {
      const orgId = projectsMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const input = projectFromBody(body);
      if (!input.name) return send(res, 400, { error: "name_required" });
      const project = createProject(store, orgId, input);
      return send(res, 201, { project });
    }

    const projectOne = path.match(/^\/orgs\/([^/]+)\/projects\/([^/]+)$/);
    if (projectOne && method === "GET") {
      const orgId = projectOne[1]!;
      const projectId = projectOne[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator", "viewer"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const project = getProject(store, orgId, projectId);
      if (!project) return send(res, 404, { error: "project_not_found" });
      return send(res, 200, { project });
    }

    if (projectOne && method === "PATCH") {
      const orgId = projectOne[1]!;
      const projectId = projectOne[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const project = patchProject(store, orgId, projectId, projectFromBody(body));
      if (!project) return send(res, 404, { error: "project_not_found" });
      return send(res, 200, { project });
    }

    if (projectOne && method === "DELETE") {
      const orgId = projectOne[1]!;
      const projectId = projectOne[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin"])) {
        return send(res, 403, { error: "forbidden" });
      }
      if (!deleteProject(store, orgId, projectId)) {
        return send(res, 404, { error: "project_not_found" });
      }
      return send(res, 200, { ok: true });
    }

    const jobsMatch = path.match(/^\/orgs\/([^/]+)\/projects\/([^/]+)\/jobs$/);
    if (jobsMatch && method === "GET") {
      const orgId = jobsMatch[1]!;
      const projectId = jobsMatch[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator", "viewer"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const listed = listJobs(store, orgId, projectId, {
        limit: url.searchParams.get("limit")
          ? Number(url.searchParams.get("limit"))
          : undefined,
        offset: url.searchParams.get("offset")
          ? Number(url.searchParams.get("offset"))
          : undefined,
        q: url.searchParams.get("q") ?? undefined,
      });
      if (!listed) return send(res, 404, { error: "project_not_found" });
      return send(res, 200, listed);
    }

    if (jobsMatch && method === "POST") {
      const orgId = jobsMatch[1]!;
      const projectId = jobsMatch[2]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const result = createJob(store, orgId, projectId, jobFromBody(body), userId);
      if (!result) return send(res, 404, { error: "project_not_found" });
      if ("error" in result) return send(res, 400, { error: result.error });
      return send(res, 201, { job: result.job });
    }

    const jobTransition = path.match(
      /^\/orgs\/([^/]+)\/projects\/([^/]+)\/jobs\/([^/]+)\/transition$/,
    );
    if (jobTransition && method === "POST") {
      const orgId = jobTransition[1]!;
      const projectId = jobTransition[2]!;
      const jobId = jobTransition[3]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const toRaw = String(body.to ?? "");
      const expected =
        body.expected_version !== undefined
          ? Number(body.expected_version)
          : undefined;
      const moved = transitionJob(
        store,
        orgId,
        projectId,
        jobId,
        toRaw as ChecklistJobStatus,
        userId,
        expected,
      );
      if (!moved.ok) {
        const code =
          moved.error === "version_conflict" || moved.error === "illegal_transition"
            ? 409
            : moved.error === "job_not_found"
              ? 404
              : 400;
        return send(res, code, { error: moved.error });
      }
      return send(res, 200, { job: moved.job });
    }

    const jobScenario = path.match(
      /^\/orgs\/([^/]+)\/projects\/([^/]+)\/jobs\/([^/]+)\/scenarios$/,
    );
    if (jobScenario && method === "GET") {
      const orgId = jobScenario[1]!;
      const projectId = jobScenario[2]!;
      const jobId = jobScenario[3]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator", "viewer"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const scenario = scenarioCompare(store, orgId, projectId, jobId);
      if (!scenario) return send(res, 404, { error: "job_not_found" });
      return send(res, 200, scenario);
    }

    const jobProbe = path.match(
      /^\/orgs\/([^/]+)\/projects\/([^/]+)\/jobs\/([^/]+)\/probe-library$/,
    );
    if (jobProbe && method === "POST") {
      const orgId = jobProbe[1]!;
      const projectId = jobProbe[2]!;
      const jobId = jobProbe[3]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const job = getJob(store, orgId, projectId, jobId);
      if (!job) return send(res, 404, { error: "job_not_found" });
      if (!depBaseUrl) {
        return send(res, 503, { error: "dependency_not_configured" });
      }
      const depUrl = `${depBaseUrl}/library-check`;
      const dep = await depFetch(depUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query: job.query,
          plan_depth: job.plan_depth,
          project_id: projectId,
        }),
      });
      if (!dep.ok || dep.status >= 500) {
        return send(res, 502, {
          error: "dependency_failed",
          dependency_status: dep.status,
          detail: dep.json,
        });
      }
      return send(res, 200, {
        job_id: job.id,
        fit_hint: Number(dep.json.fit_hint ?? job.plan_depth),
        corpus_ok: dep.json.ok === true || dep.json.ok === "true",
        mapped_from: "library-check",
      });
    }

    const jobOne = path.match(
      /^\/orgs\/([^/]+)\/projects\/([^/]+)\/jobs\/([^/]+)$/,
    );
    if (jobOne && method === "GET") {
      const orgId = jobOne[1]!;
      const projectId = jobOne[2]!;
      const jobId = jobOne[3]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator", "viewer"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const job = getJob(store, orgId, projectId, jobId);
      if (!job) return send(res, 404, { error: "job_not_found" });
      return send(res, 200, { job });
    }

    if (jobOne && method === "PATCH") {
      const orgId = jobOne[1]!;
      const projectId = jobOne[2]!;
      const jobId = jobOne[3]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator"])) {
        return send(res, 403, { error: "forbidden" });
      }
      const body = await readBody(req);
      const result = patchJob(
        store,
        orgId,
        projectId,
        jobId,
        jobPatchFromBody(body),
        userId,
      );
      if ("error" in result) {
        const status =
          result.error === "job_not_found"
            ? 404
            : result.error === "version_conflict" ||
                result.error === "illegal_transition"
              ? 409
              : 400;
        return send(res, status, { error: result.error });
      }
      return send(res, 200, { job: result.job });
    }

    if (jobOne && method === "DELETE") {
      const orgId = jobOne[1]!;
      const projectId = jobOne[2]!;
      const jobId = jobOne[3]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator"])) {
        return send(res, 403, { error: "forbidden" });
      }
      if (!deleteJob(store, orgId, projectId, jobId)) {
        return send(res, 404, { error: "job_not_found" });
      }
      return send(res, 200, { ok: true });
    }

    const goldensMatch = path.match(/^\/orgs\/([^/]+)\/goldens$/);
    if (goldensMatch && method === "GET") {
      const orgId = goldensMatch[1]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin", "operator", "viewer"])) {
        return send(res, 403, { error: "forbidden" });
      }
      return send(res, 200, listGoldenCards());
    }

    return send(res, 404, { error: "not_found" });
  });

  return { server, store };
}
