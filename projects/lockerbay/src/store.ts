import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "reserved" | "occupied" | "released" | "discarded";

export type Locker = {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: WorkflowState;
  state: WorkflowState;
  version: number;
};

export type AuditEntry = {
  id: string;
  lockerId: string;
  actorId: string;
  from: WorkflowState;
  to: WorkflowState;
  at: string;
};

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

const LEGAL: Record<WorkflowState, WorkflowState[]> = {
  reserved: ["occupied", "discarded"],
  occupied: ["released"],
  released: [],
  discarded: ["reserved"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "reserved" ||
    value === "occupied" ||
    value === "released" ||
    value === "discarded"
  );
}

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

export function registerUser(
  db: DatabaseSync,
  email: string,
  password: string,
): { id: string; email: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
    id,
    email,
    password,
  );
  return { id, email };
}

export function findUserByEmail(
  db: DatabaseSync,
  email: string,
): { id: string; email: string; password: string } | undefined {
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
    .prepare("SELECT user_id AS userId FROM tokens WHERE token = ?")
    .get(token) as { userId: string } | undefined;
  return row?.userId ?? null;
}

function mapLocker(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Locker {
  const state = isState(row.status) ? row.status : "reserved";
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    status: state,
    state,
    version: row.version,
  };
}

export function createLocker(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Locker {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO lockers (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'reserved', 1)",
  ).run(id, userId, title, body);
  return getLocker(db, id)!;
}

export function listLockers(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { lockers: Locker[]; nextCursor: string | null; limit: number } {
  const DEFAULT_LIMIT = 20;
  const MAX_LIMIT = 50;
  let limit = opts.limit ?? DEFAULT_LIMIT;
  if (!Number.isFinite(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  const cursor = opts.cursor ?? null;
  const rows = (
    cursor
      ? db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM lockers WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM lockers WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapLocker>[0]>;
  const lockers = rows.map(mapLocker);
  const nextCursor =
    lockers.length === limit ? lockers[lockers.length - 1]!.id : null;
  return { lockers, nextCursor, limit };
}

export function seedLockers(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO lockers (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'reserved', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `locker_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Building ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getLocker(db: DatabaseSync, id: string): Locker | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM lockers WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapLocker>[0] | undefined;
  return row ? mapLocker(row) : undefined;
}

export function updateLocker(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Locker | undefined {
  const existing = getLocker(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE lockers SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getLocker(db, id);
}

export type TransitionResult =
  | { ok: true; request: Locker }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionLocker(
  db: DatabaseSync,
  lockerId: string,
  userId: string,
  to: unknown,
  version: unknown,
): TransitionResult {
  if (typeof version !== "number") {
    return { ok: false, status: 400, error: "version required" };
  }
  if (!isState(to)) {
    return { ok: false, status: 400, error: "invalid target state" };
  }
  const existing = getLocker(db, lockerId);
  if (!existing || existing.userId !== userId) {
    return { ok: false, status: 404, error: "not found" };
  }
  if (!LEGAL[existing.state].includes(to)) {
    return {
      ok: false,
      status: 409,
      error: `illegal transition from ${existing.state} to ${to}`,
    };
  }
  if (version !== existing.version) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const result = db
    .prepare(
      "UPDATE lockers SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, lockerId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO locker_audit (id, locker_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), lockerId, userId, existing.state, to, at);
  const updated = getLocker(db, lockerId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listLockerAudit(
  db: DatabaseSync,
  lockerId: string,
  userId: string,
): AuditEntry[] | null {
  const locker = getLocker(db, lockerId);
  if (!locker || locker.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, locker_id AS lockerId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM locker_audit WHERE locker_id = ? ORDER BY at ASC`,
    )
    .all(lockerId) as AuditEntry[];
}

export function deleteLocker(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM lockers WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, buildingId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM building_members WHERE building_id = ? AND user_id = ?")
    .get(buildingId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createBuilding(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO buildings (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO building_members (building_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getBuilding(
  db: DatabaseSync,
  buildingId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM buildings WHERE id = ?")
    .get(buildingId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addBuildingMember(
  db: DatabaseSync,
  buildingId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO building_members (building_id, user_id, role) VALUES (?, ?, ?)",
  ).run(buildingId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  buildingId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; buildingId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, building_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, buildingId, title, notes, createdBy);
  return { id, buildingId, title, notes };
}

export function getTaskBuildingId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT building_id AS buildingId FROM tasks WHERE id = ?")
    .get(taskId) as { buildingId: string } | undefined;
  return row?.buildingId ?? null;
}

export function createComment(
  db: DatabaseSync,
  taskId: string,
  authorId: string,
  body: string,
): { id: string; taskId: string; authorId: string; body: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO comments (id, task_id, author_id, body) VALUES (?, ?, ?, ?)",
  ).run(id, taskId, authorId, body);
  return { id, taskId, authorId, body };
}
