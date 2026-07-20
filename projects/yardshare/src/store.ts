import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "listed" | "borrowed" | "returned" | "discarded";

export type Tool = {
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
  toolId: string;
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

function mapTool(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Tool {
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

export function createTool(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Tool {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tools (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'listed', 1)",
  ).run(id, userId, title, body);
  return getTool(db, id)!;
}

export function listTools(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { tools: Tool[]; nextCursor: string | null; limit: number } {
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
             FROM tools WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM tools WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapTool>[0]>;
  const tools = rows.map(mapTool);
  const nextCursor =
    tools.length === limit ? tools[tools.length - 1]!.id : null;
  return { tools, nextCursor, limit };
}

export function seedTools(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO tools (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'listed', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `tool_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Shed ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getTool(db: DatabaseSync, id: string): Tool | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM tools WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapTool>[0] | undefined;
  return row ? mapTool(row) : undefined;
}

export function updateTool(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Tool | undefined {
  const existing = getTool(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE tools SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getTool(db, id);
}

export type TransitionResult =
  | { ok: true; request: Tool }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionTool(
  db: DatabaseSync,
  toolId: string,
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
  const existing = getTool(db, toolId);
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
      "UPDATE tools SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, toolId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO tool_audit (id, tool_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), toolId, userId, existing.state, to, at);
  const updated = getTool(db, toolId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listToolAudit(
  db: DatabaseSync,
  toolId: string,
  userId: string,
): AuditEntry[] | null {
  const tool = getTool(db, toolId);
  if (!tool || tool.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, tool_id AS toolId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM tool_audit WHERE tool_id = ? ORDER BY at ASC`,
    )
    .all(toolId) as AuditEntry[];
}

export function deleteTool(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM tools WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, shedId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM shed_members WHERE shed_id = ? AND user_id = ?")
    .get(shedId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createShed(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO sheds (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO shed_members (shed_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getShed(
  db: DatabaseSync,
  shedId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM sheds WHERE id = ?")
    .get(shedId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addShedMember(
  db: DatabaseSync,
  shedId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO shed_members (shed_id, user_id, role) VALUES (?, ?, ?)",
  ).run(shedId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  shedId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; shedId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, shed_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, shedId, title, notes, createdBy);
  return { id, shedId, title, notes };
}

export function getTaskShedId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT shed_id AS shedId FROM tasks WHERE id = ?")
    .get(taskId) as { shedId: string } | undefined;
  return row?.shedId ?? null;
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
