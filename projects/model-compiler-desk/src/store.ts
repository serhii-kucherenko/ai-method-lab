import { randomUUID } from "node:crypto";

export type OrgRole = "admin" | "operator" | "viewer";

export type CompileJobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

type User = { id: string; email: string; password: string };
type Org = { id: string; name: string; created_by: string };

export type Project = {
  id: string;
  org_id: string;
  name: string;
  model_name: string;
  target_backend: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type CompileJob = {
  id: string;
  org_id: string;
  project_id: string;
  label: string;
  status: CompileJobStatus;
  mlir_pass_hint: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Store = {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  tokens: Map<string, string>;
  orgs: Map<string, Org>;
  members: Map<string, OrgRole>;
  projects: Map<string, Project>;
  jobs: Map<string, CompileJob>;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

const JOB_STATUSES: CompileJobStatus[] = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
];

function memberKey(orgId: string, userId: string): string {
  return `${orgId}::${userId}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function isCompileJobStatus(value: string): value is CompileJobStatus {
  return (JOB_STATUSES as string[]).includes(value);
}

export function createStore(opts: { rateLimit?: number } = {}): Store {
  return {
    users: new Map(),
    usersByEmail: new Map(),
    tokens: new Map(),
    orgs: new Map(),
    members: new Map(),
    projects: new Map(),
    jobs: new Map(),
    rateLimit: opts.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(store: Store, email: string, password: string) {
  const id = randomUUID();
  store.users.set(id, { id, email, password });
  store.usersByEmail.set(email, id);
  return { id, email };
}

export function findUserByEmail(store: Store, email: string) {
  const id = store.usersByEmail.get(email);
  return id ? store.users.get(id) : undefined;
}

export function issueToken(store: Store, userId: string): string {
  const token = randomUUID();
  store.tokens.set(token, userId);
  return token;
}

export function resolveToken(store: Store, token: string): string | null {
  return store.tokens.get(token) ?? null;
}

export function createOrg(store: Store, userId: string, name: string) {
  const id = randomUUID();
  store.orgs.set(id, { id, name, created_by: userId });
  store.members.set(memberKey(id, userId), "admin");
  return { id, name };
}

export function getOrg(store: Store, id: string) {
  const org = store.orgs.get(id);
  return org ? { id: org.id, name: org.name } : undefined;
}

export function assertAccess(
  store: Store,
  orgId: string,
  userId: string,
  roles: OrgRole[],
): OrgRole | null {
  const role = store.members.get(memberKey(orgId, userId));
  if (!role || !roles.includes(role)) return null;
  return role;
}

export function addMember(
  store: Store,
  orgId: string,
  userId: string,
  role: OrgRole,
): { ok: true } | { ok: false; error: string } {
  if (!getOrg(store, orgId)) return { ok: false, error: "org_not_found" };
  if (!store.users.get(userId)) return { ok: false, error: "user_not_found" };
  store.members.set(memberKey(orgId, userId), role);
  return { ok: true };
}

export type ProjectCreate = {
  name: string;
  model_name?: string;
  target_backend?: string;
  notes?: string;
};

function publicProject(p: Project) {
  return {
    id: p.id,
    org_id: p.org_id,
    name: p.name,
    model_name: p.model_name,
    target_backend: p.target_backend,
    notes: p.notes,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

export function createProject(store: Store, orgId: string, input: ProjectCreate) {
  const stamp = nowIso();
  const row: Project = {
    id: randomUUID(),
    org_id: orgId,
    name: input.name.trim(),
    model_name: (input.model_name ?? "unnamed-model").trim() || "unnamed-model",
    target_backend: (input.target_backend ?? "mlir-demo").trim() || "mlir-demo",
    notes: (input.notes ?? "").trim(),
    created_at: stamp,
    updated_at: stamp,
  };
  store.projects.set(row.id, row);
  return publicProject(row);
}

export function getProject(store: Store, orgId: string, projectId: string) {
  const p = store.projects.get(projectId);
  if (!p || p.org_id !== orgId) return undefined;
  return publicProject(p);
}

export function listProjects(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number; q?: string } = {},
) {
  const q = (opts.q ?? "").trim().toLowerCase();
  const all = [...store.projects.values()]
    .filter((p) => p.org_id === orgId)
    .filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.model_name.toLowerCase().includes(q),
    )
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    projects: all.slice(offset, offset + limit).map(publicProject),
    total,
    limit,
    offset,
  };
}

export function patchProject(
  store: Store,
  orgId: string,
  projectId: string,
  patch: Partial<ProjectCreate>,
) {
  const existing = store.projects.get(projectId);
  if (!existing || existing.org_id !== orgId) return null;
  const next: Project = {
    ...existing,
    name: patch.name !== undefined ? String(patch.name).trim() : existing.name,
    model_name:
      patch.model_name !== undefined
        ? String(patch.model_name).trim() || existing.model_name
        : existing.model_name,
    target_backend:
      patch.target_backend !== undefined
        ? String(patch.target_backend).trim() || existing.target_backend
        : existing.target_backend,
    notes: patch.notes !== undefined ? String(patch.notes).trim() : existing.notes,
    updated_at: nowIso(),
  };
  store.projects.set(projectId, next);
  return publicProject(next);
}

export function deleteProject(store: Store, orgId: string, projectId: string) {
  const existing = store.projects.get(projectId);
  if (!existing || existing.org_id !== orgId) return false;
  for (const [jobId, job] of store.jobs) {
    if (job.project_id === projectId) store.jobs.delete(jobId);
  }
  store.projects.delete(projectId);
  return true;
}

export type JobCreate = {
  label?: string;
  status?: CompileJobStatus;
  mlir_pass_hint?: string;
  notes?: string;
};

function publicJob(j: CompileJob) {
  return {
    id: j.id,
    org_id: j.org_id,
    project_id: j.project_id,
    label: j.label,
    status: j.status,
    mlir_pass_hint: j.mlir_pass_hint,
    notes: j.notes,
    created_at: j.created_at,
    updated_at: j.updated_at,
  };
}

export function createJob(
  store: Store,
  orgId: string,
  projectId: string,
  input: JobCreate,
) {
  const project = store.projects.get(projectId);
  if (!project || project.org_id !== orgId) return null;
  const stamp = nowIso();
  const status = input.status && isCompileJobStatus(input.status) ? input.status : "queued";
  const row: CompileJob = {
    id: randomUUID(),
    org_id: orgId,
    project_id: projectId,
    label: (input.label ?? "compile-job").trim() || "compile-job",
    status,
    mlir_pass_hint: (input.mlir_pass_hint ?? "lower-to-linalg").trim(),
    notes: (input.notes ?? "").trim(),
    created_at: stamp,
    updated_at: stamp,
  };
  store.jobs.set(row.id, row);
  return publicJob(row);
}

export function getJob(
  store: Store,
  orgId: string,
  projectId: string,
  jobId: string,
) {
  const j = store.jobs.get(jobId);
  if (!j || j.org_id !== orgId || j.project_id !== projectId) return undefined;
  return publicJob(j);
}

export function listJobs(
  store: Store,
  orgId: string,
  projectId: string,
  opts: { limit?: number; offset?: number; q?: string } = {},
) {
  const project = store.projects.get(projectId);
  if (!project || project.org_id !== orgId) return null;
  const q = (opts.q ?? "").trim().toLowerCase();
  const all = [...store.jobs.values()]
    .filter((j) => j.org_id === orgId && j.project_id === projectId)
    .filter(
      (j) =>
        !q ||
        j.label.toLowerCase().includes(q) ||
        j.status.toLowerCase().includes(q) ||
        j.mlir_pass_hint.toLowerCase().includes(q),
    )
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    jobs: all.slice(offset, offset + limit).map(publicJob),
    total,
    limit,
    offset,
  };
}

export function patchJob(
  store: Store,
  orgId: string,
  projectId: string,
  jobId: string,
  patch: Partial<JobCreate>,
) {
  const existing = store.jobs.get(jobId);
  if (!existing || existing.org_id !== orgId || existing.project_id !== projectId) {
    return null;
  }
  let status = existing.status;
  if (patch.status !== undefined) {
    if (!isCompileJobStatus(patch.status)) return { error: "bad_status" as const };
    status = patch.status;
  }
  const next: CompileJob = {
    ...existing,
    label:
      patch.label !== undefined
        ? String(patch.label).trim() || existing.label
        : existing.label,
    status,
    mlir_pass_hint:
      patch.mlir_pass_hint !== undefined
        ? String(patch.mlir_pass_hint).trim()
        : existing.mlir_pass_hint,
    notes: patch.notes !== undefined ? String(patch.notes).trim() : existing.notes,
    updated_at: nowIso(),
  };
  store.jobs.set(jobId, next);
  return { job: publicJob(next) };
}

export function deleteJob(
  store: Store,
  orgId: string,
  projectId: string,
  jobId: string,
) {
  const existing = store.jobs.get(jobId);
  if (!existing || existing.org_id !== orgId || existing.project_id !== projectId) {
    return false;
  }
  store.jobs.delete(jobId);
  return true;
}
