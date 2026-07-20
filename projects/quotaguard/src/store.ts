import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type OrgRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canRelease,
  canTransition,
  dualReleaseReady,
  fitsCeiling,
  type ChargeState,
} from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

export function createStore(
  opts: {
    dbPath?: string;
    dep?: DepClient;
    webhookSecret?: string;
    rateLimit?: number;
  } = {},
): Store {
  return {
    db: openDatabase(opts.dbPath ?? ":memory:"),
    dep: opts.dep ?? createMockDep(),
    webhookSecret: opts.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: opts.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(db: DatabaseSync, email: string, password: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(id, email, password);
  return { id, email };
}

export function findUserByEmail(db: DatabaseSync, email: string) {
  return db.prepare("SELECT id, email, password FROM users WHERE email = ?").get(email) as
    | { id: string; email: string; password: string }
    | undefined;
}

export function issueToken(db: DatabaseSync, userId: string): string {
  const token = randomUUID();
  db.prepare("INSERT INTO tokens (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

export function resolveToken(db: DatabaseSync, token: string): string | null {
  const row = db.prepare("SELECT user_id FROM tokens WHERE token = ?").get(token) as
    | { user_id: string }
    | undefined;
  return row?.user_id ?? null;
}

export function createOrg(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO orgs (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(`INSERT INTO org_members (org_id, user_id, role) VALUES (?, ?, 'finance')`).run(
    id,
    userId,
  );
  return { id, name };
}

export function addMember(db: DatabaseSync, orgId: string, userId: string, role: OrgRole) {
  db.prepare("INSERT INTO org_members (org_id, user_id, role) VALUES (?, ?, ?)").run(
    orgId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, orgId: string, userId: string): OrgRole | null {
  const row = db
    .prepare("SELECT role FROM org_members WHERE org_id = ? AND user_id = ?")
    .get(orgId, userId) as { role: OrgRole } | undefined;
  return row?.role ?? null;
}

export function getOrg(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM orgs WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  orgId: string,
  userId: string,
  mode: "read" | "write" | "own" | "release",
): OrgRole | null {
  const role = getRole(db, orgId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "finance" || role === "analyst")) return role;
  if (mode === "own" && role === "finance") return role;
  if (mode === "release" && canRelease(role)) return role;
  return null;
}

export type Quota = {
  id: string;
  orgId: string;
  label: string;
  ceiling: number;
  outstanding: number;
};

function outstandingCharges(db: DatabaseSync, quotaId: string): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS s FROM charges
       WHERE quota_id = ? AND state IN ('requested', 'held')`,
    )
    .get(quotaId) as { s: number };
  return row.s;
}

export function getQuota(db: DatabaseSync, id: string): Quota | undefined {
  const row = db
    .prepare(`SELECT id, org_id AS orgId, label, ceiling FROM quotas WHERE id = ?`)
    .get(id) as { id: string; orgId: string; label: string; ceiling: number } | undefined;
  if (!row) return undefined;
  return { ...row, outstanding: outstandingCharges(db, id) };
}

export function createQuota(
  db: DatabaseSync,
  orgId: string,
  label: string,
  ceiling: number,
): { ok: true; quota: Quota } | { ok: false; error: string } {
  if (!(ceiling > 0)) return { ok: false, error: "ceiling must be positive" };
  const id = randomUUID();
  db.prepare(`INSERT INTO quotas (id, org_id, label, ceiling) VALUES (?, ?, ?, ?)`).run(
    id,
    orgId,
    label,
    ceiling,
  );
  return { ok: true, quota: getQuota(db, id)! };
}

export function listQuotas(db: DatabaseSync, orgId: string, limit: number, offset: number) {
  const rows = db
    .prepare(`SELECT id FROM quotas WHERE org_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`)
    .all(orgId, limit, offset) as { id: string }[];
  return rows.map((r) => getQuota(db, r.id)!);
}

export type Charge = {
  id: string;
  quotaId: string;
  title: string;
  amount: number;
  state: ChargeState;
  version: number;
  releaseCount: number;
};

function releaseCount(db: DatabaseSync, chargeId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM charge_releases WHERE charge_id = ?")
    .get(chargeId) as { c: number };
  return row.c;
}

export function getCharge(db: DatabaseSync, id: string): Charge | undefined {
  const row = db
    .prepare(
      `SELECT id, quota_id AS quotaId, title, amount, state, version FROM charges WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        quotaId: string;
        title: string;
        amount: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    quotaId: row.quotaId,
    title: row.title,
    amount: row.amount,
    state: row.state as ChargeState,
    version: row.version,
    releaseCount: releaseCount(db, id),
  };
}

export function createCharge(
  db: DatabaseSync,
  quotaId: string,
  title: string,
  amount: number,
): { ok: true; charge: Charge } | { ok: false; error: string } {
  const quota = getQuota(db, quotaId);
  if (!quota) return { ok: false, error: "quota not found" };
  if (!fitsCeiling(amount, quota.ceiling, quota.outstanding)) {
    return { ok: false, error: "charge would exceed quota ceiling" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO charges (id, quota_id, title, amount, state, version)
     VALUES (?, ?, ?, ?, 'requested', 1)`,
  ).run(id, quotaId, title, amount);
  return { ok: true, charge: getCharge(db, id)! };
}

export function addRelease(
  db: DatabaseSync,
  chargeId: string,
  financeId: string,
): { ok: true; releaseCount: number } | { ok: false; error: string; status: number } {
  const charge = getCharge(db, chargeId);
  if (!charge) return { ok: false, error: "not found", status: 404 };
  if (charge.state !== "held") {
    return { ok: false, error: "releases only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO charge_releases (id, charge_id, finance_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), chargeId, financeId);
  } catch {
    return { ok: false, error: "already released by this finance", status: 409 };
  }
  return { ok: true, releaseCount: releaseCount(db, chargeId) };
}

export function transitionCharge(
  db: DatabaseSync,
  chargeId: string,
  actorId: string,
  to: ChargeState,
  version: number,
): { ok: true; charge: Charge } | { ok: false; error: string; status: number } {
  const charge = getCharge(db, chargeId);
  if (!charge) return { ok: false, error: "not found", status: 404 };
  if (charge.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(charge.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "released" && !dualReleaseReady(charge.releaseCount)) {
    return { ok: false, error: "dual finance release required", status: 400 };
  }
  db.prepare("UPDATE charges SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    chargeId,
  );
  db.prepare(
    `INSERT INTO charge_audit (id, charge_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), chargeId, actorId, charge.state, to);
  return { ok: true, charge: getCharge(db, chargeId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  chargeId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, charge_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, chargeId, JSON.stringify(payload));
}

export function orgIdForCharge(db: DatabaseSync, chargeId: string): string | null {
  const charge = getCharge(db, chargeId);
  if (!charge) return null;
  return getQuota(db, charge.quotaId)?.orgId ?? null;
}
