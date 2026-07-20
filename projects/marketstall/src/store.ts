import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "held" | "trading" | "closed" | "discarded";

export type Stall = {
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
  stallId: string;
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
  held: ["trading", "discarded"],
  trading: ["closed"],
  closed: [],
  discarded: ["held"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "held" ||
    value === "trading" ||
    value === "closed" ||
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

function mapStall(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Stall {
  const state = isState(row.status) ? row.status : "held";
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

export function createStall(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Stall {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO stalls (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'held', 1)",
  ).run(id, userId, title, body);
  return getStall(db, id)!;
}

export function listStalls(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { stalls: Stall[]; nextCursor: string | null; limit: number } {
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
             FROM stalls WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM stalls WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapStall>[0]>;
  const stalls = rows.map(mapStall);
  const nextCursor =
    stalls.length === limit ? stalls[stalls.length - 1]!.id : null;
  return { stalls, nextCursor, limit };
}

export function seedStalls(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO stalls (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'held', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `stall_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Market ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getStall(db: DatabaseSync, id: string): Stall | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM stalls WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapStall>[0] | undefined;
  return row ? mapStall(row) : undefined;
}

export function updateStall(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Stall | undefined {
  const existing = getStall(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE stalls SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getStall(db, id);
}

export type TransitionResult =
  | { ok: true; request: Stall }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionStall(
  db: DatabaseSync,
  stallId: string,
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
  const existing = getStall(db, stallId);
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
      "UPDATE stalls SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, stallId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO stall_audit (id, stall_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), stallId, userId, existing.state, to, at);
  const updated = getStall(db, stallId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listStallAudit(
  db: DatabaseSync,
  stallId: string,
  userId: string,
): AuditEntry[] | null {
  const stall = getStall(db, stallId);
  if (!stall || stall.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, stall_id AS stallId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM stall_audit WHERE stall_id = ? ORDER BY at ASC`,
    )
    .all(stallId) as AuditEntry[];
}

export function deleteStall(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM stalls WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, marketId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM market_members WHERE market_id = ? AND user_id = ?")
    .get(marketId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createMarket(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO markets (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO market_members (market_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getMarket(
  db: DatabaseSync,
  marketId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM markets WHERE id = ?")
    .get(marketId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addMarketMember(
  db: DatabaseSync,
  marketId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO market_members (market_id, user_id, role) VALUES (?, ?, ?)",
  ).run(marketId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  marketId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; marketId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, market_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, marketId, title, notes, createdBy);
  return { id, marketId, title, notes };
}

export function getTaskMarketId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT market_id AS marketId FROM tasks WHERE id = ?")
    .get(taskId) as { marketId: string } | undefined;
  return row?.marketId ?? null;
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
