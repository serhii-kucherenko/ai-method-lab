import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describeClaim } from "./claim.js";
import {
  addMember,
  assertAccess,
  createJob,
  createOrg,
  createProject,
  createStore,
  deleteJob,
  deleteProject,
  findUserByEmail,
  getJob,
  getOrg,
  getProject,
  isCompileJobStatus,
  issueToken,
  listJobs,
  listProjects,
  patchJob,
  patchProject,
  registerUser,
  resolveToken,
  type CompileJobStatus,
  type JobCreate,
  type OrgRole,
  type ProjectCreate,
  type Store,
} from "./store.js";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

type Json = Record<string, unknown>;

const PAPER_CLAIM = {
  paperId: "2607.15865",
  title: "An MLIR-Based Compilation Method for Large Language Models",
  codeUrl: "https://github.com/sophgo/tpu-mlir",
  buildClaim:
    "This method can contribute to the development of more efficient and scalable large language models, which can advance the field of artificial intelligence and natural language processing.",
};

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
    model_name:
      body.model_name !== undefined ? String(body.model_name) : undefined,
    target_backend:
      body.target_backend !== undefined ? String(body.target_backend) : undefined,
    notes: body.notes !== undefined ? String(body.notes) : undefined,
  };
}

function projectPatchFromBody(body: Json): Partial<ProjectCreate> {
  const patch: Partial<ProjectCreate> = {};
  if (body.name !== undefined) patch.name = String(body.name);
  if (body.model_name !== undefined) patch.model_name = String(body.model_name);
  if (body.target_backend !== undefined) {
    patch.target_backend = String(body.target_backend);
  }
  if (body.notes !== undefined) patch.notes = String(body.notes);
  return patch;
}

function jobFromBody(body: Json): JobCreate {
  const statusRaw =
    body.status !== undefined ? String(body.status) : undefined;
  return {
    label: body.label !== undefined ? String(body.label) : undefined,
    status:
      statusRaw && isCompileJobStatus(statusRaw)
        ? (statusRaw as CompileJobStatus)
        : undefined,
    mlir_pass_hint:
      body.mlir_pass_hint !== undefined ? String(body.mlir_pass_hint) : undefined,
    notes: body.notes !== undefined ? String(body.notes) : undefined,
  };
}

function jobPatchFromBody(body: Json): Partial<JobCreate> {
  const patch: Partial<JobCreate> = {};
  if (body.label !== undefined) patch.label = String(body.label);
  if (body.status !== undefined) {
    const statusRaw = String(body.status);
    if (isCompileJobStatus(statusRaw)) patch.status = statusRaw;
    else patch.status = statusRaw as CompileJobStatus;
  }
  if (body.mlir_pass_hint !== undefined) {
    patch.mlir_pass_hint = String(body.mlir_pass_hint);
  }
  if (body.notes !== undefined) patch.notes = String(body.notes);
  return patch;
}

export function createApp(opts: { rateLimit?: number; store?: Store } = {}) {
  const store = opts.store ?? createStore({ rateLimit: opts.rateLimit });

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
        product: "model-compiler-desk",
        display_name: "Model Compiler Desk",
      });
    }

    if (method === "GET" && path === "/claim") {
      const claim = describeClaim(PAPER_CLAIM);
      return send(res, 200, {
        product: "Model Compiler Desk",
        claim,
        honesty:
          "Method-lab experiment inspired by the paper — not a replacement for the authors' compiler.",
      });
    }

    if (!checkRateLimit(store, req, res)) return;

    if (method === "POST" && path === "/auth/register") {
      const body = await readBody(req);
      const email = String(body.email ?? "").trim();
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
      const project = patchProject(store, orgId, projectId, projectPatchFromBody(body));
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
      const job = createJob(store, orgId, projectId, jobFromBody(body));
      if (!job) return send(res, 404, { error: "project_not_found" });
      return send(res, 201, { job });
    }

    const jobOne = path.match(/^\/orgs\/([^/]+)\/projects\/([^/]+)\/jobs\/([^/]+)$/);
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
      const result = patchJob(store, orgId, projectId, jobId, jobPatchFromBody(body));
      if (!result) return send(res, 404, { error: "job_not_found" });
      if ("error" in result) return send(res, 400, { error: result.error });
      return send(res, 200, { job: result.job });
    }

    if (jobOne && method === "DELETE") {
      const orgId = jobOne[1]!;
      const projectId = jobOne[2]!;
      const jobId = jobOne[3]!;
      const userId = authUserId(store, req);
      if (!userId) return send(res, 401, { error: "unauthorized" });
      if (!assertAccess(store, orgId, userId, ["admin"])) {
        return send(res, 403, { error: "forbidden" });
      }
      if (!deleteJob(store, orgId, projectId, jobId)) {
        return send(res, 404, { error: "job_not_found" });
      }
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { error: "not_found" });
  });

  return { server, store };
}
