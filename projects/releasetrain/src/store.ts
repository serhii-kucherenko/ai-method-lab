import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type TrainRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canApprove,
  canTransition,
  checklistReady,
  dualApprovalReady,
  type WorkflowState,
} from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

export type CreateStoreOptions = {
  dbPath?: string;
  dep?: DepClient;
  webhookSecret?: string;
  rateLimit?: number;
};

export function createStore(opts: CreateStoreOptions | string = {}): Store {
  const normalized = typeof opts === "string" ? { dbPath: opts } : opts;
  return {
    db: openDatabase(normalized.dbPath ?? ":memory:"),
    dep: normalized.dep ?? createMockDep(),
    webhookSecret: normalized.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: normalized.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(db: DatabaseSync, email: string, password: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
    id,
    email,
    password,
  );
  return { id, email };
}

export function findUserByEmail(db: DatabaseSync, email: string) {
  return db
    .prepare("SELECT id, email, password FROM users WHERE email = ?")
    .get(email) as { id: string; email: string; password: string } | undefined;
}

export function issueToken(db: DatabaseSync, userId: string): string {
  const token = randomUUID();
  db.prepare("INSERT INTO tokens (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

export function resolveToken(db: DatabaseSync, token: string): string | null {
  const row = db
    .prepare("SELECT user_id FROM tokens WHERE token = ?")
    .get(token) as { user_id: string } | undefined;
  return row?.user_id ?? null;
}

export function createTrain(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO trains (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO train_members (train_id, user_id, role) VALUES (?, ?, 'lead')",
  ).run(id, userId);
  return { id, name };
}

export function addTrainMember(
  db: DatabaseSync,
  trainId: string,
  userId: string,
  role: TrainRole,
): void {
  db.prepare(
    "INSERT INTO train_members (train_id, user_id, role) VALUES (?, ?, ?)",
  ).run(trainId, userId, role);
}

export function getTrainRole(
  db: DatabaseSync,
  trainId: string,
  userId: string,
): TrainRole | null {
  const row = db
    .prepare("SELECT role FROM train_members WHERE train_id = ? AND user_id = ?")
    .get(trainId, userId) as { role: TrainRole } | undefined;
  return row?.role ?? null;
}

export function getTrain(db: DatabaseSync, trainId: string) {
  return db
    .prepare("SELECT id, name FROM trains WHERE id = ?")
    .get(trainId) as { id: string; name: string } | undefined;
}

function canWrite(role: TrainRole | null): boolean {
  return role === "lead" || role === "engineer";
}

function canRead(role: TrainRole | null): boolean {
  return role === "lead" || role === "engineer" || role === "approver";
}

export function assertTrainAccess(
  db: DatabaseSync,
  trainId: string,
  userId: string,
  mode: "read" | "write" | "approve",
): TrainRole | null {
  const role = getTrainRole(db, trainId, userId);
  if (!role) return null;
  if (mode === "write" && !canWrite(role)) return null;
  if (mode === "read" && !canRead(role)) return null;
  if (mode === "approve" && !canApprove(role)) return null;
  return role;
}

export function createService(db: DatabaseSync, trainId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO services (id, train_id, name) VALUES (?, ?, ?)").run(
    id,
    trainId,
    name,
  );
  return { id, trainId, name };
}

export function listServices(
  db: DatabaseSync,
  trainId: string,
  limit: number,
  offset: number,
) {
  return db
    .prepare(
      `SELECT id, train_id AS trainId, name FROM services
       WHERE train_id = ? ORDER BY name ASC LIMIT ? OFFSET ?`,
    )
    .all(trainId, limit, offset) as {
    id: string;
    trainId: string;
    name: string;
  }[];
}

export function getService(db: DatabaseSync, serviceId: string) {
  return db
    .prepare("SELECT id, train_id AS trainId, name FROM services WHERE id = ?")
    .get(serviceId) as { id: string; trainId: string; name: string } | undefined;
}

export type Release = {
  id: string;
  serviceId: string;
  version: string;
  state: WorkflowState;
  versionNum: number;
  checkedCount: number;
  approvalCount: number;
};

function mapRelease(row: {
  id: string;
  serviceId: string;
  version: string;
  state: string;
  versionNum: number;
}): Release {
  return {
    id: row.id,
    serviceId: row.serviceId,
    version: row.version,
    state: row.state as WorkflowState,
    versionNum: row.versionNum,
    checkedCount: 0,
    approvalCount: 0,
  };
}

export function checkedCount(db: DatabaseSync, releaseId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM checklist_items WHERE release_id = ? AND checked = 1")
    .get(releaseId) as { c: number };
  return Number(row.c);
}

export function approvalCount(db: DatabaseSync, releaseId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM release_approvals WHERE release_id = ?")
    .get(releaseId) as { c: number };
  return Number(row.c);
}

export function createRelease(
  db: DatabaseSync,
  serviceId: string,
  version: string,
): Release {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO releases (id, service_id, version, state, version_num)
     VALUES (?, ?, ?, 'planned', 1)`,
  ).run(id, serviceId, version);
  return getRelease(db, id)!;
}

export function getRelease(db: DatabaseSync, releaseId: string): Release | undefined {
  const row = db
    .prepare(
      `SELECT id, service_id AS serviceId, version, state, version_num AS versionNum
       FROM releases WHERE id = ?`,
    )
    .get(releaseId) as
    | {
        id: string;
        serviceId: string;
        version: string;
        state: string;
        versionNum: number;
      }
    | undefined;
  if (!row) return undefined;
  const release = mapRelease(row);
  release.checkedCount = checkedCount(db, releaseId);
  release.approvalCount = approvalCount(db, releaseId);
  return release;
}

export function listReleases(
  db: DatabaseSync,
  serviceId: string,
  limit: number,
  offset: number,
): Release[] {
  const rows = db
    .prepare(
      `SELECT id, service_id AS serviceId, version, state, version_num AS versionNum
       FROM releases WHERE service_id = ?
       ORDER BY version ASC LIMIT ? OFFSET ?`,
    )
    .all(serviceId, limit, offset) as {
    id: string;
    serviceId: string;
    version: string;
    state: string;
    versionNum: number;
  }[];
  return rows.map((r) => {
    const rel = mapRelease(r);
    rel.checkedCount = checkedCount(db, r.id);
    rel.approvalCount = approvalCount(db, r.id);
    return rel;
  });
}

export function addChecklistItem(
  db: DatabaseSync,
  releaseId: string,
  label: string,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO checklist_items (id, release_id, label, checked)
     VALUES (?, ?, ?, 0)`,
  ).run(id, releaseId, label);
  return { id, releaseId, label, checked: false };
}

export function checkItem(
  db: DatabaseSync,
  releaseId: string,
  itemId: string,
  userId: string,
): { ok: true } | { ok: false; error: string; status: number } {
  const item = db
    .prepare("SELECT id FROM checklist_items WHERE id = ? AND release_id = ?")
    .get(itemId, releaseId) as { id: string } | undefined;
  if (!item) return { ok: false, error: "not found", status: 404 };
  db.prepare(
    "UPDATE checklist_items SET checked = 1, checked_by = ? WHERE id = ?",
  ).run(userId, itemId);
  return { ok: true };
}

export function addApproval(
  db: DatabaseSync,
  releaseId: string,
  approverId: string,
): { ok: true; approvalCount: number } | { ok: false; error: string; status: number } {
  const release = getRelease(db, releaseId);
  if (!release) return { ok: false, error: "not found", status: 404 };
  if (release.state !== "staging") {
    return { ok: false, error: "approvals only in staging", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO release_approvals (id, release_id, approver_id)
       VALUES (?, ?, ?)`,
    ).run(randomUUID(), releaseId, approverId);
  } catch {
    return { ok: false, error: "already approved", status: 409 };
  }
  return { ok: true, approvalCount: approvalCount(db, releaseId) };
}

export function transitionRelease(
  db: DatabaseSync,
  releaseId: string,
  actorId: string,
  to: WorkflowState,
  versionNum: number,
): { ok: true; release: Release } | { ok: false; error: string; status: number } {
  const release = getRelease(db, releaseId);
  if (!release) return { ok: false, error: "not found", status: 404 };
  if (release.versionNum !== versionNum) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(release.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "staging") {
    if (!checklistReady(release.checkedCount)) {
      return { ok: false, error: "checklist required before staging", status: 400 };
    }
  }
  if (to === "prod") {
    if (!dualApprovalReady(release.approvalCount)) {
      return { ok: false, error: "dual approval required before prod", status: 400 };
    }
  }
  db.prepare(
    `UPDATE releases SET state = ?, version_num = version_num + 1 WHERE id = ?`,
  ).run(to, releaseId);
  db.prepare(
    `INSERT INTO release_audit (id, release_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), releaseId, actorId, release.state, to);
  return { ok: true, release: getRelease(db, releaseId)! };
}

export function rollbackRelease(
  db: DatabaseSync,
  releaseId: string,
  actorId: string,
  versionNum: number,
): { ok: true; release: Release } | { ok: false; error: string; status: number } {
  const release = getRelease(db, releaseId);
  if (!release) return { ok: false, error: "not found", status: 404 };
  if (release.versionNum !== versionNum) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (release.state !== "prod") {
    return { ok: false, error: "rollback only from prod", status: 400 };
  }
  db.prepare(
    `UPDATE releases SET state = 'rolled_back', version_num = version_num + 1 WHERE id = ?`,
  ).run(releaseId);
  db.prepare(
    `INSERT INTO release_audit (id, release_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), releaseId, actorId, "prod", "rolled_back");
  return { ok: true, release: getRelease(db, releaseId)! };
}

export function listAudit(db: DatabaseSync, releaseId: string) {
  return db
    .prepare(
      `SELECT id, from_state AS "from", to_state AS "to", actor_id AS actorId, at
       FROM release_audit WHERE release_id = ? ORDER BY at ASC`,
    )
    .all(releaseId) as {
    id: string;
    from: string;
    to: string;
    actorId: string;
    at: string;
  }[];
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  releaseId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, release_id, payload)
     VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, releaseId, JSON.stringify(payload));
}

export function trainIdForService(db: DatabaseSync, serviceId: string): string | null {
  return getService(db, serviceId)?.trainId ?? null;
}

export function trainIdForRelease(db: DatabaseSync, releaseId: string): string | null {
  const release = getRelease(db, releaseId);
  if (!release) return null;
  return trainIdForService(db, release.serviceId);
}
