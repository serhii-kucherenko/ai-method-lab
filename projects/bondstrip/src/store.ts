import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type DeskRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import { accrueBond, type AccrueInput } from "./accrue.js";
import { canTransition, type StripState } from "./rules.js";

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

export function createDesk(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO desks (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare("INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, 'analyst')").run(
    id,
    userId,
  );
  return { id, name };
}

export function addMember(db: DatabaseSync, deskId: string, userId: string, role: DeskRole) {
  db.prepare(
    `INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, ?)
     ON CONFLICT(desk_id, user_id) DO UPDATE SET role = excluded.role`,
  ).run(deskId, userId, role);
}

export function getRole(db: DatabaseSync, deskId: string, userId: string): DeskRole | null {
  const row = db
    .prepare("SELECT role FROM desk_members WHERE desk_id = ? AND user_id = ?")
    .get(deskId, userId) as { role: DeskRole } | undefined;
  return row?.role ?? null;
}

export function getDesk(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM desks WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  deskId: string,
  userId: string,
  mode: "read" | "write" | "confirm" | "notify",
): DeskRole | null {
  const role = getRole(db, deskId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && role === "analyst") return role;
  if (mode === "confirm" && (role === "trader" || role === "ops_admin")) return role;
  if (mode === "notify" && role === "ops_admin") return role;
  return null;
}

export function createStrip(
  db: DatabaseSync,
  deskId: string,
  input: AccrueInput,
): WriteResult<Record<string, unknown>> {
  const result = accrueBond(input);
  const id = randomUUID();
  db.prepare(
    `INSERT INTO strips (
      id, desk_id, day_count, face, coupon_rate, freq, prev_coupon, next_coupon, settle, maturity,
      coupon_dates, periodic_coupon, days_elapsed, days_in_period, accrued, cashflows, ok, reason, state, version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 1)`,
  ).run(
    id,
    deskId,
    input.day_count,
    input.face,
    input.coupon_rate,
    input.freq,
    input.prev_coupon,
    input.next_coupon,
    input.settle,
    input.maturity ?? null,
    input.coupon_dates ? JSON.stringify(input.coupon_dates) : null,
    result.ok ? result.periodic_coupon : null,
    result.ok ? result.days_elapsed : null,
    result.ok ? result.days_in_period : null,
    result.ok ? result.accrued : null,
    result.ok && result.cashflows ? JSON.stringify(result.cashflows) : null,
    result.ok ? 1 : 0,
    result.ok ? null : result.reason,
  );
  return {
    ok: true,
    value: {
      id,
      ok: result.ok,
      reason: result.ok ? null : result.reason,
      accrued: result.ok ? result.accrued : null,
      periodic_coupon: result.ok ? result.periodic_coupon : null,
      days_elapsed: result.ok ? result.days_elapsed : null,
      days_in_period: result.ok ? result.days_in_period : null,
      cashflows: result.ok ? (result.cashflows ?? null) : null,
      state: "draft",
      version: 1,
    },
  };
}

export function getStrip(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, desk_id AS deskId, ok, state, version, reason, accrued
       FROM strips WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        deskId: string;
        ok: number;
        state: StripState;
        version: number;
        reason: string | null;
        accrued: number | null;
      }
    | undefined;
}

export function listStrips(db: DatabaseSync, deskId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, settle, accrued, ok, state, reason
       FROM strips WHERE desk_id = ?
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(deskId, limit, offset) as Array<{
    id: string;
    settle: string;
    accrued: number | null;
    ok: number;
    state: string;
    reason: string | null;
  }>;
}

export function countStrips(db: DatabaseSync, deskId: string): number {
  const row = db.prepare("SELECT COUNT(*) AS n FROM strips WHERE desk_id = ?").get(deskId) as {
    n: number;
  };
  return Number(row.n);
}

export function listExceptions(db: DatabaseSync, deskId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, settle, accrued, reason, ok
       FROM strips WHERE desk_id = ? AND ok = 0
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(deskId, limit, offset) as Array<{
    id: string;
    settle: string;
    accrued: number | null;
    reason: string | null;
    ok: number;
  }>;
}

export function countExceptions(db: DatabaseSync, deskId: string): number {
  const row = db
    .prepare(`SELECT COUNT(*) AS n FROM strips WHERE desk_id = ? AND ok = 0`)
    .get(deskId) as { n: number };
  return Number(row.n);
}

export function transitionStrip(
  db: DatabaseSync,
  stripId: string,
  actorId: string,
  to: StripState,
  expectedVersion: number,
): WriteResult<{ id: string; version: number; state: StripState }> {
  const row = getStrip(db, stripId);
  if (!row) return { ok: false, status: 404, error: "not found" };
  if (row.version !== expectedVersion) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  if (!canTransition(row.state, to)) {
    return { ok: false, status: 400, error: "illegal transition" };
  }
  if (to === "confirmed" && !row.ok) {
    return { ok: false, status: 400, error: "cannot confirm rejected strip" };
  }
  const updated = db
    .prepare("UPDATE strips SET state = ?, version = version + 1 WHERE id = ? AND version = ?")
    .run(to, stripId, expectedVersion);
  if (Number(updated.changes) !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  db.prepare(
    `INSERT INTO strip_audit (id, strip_id, actor_id, from_state, to_state) VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), stripId, actorId, row.state, to);
  return { ok: true, value: { id: stripId, version: expectedVersion + 1, state: to } };
}

export function listStripAudit(db: DatabaseSync, stripId: string) {
  return db
    .prepare(
      `SELECT from_state AS fromState, to_state AS toState, actor_id AS actorId, at
       FROM strip_audit WHERE strip_id = ? ORDER BY at`,
    )
    .all(stripId);
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  deskId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, desk_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, deskId, JSON.stringify(payload));
}
