import { randomUUID } from "node:crypto";
import { excise, type ExciseInput, type ExciseResult } from "./domain/excise.js";

export type OrgRole = "analyst" | "auditor" | "admin";

type User = { id: string; email: string; password: string };
type Org = { id: string; name: string; created_by: string };

export type Transaction = {
  id: string;
  org_id: string;
  label: string;
  amount_involved: number;
  year_parts: number;
  corrected: boolean;
  fmv_a?: number;
  fmv_b?: number;
  use_fmv_greater_of: boolean;
  understate_amount: boolean;
  flat_excise_cheat: boolean;
  dual_approver_cheat: boolean;
  skip_additional_tax: boolean;
  created_at: string;
};

export type AuditEvent = {
  id: string;
  org_id: string;
  transaction_id: string;
  actor_id: string | null;
  action: string;
  status: string;
  initial_tax: number | null;
  additional_tax: number | null;
  total: number | null;
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
  transactions: Map<string, Transaction>;
  auditEvents: AuditEvent[];
  orgSettings: Map<string, OrgSettings>;
  webhookDeliveries: Map<string, { org_id: string; transaction_id: string }>;
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
    transactions: new Map(),
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

export type TransactionCreate = ExciseInput & { label?: string };

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

export function createTransaction(
  store: Store,
  orgId: string,
  input: TransactionCreate,
  actorId?: string | null,
) {
  const id = randomUUID();
  const tx: Transaction = {
    id,
    org_id: orgId,
    label: input.label ?? "PT forecast",
    amount_involved: Number(input.amount_involved ?? 0),
    year_parts: Number(input.year_parts ?? 0),
    corrected: input.corrected === true,
    fmv_a: typeof input.fmv_a === "number" ? input.fmv_a : undefined,
    fmv_b: typeof input.fmv_b === "number" ? input.fmv_b : undefined,
    use_fmv_greater_of: input.use_fmv_greater_of === true,
    understate_amount: input.understate_amount === true,
    flat_excise_cheat: input.flat_excise_cheat === true,
    dual_approver_cheat: input.dual_approver_cheat === true,
    skip_additional_tax: input.skip_additional_tax === true,
    created_at: new Date().toISOString(),
  };
  store.transactions.set(id, tx);
  appendAudit(store, {
    org_id: orgId,
    transaction_id: id,
    actor_id: actorId ?? null,
    action: "transaction_create",
    status: "ok",
    initial_tax: null,
    additional_tax: null,
    total: null,
    reason: null,
    algorithm_version: null,
  });
  return getTransaction(store, orgId, id);
}

export function getTransaction(store: Store, orgId: string, id: string) {
  const tx = store.transactions.get(id);
  if (!tx || tx.org_id !== orgId) return undefined;
  const { created_at: _c, ...rest } = tx;
  return rest;
}

export function listTransactions(
  store: Store,
  orgId: string,
  opts: { limit?: number; offset?: number } = {},
) {
  const all = [...store.transactions.values()]
    .filter((t) => t.org_id === orgId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  const total = all.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  return {
    transactions: all.slice(offset, offset + limit).map((t) => {
      const { created_at: _c, ...rest } = t;
      return rest;
    }),
    total,
    limit,
    offset,
  };
}

function toExciseInput(tx: ReturnType<typeof getTransaction>): ExciseInput | null {
  if (!tx) return null;
  return {
    amount_involved: tx.amount_involved,
    year_parts: tx.year_parts,
    corrected: tx.corrected,
    fmv_a: tx.fmv_a,
    fmv_b: tx.fmv_b,
    use_fmv_greater_of: tx.use_fmv_greater_of,
    understate_amount: tx.understate_amount,
    flat_excise_cheat: tx.flat_excise_cheat,
    dual_approver_cheat: tx.dual_approver_cheat,
    skip_additional_tax: tx.skip_additional_tax,
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

export function patchTransaction(
  store: Store,
  orgId: string,
  transactionId: string,
  patch: Partial<TransactionCreate>,
  actorId?: string | null,
) {
  const existing = store.transactions.get(transactionId);
  if (!existing || existing.org_id !== orgId) return null;
  const next: Transaction = {
    ...existing,
    label: patch.label ?? existing.label,
    amount_involved:
      patch.amount_involved !== undefined
        ? Number(patch.amount_involved)
        : existing.amount_involved,
    year_parts:
      patch.year_parts !== undefined ? Number(patch.year_parts) : existing.year_parts,
    corrected:
      patch.corrected !== undefined ? patch.corrected === true : existing.corrected,
    fmv_a: patch.fmv_a !== undefined ? Number(patch.fmv_a) : existing.fmv_a,
    fmv_b: patch.fmv_b !== undefined ? Number(patch.fmv_b) : existing.fmv_b,
    use_fmv_greater_of:
      patch.use_fmv_greater_of !== undefined
        ? patch.use_fmv_greater_of === true
        : existing.use_fmv_greater_of,
    understate_amount:
      patch.understate_amount !== undefined
        ? patch.understate_amount === true
        : existing.understate_amount,
    flat_excise_cheat:
      patch.flat_excise_cheat !== undefined
        ? patch.flat_excise_cheat === true
        : existing.flat_excise_cheat,
    dual_approver_cheat:
      patch.dual_approver_cheat !== undefined
        ? patch.dual_approver_cheat === true
        : existing.dual_approver_cheat,
    skip_additional_tax:
      patch.skip_additional_tax !== undefined
        ? patch.skip_additional_tax === true
        : existing.skip_additional_tax,
  };
  store.transactions.set(transactionId, next);
  appendAudit(store, {
    org_id: orgId,
    transaction_id: transactionId,
    actor_id: actorId ?? null,
    action: "transaction_patch",
    status: "ok",
    initial_tax: null,
    additional_tax: null,
    total: null,
    reason: null,
    algorithm_version: null,
  });
  return getTransaction(store, orgId, transactionId);
}

export function runForecast(
  store: Store,
  orgId: string,
  transactionId: string,
  actorId?: string | null,
): (ExciseResult & { transaction_id: string; run_id?: string }) | null {
  const tx = getTransaction(store, orgId, transactionId);
  const input = toExciseInput(tx);
  if (!input) return null;
  const result = excise(input);
  if (result.status === "ok") {
    const ev = appendAudit(store, {
      org_id: orgId,
      transaction_id: transactionId,
      actor_id: actorId ?? null,
      action: "forecast_lock",
      status: "ok",
      initial_tax: result.initial_tax,
      additional_tax: result.additional_tax,
      total: result.total,
      reason: null,
      algorithm_version: result.algorithm_version,
    });
    return { ...result, transaction_id: transactionId, run_id: ev.id };
  }
  const ev = appendAudit(store, {
    org_id: orgId,
    transaction_id: transactionId,
    actor_id: actorId ?? null,
    action: "forecast_reject",
    status: "reject",
    initial_tax: null,
    additional_tax: null,
    total: null,
    reason: result.reason,
    algorithm_version: null,
  });
  return { ...result, transaction_id: transactionId, run_id: ev.id };
}

export type BatchForecastItem = {
  transaction_id: string;
  status: "ok" | "reject";
  initial_tax?: number;
  additional_tax?: number;
  total?: number;
  reason?: string;
  run_id?: string;
};

export function runBatchForecast(
  store: Store,
  orgId: string,
  transactionIds: string[],
  actorId?: string | null,
): { results: BatchForecastItem[] } {
  const results: BatchForecastItem[] = [];
  for (const transactionId of transactionIds) {
    try {
      const outcome = runForecast(store, orgId, transactionId, actorId);
      if (!outcome) {
        results.push({
          transaction_id: transactionId,
          status: "reject",
          reason: "not_found",
        });
        continue;
      }
      if (outcome.status === "ok") {
        results.push({
          transaction_id: transactionId,
          status: "ok",
          initial_tax: outcome.initial_tax,
          additional_tax: outcome.additional_tax,
          total: outcome.total,
          run_id: outcome.run_id,
        });
      } else {
        results.push({
          transaction_id: transactionId,
          status: "reject",
          reason: outcome.reason,
          run_id: outcome.run_id,
        });
      }
    } catch (err) {
      results.push({
        transaction_id: transactionId,
        status: "reject",
        reason: err instanceof Error ? err.message : "batch_error",
      });
    }
  }
  return { results };
}

export type AuditListOpts = {
  transactionId?: string;
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
  if (opts.transactionId) {
    rows = rows.filter((e) => e.transaction_id === opts.transactionId);
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
    "transaction_id",
    "action",
    "status",
    "initial_tax",
    "additional_tax",
    "total",
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
        ev.transaction_id,
        ev.action,
        ev.status,
        ev.initial_tax,
        ev.additional_tax,
        ev.total,
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

export function getOrgSettings(store: Store, orgId: string): OrgSettings | null {
  if (!getOrg(store, orgId)) return null;
  let settings = store.orgSettings.get(orgId);
  if (!settings) {
    settings = defaultSettings(orgId);
    store.orgSettings.set(orgId, settings);
  }
  return { ...settings };
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

export function ingestWebhookTransaction(
  store: Store,
  orgId: string,
  input: TransactionCreate,
  idempotencyKey: string,
): { transaction: ReturnType<typeof getTransaction>; replay: boolean } | { error: string } {
  if (!getOrg(store, orgId)) return { error: "org_not_found" };
  const existing = store.webhookDeliveries.get(idempotencyKey);
  if (existing) {
    if (existing.org_id !== orgId) return { error: "idempotency_org_mismatch" };
    return {
      transaction: getTransaction(store, orgId, existing.transaction_id),
      replay: true,
    };
  }
  const transaction = createTransaction(store, orgId, input, null);
  if (!transaction) return { error: "create_failed" };
  store.webhookDeliveries.set(idempotencyKey, {
    org_id: orgId,
    transaction_id: transaction.id,
  });
  return { transaction, replay: false };
}
