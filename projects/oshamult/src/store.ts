import { randomUUID } from "node:crypto";
import {
  penalty,
  type PenaltyInput,
  type PenaltyResult,
  type PenaltyStep,
} from "./domain/penalty.js";

export type OrgRole = "analyst" | "auditor" | "admin";

type User = { id: string; email: string; password: string };
type Org = { id: string; name: string; created_by: string };
type Citation = {
  id: string;
  org_id: string;
  classification: string;
  gravity_tier: string;
  gbp_amount: number;
  size_pct: number;
  history_pct: number;
  good_faith_pct: number;
  quick_fix_pct: number;
  use_statutory_max: boolean;
  additive_cheat: boolean;
  created_at: string;
};

export type AuditEvent = {
  id: string;
  org_id: string;
  citation_id: string;
  actor_id: string | null;
  action: string;
  status: string;
  penalty: number | null;
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
  citations: Map<string, Citation>;
  auditEvents: AuditEvent[];
  orgSettings: Map<string, OrgSettings>;
  webhookDeliveries: Map<string, { org_id: string; citation_id: string }>;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

function memberKey(orgId: string, userId: string): string {
  return `${orgId}::${userId}`;
}

function defaultSettings(orgId: string): OrgSettings {
  return {
    orgId,
    webhook_secret: `whsec_${randomUUID().replace(/-/g, "").slice(0, 24)}`,
    tokens_note: "Bearer tokens issued at register; rotate via admin settings.",
    updated_at: new Date().toISOString(),
  };
}

export function createStore(opts: { rateLimit?: number } = {}): Store {
  return {
    users: new Map(),
    usersByEmail: new Map(),
    tokens: new Map(),
    orgs: new Map(),
    members: new Map(),
    citations: new Map(),
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
  store.orgSettings.set(id, defaultSettings(id));
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

export type CitationCreate = PenaltyInput & {
  classification: string;
  gravity_tier: string;
  gbp_amount: number;
  size_pct: number;
  history_pct: number;
  good_faith_pct: number;
  quick_fix_pct: number;
};

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

export function createCitation(
  store: Store,
  orgId: string,
  input: CitationCreate,
  actorId?: string | null,
) {
  const id = randomUUID();
  const citation: Citation = {
    id,
    org_id: orgId,
    classification: input.classification,
    gravity_tier: input.gravity_tier,
    gbp_amount: input.gbp_amount,
    size_pct: input.size_pct,
    history_pct: input.history_pct,
    good_faith_pct: input.good_faith_pct,
    quick_fix_pct: input.quick_fix_pct,
    use_statutory_max: input.use_statutory_max === true,
    additive_cheat: input.additive_cheat === true,
    created_at: new Date().toISOString(),
  };
  store.citations.set(id, citation);
  appendAudit(store, {
    org_id: orgId,
    citation_id: id,
    actor_id: actorId ?? null,
    action: "citation_create",
    status: "ok",
    penalty: null,
    reason: null,
    algorithm_version: null,
  });
  return getCitation(store, orgId, id);
}

export function getCitation(store: Store, orgId: string, id: string) {
  const citation = store.citations.get(id);
  if (!citation || citation.org_id !== orgId) return undefined;
  const { created_at: _c, ...rest } = citation;
  return rest;
}

export function listCitations(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number } = {},
) {
  const all = [...store.citations.values()]
    .filter((c) => c.org_id === orgId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    citations: all.slice(offset, offset + limit).map((c) => {
      const { created_at: _c, ...rest } = c;
      return rest;
    }),
    total,
    limit,
    offset,
  };
}

export function runForecast(
  store: Store,
  orgId: string,
  citationId: string,
  actorId?: string | null,
): (PenaltyResult & { citation_id: string; run_id?: string }) | null {
  const citation = getCitation(store, orgId, citationId);
  if (!citation) return null;
  const { id: _id, org_id: _org, ...input } = citation;
  const result = penalty(input);
  if (result.status === "ok") {
    const ev = appendAudit(store, {
      org_id: orgId,
      citation_id: citationId,
      actor_id: actorId ?? null,
      action: "forecast_lock",
      status: "ok",
      penalty: result.penalty,
      reason: null,
      algorithm_version: result.algorithm_version,
    });
    return { ...result, citation_id: citationId, run_id: ev.id };
  }
  const ev = appendAudit(store, {
    org_id: orgId,
    citation_id: citationId,
    actor_id: actorId ?? null,
    action: "forecast_reject",
    status: "reject",
    penalty: null,
    reason: result.reason,
    algorithm_version: null,
  });
  return { ...result, citation_id: citationId, run_id: ev.id };
}

export type BatchForecastItem = {
  citation_id: string;
  status: "ok" | "reject";
  penalty?: number;
  reason?: string;
  run_id?: string;
  steps?: PenaltyStep[];
};

export function runBatchForecast(
  store: Store,
  orgId: string,
  citationIds: string[],
  actorId?: string | null,
): { results: BatchForecastItem[] } {
  const results: BatchForecastItem[] = [];
  for (const citationId of citationIds) {
    try {
      const outcome = runForecast(store, orgId, citationId, actorId);
      if (!outcome) {
        results.push({ citation_id: citationId, status: "reject", reason: "not_found" });
        continue;
      }
      if (outcome.status === "ok") {
        results.push({
          citation_id: citationId,
          status: "ok",
          penalty: outcome.penalty,
          run_id: outcome.run_id,
          steps: outcome.steps,
        });
      } else {
        results.push({
          citation_id: citationId,
          status: "reject",
          reason: outcome.reason,
          run_id: outcome.run_id,
        });
      }
    } catch (err) {
      results.push({
        citation_id: citationId,
        status: "reject",
        reason: err instanceof Error ? err.message : "batch_error",
      });
    }
  }
  return { results };
}

export type AuditListOpts = {
  citationId?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

export function listAudit(
  store: Store,
  orgId: string,
  opts: AuditListOpts = {},
): { events: AuditEvent[]; total: number; limit: number; offset: number } {
  let rows = store.auditEvents.filter((e) => e.org_id === orgId);
  if (opts.citationId) {
    rows = rows.filter((e) => e.citation_id === opts.citationId);
  }
  if (opts.status) {
    rows = rows.filter((e) => e.status === opts.status);
  }
  rows = [...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = rows.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    events: rows.slice(offset, offset + limit),
    total,
    limit,
    offset,
  };
}

export function auditToCsv(events: AuditEvent[]): string {
  const header = [
    "id",
    "citation_id",
    "action",
    "status",
    "penalty",
    "reason",
    "algorithm_version",
    "actor_id",
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
        ev.citation_id,
        ev.action,
        ev.status,
        ev.penalty,
        ev.reason,
        ev.algorithm_version,
        ev.actor_id,
        ev.created_at,
      ]
        .map(escape)
        .join(","),
    );
  }
  return lines.join("\n");
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

export function patchCitation(
  store: Store,
  orgId: string,
  citationId: string,
  patch: Partial<CitationCreate>,
  actorId?: string | null,
) {
  const existing = store.citations.get(citationId);
  if (!existing || existing.org_id !== orgId) return null;
  const next: Citation = {
    ...existing,
    classification: patch.classification ?? existing.classification,
    gravity_tier: patch.gravity_tier ?? existing.gravity_tier,
    gbp_amount: patch.gbp_amount ?? existing.gbp_amount,
    size_pct: patch.size_pct ?? existing.size_pct,
    history_pct: patch.history_pct ?? existing.history_pct,
    good_faith_pct: patch.good_faith_pct ?? existing.good_faith_pct,
    quick_fix_pct: patch.quick_fix_pct ?? existing.quick_fix_pct,
    use_statutory_max:
      patch.use_statutory_max !== undefined
        ? patch.use_statutory_max
        : existing.use_statutory_max,
    additive_cheat:
      patch.additive_cheat !== undefined ? patch.additive_cheat : existing.additive_cheat,
  };
  store.citations.set(citationId, next);
  appendAudit(store, {
    org_id: orgId,
    citation_id: citationId,
    actor_id: actorId ?? null,
    action: "citation_patch",
    status: "ok",
    penalty: null,
    reason: null,
    algorithm_version: null,
  });
  return getCitation(store, orgId, citationId);
}

export function getOrgSettings(store: Store, orgId: string): OrgSettings | null {
  if (!getOrg(store, orgId)) return null;
  let settings = store.orgSettings.get(orgId);
  if (!settings) {
    settings = defaultSettings(orgId);
    store.orgSettings.set(orgId, settings);
  }
  return {
    ...settings,
  };
}

export function patchOrgSettings(
  store: Store,
  orgId: string,
  patch: { webhook_secret?: string; tokens_note?: string },
): { ok: true; value: OrgSettings } | { ok: false; error: string } {
  const current = getOrgSettings(store, orgId);
  if (!current) return { ok: false, error: "org_not_found" };
  const next: OrgSettings = {
    orgId,
    webhook_secret:
      patch.webhook_secret !== undefined ? patch.webhook_secret : current.webhook_secret,
    tokens_note: patch.tokens_note !== undefined ? patch.tokens_note : current.tokens_note,
    updated_at: new Date().toISOString(),
  };
  store.orgSettings.set(orgId, next);
  return { ok: true, value: next };
}

export function rotateWebhookSecret(
  store: Store,
  orgId: string,
): { ok: true; value: OrgSettings } | { ok: false; error: string } {
  return patchOrgSettings(store, orgId, {
    webhook_secret: `whsec_${randomUUID().replace(/-/g, "").slice(0, 24)}`,
  });
}

export function ingestWebhookCitation(
  store: Store,
  orgId: string,
  input: CitationCreate,
  idempotencyKey: string,
): { citation: ReturnType<typeof getCitation>; replay: boolean } | { error: string } {
  if (!getOrg(store, orgId)) return { error: "org_not_found" };
  const existing = store.webhookDeliveries.get(idempotencyKey);
  if (existing) {
    if (existing.org_id !== orgId) return { error: "idempotency_org_mismatch" };
    return {
      citation: getCitation(store, orgId, existing.citation_id),
      replay: true,
    };
  }
  const citation = createCitation(store, orgId, input, null);
  if (!citation) return { error: "create_failed" };
  store.webhookDeliveries.set(idempotencyKey, {
    org_id: orgId,
    citation_id: citation.id,
  });
  return { citation, replay: false };
}
