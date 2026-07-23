import { randomUUID } from "node:crypto";

export type OrgRole = "admin" | "operator" | "viewer";

export type CompileJobStatus =
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
  version: number;
  created_at: string;
  updated_at: string;
};

export type AuditEntry = {
  id: string;
  org_id: string;
  project_id: string;
  job_id: string;
  actor_user_id: string;
  from_status: CompileJobStatus;
  to_status: CompileJobStatus;
  created_at: string;
};

export type OrgSettings = {
  orgId: string;
  webhook_secret: string;
  tokens_note: string;
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
  audit: AuditEntry[];
  settings: Map<string, OrgSettings>;
  webhookDeliveries: Map<string, string>;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

const JOB_STATUSES: CompileJobStatus[] = [
  "draft",
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
];

/** Legal compile-job lifecycle edges. */
const ALLOWED_TRANSITIONS: Record<CompileJobStatus, CompileJobStatus[]> = {
  draft: ["queued", "cancelled"],
  queued: ["running", "cancelled"],
  running: ["succeeded", "failed", "cancelled"],
  succeeded: [],
  failed: [],
  cancelled: [],
};

function memberKey(orgId: string, userId: string): string {
  return `${orgId}::${userId}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function isCompileJobStatus(value: string): value is CompileJobStatus {
  return (JOB_STATUSES as string[]).includes(value);
}

export function canTransition(
  from: CompileJobStatus,
  to: CompileJobStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

function freshWebhookSecret(): string {
  return `whsec_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
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
    audit: [],
    settings: new Map(),
    webhookDeliveries: new Map(),
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
  store.settings.set(id, {
    orgId: id,
    webhook_secret: freshWebhookSecret(),
    tokens_note: "API tokens are issued at register. Treat bearer tokens as secrets.",
    updated_at: nowIso(),
  });
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
    version: j.version,
    created_at: j.created_at,
    updated_at: j.updated_at,
  };
}

function appendAudit(
  store: Store,
  job: CompileJob,
  actorUserId: string,
  from: CompileJobStatus,
  to: CompileJobStatus,
) {
  store.audit.push({
    id: randomUUID(),
    org_id: job.org_id,
    project_id: job.project_id,
    job_id: job.id,
    actor_user_id: actorUserId,
    from_status: from,
    to_status: to,
    created_at: nowIso(),
  });
}

