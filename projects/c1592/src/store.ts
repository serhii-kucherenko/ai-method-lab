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
  violation_id: string;
  actor_id: string | null;
  action: string;
  status: string;
  penalty_max: number | null;
  branch: string | null;
  reason: string | null;
  algorithm_version: string | null;
  created_at: string;
};

export type Store = {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  tokens: Map<string, string>;
  orgs: Map<string, Org>;
  members: Map<string, OrgRole>;
  violations: Map<string, Violation>;
  auditEvents: AuditEvent[];
  rateLimit: number;
  rateCounts: Map<string, number>;
};

function memberKey(orgId: string, userId: string): string {
  return `${orgId}::${userId}`;
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
): (PenaltyResult & { violation_id: string; run_id?: string }) | null {
  const v = getViolation(store, orgId, violationId);
  const input = toInput(v);
  if (!input) return null;
  const result = penaltyMax(input);
  if (result.status === "ok") {
    const ev = appendAudit(store, {
      org_id: orgId,
      violation_id: violationId,
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
