import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "queued" | "washing" | "dried" | "discarded";

export type Load = {
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
  loadId: string;
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
  queued: ["washing", "discarded"],
  washing: ["dried"],
  dried: [],
  discarded: ["queued"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "queued" ||
    value === "washing" ||
    value === "dried" ||
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

function mapLoad(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Load {
  const state = isState(row.status) ? row.status : "queued";
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

export function createLoad(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Load {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO loads (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'queued', 1)",
  ).run(id, userId, title, body);
  return getLoad(db, id)!;
}

export function listLoads(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { loads: Load[]; nextCursor: string | null; limit: number } {
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
             FROM loads WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM loads WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapLoad>[0]>;
  const loads = rows.map(mapLoad);
  const nextCursor =
    loads.length === limit ? loads[loads.length - 1]!.id : null;
  return { loads, nextCursor, limit };
}

export function seedLoads(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO loads (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'queued', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `load_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Room ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getLoad(db: DatabaseSync, id: string): Load | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM loads WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapLoad>[0] | undefined;
  return row ? mapLoad(row) : undefined;
}

export function updateLoad(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Load | undefined {
  const existing = getLoad(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE loads SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getLoad(db, id);
}

export type TransitionResult =
  | { ok: true; request: Load }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionLoad(
  db: DatabaseSync,
  loadId: string,
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
  const existing = getLoad(db, loadId);
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
      "UPDATE loads SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, loadId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO load_audit (id, load_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), loadId, userId, existing.state, to, at);
  const updated = getLoad(db, loadId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listLoadAudit(
  db: DatabaseSync,
  loadId: string,
  userId: string,
): AuditEntry[] | null {
  const load = getLoad(db, loadId);
  if (!load || load.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, load_id AS loadId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM load_audit WHERE load_id = ? ORDER BY at ASC`,
    )
    .all(loadId) as AuditEntry[];
}

export function deleteLoad(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM loads WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, roomId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM room_members WHERE room_id = ? AND user_id = ?")
    .get(roomId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createRoom(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO rooms (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO room_members (room_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getRoom(
  db: DatabaseSync,
  roomId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM rooms WHERE id = ?")
    .get(roomId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addRoomMember(
  db: DatabaseSync,
  roomId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO room_members (room_id, user_id, role) VALUES (?, ?, ?)",
  ).run(roomId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  roomId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; roomId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, room_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, roomId, title, notes, createdBy);
  return { id, roomId, title, notes };
}

export function getTaskRoomId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT room_id AS roomId FROM tasks WHERE id = ?")
    .get(taskId) as { roomId: string } | undefined;
  return row?.roomId ?? null;
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
