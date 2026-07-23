import { randomUUID } from "node:crypto";

export type OrgRole = "admin" | "operator" | "viewer";

export type RetrievalJobStatus =
  | "draft"
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
  corpus_label: string;
  hop_budget: number;
  notes: string;
  /** Added in schema migration v2 */
  query_template: string;
  created_at: string;
  updated_at: string;
};

export type RetrievalJob = {
  id: string;
  org_id: string;
  project_id: string;
  label: string;
  status: RetrievalJobStatus;
  query: string;
  hop_depth: number;
  notes: string;
  version: number;
  created_at: string;
  updated_at: string;
};

export type Store = {
  schemaVersion: number;
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  tokens: Map<string, string>;
  orgs: Map<string, Org>;
  members: Map<string, OrgRole>;
  projects: Map<string, Project>;
  jobs: Map<string, RetrievalJob>;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

const JOB_STATUSES: RetrievalJobStatus[] = [
  "draft",
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
];

const CURRENT_SCHEMA = 2;

function memberKey(orgId: string, userId: string): string {
  return `${orgId}::${userId}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function isRetrievalJobStatus(value: string): value is RetrievalJobStatus {
  return (JOB_STATUSES as string[]).includes(value);
}

/** Apply schema migrations after initial create (oracle: migration-missing). */
export function applyMigrations(store: Store): number {
  if (store.schemaVersion < 2) {
    for (const project of store.projects.values()) {
      if (project.query_template === undefined || project.query_template === null) {
        project.query_template = "";
      }
    }
    store.schemaVersion = 2;
  }
  return store.schemaVersion;
}

export function createStore(opts: { rateLimit?: number } = {}): Store {
  const store: Store = {
    schemaVersion: 1,
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
  applyMigrations(store);
  return store;
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
  corpus_label?: string;
  hop_budget?: number;
  notes?: string;
  query_template?: string;
};

function publicProject(p: Project) {
  return {
    id: p.id,
    org_id: p.org_id,
    name: p.name,
    corpus_label: p.corpus_label,
    hop_budget: p.hop_budget,
    notes: p.notes,
    query_template: p.query_template,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

export function createProject(store: Store, orgId: string, input: ProjectCreate) {
  const stamp = nowIso();
  const hop =
    input.hop_budget !== undefined && Number.isFinite(Number(input.hop_budget))
      ? Math.max(1, Math.min(8, Math.floor(Number(input.hop_budget))))
      : 2;
  const row: Project = {
    id: randomUUID(),
    org_id: orgId,
    name: input.name.trim(),
    corpus_label: (input.corpus_label ?? "default-corpus").trim() || "default-corpus",
    hop_budget: hop,
    notes: (input.notes ?? "").trim(),
    query_template: (input.query_template ?? "").trim(),
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

export function listProjects(store: Store, orgId: string) {
  return [...store.projects.values()]
    .filter((p) => p.org_id === orgId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .map(publicProject);
}

export function patchProject(
  store: Store,
  orgId: string,
  projectId: string,
  patch: Partial<ProjectCreate>,
) {
  const existing = store.projects.get(projectId);
  if (!existing || existing.org_id !== orgId) return null;
  const hop =
    patch.hop_budget !== undefined && Number.isFinite(Number(patch.hop_budget))
      ? Math.max(1, Math.min(8, Math.floor(Number(patch.hop_budget))))
      : existing.hop_budget;
  const next: Project = {
    ...existing,
    name: patch.name !== undefined ? String(patch.name).trim() : existing.name,
    corpus_label:
      patch.corpus_label !== undefined
        ? String(patch.corpus_label).trim() || existing.corpus_label
        : existing.corpus_label,
    hop_budget: hop,
    notes: patch.notes !== undefined ? String(patch.notes).trim() : existing.notes,
    query_template:
      patch.query_template !== undefined
        ? String(patch.query_template).trim()
        : existing.query_template,
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
  status?: RetrievalJobStatus;
  query?: string;
  hop_depth?: number;
  notes?: string;
};

function publicJob(j: RetrievalJob) {
  return {
    id: j.id,
    org_id: j.org_id,
    project_id: j.project_id,
    label: j.label,
    status: j.status,
    query: j.query,
    hop_depth: j.hop_depth,
    notes: j.notes,
    version: j.version,
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
  let status: RetrievalJobStatus = "draft";
  if (input.status !== undefined) {
    if (!isRetrievalJobStatus(input.status)) return { error: "bad_status" as const };
    if (input.status !== "draft" && input.status !== "queued") {
      return { error: "illegal_create_status" as const };
    }
    status = input.status;
  }
  const hop =
    input.hop_depth !== undefined && Number.isFinite(Number(input.hop_depth))
      ? Math.max(1, Math.min(project.hop_budget, Math.floor(Number(input.hop_depth))))
      : 1;
  const stamp = nowIso();
  const row: RetrievalJob = {
    id: randomUUID(),
    org_id: orgId,
    project_id: projectId,
    label: (input.label ?? "retrieval-job").trim() || "retrieval-job",
    status,
    query: (input.query ?? "").trim(),
    hop_depth: hop,
    notes: (input.notes ?? "").trim(),
    version: 1,
    created_at: stamp,
    updated_at: stamp,
  };
  store.jobs.set(row.id, row);
  return { job: publicJob(row) };
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

export function listJobs(store: Store, orgId: string, projectId: string) {
  const project = store.projects.get(projectId);
  if (!project || project.org_id !== orgId) return null;
  return [...store.jobs.values()]
    .filter((j) => j.org_id === orgId && j.project_id === projectId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .map(publicJob);
}

export type JobPatch = Partial<JobCreate>;

export function patchJob(
  store: Store,
  orgId: string,
  projectId: string,
  jobId: string,
  patch: JobPatch,
) {
  const existing = store.jobs.get(jobId);
  if (!existing || existing.org_id !== orgId || existing.project_id !== projectId) {
    return { error: "job_not_found" as const };
  }
  if (patch.status !== undefined && !isRetrievalJobStatus(patch.status)) {
    return { error: "bad_status" as const };
  }
  const next: RetrievalJob = {
    ...existing,
    label:
      patch.label !== undefined
        ? String(patch.label).trim() || existing.label
        : existing.label,
    status: patch.status !== undefined ? patch.status : existing.status,
    query: patch.query !== undefined ? String(patch.query).trim() : existing.query,
    hop_depth:
      patch.hop_depth !== undefined && Number.isFinite(Number(patch.hop_depth))
        ? Math.max(1, Math.floor(Number(patch.hop_depth)))
        : existing.hop_depth,
    notes: patch.notes !== undefined ? String(patch.notes).trim() : existing.notes,
    version: existing.version + 1,
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

export function schemaInfo(store: Store) {
  return {
    schema_version: store.schemaVersion,
    current: CURRENT_SCHEMA,
    migrated: store.schemaVersion >= CURRENT_SCHEMA,
  };
}
