import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type AccountRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import { billTariff, type BillInput } from "./bill.js";
import { canTransition, type BillState } from "./rules.js";

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

type WriteResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

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

export function createAccount(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO accounts (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO account_members (account_id, user_id, role) VALUES (?, ?, 'analyst')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, accountId: string, userId: string, role: AccountRole) {
  db.prepare(
    `INSERT INTO account_members (account_id, user_id, role) VALUES (?, ?, ?)
     ON CONFLICT(account_id, user_id) DO UPDATE SET role = excluded.role`,
  ).run(accountId, userId, role);
}

export function getRole(db: DatabaseSync, accountId: string, userId: string): AccountRole | null {
  const row = db
    .prepare("SELECT role FROM account_members WHERE account_id = ? AND user_id = ?")
    .get(accountId, userId) as { role: AccountRole } | undefined;
  return row?.role ?? null;
}

export function getAccount(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM accounts WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  accountId: string,
  userId: string,
  mode: "read" | "write" | "post" | "notify",
): AccountRole | null {
  const role = getRole(db, accountId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && role === "analyst") return role;
  if (mode === "post" && (role === "poster" || role === "ops_admin")) return role;
  if (mode === "notify" && role === "ops_admin") return role;
  return null;
}

export function createBill(
  db: DatabaseSync,
  accountId: string,
  input: BillInput,
): WriteResult<Record<string, unknown>> {
  const result = billTariff(input);
  const id = randomUUID();
  db.prepare(
    `INSERT INTO bills (
      id, account_id, total_kwh, current_peak_kw, prior_peak_kw, ratchet_pct, demand_rate, blocks,
      energy_charge, billing_demand_kw, demand_charge, total_charge, ok, reason, state, version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 1)`,
  ).run(
    id,
    accountId,
    input.total_kwh,
    input.current_peak_kw,
    input.prior_peak_kw,
    input.ratchet_pct,
    input.demand_rate,
    JSON.stringify(input.blocks),
    result.ok ? result.energy_charge : null,
    result.ok ? result.billing_demand_kw : null,
    result.ok ? result.demand_charge : null,
    result.ok ? result.total_charge : null,
    result.ok ? 1 : 0,
    result.ok ? null : result.reason,
  );
  return {
    ok: true,
    value: {
      id,
      ok: result.ok,
      reason: result.ok ? null : result.reason,
      energy_charge: result.ok ? result.energy_charge : null,
      billing_demand_kw: result.ok ? result.billing_demand_kw : null,
      demand_charge: result.ok ? result.demand_charge : null,
      total_charge: result.ok ? result.total_charge : null,
      state: "draft",
      version: 1,
    },
  };
}

export function getBill(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, account_id AS accountId, ok, state, version, reason, total_charge AS totalCharge
       FROM bills WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        accountId: string;
        ok: number;
        state: BillState;
        version: number;
        reason: string | null;
        totalCharge: number | null;
      }
    | undefined;
}

export function listBills(db: DatabaseSync, accountId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, total_kwh AS totalKwh, total_charge AS totalCharge, ok, state, reason
       FROM bills WHERE account_id = ?
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(accountId, limit, offset) as Array<{
    id: string;
    totalKwh: number;
    totalCharge: number | null;
    ok: number;
    state: string;
    reason: string | null;
  }>;
}

export function countBills(db: DatabaseSync, accountId: string): number {
  const row = db.prepare("SELECT COUNT(*) AS n FROM bills WHERE account_id = ?").get(accountId) as {
    n: number;
  };
  return Number(row.n);
}

export function listExceptions(db: DatabaseSync, accountId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, total_kwh AS totalKwh, total_charge AS totalCharge, reason, ok
       FROM bills WHERE account_id = ? AND ok = 0
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(accountId, limit, offset) as Array<{
    id: string;
    totalKwh: number;
    totalCharge: number | null;
    reason: string | null;
    ok: number;
  }>;
}

export function countExceptions(db: DatabaseSync, accountId: string): number {
  const row = db
    .prepare(`SELECT COUNT(*) AS n FROM bills WHERE account_id = ? AND ok = 0`)
    .get(accountId) as { n: number };
  return Number(row.n);
}

export function transitionBill(
  db: DatabaseSync,
  billId: string,
  actorId: string,
  to: BillState,
  expectedVersion: number,
): WriteResult<{ id: string; version: number; state: BillState }> {
  const row = getBill(db, billId);
  if (!row) return { ok: false, status: 404, error: "not found" };
  if (row.version !== expectedVersion) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  if (!canTransition(row.state, to)) {
    return { ok: false, status: 400, error: "illegal transition" };
  }
  if (to === "posted" && !row.ok) {
    return { ok: false, status: 400, error: "cannot post rejected bill" };
  }
  const updated = db
    .prepare("UPDATE bills SET state = ?, version = version + 1 WHERE id = ? AND version = ?")
    .run(to, billId, expectedVersion);
  if (Number(updated.changes) !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  db.prepare(
    `INSERT INTO bill_audit (id, bill_id, actor_id, from_state, to_state) VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), billId, actorId, row.state, to);
  return { ok: true, value: { id: billId, version: expectedVersion + 1, state: to } };
}

export function listBillAudit(db: DatabaseSync, billId: string) {
  return db
    .prepare(
      `SELECT from_state AS fromState, to_state AS toState, actor_id AS actorId, at
       FROM bill_audit WHERE bill_id = ? ORDER BY at`,
    )
    .all(billId);
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  accountId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, account_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, accountId, JSON.stringify(payload));
}
