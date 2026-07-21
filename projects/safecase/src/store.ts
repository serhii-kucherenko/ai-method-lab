import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type FirmRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canArchive,
  canTransition,
  dualArchiveReady,
  retentionMet,
  type MatterState,
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

export function createFirm(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO firms (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(`INSERT INTO firm_members (firm_id, user_id, role) VALUES (?, ?, 'counsel')`).run(
    id,
    userId,
  );
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
  mode: "read" | "write" | "own" | "archive",
): FirmRole | null {
  const role = getRole(db, firmId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "counsel" || role === "paralegal")) return role;
  if (mode === "own" && role === "counsel") return role;
  if (mode === "archive" && canArchive(role)) return role;
  return null;
}

export type Matter = {
  id: string;
  firmId: string;
  title: string;
  retentionDays: number;
  openedAt: string;
  state: MatterState;
  version: number;
  approvalCount: number;
  evidenceCount: number;
};

function approvalCount(db: DatabaseSync, matterId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM archive_approvals WHERE matter_id = ?")
    .get(matterId) as { c: number };
  return row.c;
}

function evidenceCount(db: DatabaseSync, matterId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM evidence WHERE matter_id = ?")
    .get(matterId) as { c: number };
  return row.c;
}

export function getMatter(db: DatabaseSync, id: string): Matter | undefined {
  const row = db
    .prepare(
      `SELECT id, firm_id AS firmId, title, retention_days AS retentionDays,
              opened_at AS openedAt, state, version
       FROM matters WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        firmId: string;
        title: string;
        retentionDays: number;
        openedAt: string;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    firmId: row.firmId,
    title: row.title,
    retentionDays: row.retentionDays,
    openedAt: row.openedAt,
    state: row.state as MatterState,
    version: row.version,
    approvalCount: approvalCount(db, id),
    evidenceCount: evidenceCount(db, id),
  };
}

export function createMatter(
  db: DatabaseSync,
  firmId: string,
  title: string,
  retentionDays: number,
  openedAt: string,
): Matter {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO matters (id, firm_id, title, retention_days, opened_at, state, version)
     VALUES (?, ?, ?, ?, ?, 'open', 1)`,
  ).run(id, firmId, title, retentionDays, openedAt);
  return getMatter(db, id)!;
}

export function listMatters(db: DatabaseSync, firmId: string, limit: number, offset: number) {
  const rows = db
    .prepare(
      `SELECT id FROM matters WHERE firm_id = ? ORDER BY title ASC LIMIT ? OFFSET ?`,
    )
    .all(firmId, limit, offset) as { id: string }[];
  return rows.map((r) => getMatter(db, r.id)!);
}

export function addEvidence(
  db: DatabaseSync,
  matterId: string,
  label: string,
  collectedAt: string,
): { ok: true; matter: Matter } | { ok: false; error: string; status: number } {
  const matter = getMatter(db, matterId);
  if (!matter) return { ok: false, error: "not found", status: 404 };
  if (matter.state === "archived") {
    return { ok: false, error: "matter archived", status: 400 };
  }
  if (!label.trim()) return { ok: false, error: "label required", status: 400 };
  db.prepare(
    `INSERT INTO evidence (id, matter_id, label, collected_at) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), matterId, label, collectedAt);
  return { ok: true, matter: getMatter(db, matterId)! };
}

export function addArchiveApproval(
  db: DatabaseSync,
  matterId: string,
  counselId: string,
): { ok: true; approvalCount: number } | { ok: false; error: string; status: number } {
  const matter = getMatter(db, matterId);
  if (!matter) return { ok: false, error: "not found", status: 404 };
  if (matter.state !== "held") {
    return { ok: false, error: "approvals only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO archive_approvals (id, matter_id, counsel_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), matterId, counselId);
  } catch {
    return { ok: false, error: "already approved", status: 409 };
  }
  return { ok: true, approvalCount: approvalCount(db, matterId) };
}

export function transitionMatter(
  db: DatabaseSync,
  matterId: string,
  actorId: string,
  to: MatterState,
  version: number,
  nowIso: string,
): { ok: true; matter: Matter } | { ok: false; error: string; status: number } {
  const matter = getMatter(db, matterId);
  if (!matter) return { ok: false, error: "not found", status: 404 };
  if (matter.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(matter.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "archived") {
    if (!retentionMet(matter.openedAt, matter.retentionDays, nowIso)) {
      return { ok: false, error: "retention period not met", status: 400 };
    }
    if (!dualArchiveReady(matter.approvalCount)) {
      return { ok: false, error: "dual counsel archive required", status: 400 };
    }
  }
  db.prepare("UPDATE matters SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    matterId,
  );
  db.prepare(
    `INSERT INTO matter_audit (id, matter_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), matterId, actorId, matter.state, to);
  return { ok: true, matter: getMatter(db, matterId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  matterId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, matter_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, matterId, JSON.stringify(payload));
}
