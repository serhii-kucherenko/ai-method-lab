import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "staged" | "rented" | "returned" | "discarded";

export type Vehicle = {
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
  vehicleId: string;
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
  staged: ["rented", "discarded"],
  rented: ["returned"],
  returned: [],
  discarded: ["staged"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "staged" ||
    value === "rented" ||
    value === "returned" ||
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

function mapVehicle(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Vehicle {
  const state = isState(row.status) ? row.status : "staged";
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

export function createVehicle(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Vehicle {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO vehicles (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'staged', 1)",
  ).run(id, userId, title, body);
  return getVehicle(db, id)!;
}

export function listVehicles(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { vehicles: Vehicle[]; nextCursor: string | null; limit: number } {
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
             FROM vehicles WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM vehicles WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapVehicle>[0]>;
  const vehicles = rows.map(mapVehicle);
  const nextCursor =
    vehicles.length === limit ? vehicles[vehicles.length - 1]!.id : null;
  return { vehicles, nextCursor, limit };
}

export function seedVehicles(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO vehicles (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'staged', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `vehicle_${String(i).padStart(5, "0")}`;
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

export function getVehicle(db: DatabaseSync, id: string): Vehicle | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM vehicles WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapVehicle>[0] | undefined;
  return row ? mapVehicle(row) : undefined;
}

export function updateVehicle(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Vehicle | undefined {
  const existing = getVehicle(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE vehicles SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getVehicle(db, id);
}

export type TransitionResult =
  | { ok: true; request: Vehicle }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionVehicle(
  db: DatabaseSync,
  vehicleId: string,
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
  const existing = getVehicle(db, vehicleId);
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
      "UPDATE vehicles SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, vehicleId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO vehicle_audit (id, vehicle_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), vehicleId, userId, existing.state, to, at);
  const updated = getVehicle(db, vehicleId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listVehicleAudit(
  db: DatabaseSync,
  vehicleId: string,
  userId: string,
): AuditEntry[] | null {
  const vehicle = getVehicle(db, vehicleId);
  if (!vehicle || vehicle.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, vehicle_id AS vehicleId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM vehicle_audit WHERE vehicle_id = ? ORDER BY at ASC`,
    )
    .all(vehicleId) as AuditEntry[];
}

export function deleteVehicle(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM vehicles WHERE id = ?").run(id);
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
