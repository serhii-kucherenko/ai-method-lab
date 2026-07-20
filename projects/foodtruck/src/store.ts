import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "parked" | "serving" | "packed" | "discarded";

export type Stop = {
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
  stopId: string;
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
  parked: ["serving", "discarded"],
  serving: ["packed"],
  packed: [],
  discarded: ["parked"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "parked" ||
    value === "serving" ||
    value === "packed" ||
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

function mapStop(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Stop {
  const state = isState(row.status) ? row.status : "parked";
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

export function createStop(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Stop {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO stops (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'parked', 1)",
  ).run(id, userId, title, body);
  return getStop(db, id)!;
}

export function listStops(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { stops: Stop[]; nextCursor: string | null; limit: number } {
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
             FROM stops WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM stops WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapStop>[0]>;
  const stops = rows.map(mapStop);
  const nextCursor =
    stops.length === limit ? stops[stops.length - 1]!.id : null;
  return { stops, nextCursor, limit };
}

export function seedStops(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO stops (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'parked', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `stop_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Lot ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getStop(db: DatabaseSync, id: string): Stop | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM stops WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapStop>[0] | undefined;
  return row ? mapStop(row) : undefined;
}

export function updateStop(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Stop | undefined {
  const existing = getStop(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE stops SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getStop(db, id);
}

export type TransitionResult =
  | { ok: true; request: Stop }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionStop(
  db: DatabaseSync,
  stopId: string,
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
  const existing = getStop(db, stopId);
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
      "UPDATE stops SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, stopId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO stop_audit (id, stop_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), stopId, userId, existing.state, to, at);
  const updated = getStop(db, stopId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listStopAudit(
  db: DatabaseSync,
  stopId: string,
  userId: string,
): AuditEntry[] | null {
  const stop = getStop(db, stopId);
  if (!stop || stop.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, stop_id AS stopId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM stop_audit WHERE stop_id = ? ORDER BY at ASC`,
    )
    .all(stopId) as AuditEntry[];
}

export function deleteStop(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM stops WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, lotId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM lot_members WHERE lot_id = ? AND user_id = ?")
    .get(lotId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createLot(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO lots (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO lot_members (lot_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getLot(
  db: DatabaseSync,
  lotId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM lots WHERE id = ?")
    .get(lotId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addLotMember(
  db: DatabaseSync,
  lotId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO lot_members (lot_id, user_id, role) VALUES (?, ?, ?)",
  ).run(lotId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  lotId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; lotId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, lot_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, lotId, title, notes, createdBy);
  return { id, lotId, title, notes };
}

export function getTaskLotId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT lot_id AS lotId FROM tasks WHERE id = ?")
    .get(taskId) as { lotId: string } | undefined;
  return row?.lotId ?? null;
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
