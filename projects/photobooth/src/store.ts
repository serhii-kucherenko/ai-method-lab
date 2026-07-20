import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "ready" | "shooting" | "printed" | "discarded";

export type Session = {
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
  sessionId: string;
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
  ready: ["shooting", "discarded"],
  shooting: ["printed"],
  printed: [],
  discarded: ["ready"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "ready" ||
    value === "shooting" ||
    value === "printed" ||
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

function mapSession(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Session {
  const state = isState(row.status) ? row.status : "ready";
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

export function createSession(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Session {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO sessions (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'ready', 1)",
  ).run(id, userId, title, body);
  return getSession(db, id)!;
}

export function listSessions(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { sessions: Session[]; nextCursor: string | null; limit: number } {
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
             FROM sessions WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM sessions WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapSession>[0]>;
  const sessions = rows.map(mapSession);
  const nextCursor =
    sessions.length === limit ? sessions[sessions.length - 1]!.id : null;
  return { sessions, nextCursor, limit };
}

export function seedSessions(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO sessions (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'ready', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `session_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Booth ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getSession(db: DatabaseSync, id: string): Session | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM sessions WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapSession>[0] | undefined;
  return row ? mapSession(row) : undefined;
}

export function updateSession(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Session | undefined {
  const existing = getSession(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE sessions SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getSession(db, id);
}

export type TransitionResult =
  | { ok: true; request: Session }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionSession(
  db: DatabaseSync,
  sessionId: string,
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
  const existing = getSession(db, sessionId);
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
      "UPDATE sessions SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, sessionId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO session_audit (id, session_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), sessionId, userId, existing.state, to, at);
  const updated = getSession(db, sessionId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listSessionAudit(
  db: DatabaseSync,
  sessionId: string,
  userId: string,
): AuditEntry[] | null {
  const session = getSession(db, sessionId);
  if (!session || session.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, session_id AS sessionId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM session_audit WHERE session_id = ? ORDER BY at ASC`,
    )
    .all(sessionId) as AuditEntry[];
}

export function deleteSession(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, boothId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM booth_members WHERE booth_id = ? AND user_id = ?")
    .get(boothId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createBooth(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO booths (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO booth_members (booth_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getBooth(
  db: DatabaseSync,
  boothId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM booths WHERE id = ?")
    .get(boothId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addBoothMember(
  db: DatabaseSync,
  boothId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO booth_members (booth_id, user_id, role) VALUES (?, ?, ?)",
  ).run(boothId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  boothId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; boothId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, booth_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, boothId, title, notes, createdBy);
  return { id, boothId, title, notes };
}

export function getTaskBoothId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT booth_id AS boothId FROM tasks WHERE id = ?")
    .get(taskId) as { boothId: string } | undefined;
  return row?.boothId ?? null;
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
