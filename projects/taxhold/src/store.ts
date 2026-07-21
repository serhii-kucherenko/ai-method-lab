import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type DeskRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canApprove,
  canTransition,
  dualFileReady,
  isLate,
  type FilingState,
} from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
  nowIso: () => string;
};

export function createStore(
  opts: {
    dbPath?: string;
    dep?: DepClient;
    webhookSecret?: string;
    rateLimit?: number;
    nowIso?: () => string;
  } = {},
): Store {
  return {
    db: openDatabase(opts.dbPath ?? ":memory:"),
    dep: opts.dep ?? createMockDep(),
    webhookSecret: opts.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: opts.rateLimit ?? 1000,
    rateCounts: new Map(),
    nowIso: opts.nowIso ?? (() => new Date().toISOString()),
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

export function createDesk(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO desks (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    `INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, 'tax_officer')`,
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, deskId: string, userId: string, role: DeskRole) {
  db.prepare("INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, ?)").run(
    deskId,
    userId,
    role,
  );
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
  mode: "read" | "write" | "own" | "approve",
): DeskRole | null {
  const role = getRole(db, deskId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "tax_officer" || role === "clerk")) return role;
  if (mode === "own" && role === "tax_officer") return role;
  if (mode === "approve" && canApprove(role)) return role;
  return null;
}

export type Period = {
  id: string;
  deskId: string;
  label: string;
  dueAt: string;
  lateDays: number;
};

export function getPeriod(db: DatabaseSync, id: string): Period | undefined {
  return db
    .prepare(
      `SELECT id, desk_id AS deskId, label, due_at AS dueAt, late_days AS lateDays
       FROM periods WHERE id = ?`,
    )
    .get(id) as Period | undefined;
}

export function createPeriod(
  db: DatabaseSync,
  deskId: string,
  label: string,
  dueAt: string,
  lateDays: number,
): Period {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO periods (id, desk_id, label, due_at, late_days) VALUES (?, ?, ?, ?, ?)`,
  ).run(id, deskId, label, dueAt, lateDays);
  return getPeriod(db, id)!;
}

export function listPeriods(db: DatabaseSync, deskId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, desk_id AS deskId, label, due_at AS dueAt, late_days AS lateDays
       FROM periods WHERE desk_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
    )
    .all(deskId, limit, offset) as Period[];
}

export type Filing = {
  id: string;
  periodId: string;
  title: string;
  state: FilingState;
  version: number;
  approvalCount: number;
  late: boolean;
};

function approvalCount(db: DatabaseSync, filingId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM file_approvals WHERE filing_id = ?")
    .get(filingId) as { c: number };
  return row.c;
}

export function getFiling(db: DatabaseSync, id: string, nowIso: string): Filing | undefined {
  const row = db
    .prepare(
      `SELECT id, period_id AS periodId, title, state, version FROM filings WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        periodId: string;
        title: string;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  const period = getPeriod(db, row.periodId);
  const late = period ? isLate(period.dueAt, period.lateDays, nowIso) : false;
  return {
    id: row.id,
    periodId: row.periodId,
    title: row.title,
    state: row.state as FilingState,
    version: row.version,
    approvalCount: approvalCount(db, id),
    late,
  };
}

export function createFiling(
  db: DatabaseSync,
  periodId: string,
  title: string,
  nowIso: string,
): { ok: true; filing: Filing } | { ok: false; error: string } {
  if (!getPeriod(db, periodId)) return { ok: false, error: "period not found" };
  if (!title.trim()) return { ok: false, error: "title required" };
  const id = randomUUID();
  db.prepare(
    `INSERT INTO filings (id, period_id, title, state, version) VALUES (?, ?, ?, 'open', 1)`,
  ).run(id, periodId, title);
  return { ok: true, filing: getFiling(db, id, nowIso)! };
}

export function addApproval(
  db: DatabaseSync,
  filingId: string,
  officerId: string,
  nowIso: string,
): { ok: true; approvalCount: number } | { ok: false; error: string; status: number } {
  const filing = getFiling(db, filingId, nowIso);
  if (!filing) return { ok: false, error: "not found", status: 404 };
  if (filing.state !== "held") {
    return { ok: false, error: "approvals only while held", status: 400 };
  }
  if (!filing.late) {
    return { ok: false, error: "approvals only for late filings", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO file_approvals (id, filing_id, officer_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), filingId, officerId);
  } catch {
    return { ok: false, error: "already approved", status: 409 };
  }
  return { ok: true, approvalCount: approvalCount(db, filingId) };
}

export function transitionFiling(
  db: DatabaseSync,
  filingId: string,
  actorId: string,
  to: FilingState,
  version: number,
  nowIso: string,
): { ok: true; filing: Filing } | { ok: false; error: string; status: number } {
  const filing = getFiling(db, filingId, nowIso);
  if (!filing) return { ok: false, error: "not found", status: 404 };
  if (filing.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(filing.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "filed" && !dualFileReady(filing.approvalCount, filing.late)) {
    return { ok: false, error: "dual tax officer approval required for late filing", status: 400 };
  }
  db.prepare("UPDATE filings SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    filingId,
  );
  db.prepare(
    `INSERT INTO filing_audit (id, filing_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), filingId, actorId, filing.state, to);
  return { ok: true, filing: getFiling(db, filingId, nowIso)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  filingId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, filing_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, filingId, JSON.stringify(payload));
}

export function deskIdForFiling(db: DatabaseSync, filingId: string, nowIso: string): string | null {
  const filing = getFiling(db, filingId, nowIso);
  if (!filing) return null;
  return getPeriod(db, filing.periodId)?.deskId ?? null;
}
