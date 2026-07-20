import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "open" | "occupied" | "cleared" | "discarded";

export type Desk = {
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
  deskId: string;
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
  open: ["occupied", "discarded"],
  occupied: ["cleared"],
  cleared: [],
  discarded: ["open"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "open" ||
    value === "occupied" ||
    value === "cleared" ||
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

function mapDesk(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Desk {
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

export function createDesk(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Desk {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO desks (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'open', 1)",
  ).run(id, userId, title, body);
  return getDesk(db, id)!;
}

export function listDesks(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { desks: Desk[]; nextCursor: string | null; limit: number } {
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
             FROM desks WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM desks WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapDesk>[0]>;
  const desks = rows.map(mapDesk);
  const nextCursor =
    desks.length === limit ? desks[desks.length - 1]!.id : null;
  return { desks, nextCursor, limit };
}

export function seedDesks(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO desks (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'open', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `desk_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Space ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getDesk(db: DatabaseSync, id: string): Desk | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM desks WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapDesk>[0] | undefined;
  return row ? mapDesk(row) : undefined;
}

export function updateDesk(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Desk | undefined {
  const existing = getDesk(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE desks SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getDesk(db, id);
}

export type TransitionResult =
  | { ok: true; request: Desk }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionDesk(
  db: DatabaseSync,
  deskId: string,
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
  const existing = getDesk(db, deskId);
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
      "UPDATE desks SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, deskId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO desk_audit (id, desk_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), deskId, userId, existing.state, to, at);
  const updated = getDesk(db, deskId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listDeskAudit(
  db: DatabaseSync,
  deskId: string,
  userId: string,
): AuditEntry[] | null {
  const desk = getDesk(db, deskId);
  if (!desk || desk.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, desk_id AS deskId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM desk_audit WHERE desk_id = ? ORDER BY at ASC`,
    )
    .all(deskId) as AuditEntry[];
}

export function deleteDesk(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM desks WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, spaceId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM space_members WHERE space_id = ? AND user_id = ?")
    .get(spaceId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createSpace(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO spaces (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO space_members (space_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getSpace(
  db: DatabaseSync,
  spaceId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM spaces WHERE id = ?")
    .get(spaceId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addSpaceMember(
  db: DatabaseSync,
  spaceId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO space_members (space_id, user_id, role) VALUES (?, ?, ?)",
  ).run(spaceId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  spaceId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; spaceId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, space_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, spaceId, title, notes, createdBy);
  return { id, spaceId, title, notes };
}

export function getTaskSpaceId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT space_id AS spaceId FROM tasks WHERE id = ?")
    .get(taskId) as { spaceId: string } | undefined;
  return row?.spaceId ?? null;
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