export function createJob(
  store: Store,
  orgId: string,
  projectId: string,
  input: JobCreate,
  actorUserId?: string,
) {
  const project = store.projects.get(projectId);
  if (!project || project.org_id !== orgId) return null;
  const stamp = nowIso();
  let status: CompileJobStatus = "draft";
  if (input.status !== undefined) {
    if (!isCompileJobStatus(input.status)) return { error: "bad_status" as const };
    if (input.status !== "draft" && input.status !== "queued") {
      return { error: "illegal_create_status" as const };
    }
    status = input.status;
  }
  const row: CompileJob = {
    id: randomUUID(),
    org_id: orgId,
    project_id: projectId,
    label: (input.label ?? "compile-job").trim() || "compile-job",
    status,
    mlir_pass_hint: (input.mlir_pass_hint ?? "lower-to-linalg").trim(),
    notes: (input.notes ?? "").trim(),
    version: 1,
    created_at: stamp,
    updated_at: stamp,
  };
  store.jobs.set(row.id, row);
  if (actorUserId && status === "queued") {
    appendAudit(store, row, actorUserId, "draft", "queued");
  }
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

export type JobPatch = Partial<JobCreate> & { expected_version?: number };

export type TransitionResult =
  | { ok: true; job: ReturnType<typeof publicJob> }
  | { ok: false; error: string };

export function transitionJob(
  store: Store,
  orgId: string,
  projectId: string,
  jobId: string,
  to: CompileJobStatus,
  actorUserId: string,
  expectedVersion?: number,
): TransitionResult {
  const existing = store.jobs.get(jobId);
  if (!existing || existing.org_id !== orgId || existing.project_id !== projectId) {
    return { ok: false, error: "job_not_found" };
  }
  if (!isCompileJobStatus(to)) {
    return { ok: false, error: "bad_status" };
  }
  if (expectedVersion !== undefined && existing.version !== expectedVersion) {
    return { ok: false, error: "version_conflict" };
  }
  if (!canTransition(existing.status, to)) {
    return { ok: false, error: "illegal_transition" };
  }
  const from = existing.status;
  const next: CompileJob = {
    ...existing,
    status: to,
    version: existing.version + 1,
    updated_at: nowIso(),
  };
  store.jobs.set(jobId, next);
  appendAudit(store, next, actorUserId, from, to);
  return { ok: true, job: publicJob(next) };
}

export function patchJob(
  store: Store,
  orgId: string,
  projectId: string,
  jobId: string,
  patch: JobPatch,
  actorUserId: string,
) {
  const existing = store.jobs.get(jobId);
  if (!existing || existing.org_id !== orgId || existing.project_id !== projectId) {
    return null;
  }

  if (patch.status !== undefined && patch.status !== existing.status) {
    if (!isCompileJobStatus(patch.status)) {
      return { error: "bad_status" as const };
    }
    const moved = transitionJob(
      store,
      orgId,
      projectId,
      jobId,
      patch.status,
      actorUserId,
      patch.expected_version,
    );
    if (!moved.ok) return { error: moved.error };
    // Apply non-status fields onto the transitioned job
    const after = store.jobs.get(jobId)!;
    const withMeta: CompileJob = {
      ...after,
      label:
        patch.label !== undefined
          ? String(patch.label).trim() || after.label
          : after.label,
      mlir_pass_hint:
        patch.mlir_pass_hint !== undefined
          ? String(patch.mlir_pass_hint).trim()
          : after.mlir_pass_hint,
      notes: patch.notes !== undefined ? String(patch.notes).trim() : after.notes,
      updated_at: nowIso(),
    };
    store.jobs.set(jobId, withMeta);
    return { job: publicJob(withMeta) };
  }

  if (
    patch.expected_version !== undefined &&
    existing.version !== patch.expected_version
  ) {
    return { error: "version_conflict" as const };
  }

  const next: CompileJob = {
    ...existing,
    label:
      patch.label !== undefined
        ? String(patch.label).trim() || existing.label
        : existing.label,
    mlir_pass_hint:
      patch.mlir_pass_hint !== undefined
        ? String(patch.mlir_pass_hint).trim()
        : existing.mlir_pass_hint,
    notes: patch.notes !== undefined ? String(patch.notes).trim() : existing.notes,
    version: existing.version + (patch.label || patch.mlir_pass_hint || patch.notes ? 1 : 0),
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

export type BatchTransitionItem = {
  project_id: string;
  job_id: string;
  to: CompileJobStatus;
  expected_version?: number;
};

export type BatchTransitionResult = {
  project_id: string;
  job_id: string;
  status: "ok" | "reject";
  to?: CompileJobStatus;
  job?: ReturnType<typeof publicJob>;
  reason?: string;
};

/** Each job transitions independently — one reject does not stop siblings. */
export function batchTransitionJobs(
  store: Store,
  orgId: string,
  items: BatchTransitionItem[],
  actorUserId: string,
): { batch_id: string; results: BatchTransitionResult[] } {
  const batchId = randomUUID();
  const results: BatchTransitionResult[] = [];
  for (const item of items) {
    if (!isCompileJobStatus(item.to)) {
      results.push({
        project_id: item.project_id,
        job_id: item.job_id,
        status: "reject",
        reason: "bad_status",
      });
      continue;
    }
    const moved = transitionJob(
      store,
      orgId,
      item.project_id,
      item.job_id,
      item.to,
      actorUserId,
      item.expected_version,
    );
    if (moved.ok) {
      results.push({
        project_id: item.project_id,
        job_id: item.job_id,
        status: "ok",
        to: item.to,
        job: moved.job,
      });
    } else {
      results.push({
        project_id: item.project_id,
        job_id: item.job_id,
        status: "reject",
        reason: moved.error,
      });
    }
  }
  return { batch_id: batchId, results };
}

function countPassLayers(hint: string): number {
  const parts = hint
    .split(/[,>|]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return Math.max(1, parts.length);
}

/**
 * Scenario compare: naive opaque monolith vs paper-inspired MLIR layered passes.
 * Lab sketch only — not the authors' compiler.
 */
export function scenarioCompare(
  store: Store,
  orgId: string,
  projectId: string,
  jobId: string,
) {
  const job = store.jobs.get(jobId);
  if (!job || job.org_id !== orgId || job.project_id !== projectId) return null;
  const layers = countPassLayers(job.mlir_pass_hint);
  const naive = {
    label: "opaque_monolith",
    pass_layers: 1,
    modularity_score: 1,
    note: "Treat the model as one black-box compile unit.",
  };
  const paperInspired = {
    label: "mlir_layered",
    pass_layers: layers,
    modularity_score: layers * 2,
    note: "Sketch of layered MLIR-style passes from the paper's method claim.",
  };
  return {
    job_id: jobId,
    project_id: projectId,
    mlir_pass_hint: job.mlir_pass_hint,
    naive,
    paper_inspired: paperInspired,
    delta_modularity: paperInspired.modularity_score - naive.modularity_score,
    honesty:
      "Method-lab experiment inspired by paper 2607.15865 — not a replacement for the authors' compiler.",
  };
}

export function listAudit(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number; job_id?: string } = {},
) {
  const all = store.audit
    .filter((e) => e.org_id === orgId)
    .filter((e) => !opts.job_id || e.job_id === opts.job_id)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 50;
  return {
    entries: all.slice(offset, offset + limit),
    total,
    limit,
    offset,
  };
}

export function auditToCsv(entries: AuditEntry[]): string {
  const header =
    "id,org_id,project_id,job_id,actor_user_id,from_status,to_status,created_at";
  const lines = entries.map((e) =>
    [
      e.id,
      e.org_id,
      e.project_id,
      e.job_id,
      e.actor_user_id,
      e.from_status,
      e.to_status,
      e.created_at,
    ].join(","),
  );
  return [header, ...lines].join("\n");
}

export function getOrgSettings(store: Store, orgId: string): OrgSettings | undefined {
  return store.settings.get(orgId);
}

export function updateOrgSettings(
  store: Store,
  orgId: string,
  patch: { webhook_secret?: string; tokens_note?: string },
): OrgSettings | null {
  const current = store.settings.get(orgId);
  if (!current) return null;
  const next: OrgSettings = {
    ...current,
    webhook_secret:
      patch.webhook_secret !== undefined ? patch.webhook_secret : current.webhook_secret,
    tokens_note:
      patch.tokens_note !== undefined ? patch.tokens_note : current.tokens_note,
    updated_at: nowIso(),
  };
  store.settings.set(orgId, next);
  return next;
}

export function rotateWebhookSecret(store: Store, orgId: string): OrgSettings | null {
  return updateOrgSettings(store, orgId, { webhook_secret: freshWebhookSecret() });
}

export function ingestWebhookJob(
  store: Store,
  orgId: string,
  projectId: string,
  idempotencyKey: string,
  input: JobCreate,
):
  | {
      ok: true;
      status: 201 | 200;
      job: ReturnType<typeof publicJob>;
      replay: boolean;
    }
  | { ok: false; status: number; error: string } {
  if (!getOrg(store, orgId)) return { ok: false, status: 404, error: "org_not_found" };
  if (!idempotencyKey) {
    return { ok: false, status: 400, error: "idempotency_key_required" };
  }
  const deliveryKey = `${orgId}::${idempotencyKey}`;
  const existingId = store.webhookDeliveries.get(deliveryKey);
  if (existingId) {
    const j = store.jobs.get(existingId);
    if (j && j.org_id === orgId) {
      return { ok: true, status: 200, job: publicJob(j), replay: true };
    }
  }
  const created = createJob(store, orgId, projectId, input);
  if (!created) return { ok: false, status: 404, error: "project_not_found" };
  if ("error" in created) return { ok: false, status: 400, error: created.error };
  store.webhookDeliveries.set(deliveryKey, created.job.id);
  return { ok: true, status: 201, job: created.job, replay: false };
}
