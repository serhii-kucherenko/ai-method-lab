import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "docked" | "rented" | "redocked" | "discarded";

export type Bike = {
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
  bikeId: string;
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
  docked: ["rented", "discarded"],
  rented: ["redocked"],
  redocked: [],
  discarded: ["docked"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "docked" ||
    value === "rented" ||
    value === "redocked" ||
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

function mapBike(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Bike {
  const state = isState(row.status) ? row.status : "docked";
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

export function createBike(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Bike {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO bikes (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'docked', 1)",
  ).run(id, userId, title, body);
  return getBike(db, id)!;
}

export function listBikes(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { bikes: Bike[]; nextCursor: string | null; limit: number } {
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
             FROM bikes WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM bikes WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapBike>[0]>;
  const bikes = rows.map(mapBike);
  const nextCursor =
    bikes.length === limit ? bikes[bikes.length - 1]!.id : null;
  return { bikes, nextCursor, limit };
}

export function seedBikes(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO bikes (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'docked', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `bike_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Hub ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getBike(db: DatabaseSync, id: string): Bike | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM bikes WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapBike>[0] | undefined;
  return row ? mapBike(row) : undefined;
}

export function updateBike(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Bike | undefined {
  const existing = getBike(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE bikes SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getBike(db, id);
}

export type TransitionResult =
  | { ok: true; request: Bike }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionBike(
  db: DatabaseSync,
  bikeId: string,
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
  const existing = getBike(db, bikeId);
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
      "UPDATE bikes SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, bikeId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO bike_audit (id, bike_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), bikeId, userId, existing.state, to, at);
  const updated = getBike(db, bikeId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listBikeAudit(
  db: DatabaseSync,
  bikeId: string,
  userId: string,
): AuditEntry[] | null {
  const bike = getBike(db, bikeId);
  if (!bike || bike.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, bike_id AS bikeId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM bike_audit WHERE bike_id = ? ORDER BY at ASC`,
    )
    .all(bikeId) as AuditEntry[];
}

export function deleteBike(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM bikes WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, hubId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM hub_members WHERE hub_id = ? AND user_id = ?")
    .get(hubId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createHub(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO hubs (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO hub_members (hub_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getHub(
  db: DatabaseSync,
  hubId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM hubs WHERE id = ?")
    .get(hubId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addHubMember(
  db: DatabaseSync,
  hubId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO hub_members (hub_id, user_id, role) VALUES (?, ?, ?)",
  ).run(hubId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  hubId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; hubId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, hub_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, hubId, title, notes, createdBy);
  return { id, hubId, title, notes };
}

export function getTaskHubId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT hub_id AS hubId FROM tasks WHERE id = ?")
    .get(taskId) as { hubId: string } | undefined;
  return row?.hubId ?? null;
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
