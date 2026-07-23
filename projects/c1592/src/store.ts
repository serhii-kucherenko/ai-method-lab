import { randomUUID } from "node:crypto";
import { penaltyMax, type PenaltyInput, type PenaltyResult } from "./domain/penaltyMax.js";

export type OrgRole = "analyst" | "auditor" | "admin";

type User = { id: string; email: string; password: string };
type Org = { id: string; name: string; created_by: string };

export type Violation = {
  id: string;
  org_id: string;
  label: string;
  culpability: string;
  duty_loss: number;
  domestic_value: number;
  dutiable_value: number;
  flat_2x_cheat: boolean;
  dual_approver_cheat: boolean;
  ignore_domestic_cap: boolean;
  created_at: string;
};

export type AuditEvent = {
  id: string;
  org_id: string;
  violation_id: string | null;
  batch_id: string | null;
  actor_id: string | null;
  action: string;
  status: string;
  penalty_max: number | null;
  branch: string | null;
  reason: string | null;
  algorithm_version: string | null;
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
  violations: Map<string, Violation>;
  auditEvents: AuditEvent[];
  orgSettings: Map<string, OrgSettings>;
  webhookDeliveries: Map<string, { org_id: string; violation_id: string }>;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

function memberKey(orgId: string, userId: string): string {
  return `${orgId}::${userId}`;
}

function newWebhookSecret(): string {
  return `whsec_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

export function createStore(opts: { rateLimit?: number } = {}): Store {
  return {
    users: new Map(),
    usersByEmail: new Map(),
    tokens: new Map(),
    orgs: new Map(),
    members: new Map(),
    violations: new Map(),
    auditEvents: [],
    orgSettings: new Map(),
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
  store.orgSettings.set(id, {
    orgId: id,
    webhook_secret: newWebhookSecret(),
    tokens_note: "API tokens are issued at register. Treat bearer tokens as secrets.",
    updated_at: new Date().toISOString(),
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

export type ViolationCreate = PenaltyInput & { label?: string };

function appendAudit(
  store: Store,
  event: Omit<AuditEvent, "id" | "created_at">,
): AuditEvent {
  const row: AuditEvent = {
    ...event,
    id: randomUUID(),
    created_at: new Date().toISOString(),
  };
  store.auditEvents.push(row);
  return row;
}

export function createViolation(
  store: Store,
  orgId: string,
  input: ViolationCreate,
  actorId?: string | null,
) {
  const id = randomUUID();
  const v: Violation = {
    id,
    org_id: orgId,
    label: input.label ?? "§1592 forecast",
    culpability: String(input.culpability ?? ""),
    duty_loss: Number(input.duty_loss ?? 0),
    domestic_value: Number(input.domestic_value ?? 0),
    dutiable_value: Number(input.dutiable_value ?? 0),
    flat_2x_cheat: input.flat_2x_cheat === true,
    dual_approver_cheat: input.dual_approver_cheat === true,
    ignore_domestic_cap: input.ignore_domestic_cap === true,
    created_at: new Date().toISOString(),
  };
  store.violations.set(id, v);
  appendAudit(store, {
    org_id: orgId,
    violation_id: id,
    batch_id: null,
    actor_id: actorId ?? null,
    action: "violation_create",
    status: "ok",
    penalty_max: null,
    branch: null,
    reason: null,
    algorithm_version: null,
  });
  return getViolation(store, orgId, id);
}

export function getViolation(store: Store, orgId: string, id: string) {
  const v = store.violations.get(id);
  if (!v || v.org_id !== orgId) return undefined;
  const { created_at: _c, ...rest } = v;
  return rest;
}

export function listViolations(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number } = {},
) {
  const all = [...store.violations.values()]
    .filter((t) => t.org_id === orgId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    violations: all.slice(offset, offset + limit).map((t) => {
      const { created_at: _c, ...rest } = t;
      return rest;
    }),
    total,
    limit,
    offset,
  };
}

function toInput(v: ReturnType<typeof getViolation>): PenaltyInput | null {
  if (!v) return null;
  return {
    culpability: v.culpability,
    duty_loss: v.duty_loss,
    domestic_value: v.domestic_value,
    dutiable_value: v.dutiable_value,
    flat_2x_cheat: v.flat_2x_cheat,
    dual_approver_cheat: v.dual_approver_cheat,
    ignore_domestic_cap: v.ignore_domestic_cap,
  };
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

export function patchViolation(
  store: Store,
  orgId: string,
  violationId: string,
  patch: Partial<ViolationCreate>,
  actorId?: string | null,
) {
  const existing = store.violations.get(violationId);
  if (!existing || existing.org_id !== orgId) return null;
  const next: Violation = {
    ...existing,
    label: patch.label ?? existing.label,
    culpability:
      patch.culpability !== undefined ? String(patch.culpability) : existing.culpability,
    duty_loss:
      patch.duty_loss !== undefined ? Number(patch.duty_loss) : existing.duty_loss,
    domestic_value:
      patch.domestic_value !== undefined
        ? Number(patch.domestic_value)
        : existing.domestic_value,
    dutiable_value:
      patch.dutiable_value !== undefined
        ? Number(patch.dutiable_value)
        : existing.dutiable_value,
    flat_2x_cheat:
      patch.flat_2x_cheat !== undefined
        ? patch.flat_2x_cheat === true
        : existing.flat_2x_cheat,
    dual_approver_cheat:
      patch.dual_approver_cheat !== undefined
        ? patch.dual_approver_cheat === true
        : existing.dual_approver_cheat,
    ignore_domestic_cap:
      patch.ignore_domestic_cap !== undefined
        ? patch.ignore_domestic_cap === true
        : existing.ignore_domestic_cap,
  };
  store.violations.set(violationId, next);
  appendAudit(store, {
    org_id: orgId,
    violation_id: violationId,
    batch_id: null,
    actor_id: actorId ?? null,
    action: "violation_patch",
    status: "ok",
    penalty_max: null,
    branch: null,
    reason: null,
    algorithm_version: null,
  });
  return getViolation(store, orgId, violationId);
}

export function runForecast(
  store: Store,
  orgId: string,
  violationId: string,
  actorId?: string | null,
  batchId: string | null = null,
): (PenaltyResult & { violation_id: string; run_id?: string }) | null {
  const v = getViolation(store, orgId, violationId);
  const input = toInput(v);
  if (!input) return null;
  const result = penaltyMax(input);
  if (result.status === "ok") {
    const ev = appendAudit(store, {
      org_id: orgId,
      violation_id: violationId,
      batch_id: batchId,
      actor_id: actorId ?? null,
      action: "forecast_lock",
      status: "ok",
      penalty_max: result.penalty_max,
      branch: result.branch,
      reason: null,
      algorithm_version: result.algorithm_version,
    });
    return { ...result, violation_id: violationId, run_id: ev.id };
  }
  const ev = appendAudit(store, {
    org_id: orgId,
    violation_id: violationId,
    batch_id: batchId,
    actor_id: actorId ?? null,
    action: "forecast_reject",
    status: "reject",
    penalty_max: null,
    branch: null,
    reason: result.reason,
    algorithm_version: null,
  });
  return { ...result, violation_id: violationId, run_id: ev.id };
}

export type BatchForecastItem = {
  violation_id: string;
  status: "ok" | "reject";
  penalty_max?: number;
  branch?: string;
  reason?: string;
  algorithm_version?: string;
};

export function runBatchForecast(
  store: Store,
  orgId: string,
  violationIds: string[],
  actorId?: string | null,
): { batch_id: string; results: BatchForecastItem[] } {
  const batchId = randomUUID();
  const results: BatchForecastItem[] = [];
  for (const violationId of violationIds) {
    try {
      const outcome = runForecast(store, orgId, violationId, actorId, batchId);
      if (!outcome) {
        appendAudit(store, {
          org_id: orgId,
          violation_id: null,
          batch_id: batchId,
          actor_id: actorId ?? null,
          action: "forecast_reject",
          status: "reject",
          penalty_max: null,
          branch: null,
          reason: "not_found",
          algorithm_version: null,
        });
        results.push({ violation_id: violationId, status: "reject", reason: "not_found" });
        continue;
      }
      if (outcome.status === "ok") {
        results.push({
          violation_id: violationId,
          status: "ok",
          penalty_max: outcome.penalty_max,
          branch: outcome.branch,
          algorithm_version: outcome.algorithm_version,
        });
      } else {
        results.push({
          violation_id: violationId,
          status: "reject",
          reason: outcome.reason,
        });
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : "batch_error";
      appendAudit(store, {
        org_id: orgId,
        violation_id: null,
        batch_id: batchId,
        actor_id: actorId ?? null,
        action: "forecast_reject",
        status: "reject",
        penalty_max: null,
        branch: null,
        reason,
        algorithm_version: null,
      });
      results.push({ violation_id: violationId, status: "reject", reason });
    }
  }
  return { batch_id: batchId, results };
}

export function listAudit(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number } = {},
): { events: AuditEvent[]; total: number; limit: number; offset: number } {
  const all = store.auditEvents
    .filter((e) => e.org_id === orgId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    events: all.slice(offset, offset + limit),
    total,
    limit,
    offset,
  };
}

export function auditToCsv(events: AuditEvent[]): string {
  const header = [
    "id",
    "violation_id",
    "batch_id",
    "action",
    "status",
    "penalty_max",
    "branch",
    "reason",
    "algorithm_version",
    "created_at",
  ];
  const escape = (v: unknown): string => {
    const s = v === null || v === undefined ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [header.join(",")];
  for (const ev of events) {
    lines.push(
      [
        ev.id,
        ev.violation_id,
        ev.batch_id,
        ev.action,
        ev.status,
        ev.penalty_max,
        ev.branch,
        ev.reason,
        ev.algorithm_version,
        ev.created_at,
      ]
        .map(escape)
        .join(","),
    );
  }
  return lines.join("\n");
}

export function getOrgSettings(store: Store, orgId: string): OrgSettings | null {
  if (!getOrg(store, orgId)) return null;
  let settings = store.orgSettings.get(orgId);
  if (!settings) {
    settings = {
      orgId,
      webhook_secret: newWebhookSecret(),
      tokens_note: "API tokens are issued at register. Treat bearer tokens as secrets.",
      updated_at: new Date().toISOString(),
    };
    store.orgSettings.set(orgId, settings);
  }
  return settings;
}

export function patchOrgSettings(
  store: Store,
  orgId: string,
  patch: { webhook_secret?: string; tokens_note?: string },
): OrgSettings | null {
  const current = getOrgSettings(store, orgId);
  if (!current) return null;
  const next: OrgSettings = {
    orgId,
    webhook_secret:
      patch.webhook_secret !== undefined ? patch.webhook_secret : current.webhook_secret,
    tokens_note: patch.tokens_note !== undefined ? patch.tokens_note : current.tokens_note,
    updated_at: new Date().toISOString(),
  };
  store.orgSettings.set(orgId, next);
  return next;
}

export function rotateWebhookSecret(store: Store, orgId: string): OrgSettings | null {
  return patchOrgSettings(store, orgId, { webhook_secret: newWebhookSecret() });
}

export function ingestWebhookViolation(
  store: Store,
  orgId: string,
  idempotencyKey: string,
  input: ViolationCreate,
):
  | {
      ok: true;
      status: 201 | 200;
      violation: NonNullable<ReturnType<typeof getViolation>>;
      replay: boolean;
    }
  | { ok: false; status: number; error: string } {
  if (!getOrg(store, orgId)) return { ok: false, status: 404, error: "org_not_found" };
  if (!idempotencyKey.trim()) {
    return { ok: false, status: 400, error: "idempotency_key_required" };
  }
  const prior = store.webhookDeliveries.get(idempotencyKey);
  if (prior) {
    const violation = getViolation(store, orgId, prior.violation_id);
    if (!violation) return { ok: false, status: 500, error: "replay_missing" };
    return { ok: true, status: 200, violation, replay: true };
  }
  const violation = createViolation(store, orgId, input, null);
  if (!violation) return { ok: false, status: 500, error: "create_failed" };
  store.webhookDeliveries.set(idempotencyKey, {
    org_id: orgId,
    violation_id: violation.id,
  });
  return { ok: true, status: 201, violation, replay: false };
}
