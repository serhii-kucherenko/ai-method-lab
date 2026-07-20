import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "booked" | "taught" | "reviewed" | "discarded";

export type Lesson = {
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
  lessonId: string;
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
  booked: ["taught", "discarded"],
  taught: ["reviewed"],
  reviewed: [],
  discarded: ["booked"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "booked" ||
    value === "taught" ||
    value === "reviewed" ||
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

function mapLesson(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Lesson {
  const state = isState(row.status) ? row.status : "booked";
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

export function createLesson(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Lesson {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO lessons (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'booked', 1)",
  ).run(id, userId, title, body);
  return getLesson(db, id)!;
}

export function listLessons(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { lessons: Lesson[]; nextCursor: string | null; limit: number } {
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
             FROM lessons WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM lessons WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapLesson>[0]>;
  const lessons = rows.map(mapLesson);
  const nextCursor =
    lessons.length === limit ? lessons[lessons.length - 1]!.id : null;
  return { lessons, nextCursor, limit };
}

export function seedLessons(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO lessons (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'booked', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `lesson_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Studio ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getLesson(db: DatabaseSync, id: string): Lesson | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM lessons WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapLesson>[0] | undefined;
  return row ? mapLesson(row) : undefined;
}

export function updateLesson(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Lesson | undefined {
  const existing = getLesson(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE lessons SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getLesson(db, id);
}

export type TransitionResult =
  | { ok: true; request: Lesson }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionLesson(
  db: DatabaseSync,
  lessonId: string,
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
  const existing = getLesson(db, lessonId);
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
      "UPDATE lessons SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, lessonId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO lesson_audit (id, lesson_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), lessonId, userId, existing.state, to, at);
  const updated = getLesson(db, lessonId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listLessonAudit(
  db: DatabaseSync,
  lessonId: string,
  userId: string,
): AuditEntry[] | null {
  const lesson = getLesson(db, lessonId);
  if (!lesson || lesson.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, lesson_id AS lessonId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM lesson_audit WHERE lesson_id = ? ORDER BY at ASC`,
    )
    .all(lessonId) as AuditEntry[];
}

export function deleteLesson(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM lessons WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, studioId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM studio_members WHERE studio_id = ? AND user_id = ?")
    .get(studioId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createStudio(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO studios (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO studio_members (studio_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getStudio(
  db: DatabaseSync,
  studioId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM studios WHERE id = ?")
    .get(studioId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addStudioMember(
  db: DatabaseSync,
  studioId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO studio_members (studio_id, user_id, role) VALUES (?, ?, ?)",
  ).run(studioId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  studioId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; studioId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, studio_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, studioId, title, notes, createdBy);
  return { id, studioId, title, notes };
}

export function getTaskStudioId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT studio_id AS studioId FROM tasks WHERE id = ?")
    .get(taskId) as { studioId: string } | undefined;
  return row?.studioId ?? null;
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
