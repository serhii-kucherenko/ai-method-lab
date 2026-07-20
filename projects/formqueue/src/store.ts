import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "submitted" | "reviewed" | "closed" | "discarded";

export type Form = {
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
  formId: string;
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
  submitted: ["reviewed", "discarded"],
  reviewed: ["closed"],
  closed: [],
  discarded: ["submitted"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "submitted" ||
    value === "reviewed" ||
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

function mapForm(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Form {
  const state = isState(row.status) ? row.status : "submitted";
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

export function createForm(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Form {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO forms (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'submitted', 1)",
  ).run(id, userId, title, body);
  return getForm(db, id)!;
}

export function listForms(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { forms: Form[]; nextCursor: string | null; limit: number } {
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
             FROM forms WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM forms WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapForm>[0]>;
  const forms = rows.map(mapForm);
  const nextCursor =
    forms.length === limit ? forms[forms.length - 1]!.id : null;
  return { forms, nextCursor, limit };
}

export function seedForms(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO forms (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'submitted', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `form_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Queue ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getForm(db: DatabaseSync, id: string): Form | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM forms WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapForm>[0] | undefined;
  return row ? mapForm(row) : undefined;
}

export function updateForm(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Form | undefined {
  const existing = getForm(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE forms SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getForm(db, id);
}

export type TransitionResult =
  | { ok: true; request: Form }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionForm(
  db: DatabaseSync,
  formId: string,
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
  const existing = getForm(db, formId);
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
      "UPDATE forms SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, formId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO form_audit (id, form_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), formId, userId, existing.state, to, at);
  const updated = getForm(db, formId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listFormAudit(
  db: DatabaseSync,
  formId: string,
  userId: string,
): AuditEntry[] | null {
  const form = getForm(db, formId);
  if (!form || form.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, form_id AS formId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM form_audit WHERE form_id = ? ORDER BY at ASC`,
    )
    .all(formId) as AuditEntry[];
}

export function deleteForm(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM forms WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, queueId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM queue_members WHERE queue_id = ? AND user_id = ?")
    .get(queueId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createQueue(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO queues (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO queue_members (queue_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getQueue(
  db: DatabaseSync,
  queueId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM queues WHERE id = ?")
    .get(queueId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addQueueMember(
  db: DatabaseSync,
  queueId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO queue_members (queue_id, user_id, role) VALUES (?, ?, ?)",
  ).run(queueId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  queueId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; queueId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, queue_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, queueId, title, notes, createdBy);
  return { id, queueId, title, notes };
}

export function getTaskQueueId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT queue_id AS queueId FROM tasks WHERE id = ?")
    .get(taskId) as { queueId: string } | undefined;
  return row?.queueId ?? null;
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
