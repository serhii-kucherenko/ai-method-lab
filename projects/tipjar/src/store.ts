import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "pledged" | "collected" | "thanked" | "discarded";

export type Tip = {
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
  tipId: string;
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
  pledged: ["collected", "discarded"],
  collected: ["thanked"],
  thanked: [],
  discarded: ["pledged"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "pledged" ||
    value === "collected" ||
    value === "thanked" ||
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

function mapTip(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Tip {
  const state = isState(row.status) ? row.status : "pledged";
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

export function createTip(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Tip {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tips (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'pledged', 1)",
  ).run(id, userId, title, body);
  return getTip(db, id)!;
}

export function listTips(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { tips: Tip[]; nextCursor: string | null; limit: number } {
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
             FROM tips WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM tips WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapTip>[0]>;
  const tips = rows.map(mapTip);
  const nextCursor =
    tips.length === limit ? tips[tips.length - 1]!.id : null;
  return { tips, nextCursor, limit };
}

export function seedTips(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO tips (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'pledged', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `tip_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Jar ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getTip(db: DatabaseSync, id: string): Tip | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM tips WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapTip>[0] | undefined;
  return row ? mapTip(row) : undefined;
}

export function updateTip(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Tip | undefined {
  const existing = getTip(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE tips SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getTip(db, id);
}

export type TransitionResult =
  | { ok: true; request: Tip }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionTip(
  db: DatabaseSync,
  tipId: string,
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
  const existing = getTip(db, tipId);
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
      "UPDATE tips SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, tipId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO tip_audit (id, tip_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), tipId, userId, existing.state, to, at);
  const updated = getTip(db, tipId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listTipAudit(
  db: DatabaseSync,
  tipId: string,
  userId: string,
): AuditEntry[] | null {
  const tip = getTip(db, tipId);
  if (!tip || tip.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, tip_id AS tipId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM tip_audit WHERE tip_id = ? ORDER BY at ASC`,
    )
    .all(tipId) as AuditEntry[];
}

export function deleteTip(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM tips WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, jarId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM jar_members WHERE jar_id = ? AND user_id = ?")
    .get(jarId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createJar(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO jars (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO jar_members (jar_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getJar(
  db: DatabaseSync,
  jarId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM jars WHERE id = ?")
    .get(jarId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addJarMember(
  db: DatabaseSync,
  jarId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO jar_members (jar_id, user_id, role) VALUES (?, ?, ?)",
  ).run(jarId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  jarId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; jarId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, jar_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, jarId, title, notes, createdBy);
  return { id, jarId, title, notes };
}

export function getTaskJarId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT jar_id AS jarId FROM tasks WHERE id = ?")
    .get(taskId) as { jarId: string } | undefined;
  return row?.jarId ?? null;
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
