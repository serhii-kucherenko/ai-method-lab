import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "listed" | "reserved" | "picked_up" | "discarded";

export type Stock = {
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
  stockId: string;
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
  listed: ["reserved", "discarded"],
  reserved: ["picked_up"],
  picked_up: [],
  discarded: ["listed"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "listed" ||
    value === "reserved" ||
    value === "picked_up" ||
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

function mapStock(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Stock {
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

export function createStock(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Stock {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO stocks (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'listed', 1)",
  ).run(id, userId, title, body);
  return getStock(db, id)!;
}

export function listStocks(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { stocks: Stock[]; nextCursor: string | null; limit: number } {
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
             FROM stocks WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM stocks WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapStock>[0]>;
  const stocks = rows.map(mapStock);
  const nextCursor =
    stocks.length === limit ? stocks[stocks.length - 1]!.id : null;
  return { stocks, nextCursor, limit };
}

export function seedStocks(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO stocks (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'listed', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `stock_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Pantry ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getStock(db: DatabaseSync, id: string): Stock | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM stocks WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapStock>[0] | undefined;
  return row ? mapStock(row) : undefined;
}

export function updateStock(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Stock | undefined {
  const existing = getStock(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE stocks SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getStock(db, id);
}

export type TransitionResult =
  | { ok: true; request: Stock }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionStock(
  db: DatabaseSync,
  stockId: string,
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
  const existing = getStock(db, stockId);
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
      "UPDATE stocks SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, stockId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO stock_audit (id, stock_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), stockId, userId, existing.state, to, at);
  const updated = getStock(db, stockId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listStockAudit(
  db: DatabaseSync,
  stockId: string,
  userId: string,
): AuditEntry[] | null {
  const stock = getStock(db, stockId);
  if (!stock || stock.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, stock_id AS stockId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM stock_audit WHERE stock_id = ? ORDER BY at ASC`,
    )
    .all(stockId) as AuditEntry[];
}

export function deleteStock(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM stocks WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, pantryId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM pantry_members WHERE pantry_id = ? AND user_id = ?")
    .get(pantryId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createPantry(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO pantries (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO pantry_members (pantry_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getPantry(
  db: DatabaseSync,
  pantryId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM pantries WHERE id = ?")
    .get(pantryId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addPantryMember(
  db: DatabaseSync,
  pantryId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO pantry_members (pantry_id, user_id, role) VALUES (?, ?, ?)",
  ).run(pantryId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  pantryId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; pantryId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, pantry_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, pantryId, title, notes, createdBy);
  return { id, pantryId, title, notes };
}

export function getTaskPantryId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT pantry_id AS pantryId FROM tasks WHERE id = ?")
    .get(taskId) as { pantryId: string } | undefined;
  return row?.pantryId ?? null;
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
