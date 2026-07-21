import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type AccountRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import { settleInterval, type SettleInput } from "./settle.js";
import { canTransition, type IntervalState } from "./rules.js";

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
  if (mode === "post" && (role === "settler" || role === "ops_admin")) return role;
  if (mode === "notify" && role === "ops_admin") return role;
  return null;
}

export function createInterval(
  db: DatabaseSync,
  accountId: string,
  input: SettleInput,
): WriteResult<Record<string, unknown>> {
  const result = settleInterval(input);
  const id = randomUUID();
  const intervalStart = input.interval_start ?? input.meter_interval_start ?? "";
  db.prepare(
    `INSERT INTO intervals (
      id, account_id, interval_start, meter_kwh, schedule_kwh, delivery_factor, imbalance_price,
      adjusted_kwh, imbalance_kwh, charge, ok, reason, state, version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 1)`,
  ).run(
    id,
    accountId,
    intervalStart,
    input.meter_kwh,
    input.schedule_kwh,
    input.delivery_factor,
    input.imbalance_price,
    result.ok ? result.adjusted_kwh : null,
    result.ok ? result.imbalance_kwh : null,
    result.ok ? result.charge : null,
    result.ok ? 1 : 0,
    result.ok ? null : result.reason,
  );
  return {
    ok: true,
    value: {
      id,
      ok: result.ok,
      reason: result.ok ? null : result.reason,
      adjusted_kwh: result.ok ? result.adjusted_kwh : null,
      imbalance_kwh: result.ok ? result.imbalance_kwh : null,
      charge: result.ok ? result.charge : null,
      state: "draft",
      version: 1,
    },
  };
}

export function getInterval(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, account_id AS accountId, ok, state, version, reason, imbalance_kwh AS imbalanceKwh
       FROM intervals WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        accountId: string;
        ok: number;
        state: IntervalState;
        version: number;
        reason: string | null;
        imbalanceKwh: number | null;
      }
    | undefined;
}

export function listIntervals(db: DatabaseSync, accountId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, interval_start AS intervalStart, imbalance_kwh AS imbalanceKwh, charge, ok, state
       FROM intervals WHERE account_id = ?
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(accountId, limit, offset) as Array<{
    id: string;
    intervalStart: string;
    imbalanceKwh: number | null;
    charge: number | null;
    ok: number;
    state: string;
  }>;
}

export function countIntervals(db: DatabaseSync, accountId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM intervals WHERE account_id = ?")
    .get(accountId) as { n: number };
  return Number(row.n);
}

export function listExceptions(db: DatabaseSync, accountId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, interval_start AS intervalStart, imbalance_kwh AS imbalanceKwh, charge, reason, ok
       FROM intervals
       WHERE account_id = ? AND (ok = 0 OR imbalance_kwh IS NULL OR imbalance_kwh != 0)
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(accountId, limit, offset) as Array<{
    id: string;
    intervalStart: string;
    imbalanceKwh: number | null;
    charge: number | null;
    reason: string | null;
    ok: number;
  }>;
}

export function countExceptions(db: DatabaseSync, accountId: string): number {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS n FROM intervals
       WHERE account_id = ? AND (ok = 0 OR imbalance_kwh IS NULL OR imbalance_kwh != 0)`,
    )
    .get(accountId) as { n: number };
  return Number(row.n);
}

export function transitionInterval(
  db: DatabaseSync,
  intervalId: string,
  actorId: string,
  to: IntervalState,
  expectedVersion: number,
): WriteResult<{ id: string; version: number; state: IntervalState }> {
  const row = getInterval(db, intervalId);
  if (!row) return { ok: false, status: 404, error: "not found" };
  if (row.version !== expectedVersion) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  if (!canTransition(row.state, to)) {
    return { ok: false, status: 400, error: "illegal transition" };
  }
  if (to === "posted" && !row.ok) {
    return { ok: false, status: 400, error: "cannot post rejected interval" };
  }
  const updated = db
    .prepare(
      "UPDATE intervals SET state = ?, version = version + 1 WHERE id = ? AND version = ?",
    )
    .run(to, intervalId, expectedVersion);
  if (Number(updated.changes) !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  db.prepare(
    `INSERT INTO interval_audit (id, interval_id, actor_id, from_state, to_state) VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), intervalId, actorId, row.state, to);
  return { ok: true, value: { id: intervalId, version: expectedVersion + 1, state: to } };
}

export function listIntervalAudit(db: DatabaseSync, intervalId: string) {
  return db
    .prepare(
      `SELECT id, actor_id AS actorId, from_state AS fromState, to_state AS toState, at
       FROM interval_audit WHERE interval_id = ? ORDER BY at`,
    )
    .all(intervalId) as Array<{
    id: string;
    actorId: string;
    fromState: string;
    toState: string;
    at: string;
  }>;
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  accountId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    "INSERT INTO webhook_deliveries (id, event, account_id, payload) VALUES (?, ?, ?, ?)",
  ).run(randomUUID(), event, accountId, JSON.stringify(payload));
}
