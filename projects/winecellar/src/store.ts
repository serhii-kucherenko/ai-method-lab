import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "cellared" | "tasting" | "emptied" | "discarded";

export type Bottle = {
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
  bottleId: string;
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
  cellared: ["tasting", "discarded"],
  tasting: ["emptied"],
  emptied: [],
  discarded: ["cellared"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "cellared" ||
    value === "tasting" ||
    value === "emptied" ||
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

function mapBottle(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Bottle {
  const state = isState(row.status) ? row.status : "cellared";
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

export function createBottle(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Bottle {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO bottles (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'cellared', 1)",
  ).run(id, userId, title, body);
  return getBottle(db, id)!;
}

export function listBottles(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { bottles: Bottle[]; nextCursor: string | null; limit: number } {
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
             FROM bottles WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM bottles WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapBottle>[0]>;
  const bottles = rows.map(mapBottle);
  const nextCursor =
    bottles.length === limit ? bottles[bottles.length - 1]!.id : null;
  return { bottles, nextCursor, limit };
}

export function seedBottles(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO bottles (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'cellared', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `bottle_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Cellar ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getBottle(db: DatabaseSync, id: string): Bottle | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM bottles WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapBottle>[0] | undefined;
  return row ? mapBottle(row) : undefined;
}

export function updateBottle(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Bottle | undefined {
  const existing = getBottle(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE bottles SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getBottle(db, id);
}

export type TransitionResult =
  | { ok: true; request: Bottle }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionBottle(
  db: DatabaseSync,
  bottleId: string,
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
  const existing = getBottle(db, bottleId);
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
      "UPDATE bottles SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, bottleId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO bottle_audit (id, bottle_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), bottleId, userId, existing.state, to, at);
  const updated = getBottle(db, bottleId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listBottleAudit(
  db: DatabaseSync,
  bottleId: string,
  userId: string,
): AuditEntry[] | null {
  const bottle = getBottle(db, bottleId);
  if (!bottle || bottle.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, bottle_id AS bottleId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM bottle_audit WHERE bottle_id = ? ORDER BY at ASC`,
    )
    .all(bottleId) as AuditEntry[];
}

export function deleteBottle(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM bottles WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, cellarId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM cellar_members WHERE cellar_id = ? AND user_id = ?")
    .get(cellarId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createCellar(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO cellars (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO cellar_members (cellar_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getCellar(
  db: DatabaseSync,
  cellarId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM cellars WHERE id = ?")
    .get(cellarId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addCellarMember(
  db: DatabaseSync,
  cellarId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO cellar_members (cellar_id, user_id, role) VALUES (?, ?, ?)",
  ).run(cellarId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  cellarId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; cellarId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, cellar_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, cellarId, title, notes, createdBy);
  return { id, cellarId, title, notes };
}

export function getTaskCellarId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT cellar_id AS cellarId FROM tasks WHERE id = ?")
    .get(taskId) as { cellarId: string } | undefined;
  return row?.cellarId ?? null;
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
