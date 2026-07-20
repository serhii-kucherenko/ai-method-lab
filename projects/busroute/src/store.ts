import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "scheduled" | "boarding" | "arrived" | "discarded";

export type Trip = {
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
  tripId: string;
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
  scheduled: ["boarding", "discarded"],
  boarding: ["arrived"],
  arrived: [],
  discarded: ["scheduled"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "scheduled" ||
    value === "boarding" ||
    value === "arrived" ||
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

function mapTrip(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Trip {
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

export function createTrip(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Trip {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO trips (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'scheduled', 1)",
  ).run(id, userId, title, body);
  return getTrip(db, id)!;
}

export function listTrips(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { trips: Trip[]; nextCursor: string | null; limit: number } {
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
             FROM trips WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM trips WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapTrip>[0]>;
  const trips = rows.map(mapTrip);
  const nextCursor =
    trips.length === limit ? trips[trips.length - 1]!.id : null;
  return { trips, nextCursor, limit };
}

export function seedTrips(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO trips (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'scheduled', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `trip_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Depot ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getTrip(db: DatabaseSync, id: string): Trip | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM trips WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapTrip>[0] | undefined;
  return row ? mapTrip(row) : undefined;
}

export function updateTrip(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Trip | undefined {
  const existing = getTrip(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE trips SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getTrip(db, id);
}

export type TransitionResult =
  | { ok: true; request: Trip }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionTrip(
  db: DatabaseSync,
  tripId: string,
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
  const existing = getTrip(db, tripId);
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
      "UPDATE trips SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, tripId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO trip_audit (id, trip_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), tripId, userId, existing.state, to, at);
  const updated = getTrip(db, tripId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listTripAudit(
  db: DatabaseSync,
  tripId: string,
  userId: string,
): AuditEntry[] | null {
  const trip = getTrip(db, tripId);
  if (!trip || trip.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, trip_id AS tripId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM trip_audit WHERE trip_id = ? ORDER BY at ASC`,
    )
    .all(tripId) as AuditEntry[];
}

export function deleteTrip(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM trips WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, depotId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM depot_members WHERE depot_id = ? AND user_id = ?")
    .get(depotId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createDepot(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO depots (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO depot_members (depot_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getDepot(
  db: DatabaseSync,
  depotId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM depots WHERE id = ?")
    .get(depotId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addDepotMember(
  db: DatabaseSync,
  depotId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO depot_members (depot_id, user_id, role) VALUES (?, ?, ?)",
  ).run(depotId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  depotId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; depotId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, depot_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, depotId, title, notes, createdBy);
  return { id, depotId, title, notes };
}

export function getTaskDepotId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT depot_id AS depotId FROM tasks WHERE id = ?")
    .get(taskId) as { depotId: string } | undefined;
  return row?.depotId ?? null;
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
