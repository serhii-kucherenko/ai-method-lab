import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "scheduled" | "in_care" | "released" | "discarded";

export type Visit = {
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
  visitId: string;
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
  scheduled: ["in_care", "discarded"],
  in_care: ["released"],
  released: [],
  discarded: ["scheduled"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "scheduled" ||
    value === "in_care" ||
    value === "released" ||
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

function mapVisit(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Visit {
  const state = isState(row.status) ? row.status : "scheduled";
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

export function createVisit(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Visit {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO visits (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'scheduled', 1)",
  ).run(id, userId, title, body);
  return getVisit(db, id)!;
}

export function listVisits(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { visits: Visit[]; nextCursor: string | null; limit: number } {
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
             FROM visits WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM visits WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapVisit>[0]>;
  const visits = rows.map(mapVisit);
  const nextCursor =
    visits.length === limit ? visits[visits.length - 1]!.id : null;
  return { visits, nextCursor, limit };
}

export function seedVisits(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO visits (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'scheduled', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `visit_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Kennel ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getVisit(db: DatabaseSync, id: string): Visit | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM visits WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapVisit>[0] | undefined;
  return row ? mapVisit(row) : undefined;
}

export function updateVisit(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Visit | undefined {
  const existing = getVisit(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE visits SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getVisit(db, id);
}

export type TransitionResult =
  | { ok: true; request: Visit }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionVisit(
  db: DatabaseSync,
  visitId: string,
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
  const existing = getVisit(db, visitId);
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
      "UPDATE visits SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, visitId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO visit_audit (id, visit_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), visitId, userId, existing.state, to, at);
  const updated = getVisit(db, visitId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listVisitAudit(
  db: DatabaseSync,
  visitId: string,
  userId: string,
): AuditEntry[] | null {
  const visit = getVisit(db, visitId);
  if (!visit || visit.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, visit_id AS visitId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM visit_audit WHERE visit_id = ? ORDER BY at ASC`,
    )
    .all(visitId) as AuditEntry[];
}

export function deleteVisit(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM visits WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, kennelId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM kennel_members WHERE kennel_id = ? AND user_id = ?")
    .get(kennelId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createKennel(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO kennels (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO kennel_members (kennel_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getKennel(
  db: DatabaseSync,
  kennelId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM kennels WHERE id = ?")
    .get(kennelId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addKennelMember(
  db: DatabaseSync,
  kennelId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO kennel_members (kennel_id, user_id, role) VALUES (?, ?, ?)",
  ).run(kennelId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  kennelId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; kennelId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, kennel_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, kennelId, title, notes, createdBy);
  return { id, kennelId, title, notes };
}

export function getTaskKennelId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT kennel_id AS kennelId FROM tasks WHERE id = ?")
    .get(taskId) as { kennelId: string } | undefined;
  return row?.kennelId ?? null;
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
