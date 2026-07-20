import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "draft" | "published" | "archived" | "discarded";

export type Note = {
  id: string;
  userId: string;
  title: string;
  note: string;
  status: WorkflowState;
  state: WorkflowState;
  version: number;
};

export type AuditEntry = {
  id: string;
  noteId: string;
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
  draft: ["published", "discarded"],
  published: ["archived"],
  archived: [],
  discarded: ["draft"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "draft" ||
    value === "published" ||
    value === "archived" ||
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

function mapNote(row: {
  id: string;
  user_id: string;
  title: string;
  note: string;
  status: string;
  version: number;
}): Note {
  const state = isState(row.status) ? row.status : "draft";
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    note: row.note,
    status: state,
    state,
    version: row.version,
  };
}

export function createNote(
  db: DatabaseSync,
  userId: string,
  title: string,
  note = "",
): Note {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO notes (id, user_id, title, note, status, version) VALUES (?, ?, ?, ?, 'draft', 1)",
  ).run(id, userId, title, note);
  return getNote(db, id)!;
}

export function listNotes(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { notes: Note[]; nextCursor: string | null; limit: number } {
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
            `SELECT id, user_id, title, note, status, version
             FROM notes WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, note, status, version
             FROM notes WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapNote>[0]>;
  const notes = rows.map(mapNote);
  const nextCursor =
    notes.length === limit ? notes[notes.length - 1]!.id : null;
  return { notes, nextCursor, limit };
}

export function seedNotes(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO notes (id, user_id, title, note, status, version) VALUES (?, ?, ?, '', 'draft', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `note_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Pad ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getNote(db: DatabaseSync, id: string): Note | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, note, status, version FROM notes WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapNote>[0] | undefined;
  return row ? mapNote(row) : undefined;
}

export function updateNote(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; note?: string },
): Note | undefined {
  const existing = getNote(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const note = patch.note ?? existing.note;
  db.prepare("UPDATE notes SET title = ?, note = ? WHERE id = ?").run(
    title,
    note,
    id,
  );
  return getNote(db, id);
}

export type TransitionResult =
  | { ok: true; request: Note }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionNote(
  db: DatabaseSync,
  noteId: string,
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
  const existing = getNote(db, noteId);
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
      "UPDATE notes SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, noteId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO note_audit (id, note_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), noteId, userId, existing.state, to, at);
  const updated = getNote(db, noteId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listNoteAudit(
  db: DatabaseSync,
  noteId: string,
  userId: string,
): AuditEntry[] | null {
  const note = getNote(db, noteId);
  if (!note || note.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, note_id AS noteId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM note_audit WHERE note_id = ? ORDER BY at ASC`,
    )
    .all(noteId) as AuditEntry[];
}

export function deleteNote(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM notes WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, padId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM pad_members WHERE pad_id = ? AND user_id = ?")
    .get(padId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createPad(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO pads (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO pad_members (pad_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getPad(
  db: DatabaseSync,
  padId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM pads WHERE id = ?")
    .get(padId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addPadMember(
  db: DatabaseSync,
  padId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO pad_members (pad_id, user_id, role) VALUES (?, ?, ?)",
  ).run(padId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  padId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; padId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, pad_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, padId, title, notes, createdBy);
  return { id, padId, title, notes };
}

export function getTaskPadId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT pad_id AS padId FROM tasks WHERE id = ?")
    .get(taskId) as { padId: string } | undefined;
  return row?.padId ?? null;
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
