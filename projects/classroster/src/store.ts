import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "enrolled" | "attending" | "graduated" | "discarded";

export type Seat = {
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
  seatId: string;
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
  enrolled: ["attending", "discarded"],
  attending: ["graduated"],
  graduated: [],
  discarded: ["enrolled"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "enrolled" ||
    value === "attending" ||
    value === "graduated" ||
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

function mapSeat(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Seat {
  const state = isState(row.status) ? row.status : "enrolled";
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

export function createSeat(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Seat {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO seats (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'enrolled', 1)",
  ).run(id, userId, title, body);
  return getSeat(db, id)!;
}

export function listSeats(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { seats: Seat[]; nextCursor: string | null; limit: number } {
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
             FROM seats WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM seats WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapSeat>[0]>;
  const seats = rows.map(mapSeat);
  const nextCursor =
    seats.length === limit ? seats[seats.length - 1]!.id : null;
  return { seats, nextCursor, limit };
}

export function seedSeats(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO seats (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'enrolled', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `seat_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Cohort ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getSeat(db: DatabaseSync, id: string): Seat | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM seats WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapSeat>[0] | undefined;
  return row ? mapSeat(row) : undefined;
}

export function updateSeat(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Seat | undefined {
  const existing = getSeat(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE seats SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getSeat(db, id);
}

export type TransitionResult =
  | { ok: true; request: Seat }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionSeat(
  db: DatabaseSync,
  seatId: string,
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
  const existing = getSeat(db, seatId);
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
      "UPDATE seats SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, seatId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO seat_audit (id, seat_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), seatId, userId, existing.state, to, at);
  const updated = getSeat(db, seatId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listSeatAudit(
  db: DatabaseSync,
  seatId: string,
  userId: string,
): AuditEntry[] | null {
  const seat = getSeat(db, seatId);
  if (!seat || seat.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, seat_id AS seatId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM seat_audit WHERE seat_id = ? ORDER BY at ASC`,
    )
    .all(seatId) as AuditEntry[];
}

export function deleteSeat(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM seats WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, cohortId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM cohort_members WHERE cohort_id = ? AND user_id = ?")
    .get(cohortId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createCohort(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO cohorts (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO cohort_members (cohort_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getCohort(
  db: DatabaseSync,
  cohortId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM cohorts WHERE id = ?")
    .get(cohortId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addCohortMember(
  db: DatabaseSync,
  cohortId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO cohort_members (cohort_id, user_id, role) VALUES (?, ?, ?)",
  ).run(cohortId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  cohortId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; cohortId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, cohort_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, cohortId, title, notes, createdBy);
  return { id, cohortId, title, notes };
}

export function getTaskCohortId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT cohort_id AS cohortId FROM tasks WHERE id = ?")
    .get(taskId) as { cohortId: string } | undefined;
  return row?.cohortId ?? null;
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
