import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type SiteRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canApprove,
  canTransition,
  dualCloseReady,
  isOvertime,
  type ShiftState,
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

export function createSite(
  db: DatabaseSync,
  userId: string,
  name: string,
  overtimeLimitHours = 8,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO sites (id, name, created_by, overtime_limit_hours) VALUES (?, ?, ?, ?)`,
  ).run(id, name, userId, overtimeLimitHours);
  db.prepare(
    `INSERT INTO site_members (site_id, user_id, role) VALUES (?, ?, 'supervisor')`,
  ).run(id, userId);
  return { id, name, overtimeLimitHours };
}

export function addMember(db: DatabaseSync, siteId: string, userId: string, role: SiteRole) {
  db.prepare("INSERT INTO site_members (site_id, user_id, role) VALUES (?, ?, ?)").run(
    siteId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, siteId: string, userId: string): SiteRole | null {
  const row = db
    .prepare("SELECT role FROM site_members WHERE site_id = ? AND user_id = ?")
    .get(siteId, userId) as { role: SiteRole } | undefined;
  return row?.role ?? null;
}

export function getSite(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, name, overtime_limit_hours AS overtimeLimitHours FROM sites WHERE id = ?`,
    )
    .get(id) as { id: string; name: string; overtimeLimitHours: number } | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  siteId: string,
  userId: string,
  mode: "read" | "write" | "own" | "approve",
): SiteRole | null {
  const role = getRole(db, siteId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "supervisor" || role === "lead")) return role;
  if (mode === "own" && role === "supervisor") return role;
  if (mode === "approve" && canApprove(role)) return role;
  return null;
}

export function createCrew(db: DatabaseSync, siteId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO crews (id, site_id, name) VALUES (?, ?, ?)").run(id, siteId, name);
  return { id, siteId, name };
}

export function listCrews(db: DatabaseSync, siteId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, site_id AS siteId, name FROM crews
       WHERE site_id = ? ORDER BY name ASC LIMIT ? OFFSET ?`,
    )
    .all(siteId, limit, offset) as { id: string; siteId: string; name: string }[];
}

export function getCrew(db: DatabaseSync, id: string) {
  return db
    .prepare(`SELECT id, site_id AS siteId, name FROM crews WHERE id = ?`)
    .get(id) as { id: string; siteId: string; name: string } | undefined;
}

export type Shift = {
  id: string;
  crewId: string;
  title: string;
  hours: number;
  state: ShiftState;
  version: number;
  approvalCount: number;
  overtime: boolean;
};

function approvalCount(db: DatabaseSync, shiftId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM shift_approvals WHERE shift_id = ?")
    .get(shiftId) as { c: number };
  return row.c;
}

export function getShift(db: DatabaseSync, id: string): Shift | undefined {
  const row = db
    .prepare(
      `SELECT id, crew_id AS crewId, title, hours, state, version FROM shifts WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        crewId: string;
        title: string;
        hours: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  const crew = getCrew(db, row.crewId);
  const site = crew ? getSite(db, crew.siteId) : undefined;
  const overtime = site ? isOvertime(row.hours, site.overtimeLimitHours) : false;
  return {
    id: row.id,
    crewId: row.crewId,
    title: row.title,
    hours: row.hours,
    state: row.state as ShiftState,
    version: row.version,
    approvalCount: approvalCount(db, id),
    overtime,
  };
}

export function createShift(
  db: DatabaseSync,
  crewId: string,
  title: string,
  hours: number,
): { ok: true; shift: Shift } | { ok: false; error: string } {
  if (!getCrew(db, crewId)) return { ok: false, error: "crew not found" };
  if (!(hours > 0)) return { ok: false, error: "hours must be positive" };
  const id = randomUUID();
  db.prepare(
    `INSERT INTO shifts (id, crew_id, title, hours, state, version)
     VALUES (?, ?, ?, ?, 'open', 1)`,
  ).run(id, crewId, title, hours);
  return { ok: true, shift: getShift(db, id)! };
}

export function addApproval(
  db: DatabaseSync,
  shiftId: string,
  supervisorId: string,
): { ok: true; approvalCount: number } | { ok: false; error: string; status: number } {
  const shift = getShift(db, shiftId);
  if (!shift) return { ok: false, error: "not found", status: 404 };
  if (shift.state !== "active") {
    return { ok: false, error: "approvals only while active", status: 400 };
  }
  if (!shift.overtime) {
    return { ok: false, error: "approvals only for overtime", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO shift_approvals (id, shift_id, supervisor_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), shiftId, supervisorId);
  } catch {
    return { ok: false, error: "already approved", status: 409 };
  }
  return { ok: true, approvalCount: approvalCount(db, shiftId) };
}

export function transitionShift(
  db: DatabaseSync,
  shiftId: string,
  actorId: string,
  to: ShiftState,
  version: number,
): { ok: true; shift: Shift } | { ok: false; error: string; status: number } {
  const shift = getShift(db, shiftId);
  if (!shift) return { ok: false, error: "not found", status: 404 };
  if (shift.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(shift.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "closed" && !dualCloseReady(shift.approvalCount, shift.overtime)) {
    return { ok: false, error: "dual supervisor approval required for overtime", status: 400 };
  }
  db.prepare("UPDATE shifts SET state = ?, version = version + 1 WHERE id = ?").run(to, shiftId);
  db.prepare(
    `INSERT INTO shift_audit (id, shift_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), shiftId, actorId, shift.state, to);
  return { ok: true, shift: getShift(db, shiftId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  shiftId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, shift_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, shiftId, JSON.stringify(payload));
}

export function siteIdForShift(db: DatabaseSync, shiftId: string): string | null {
  const shift = getShift(db, shiftId);
  if (!shift) return null;
  return getCrew(db, shift.crewId)?.siteId ?? null;
}
