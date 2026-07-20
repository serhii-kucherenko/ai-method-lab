import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "reserved" | "fitted" | "returned" | "discarded";

export type Hold = {
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
  holdId: string;
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
  reserved: ["fitted", "discarded"],
  fitted: ["returned"],
  returned: [],
  discarded: ["reserved"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "reserved" ||
    value === "fitted" ||
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

function mapHold(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Hold {
  const state = isState(row.status) ? row.status : "reserved";
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

export function createHold(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Hold {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO holds (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'reserved', 1)",
  ).run(id, userId, title, body);
  return getHold(db, id)!;
}

export function listHolds(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { holds: Hold[]; nextCursor: string | null; limit: number } {
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
             FROM holds WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM holds WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapHold>[0]>;
  const holds = rows.map(mapHold);
  const nextCursor =
    holds.length === limit ? holds[holds.length - 1]!.id : null;
  return { holds, nextCursor, limit };
}

export function seedHolds(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO holds (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'reserved', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `hold_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Lodge ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getHold(db: DatabaseSync, id: string): Hold | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM holds WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapHold>[0] | undefined;
  return row ? mapHold(row) : undefined;
}

export function updateHold(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Hold | undefined {
  const existing = getHold(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE holds SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getHold(db, id);
}

export type TransitionResult =
  | { ok: true; request: Hold }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionHold(
  db: DatabaseSync,
  holdId: string,
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
  const existing = getHold(db, holdId);
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
      "UPDATE holds SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, holdId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO hold_audit (id, hold_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), holdId, userId, existing.state, to, at);
  const updated = getHold(db, holdId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listHoldAudit(
  db: DatabaseSync,
  holdId: string,
  userId: string,
): AuditEntry[] | null {
  const hold = getHold(db, holdId);
  if (!hold || hold.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, hold_id AS holdId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM hold_audit WHERE hold_id = ? ORDER BY at ASC`,
    )
    .all(holdId) as AuditEntry[];
}

export function deleteHold(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM holds WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, lodgeId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM lodge_members WHERE lodge_id = ? AND user_id = ?")
    .get(lodgeId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createLodge(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO lodges (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO lodge_members (lodge_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getLodge(
  db: DatabaseSync,
  lodgeId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM lodges WHERE id = ?")
    .get(lodgeId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addLodgeMember(
  db: DatabaseSync,
  lodgeId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO lodge_members (lodge_id, user_id, role) VALUES (?, ?, ?)",
  ).run(lodgeId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  lodgeId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; lodgeId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, lodge_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, lodgeId, title, notes, createdBy);
  return { id, lodgeId, title, notes };
}

export function getTaskLodgeId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT lodge_id AS lodgeId FROM tasks WHERE id = ?")
    .get(taskId) as { lodgeId: string } | undefined;
  return row?.lodgeId ?? null;
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
