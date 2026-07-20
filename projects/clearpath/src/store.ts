import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "draft" | "in_review" | "approved" | "rejected";

export type RequestItem = {
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
  requestId: string;
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
  /** Max authenticated requests per token before 429 (tests may lower). */
  rateLimit: number;
  rateCounts: Map<string, number>;
};

const LEGAL: Record<WorkflowState, WorkflowState[]> = {
  draft: ["in_review"],
  in_review: ["approved", "rejected"],
  approved: [],
  rejected: ["draft"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "draft" ||
    value === "in_review" ||
    value === "approved" ||
    value === "rejected"
  );
}

function mapRequest(row: {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): RequestItem {
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

export function createStore(opts: CreateStoreOptions = {}): Store {
  return {
    db: openDatabase(opts.dbPath ?? ":memory:"),
    dep: opts.dep ?? createMockDep(),
    webhookSecret: opts.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: opts.rateLimit ?? 1000,
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

export function createRequest(
  db: DatabaseSync,
  userId: string,
  title: string,
  body: string,
): RequestItem {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO requests (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'draft', 1)",
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

export function listRequests(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { requests: RequestItem[]; nextCursor: string | null; limit: number } {
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
             FROM requests WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id AS userId, title, body, status, version
             FROM requests WHERE user_id = ?
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

  const requests = rows.map(mapRequest);
  const nextCursor =
    requests.length === limit ? requests[requests.length - 1].id : null;
  return { requests, nextCursor, limit };
}

export function seedRequests(
  db: DatabaseSync,
  userId: string,
  count: number,
): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO requests (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'draft', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `req_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Request ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getRequest(
  db: DatabaseSync,
  requestId: string,
  userId: string,
): RequestItem | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id AS userId, title, body, status, version FROM requests WHERE id = ? AND user_id = ?",
    )
    .get(requestId, userId) as
    | {
        id: string;
        userId: string;
        title: string;
        body: string;
        status: string;
        version: number;
      }
    | undefined;
  return row ? mapRequest(row) : undefined;
}

export function updateRequest(
  db: DatabaseSync,
  requestId: string,
  userId: string,
  patch: { title?: string; body?: string },
): RequestItem | undefined {
  const existing = getRequest(db, requestId, userId);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE requests SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    requestId,
  );
  return { ...existing, title, body };
}

export function deleteRequest(
  db: DatabaseSync,
  requestId: string,
  userId: string,
): boolean {
  const result = db
    .prepare("DELETE FROM requests WHERE id = ? AND user_id = ?")
    .run(requestId, userId);
  return result.changes > 0;
}

export type TransitionResult =
  | { ok: true; request: RequestItem }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionRequest(
  db: DatabaseSync,
  requestId: string,
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
  const existing = getRequest(db, requestId, userId);
  if (!existing) {
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
      "UPDATE requests SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, requestId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }

  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO request_audit (id, request_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), requestId, userId, existing.state, to, at);

  const updated = getRequest(db, requestId, userId);
  if (!updated) {
    return { ok: false, status: 404, error: "not found" };
  }
  return { ok: true, request: updated };
}

export function listAudit(
  db: DatabaseSync,
  requestId: string,
  userId: string,
): AuditEntry[] | null {
  if (!getRequest(db, requestId, userId)) return null;
  const rows = db
    .prepare(
      `SELECT id, request_id AS requestId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM request_audit WHERE request_id = ? ORDER BY at ASC`,
    )
    .all(requestId) as AuditEntry[];
  return rows;
}
