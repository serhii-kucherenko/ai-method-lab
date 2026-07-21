import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type FirmRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canRelease,
  canTransition,
  dualReleaseReady,
  fitsOverpay,
  overpayAmount,
  type ClawbackState,
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

export function createFirm(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO firms (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO firm_members (firm_id, user_id, role) VALUES (?, ?, 'hr_lead')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, firmId: string, userId: string, role: FirmRole) {
  db.prepare("INSERT INTO firm_members (firm_id, user_id, role) VALUES (?, ?, ?)").run(
    firmId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, firmId: string, userId: string): FirmRole | null {
  const row = db
    .prepare("SELECT role FROM firm_members WHERE firm_id = ? AND user_id = ?")
    .get(firmId, userId) as { role: FirmRole } | undefined;
  return row?.role ?? null;
}

export function getFirm(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM firms WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  firmId: string,
  userId: string,
  mode: "read" | "write" | "own" | "release",
): FirmRole | null {
  const role = getRole(db, firmId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "hr_lead" || role === "payroll")) return role;
  if (mode === "own" && role === "hr_lead") return role;
  if (mode === "release" && canRelease(role)) return role;
  return null;
}

export function createRun(
  db: DatabaseSync,
  firmId: string,
  label: string,
  owed: number,
  paid: number,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO payroll_runs (id, firm_id, label, owed, paid) VALUES (?, ?, ?, ?, ?)`,
  ).run(id, firmId, label, owed, paid);
  return {
    id,
    firmId,
    label,
    owed,
    paid,
    overpay: overpayAmount(owed, paid),
  };
}

export function listRuns(db: DatabaseSync, firmId: string, limit: number, offset: number) {
  return (
    db
      .prepare(
        `SELECT id, firm_id AS firmId, label, owed, paid
         FROM payroll_runs WHERE firm_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
      )
      .all(firmId, limit, offset) as {
      id: string;
      firmId: string;
      label: string;
      owed: number;
      paid: number;
    }[]
  ).map((r) => ({ ...r, overpay: overpayAmount(r.owed, r.paid) }));
}

export function getRun(db: DatabaseSync, id: string) {
  const row = db
    .prepare(
      `SELECT id, firm_id AS firmId, label, owed, paid FROM payroll_runs WHERE id = ?`,
    )
    .get(id) as
    | { id: string; firmId: string; label: string; owed: number; paid: number }
    | undefined;
  if (!row) return undefined;
  return { ...row, overpay: overpayAmount(row.owed, row.paid) };
}

function outstandingAmount(db: DatabaseSync, runId: string): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS s FROM clawbacks
       WHERE run_id = ? AND state IN ('requested', 'held')`,
    )
    .get(runId) as { s: number };
  return row.s;
}

export type Clawback = {
  id: string;
  runId: string;
  title: string;
  amount: number;
  state: ClawbackState;
  version: number;
  releaseCount: number;
};

function releaseCount(db: DatabaseSync, clawbackId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM clawback_releases WHERE clawback_id = ?")
    .get(clawbackId) as { c: number };
  return row.c;
}

export function getClawback(db: DatabaseSync, id: string): Clawback | undefined {
  const row = db
    .prepare(
      `SELECT id, run_id AS runId, title, amount, state, version FROM clawbacks WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        runId: string;
        title: string;
        amount: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    runId: row.runId,
    title: row.title,
    amount: row.amount,
    state: row.state as ClawbackState,
    version: row.version,
    releaseCount: releaseCount(db, id),
  };
}

export function createClawback(
  db: DatabaseSync,
  runId: string,
  title: string,
  amount: number,
): { ok: true; clawback: Clawback } | { ok: false; error: string } {
  const run = getRun(db, runId);
  if (!run) return { ok: false, error: "run not found" };
  const outstanding = outstandingAmount(db, runId);
  if (!fitsOverpay(amount, run.owed, run.paid, outstanding)) {
    return { ok: false, error: "clawback exceeds overpay headroom" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO clawbacks (id, run_id, title, amount, state, version)
     VALUES (?, ?, ?, ?, 'requested', 1)`,
  ).run(id, runId, title, amount);
  return { ok: true, clawback: getClawback(db, id)! };
}

export function addRelease(
  db: DatabaseSync,
  clawbackId: string,
  hrId: string,
): { ok: true; releaseCount: number } | { ok: false; error: string; status: number } {
  const clawback = getClawback(db, clawbackId);
  if (!clawback) return { ok: false, error: "not found", status: 404 };
  if (clawback.state !== "held") {
    return { ok: false, error: "releases only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO clawback_releases (id, clawback_id, hr_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), clawbackId, hrId);
  } catch {
    return { ok: false, error: "already released by this hr lead", status: 409 };
  }
  return { ok: true, releaseCount: releaseCount(db, clawbackId) };
}

export function transitionClawback(
  db: DatabaseSync,
  clawbackId: string,
  actorId: string,
  to: ClawbackState,
  version: number,
): { ok: true; clawback: Clawback } | { ok: false; error: string; status: number } {
  const clawback = getClawback(db, clawbackId);
  if (!clawback) return { ok: false, error: "not found", status: 404 };
  if (clawback.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(clawback.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "released" && !dualReleaseReady(clawback.releaseCount)) {
    return { ok: false, error: "dual hr release required", status: 400 };
  }
  db.prepare("UPDATE clawbacks SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    clawbackId,
  );
  db.prepare(
    `INSERT INTO clawback_audit (id, clawback_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), clawbackId, actorId, clawback.state, to);
  return { ok: true, clawback: getClawback(db, clawbackId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  clawbackId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, clawback_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, clawbackId, JSON.stringify(payload));
}

export function firmIdForClawback(db: DatabaseSync, clawbackId: string): string | null {
  const clawback = getClawback(db, clawbackId);
  if (!clawback) return null;
  return getRun(db, clawback.runId)?.firmId ?? null;
}
