import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "reserved" | "in_use" | "released" | "discarded";

export type Spot = {
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
  spotId: string;
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
  reserved: ["in_use", "discarded"],
  in_use: ["released"],
  released: [],
  discarded: ["reserved"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "reserved" ||
    value === "in_use" ||
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

function mapSpot(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Spot {
  const state = isState(row.status) ? row.status : "reserved";
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

export function createSpot(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Spot {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO spots (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'reserved', 1)",
  ).run(id, userId, title, body);
  return getSpot(db, id)!;
}

export function listSpots(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { spots: Spot[]; nextCursor: string | null; limit: number } {
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
             FROM spots WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM spots WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapSpot>[0]>;
  const spots = rows.map(mapSpot);
  const nextCursor =
    spots.length === limit ? spots[spots.length - 1]!.id : null;
  return { spots, nextCursor, limit };
}

export function seedSpots(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO spots (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'reserved', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `spot_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Gym ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getSpot(db: DatabaseSync, id: string): Spot | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM spots WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapSpot>[0] | undefined;
  return row ? mapSpot(row) : undefined;
}

export function updateSpot(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Spot | undefined {
  const existing = getSpot(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE spots SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getSpot(db, id);
}

export type TransitionResult =
  | { ok: true; request: Spot }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionSpot(
  db: DatabaseSync,
  spotId: string,
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
  const existing = getSpot(db, spotId);
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
      "UPDATE spots SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, spotId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO spot_audit (id, spot_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), spotId, userId, existing.state, to, at);
  const updated = getSpot(db, spotId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listSpotAudit(
  db: DatabaseSync,
  spotId: string,
  userId: string,
): AuditEntry[] | null {
  const spot = getSpot(db, spotId);
  if (!spot || spot.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, spot_id AS spotId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM spot_audit WHERE spot_id = ? ORDER BY at ASC`,
    )
    .all(spotId) as AuditEntry[];
}

export function deleteSpot(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM spots WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, gymId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM gym_members WHERE gym_id = ? AND user_id = ?")
    .get(gymId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createGym(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO gyms (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO gym_members (gym_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getGym(
  db: DatabaseSync,
  gymId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM gyms WHERE id = ?")
    .get(gymId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addGymMember(
  db: DatabaseSync,
  gymId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO gym_members (gym_id, user_id, role) VALUES (?, ?, ?)",
  ).run(gymId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  gymId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; gymId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, gym_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, gymId, title, notes, createdBy);
  return { id, gymId, title, notes };
}

export function getTaskGymId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT gym_id AS gymId FROM tasks WHERE id = ?")
    .get(taskId) as { gymId: string } | undefined;
  return row?.gymId ?? null;
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
