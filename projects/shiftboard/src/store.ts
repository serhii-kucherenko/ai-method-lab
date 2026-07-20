import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "open" | "filled" | "completed" | "discarded";

export type Shift = {
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
  shiftId: string;
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
  open: ["filled", "discarded"],
  filled: ["completed"],
  completed: [],
  discarded: ["open"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "open" ||
    value === "filled" ||
    value === "completed" ||
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

function mapShift(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Shift {
  const state = isState(row.status) ? row.status : "open";
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

export function createShift(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Shift {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO shifts (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'open', 1)",
  ).run(id, userId, title, body);
  return getShift(db, id)!;
}

export function listShifts(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { shifts: Shift[]; nextCursor: string | null; limit: number } {
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
             FROM shifts WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM shifts WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapShift>[0]>;
  const shifts = rows.map(mapShift);
  const nextCursor =
    shifts.length === limit ? shifts[shifts.length - 1]!.id : null;
  return { shifts, nextCursor, limit };
}

export function seedShifts(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO shifts (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'open', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `shift_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Crew ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getShift(db: DatabaseSync, id: string): Shift | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM shifts WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapShift>[0] | undefined;
  return row ? mapShift(row) : undefined;
}

export function updateShift(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Shift | undefined {
  const existing = getShift(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE shifts SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getShift(db, id);
}

export type TransitionResult =
  | { ok: true; request: Shift }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionShift(
  db: DatabaseSync,
  shiftId: string,
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
  const existing = getShift(db, shiftId);
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
      "UPDATE shifts SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, shiftId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO shift_audit (id, shift_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), shiftId, userId, existing.state, to, at);
  const updated = getShift(db, shiftId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listShiftAudit(
  db: DatabaseSync,
  shiftId: string,
  userId: string,
): AuditEntry[] | null {
  const shift = getShift(db, shiftId);
  if (!shift || shift.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, shift_id AS shiftId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM shift_audit WHERE shift_id = ? ORDER BY at ASC`,
    )
    .all(shiftId) as AuditEntry[];
}

export function deleteShift(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM shifts WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, crewId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM crew_members WHERE crew_id = ? AND user_id = ?")
    .get(crewId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createCrew(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO crews (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO crew_members (crew_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getCrew(
  db: DatabaseSync,
  crewId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM crews WHERE id = ?")
    .get(crewId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addCrewMember(
  db: DatabaseSync,
  crewId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO crew_members (crew_id, user_id, role) VALUES (?, ?, ?)",
  ).run(crewId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  crewId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; crewId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, crew_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, crewId, title, notes, createdBy);
  return { id, crewId, title, notes };
}

export function getTaskCrewId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT crew_id AS crewId FROM tasks WHERE id = ?")
    .get(taskId) as { crewId: string } | undefined;
  return row?.crewId ?? null;
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
