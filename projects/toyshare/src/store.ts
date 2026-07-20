import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "listed" | "borrowed" | "returned" | "discarded";

export type Toy = {
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
  toyId: string;
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
  listed: ["borrowed", "discarded"],
  borrowed: ["returned"],
  returned: [],
  discarded: ["listed"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "listed" ||
    value === "borrowed" ||
    value === "returned" ||
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

function mapToy(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Toy {
  const state = isState(row.status) ? row.status : "listed";
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

export function createToy(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Toy {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO toys (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'listed', 1)",
  ).run(id, userId, title, body);
  return getToy(db, id)!;
}

export function listToys(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { toys: Toy[]; nextCursor: string | null; limit: number } {
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
             FROM toys WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM toys WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapToy>[0]>;
  const toys = rows.map(mapToy);
  const nextCursor =
    toys.length === limit ? toys[toys.length - 1]!.id : null;
  return { toys, nextCursor, limit };
}

export function seedToys(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO toys (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'listed', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `toy_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Shelf ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getToy(db: DatabaseSync, id: string): Toy | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM toys WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapToy>[0] | undefined;
  return row ? mapToy(row) : undefined;
}

export function updateToy(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Toy | undefined {
  const existing = getToy(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE toys SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getToy(db, id);
}

export type TransitionResult =
  | { ok: true; request: Toy }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionToy(
  db: DatabaseSync,
  toyId: string,
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
  const existing = getToy(db, toyId);
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
      "UPDATE toys SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, toyId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO toy_audit (id, toy_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), toyId, userId, existing.state, to, at);
  const updated = getToy(db, toyId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listToyAudit(
  db: DatabaseSync,
  toyId: string,
  userId: string,
): AuditEntry[] | null {
  const toy = getToy(db, toyId);
  if (!toy || toy.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, toy_id AS toyId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM toy_audit WHERE toy_id = ? ORDER BY at ASC`,
    )
    .all(toyId) as AuditEntry[];
}

export function deleteToy(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM toys WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, shelfId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM shelf_members WHERE shelf_id = ? AND user_id = ?")
    .get(shelfId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createShelf(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO shelves (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO shelf_members (shelf_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getShelf(
  db: DatabaseSync,
  shelfId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM shelves WHERE id = ?")
    .get(shelfId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addShelfMember(
  db: DatabaseSync,
  shelfId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO shelf_members (shelf_id, user_id, role) VALUES (?, ?, ?)",
  ).run(shelfId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  shelfId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; shelfId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, shelf_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, shelfId, title, notes, createdBy);
  return { id, shelfId, title, notes };
}

export function getTaskShelfId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT shelf_id AS shelfId FROM tasks WHERE id = ?")
    .get(taskId) as { shelfId: string } | undefined;
  return row?.shelfId ?? null;
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
