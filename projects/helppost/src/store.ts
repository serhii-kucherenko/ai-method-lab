import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "posted" | "claimed" | "resolved" | "discarded";

export type Request = {
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
  requestId: string;
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
  posted: ["claimed", "discarded"],
  claimed: ["resolved"],
  resolved: [],
  discarded: ["posted"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "posted" ||
    value === "claimed" ||
    value === "resolved" ||
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

function mapRequest(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Request {
  const state = isState(row.status) ? row.status : "posted";
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

export function createRequest(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Request {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO requests (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'posted', 1)",
  ).run(id, userId, title, body);
  return getRequest(db, id)!;
}

export function listRequests(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { requests: Request[]; nextCursor: string | null; limit: number } {
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
             FROM requests WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM requests WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapRequest>[0]>;
  const requests = rows.map(mapRequest);
  const nextCursor =
    requests.length === limit ? requests[requests.length - 1]!.id : null;
  return { requests, nextCursor, limit };
}

export function seedRequests(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO requests (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'posted', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `request_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Board ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getRequest(db: DatabaseSync, id: string): Request | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM requests WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapRequest>[0] | undefined;
  return row ? mapRequest(row) : undefined;
}

export function updateRequest(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Request | undefined {
  const existing = getRequest(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE requests SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getRequest(db, id);
}

export type TransitionResult =
  | { ok: true; request: Request }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionRequest(
  db: DatabaseSync,
  requestId: string,
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
  const existing = getRequest(db, requestId);
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
      "UPDATE requests SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, requestId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO request_audit (id, request_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), requestId, userId, existing.state, to, at);
  const updated = getRequest(db, requestId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listRequestAudit(
  db: DatabaseSync,
  requestId: string,
  userId: string,
): AuditEntry[] | null {
  const request = getRequest(db, requestId);
  if (!request || request.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, request_id AS requestId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM request_audit WHERE request_id = ? ORDER BY at ASC`,
    )
    .all(requestId) as AuditEntry[];
}

export function deleteRequest(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM requests WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, boardId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM board_members WHERE board_id = ? AND user_id = ?")
    .get(boardId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createBoard(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO boards (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getBoard(
  db: DatabaseSync,
  boardId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM boards WHERE id = ?")
    .get(boardId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addBoardMember(
  db: DatabaseSync,
  boardId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO board_members (board_id, user_id, role) VALUES (?, ?, ?)",
  ).run(boardId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  boardId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; boardId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, board_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, boardId, title, notes, createdBy);
  return { id, boardId, title, notes };
}

export function getTaskBoardId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT board_id AS boardId FROM tasks WHERE id = ?")
    .get(taskId) as { boardId: string } | undefined;
  return row?.boardId ?? null;
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
