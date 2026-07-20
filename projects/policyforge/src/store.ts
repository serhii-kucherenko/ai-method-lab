import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type PackRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canApproveWaive,
  canTransition,
  dualWaiveReady,
  isSeverityViolation,
  type ViolationState,
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

export function createPack(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO packs (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare("INSERT INTO pack_members (pack_id, user_id, role) VALUES (?, ?, 'owner')").run(
    id,
    userId,
  );
  return { id, name };
}

export function addMember(db: DatabaseSync, packId: string, userId: string, role: PackRole) {
  db.prepare("INSERT INTO pack_members (pack_id, user_id, role) VALUES (?, ?, ?)").run(
    packId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, packId: string, userId: string): PackRole | null {
  const row = db
    .prepare("SELECT role FROM pack_members WHERE pack_id = ? AND user_id = ?")
    .get(packId, userId) as { role: PackRole } | undefined;
  return row?.role ?? null;
}

export function getPack(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM packs WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  packId: string,
  userId: string,
  mode: "read" | "write" | "own" | "approve",
): PackRole | null {
  const role = getRole(db, packId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "owner" || role === "author")) return role;
  if (mode === "own" && role === "owner") return role;
  if (mode === "approve" && canApproveWaive(role)) return role;
  return null;
}

export function createRule(
  db: DatabaseSync,
  packId: string,
  name: string,
  expression: string,
  severityThreshold = 3,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO rules (id, pack_id, name, expression, severity_threshold)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(id, packId, name, expression, severityThreshold);
  return { id, packId, name, expression, severityThreshold };
}

export function listRules(db: DatabaseSync, packId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, pack_id AS packId, name, expression,
              severity_threshold AS severityThreshold
       FROM rules WHERE pack_id = ? ORDER BY name ASC LIMIT ? OFFSET ?`,
    )
    .all(packId, limit, offset) as {
    id: string;
    packId: string;
    name: string;
    expression: string;
    severityThreshold: number;
  }[];
}

export function getRule(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, pack_id AS packId, name, expression,
              severity_threshold AS severityThreshold FROM rules WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        packId: string;
        name: string;
        expression: string;
        severityThreshold: number;
      }
    | undefined;
}

export type Violation = {
  id: string;
  ruleId: string;
  title: string;
  severity: number;
  state: ViolationState;
  version: number;
  waiveApprovalCount: number;
};

function waiveApprovalCount(db: DatabaseSync, violationId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM violation_waive_approvals WHERE violation_id = ?")
    .get(violationId) as { c: number };
  return row.c;
}

export function getViolation(db: DatabaseSync, id: string): Violation | undefined {
  const row = db
    .prepare(
      `SELECT id, rule_id AS ruleId, title, severity, state, version
       FROM violations WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        ruleId: string;
        title: string;
        severity: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    ruleId: row.ruleId,
    title: row.title,
    severity: row.severity,
    state: row.state as ViolationState,
    version: row.version,
    waiveApprovalCount: waiveApprovalCount(db, id),
  };
}

export function createViolation(
  db: DatabaseSync,
  ruleId: string,
  title: string,
  severity: number,
): { ok: true; violation: Violation } | { ok: false; error: string } {
  const rule = getRule(db, ruleId);
  if (!rule) return { ok: false, error: "rule not found" };
  if (!isSeverityViolation(severity, rule.severityThreshold)) {
    return { ok: false, error: "severity within threshold — not a violation" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO violations (id, rule_id, title, severity, state, version)
     VALUES (?, ?, ?, ?, 'open', 1)`,
  ).run(id, ruleId, title, severity);
  return { ok: true, violation: getViolation(db, id)! };
}

export function addWaiveApproval(
  db: DatabaseSync,
  violationId: string,
  approverId: string,
): { ok: true; approvalCount: number } | { ok: false; error: string; status: number } {
  const violation = getViolation(db, violationId);
  if (!violation) return { ok: false, error: "not found", status: 404 };
  if (violation.state !== "open") {
    return { ok: false, error: "waive approvals only while open", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO violation_waive_approvals (id, violation_id, approver_id)
       VALUES (?, ?, ?)`,
    ).run(randomUUID(), violationId, approverId);
  } catch {
    return { ok: false, error: "already approved", status: 409 };
  }
  return { ok: true, approvalCount: waiveApprovalCount(db, violationId) };
}

export function transitionViolation(
  db: DatabaseSync,
  violationId: string,
  actorId: string,
  to: ViolationState,
  version: number,
): { ok: true; violation: Violation } | { ok: false; error: string; status: number } {
  const violation = getViolation(db, violationId);
  if (!violation) return { ok: false, error: "not found", status: 404 };
  if (violation.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(violation.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "waived" && !dualWaiveReady(violation.waiveApprovalCount)) {
    return { ok: false, error: "dual waive approval required", status: 400 };
  }
  db.prepare("UPDATE violations SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    violationId,
  );
  db.prepare(
    `INSERT INTO violation_audit (id, violation_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), violationId, actorId, violation.state, to);
  return { ok: true, violation: getViolation(db, violationId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  violationId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, violation_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, violationId, JSON.stringify(payload));
}

export function packIdForViolation(db: DatabaseSync, violationId: string): string | null {
  const v = getViolation(db, violationId);
  if (!v) return null;
  return getRule(db, v.ruleId)?.packId ?? null;
}
