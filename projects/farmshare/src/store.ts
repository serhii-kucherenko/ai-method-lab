import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "available" | "claimed" | "delivered" | "discarded";

export type Share = {
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
  shareId: string;
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
  available: ["claimed", "discarded"],
  claimed: ["delivered"],
  delivered: [],
  discarded: ["available"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "available" ||
    value === "claimed" ||
    value === "delivered" ||
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

function mapShare(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Share {
  const state = isState(row.status) ? row.status : "available";
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

export function createShare(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Share {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO shares (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'available', 1)",
  ).run(id, userId, title, body);
  return getShare(db, id)!;
}

export function listShares(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { shares: Share[]; nextCursor: string | null; limit: number } {
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
             FROM shares WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM shares WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapShare>[0]>;
  const shares = rows.map(mapShare);
  const nextCursor =
    shares.length === limit ? shares[shares.length - 1]!.id : null;
  return { shares, nextCursor, limit };
}

export function seedShares(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO shares (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'available', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `share_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Farm ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getShare(db: DatabaseSync, id: string): Share | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM shares WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapShare>[0] | undefined;
  return row ? mapShare(row) : undefined;
}

export function updateShare(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Share | undefined {
  const existing = getShare(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE shares SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getShare(db, id);
}

export type TransitionResult =
  | { ok: true; request: Share }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionShare(
  db: DatabaseSync,
  shareId: string,
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
  const existing = getShare(db, shareId);
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
      "UPDATE shares SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, shareId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO share_audit (id, share_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), shareId, userId, existing.state, to, at);
  const updated = getShare(db, shareId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listShareAudit(
  db: DatabaseSync,
  shareId: string,
  userId: string,
): AuditEntry[] | null {
  const share = getShare(db, shareId);
  if (!share || share.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, share_id AS shareId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM share_audit WHERE share_id = ? ORDER BY at ASC`,
    )
    .all(shareId) as AuditEntry[];
}

export function deleteShare(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM shares WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, farmId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM farm_members WHERE farm_id = ? AND user_id = ?")
    .get(farmId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createFarm(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO farms (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO farm_members (farm_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getFarm(
  db: DatabaseSync,
  farmId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM farms WHERE id = ?")
    .get(farmId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addFarmMember(
  db: DatabaseSync,
  farmId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO farm_members (farm_id, user_id, role) VALUES (?, ?, ?)",
  ).run(farmId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  farmId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; farmId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, farm_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, farmId, title, notes, createdBy);
  return { id, farmId, title, notes };
}

export function getTaskFarmId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT farm_id AS farmId FROM tasks WHERE id = ?")
    .get(taskId) as { farmId: string } | undefined;
  return row?.farmId ?? null;
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
