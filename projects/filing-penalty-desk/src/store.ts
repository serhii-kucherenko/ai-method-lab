import { randomUUID } from "node:crypto";
import { forecast, type ForecastInput, type ForecastResult } from "./domain/forecast.js";

export type OrgRole = "analyst" | "auditor" | "admin";

type User = { id: string; email: string; password: string };
type Org = { id: string; name: string; created_by: string };

export type ReturnTimeline = {
  id: string;
  org_id: string;
  label: string;
  net_amount_due: number;
  unpaid_by_month: number[];
  unfiled_months: number;
  levy_bump_after_month: number | null;
  min_floor: number;
  apply_minimum: boolean;
  flat_55_cheat: boolean;
  dual_approver_cheat: boolean;
  interest_as_penalty: boolean;
  installment_025_silent: boolean;
  partnership_6698_cheat: boolean;
  scorp_6699_cheat: boolean;
  c1_after_ftf_cap_cheat: boolean;
  min_undercut_cheat: boolean;
  created_at: string;
};

export type AdditionForecast = {
  id: string;
  org_id: string;
  timeline_id: string;
  status: "ok" | "reject";
  ftf: number | null;
  ftp: number | null;
  combined: number | null;
  branch: string | null;
  reason: string | null;
  algorithm_version: string | null;
  locked_at: string;
};

