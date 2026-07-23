import { randomUUID } from "node:crypto";
import { scorePackFit } from "./domain/packFit.js";

export type OrgRole = "admin" | "operator" | "viewer";

export type ChecklistJobStatus =
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
  plant_label: string;
  risk_budget: number;
  notes: string;
  /** Added in schema migration v2 */
  orchestrator_prompt: string;
  created_at: string;
  updated_at: string;
};

export type ChecklistJob = {
  id: string;
  org_id: string;
  project_id: string;
  label: string;
  status: ChecklistJobStatus;
  query: string;
  plan_depth: number;
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
  from_status: ChecklistJobStatus;
  to_status: ChecklistJobStatus;
  created_at: string;
};

export type OrgSettings = {
  orgId: string;
  webhook_secret: string;
  tokens_note: string;
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
  jobs: Map<string, ChecklistJob>;
  audit: AuditEntry[];
  settings: Map<string, OrgSettings>;
  webhookDeliveries: Map<string, string>;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

const JOB_STATUSES: ChecklistJobStatus[] = [
  "draft",
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
];

/** Legal plan-job lifecycle edges. */
const ALLOWED_TRANSITIONS: Record<ChecklistJobStatus, ChecklistJobStatus[]> = {
  draft: ["queued", "cancelled"],
  queued: ["running", "cancelled"],
  running: ["succeeded", "failed", "cancelled"],
  succeeded: [],
  failed: [],
  cancelled: [],
};

const CURRENT_SCHEMA = 2;

function memberKey(orgId: string, userId: string): string {
  return `${orgId}::${userId}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function isChecklistJobStatus(value: string): value is ChecklistJobStatus {
  return (JOB_STATUSES as string[]).includes(value);
}

export function canTransition(
  from: ChecklistJobStatus,
  to: ChecklistJobStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

function freshWebhookSecret(): string {
  return `whsec_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

/** Apply schema migrations after initial create (oracle: migration-missing). */
export function applyMigrations(store: Store): number {
  if (store.schemaVersion < 2) {
    for (const project of store.projects.values()) {
      if (project.orchestrator_prompt === undefined || project.orchestrator_prompt === null) {
        project.orchestrator_prompt = "";
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
    audit: [],
    settings: new Map(),
    webhookDeliveries: new Map(),
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
  store.settings.set(id, {
    orgId: id,
    webhook_secret: freshWebhookSecret(),
    tokens_note:
      "API tokens are issued at register. Treat bearer tokens as secrets.",
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
  plant_label?: string;
  risk_budget?: number;
  notes?: string;
  orchestrator_prompt?: string;
};

function publicProject(p: Project) {
  return {
    id: p.id,
    org_id: p.org_id,
    name: p.name,
    plant_label: p.plant_label,
    risk_budget: p.risk_budget,
    notes: p.notes,
    orchestrator_prompt: p.orchestrator_prompt,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

export function createProject(store: Store, orgId: string, input: ProjectCreate) {
  const stamp = nowIso();
  const hop =
    input.risk_budget !== undefined && Number.isFinite(Number(input.risk_budget))
      ? Math.max(1, Math.min(8, Math.floor(Number(input.risk_budget))))
      : 2;
  const row: Project = {
    id: randomUUID(),
    org_id: orgId,
    name: input.name.trim(),
    plant_label: (input.plant_label ?? "default-module").trim() || "default-module",
    risk_budget: hop,
    notes: (input.notes ?? "").trim(),
    orchestrator_prompt: (input.orchestrator_prompt ?? "").trim(),
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
        p.plant_label.toLowerCase().includes(q),
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
  const hop =
    patch.risk_budget !== undefined && Number.isFinite(Number(patch.risk_budget))
      ? Math.max(1, Math.min(8, Math.floor(Number(patch.risk_budget))))
      : existing.risk_budget;
  const next: Project = {
    ...existing,
    name: patch.name !== undefined ? String(patch.name).trim() : existing.name,
    plant_label:
      patch.plant_label !== undefined
        ? String(patch.plant_label).trim() || existing.plant_label
        : existing.plant_label,
    risk_budget: hop,
    notes: patch.notes !== undefined ? String(patch.notes).trim() : existing.notes,
    orchestrator_prompt:
      patch.orchestrator_prompt !== undefined
        ? String(patch.orchestrator_prompt).trim()
        : existing.orchestrator_prompt,
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
  status?: ChecklistJobStatus;
  query?: string;
  plan_depth?: number;
  notes?: string;
};

function publicJob(j: ChecklistJob) {
  return {
    id: j.id,
    org_id: j.org_id,
    project_id: j.project_id,
    label: j.label,
    status: j.status,
    query: j.query,
    plan_depth: j.plan_depth,
    notes: j.notes,
    version: j.version,
    created_at: j.created_at,
    updated_at: j.updated_at,
  };
}

function appendAudit(
  store: Store,
  job: ChecklistJob,
  actorUserId: string,
  from: ChecklistJobStatus,
  to: ChecklistJobStatus,
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
  let status: ChecklistJobStatus = "draft";
  if (input.status !== undefined) {
    if (!isChecklistJobStatus(input.status)) return { error: "bad_status" as const };
    if (input.status !== "draft" && input.status !== "queued") {
      return { error: "illegal_create_status" as const };
    }
    status = input.status;
  }
  const hop =
    input.plan_depth !== undefined && Number.isFinite(Number(input.plan_depth))
      ? Math.max(1, Math.min(project.risk_budget, Math.floor(Number(input.plan_depth))))
      : 1;
  const stamp = nowIso();
  const row: ChecklistJob = {
    id: randomUUID(),
    org_id: orgId,
    project_id: projectId,
    label: (input.label ?? "plan-job").trim() || "plan-job",
    status,
    query: (input.query ?? "").trim(),
    plan_depth: hop,
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
        j.query.toLowerCase().includes(q),
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
  to: ChecklistJobStatus,
  actorUserId: string,
  expectedVersion?: number,
): TransitionResult {
  const existing = store.jobs.get(jobId);
  if (!existing || existing.org_id !== orgId || existing.project_id !== projectId) {
    return { ok: false, error: "job_not_found" };
  }
  if (!isChecklistJobStatus(to)) {
    return { ok: false, error: "bad_status" };
  }
  if (expectedVersion !== undefined && existing.version !== expectedVersion) {
    return { ok: false, error: "version_conflict" };
  }
  if (!canTransition(existing.status, to)) {
    return { ok: false, error: "illegal_transition" };
  }
  const from = existing.status;
  const next: ChecklistJob = {
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
    return { error: "job_not_found" as const };
  }

  if (patch.status !== undefined && patch.status !== existing.status) {
    if (!isChecklistJobStatus(patch.status)) {
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
    const after = store.jobs.get(jobId)!;
    const withMeta: ChecklistJob = {
      ...after,
      label:
        patch.label !== undefined
          ? String(patch.label).trim() || after.label
          : after.label,
      query: patch.query !== undefined ? String(patch.query).trim() : after.query,
      plan_depth:
        patch.plan_depth !== undefined && Number.isFinite(Number(patch.plan_depth))
          ? Math.max(1, Math.floor(Number(patch.plan_depth)))
          : after.plan_depth,
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

  const next: ChecklistJob = {
    ...existing,
    label:
      patch.label !== undefined
        ? String(patch.label).trim() || existing.label
        : existing.label,
    query: patch.query !== undefined ? String(patch.query).trim() : existing.query,
    plan_depth:
      patch.plan_depth !== undefined && Number.isFinite(Number(patch.plan_depth))
        ? Math.max(1, Math.floor(Number(patch.plan_depth)))
        : existing.plan_depth,
    notes: patch.notes !== undefined ? String(patch.notes).trim() : existing.notes,
    version:
      existing.version +
      (patch.label || patch.query || patch.plan_depth !== undefined || patch.notes
        ? 1
        : 0),
    updated_at: nowIso(),
  };
  store.jobs.set(jobId, next);
  return { job: publicJob(next) };
}

export type BatchTransitionItem = {
  project_id: string;
  job_id: string;
  to: ChecklistJobStatus;
  expected_version?: number;
};

export function batchTransitionJobs(
  store: Store,
  orgId: string,
  items: BatchTransitionItem[],
  actorUserId: string,
) {
  const results: Array<{
    project_id: string;
    job_id: string;
    status: "ok" | "reject";
    to?: ChecklistJobStatus;
    job?: ReturnType<typeof publicJob>;
    reason?: string;
  }> = [];
  const seenInBatch = new Set<string>();
  for (const item of items) {
    const dedupeKey = `${item.project_id}::${item.job_id}`;
    if (seenInBatch.has(dedupeKey)) {
      results.push({
        project_id: item.project_id,
        job_id: item.job_id,
        status: "reject",
        reason: "duplicate_in_batch",
      });
      continue;
    }
    seenInBatch.add(dedupeKey);
    const moved = transitionJob(
      store,
      orgId,
      item.project_id,
      item.job_id,
      item.to,
      actorUserId,
      item.expected_version,
    );
    if (!moved.ok) {
      results.push({
        project_id: item.project_id,
        job_id: item.job_id,
        status: "reject",
        reason: moved.error,
      });
      continue;
    }
    results.push({
      project_id: item.project_id,
      job_id: item.job_id,
      status: "ok",
      to: item.to,
      job: moved.job,
    });
  }
  return { results };
}

/** Seed many queued plan jobs for scale walks (lab fixture). */
export function seedScaleJobs(
  store: Store,
  orgId: string,
  projectId: string,
  count: number,
): string[] {
  const ids: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const created = createJob(store, orgId, projectId, {
      label: `scale-job-${String(i).padStart(4, "0")}`,
      status: "queued",
      query: `query-${i}`,
      plan_depth: (i % 3) + 1,
    });
    if (!created || "error" in created) {
      throw new Error(`seedScaleJobs failed at ${i}`);
    }
    ids.push(created.job.id);
  }
  return ids;
}

export function listAudit(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number; job_id?: string } = {},
) {
  const filtered = store.audit
    .filter((e) => e.org_id === orgId)
    .filter((e) => !opts.job_id || e.job_id === opts.job_id)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = filtered.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 50;
  return {
    entries: filtered.slice(offset, offset + limit),
    total,
    limit,
    offset,
  };
}

export function auditToCsv(entries: AuditEntry[]): string {
  const header = "id,org_id,project_id,job_id,actor_user_id,from_status,to_status,created_at";
  const rows = entries.map((e) =>
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
  return [header, ...rows].join("\n");
}

export function scenarioCompare(
  store: Store,
  orgId: string,
  projectId: string,
  jobId: string,
) {
  const job = store.jobs.get(jobId);
  if (!job || job.org_id !== orgId || job.project_id !== projectId) return null;
  const capacity = Math.max(4, Math.min(20, 4 + job.plan_depth * 2));
  const looksLikeCatalog = /:[0-9]+:-?[0-9]+/.test(job.query);
  const items = looksLikeCatalog ? job.query : undefined;
  const fit = scorePackFit({ capacity, items });
  const honesty =
    "Method-lab experiment inspired by the paper — not a replacement for the authors' packing checklist system or commercial travel apps. Never brand as FlyEnJoy or RLO.";
  if (fit.status === "reject") {
    return {
      job_id: job.id,
      indication: job.query,
      status: "reject" as const,
      reason: fit.reason,
      honesty,
    };
  }
  return {
    job_id: job.id,
    indication: job.query,
    capacity: fit.capacity,
    naive: {
      ...fit.naive,
      path: ["preference_rank", "soft_capacity_greedy"],
    },
    integrated: {
      ...fit.constrained,
      risk_score: fit.constrained.risk_score,
      path: ["hard_feasibility_gate", "preference_maximize", "feasible_subset"],
    },
    delta_score: fit.delta_score,
    honesty,
  };
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
  if ("error" in created) {
    return { ok: false, status: 400, error: String(created.error) };
  }
  store.webhookDeliveries.set(deliveryKey, created.job.id);
  return { ok: true, status: 201, job: created.job, replay: false };
}

export function schemaInfo(store: Store) {
  return {
    schema_version: store.schemaVersion,
    current: CURRENT_SCHEMA,
    migrated: store.schemaVersion >= CURRENT_SCHEMA,
  };
}
