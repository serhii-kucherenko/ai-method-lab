import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "registered" | "started" | "finished" | "discarded";

export type Entry = {
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
  entryId: string;
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
  registered: ["started", "discarded"],
  started: ["finished"],
  finished: [],
  discarded: ["registered"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "registered" ||
    value === "started" ||
    value === "finished" ||
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

function mapEntry(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Entry {
  const state = isState(row.status) ? row.status : "registered";
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

export function createEntry(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Entry {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO entries (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'registered', 1)",
  ).run(id, userId, title, body);
  return getEntry(db, id)!;
}

export function listEntrys(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { entries: Entry[]; nextCursor: string | null; limit: number } {
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
             FROM entries WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM entries WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapEntry>[0]>;
  const entries = rows.map(mapEntry);
  const nextCursor =
    entries.length === limit ? entries[entries.length - 1]!.id : null;
  return { entries, nextCursor, limit };
}

export function seedEntrys(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO entries (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'registered', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `entry_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Course ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getEntry(db: DatabaseSync, id: string): Entry | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM entries WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapEntry>[0] | undefined;
  return row ? mapEntry(row) : undefined;
}

export function updateEntry(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Entry | undefined {
  const existing = getEntry(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE entries SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getEntry(db, id);
}

export type TransitionResult =
  | { ok: true; request: Entry }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionEntry(
  db: DatabaseSync,
  entryId: string,
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
  const existing = getEntry(db, entryId);
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
      "UPDATE entries SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, entryId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO entry_audit (id, entry_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), entryId, userId, existing.state, to, at);
  const updated = getEntry(db, entryId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listEntryAudit(
  db: DatabaseSync,
  entryId: string,
  userId: string,
): AuditEntry[] | null {
  const entry = getEntry(db, entryId);
  if (!entry || entry.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, entry_id AS entryId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM entry_audit WHERE entry_id = ? ORDER BY at ASC`,
    )
    .all(entryId) as AuditEntry[];
}

export function deleteEntry(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM entries WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, courseId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM course_members WHERE course_id = ? AND user_id = ?")
    .get(courseId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createCourse(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO courses (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO course_members (course_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getCourse(
  db: DatabaseSync,
  courseId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM courses WHERE id = ?")
    .get(courseId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addCourseMember(
  db: DatabaseSync,
  courseId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO course_members (course_id, user_id, role) VALUES (?, ?, ?)",
  ).run(courseId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  courseId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; courseId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, course_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, courseId, title, notes, createdBy);
  return { id, courseId, title, notes };
}

export function getTaskCourseId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT course_id AS courseId FROM tasks WHERE id = ?")
    .get(taskId) as { courseId: string } | undefined;
  return row?.courseId ?? null;
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
