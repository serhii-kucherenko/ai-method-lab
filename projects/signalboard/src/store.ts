import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "draft" | "in_review" | "approved" | "rejected";

export type Status = {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: WorkflowState;
  state: WorkflowState;
  version: number;
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
  draft: ["in_review"],
  in_review: ["approved", "rejected"],
  approved: [],
  rejected: ["draft"],
};

function isState(v: unknown): v is WorkflowState {
  return (
    v === "draft" || v === "in_review" || v === "approved" || v === "rejected"
  );
}

function mapStatus(row: {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Status {
  const state = isState(row.status) ? row.status : "draft";
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    body: row.body,
    status: state,
    state,
    version: row.version,
  };
}

export type CreateStoreOptions = {
  dbPath?: string;
  dep?: DepClient;
  webhookSecret?: string;
  rateLimit?: number;
};

export function createStore(opts: CreateStoreOptions | string = {}): Store {
  const n = typeof opts === "string" ? { dbPath: opts } : opts;
  return {
    db: openDatabase(n.dbPath ?? ":memory:"),
    dep: n.dep ?? createMockDep(),
    webhookSecret: n.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: n.rateLimit ?? 1000,
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
    .prepare("SELECT user_id FROM tokens WHERE token = ?")
    .get(token) as { user_id: string } | undefined;
  return row?.user_id ?? null;
}

export function getRole(
  db: DatabaseSync,
  projectId: string,
  userId: string,
): Role | null {
  const row = db
    .prepare("SELECT role FROM memberships WHERE project_id = ? AND user_id = ?")
    .get(projectId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createStatus(
  db: DatabaseSync,
  userId: string,
  title: string,
  body: string,
): Status {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO statuses (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'draft', 1)",
  ).run(id, userId, title, body);
  return {
    id,
    userId,
    title,
    body,
    status: "draft",
    state: "draft",
    version: 1,
  };
}

export function listStatuses(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { statuses: Status[]; nextCursor: string | null; limit: number } {
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
            `SELECT id, user_id AS userId, title, body, status, version
             FROM statuses WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id AS userId, title, body, status, version
             FROM statuses WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<{
    id: string;
    userId: string;
    title: string;
    body: string;
    status: string;
    version: number;
  }>;
  const statuses = rows.map(mapStatus);
  const nextCursor =
    statuses.length === limit ? statuses[statuses.length - 1].id : null;
  return { statuses, nextCursor, limit };
}

export function seedStatuses(
  db: DatabaseSync,
  userId: string,
  count: number,
): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO statuses (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'draft', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `st_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Status ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getStatus(
  db: DatabaseSync,
  statusId: string,
  userId: string,
): Status | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id AS userId, title, body, status, version FROM statuses WHERE id = ? AND user_id = ?",
    )
    .get(statusId, userId) as
    | {
        id: string;
        userId: string;
        title: string;
        body: string;
        status: string;
        version: number;
      }
    | undefined;
  return row ? mapStatus(row) : undefined;
}

export function updateStatus(
  db: DatabaseSync,
  statusId: string,
  userId: string,
  patch: { title?: string; body?: string },
): Status | undefined {
  const existing = getStatus(db, statusId, userId);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE statuses SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    statusId,
  );
  return { ...existing, title, body };
}

export function deleteStatus(
  db: DatabaseSync,
  statusId: string,
  userId: string,
): boolean {
  return (
    db.prepare("DELETE FROM statuses WHERE id = ? AND user_id = ?").run(statusId, userId)
      .changes > 0
  );
}

export type TransitionResult =
  | { ok: true; request: Status }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionStatus(
  db: DatabaseSync,
  statusId: string,
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
  const existing = getStatus(db, statusId, userId);
  if (!existing) return { ok: false, status: 404, error: "not found" };
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
      "UPDATE statuses SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, statusId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO status_audit (id, status_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), statusId, userId, existing.state, to, at);
  const updated = getStatus(db, statusId, userId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listStatusAudit(
  db: DatabaseSync,
  statusId: string,
  userId: string,
) {
  if (!getStatus(db, statusId, userId)) return null;
  return db
    .prepare(
      `SELECT id, status_id AS statusId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM status_audit WHERE status_id = ? ORDER BY at ASC`,
    )
    .all(statusId);
}