export type Store = {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  tokens: Map<string, string>;
  orgs: Map<string, Org>;
  members: Map<string, OrgRole>;
  timelines: Map<string, ReturnTimeline>;
  forecasts: Map<string, AdditionForecast>;
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
    timelines: new Map(),
    forecasts: new Map(),
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

export type TimelineCreate = ForecastInput & { label?: string };

function toTimeline(
  orgId: string,
  id: string,
  input: TimelineCreate,
): ReturnTimeline {
  return {
    id,
    org_id: orgId,
    label: input.label ?? "Return timeline",
    net_amount_due: Number(input.net_amount_due ?? 0),
    unpaid_by_month: Array.isArray(input.unpaid_by_month)
      ? input.unpaid_by_month.map(Number)
      : [],
    unfiled_months: Number(input.unfiled_months ?? 0),
    levy_bump_after_month:
      input.levy_bump_after_month === null || input.levy_bump_after_month === undefined
        ? null
        : Number(input.levy_bump_after_month),
    min_floor: Number(input.min_floor ?? 0),
    apply_minimum: input.apply_minimum === true,
    flat_55_cheat: input.flat_55_cheat === true,
    dual_approver_cheat: input.dual_approver_cheat === true,
    interest_as_penalty: input.interest_as_penalty === true,
    installment_025_silent: input.installment_025_silent === true,
    partnership_6698_cheat: input.partnership_6698_cheat === true,
    scorp_6699_cheat: input.scorp_6699_cheat === true,
    c1_after_ftf_cap_cheat: input.c1_after_ftf_cap_cheat === true,
    min_undercut_cheat: input.min_undercut_cheat === true,
    created_at: new Date().toISOString(),
  };
}

export function createTimeline(store: Store, orgId: string, input: TimelineCreate) {
  const id = randomUUID();
  const row = toTimeline(orgId, id, input);
  store.timelines.set(id, row);
  return publicTimeline(row);
}

function publicTimeline(t: ReturnTimeline) {
  const { created_at: _c, ...rest } = t;
  return rest;
}

export function getTimeline(store: Store, orgId: string, id: string) {
  const t = store.timelines.get(id);
  if (!t || t.org_id !== orgId) return undefined;
  return publicTimeline(t);
}

export function listTimelines(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number; q?: string } = {},
) {
  const q = (opts.q ?? "").trim().toLowerCase();
  const all = [...store.timelines.values()]
    .filter((t) => t.org_id === orgId)
    .filter((t) => !q || t.label.toLowerCase().includes(q))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    timelines: all.slice(offset, offset + limit).map(publicTimeline),
    total,
    limit,
    offset,
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

export function patchTimeline(
  store: Store,
  orgId: string,
  timelineId: string,
  patch: Partial<TimelineCreate>,
) {
  const existing = store.timelines.get(timelineId);
  if (!existing || existing.org_id !== orgId) return null;
  const next: ReturnTimeline = {
    ...existing,
    label: patch.label !== undefined ? String(patch.label) : existing.label,
    net_amount_due:
      patch.net_amount_due !== undefined
        ? Number(patch.net_amount_due)
        : existing.net_amount_due,
    unpaid_by_month:
      patch.unpaid_by_month !== undefined
        ? patch.unpaid_by_month.map(Number)
        : existing.unpaid_by_month,
    unfiled_months:
      patch.unfiled_months !== undefined
        ? Number(patch.unfiled_months)
        : existing.unfiled_months,
    levy_bump_after_month:
      patch.levy_bump_after_month !== undefined
        ? patch.levy_bump_after_month === null
          ? null
          : Number(patch.levy_bump_after_month)
        : existing.levy_bump_after_month,
    min_floor:
      patch.min_floor !== undefined ? Number(patch.min_floor) : existing.min_floor,
    apply_minimum:
      patch.apply_minimum !== undefined
        ? patch.apply_minimum === true
        : existing.apply_minimum,
    flat_55_cheat:
      patch.flat_55_cheat !== undefined
        ? patch.flat_55_cheat === true
        : existing.flat_55_cheat,
    dual_approver_cheat:
      patch.dual_approver_cheat !== undefined
        ? patch.dual_approver_cheat === true
        : existing.dual_approver_cheat,
    interest_as_penalty:
      patch.interest_as_penalty !== undefined
        ? patch.interest_as_penalty === true
        : existing.interest_as_penalty,
    installment_025_silent:
      patch.installment_025_silent !== undefined
        ? patch.installment_025_silent === true
        : existing.installment_025_silent,
    partnership_6698_cheat:
      patch.partnership_6698_cheat !== undefined
        ? patch.partnership_6698_cheat === true
        : existing.partnership_6698_cheat,
    scorp_6699_cheat:
      patch.scorp_6699_cheat !== undefined
        ? patch.scorp_6699_cheat === true
        : existing.scorp_6699_cheat,
    c1_after_ftf_cap_cheat:
      patch.c1_after_ftf_cap_cheat !== undefined
        ? patch.c1_after_ftf_cap_cheat === true
        : existing.c1_after_ftf_cap_cheat,
    min_undercut_cheat:
      patch.min_undercut_cheat !== undefined
        ? patch.min_undercut_cheat === true
        : existing.min_undercut_cheat,
  };
  store.timelines.set(timelineId, next);
  return publicTimeline(next);
}

function toInput(t: ReturnTimeline): ForecastInput {
  return {
    net_amount_due: t.net_amount_due,
    unpaid_by_month: t.unpaid_by_month,
    unfiled_months: t.unfiled_months,
    levy_bump_after_month: t.levy_bump_after_month,
    min_floor: t.min_floor,
    apply_minimum: t.apply_minimum,
    flat_55_cheat: t.flat_55_cheat,
    dual_approver_cheat: t.dual_approver_cheat,
    interest_as_penalty: t.interest_as_penalty,
    installment_025_silent: t.installment_025_silent,
    partnership_6698_cheat: t.partnership_6698_cheat,
    scorp_6699_cheat: t.scorp_6699_cheat,
    c1_after_ftf_cap_cheat: t.c1_after_ftf_cap_cheat,
    min_undercut_cheat: t.min_undercut_cheat,
  };
}

export function runForecast(
  store: Store,
  orgId: string,
  timelineId: string,
): ForecastResult & { algorithm_version?: string; forecast_id?: string } {
  const t = store.timelines.get(timelineId);
  if (!t || t.org_id !== orgId) {
    return { status: "reject", reason: "timeline_not_found" };
  }
  const result = forecast(toInput(t));
  const id = randomUUID();
  const locked: AdditionForecast = {
    id,
    org_id: orgId,
    timeline_id: timelineId,
    status: result.status,
    ftf: result.status === "ok" ? result.ftf : null,
    ftp: result.status === "ok" ? result.ftp : null,
    combined: result.status === "ok" ? result.combined : null,
    branch: result.status === "ok" ? result.branch : null,
    reason: result.status === "reject" ? result.reason : null,
    algorithm_version: result.status === "ok" ? result.algorithm_version : "fpd-v0",
    locked_at: new Date().toISOString(),
  };
  store.forecasts.set(id, locked);
  if (result.status === "ok") {
    return { ...result, forecast_id: id };
  }
  return { ...result, algorithm_version: "fpd-v0", forecast_id: id };
}
