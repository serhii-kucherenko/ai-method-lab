import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "offered" | "booked" | "finished" | "discarded";

export type Ride = {
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
  rideId: string;
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
  offered: ["booked", "discarded"],
  booked: ["finished"],
  finished: [],
  discarded: ["offered"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "offered" ||
    value === "booked" ||
    value === "finished" ||
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

function mapRide(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Ride {
  const state = isState(row.status) ? row.status : "offered";
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

export function createRide(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Ride {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO rides (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'offered', 1)",
  ).run(id, userId, title, body);
  return getRide(db, id)!;
}

export function listRides(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { rides: Ride[]; nextCursor: string | null; limit: number } {
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
             FROM rides WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM rides WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapRide>[0]>;
  const rides = rows.map(mapRide);
  const nextCursor =
    rides.length === limit ? rides[rides.length - 1]!.id : null;
  return { rides, nextCursor, limit };
}

export function seedRides(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO rides (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'offered', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `ride_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Route ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getRide(db: DatabaseSync, id: string): Ride | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM rides WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapRide>[0] | undefined;
  return row ? mapRide(row) : undefined;
}

export function updateRide(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Ride | undefined {
  const existing = getRide(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE rides SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getRide(db, id);
}

export type TransitionResult =
  | { ok: true; request: Ride }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionRide(
  db: DatabaseSync,
  rideId: string,
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
  const existing = getRide(db, rideId);
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
      "UPDATE rides SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, rideId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO ride_audit (id, ride_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), rideId, userId, existing.state, to, at);
  const updated = getRide(db, rideId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listRideAudit(
  db: DatabaseSync,
  rideId: string,
  userId: string,
): AuditEntry[] | null {
  const ride = getRide(db, rideId);
  if (!ride || ride.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, ride_id AS rideId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM ride_audit WHERE ride_id = ? ORDER BY at ASC`,
    )
    .all(rideId) as AuditEntry[];
}

export function deleteRide(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM rides WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, routeId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM route_members WHERE route_id = ? AND user_id = ?")
    .get(routeId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createRoute(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO routes (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO route_members (route_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getRoute(
  db: DatabaseSync,
  routeId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM routes WHERE id = ?")
    .get(routeId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addRouteMember(
  db: DatabaseSync,
  routeId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO route_members (route_id, user_id, role) VALUES (?, ?, ?)",
  ).run(routeId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  routeId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; routeId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, route_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, routeId, title, notes, createdBy);
  return { id, routeId, title, notes };
}

export function getTaskRouteId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT route_id AS routeId FROM tasks WHERE id = ?")
    .get(taskId) as { routeId: string } | undefined;
  return row?.routeId ?? null;
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
