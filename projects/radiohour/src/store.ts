import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "scheduled" | "onair" | "wrapped" | "discarded";

export type Show = {
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
  showId: string;
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
  scheduled: ["onair", "discarded"],
  onair: ["wrapped"],
  wrapped: [],
  discarded: ["scheduled"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "scheduled" ||
    value === "onair" ||
    value === "wrapped" ||
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

function mapShow(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Show {
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

export function createShow(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Show {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO shows (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'scheduled', 1)",
  ).run(id, userId, title, body);
  return getShow(db, id)!;
}

export function listShows(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { shows: Show[]; nextCursor: string | null; limit: number } {
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
             FROM shows WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM shows WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapShow>[0]>;
  const shows = rows.map(mapShow);
  const nextCursor =
    shows.length === limit ? shows[shows.length - 1]!.id : null;
  return { shows, nextCursor, limit };
}

export function seedShows(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO shows (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'scheduled', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `show_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Station ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getShow(db: DatabaseSync, id: string): Show | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM shows WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapShow>[0] | undefined;
  return row ? mapShow(row) : undefined;
}

export function updateShow(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Show | undefined {
  const existing = getShow(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE shows SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getShow(db, id);
}

export type TransitionResult =
  | { ok: true; request: Show }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionShow(
  db: DatabaseSync,
  showId: string,
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
  const existing = getShow(db, showId);
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
      "UPDATE shows SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, showId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO show_audit (id, show_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), showId, userId, existing.state, to, at);
  const updated = getShow(db, showId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listShowAudit(
  db: DatabaseSync,
  showId: string,
  userId: string,
): AuditEntry[] | null {
  const show = getShow(db, showId);
  if (!show || show.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, show_id AS showId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM show_audit WHERE show_id = ? ORDER BY at ASC`,
    )
    .all(showId) as AuditEntry[];
}

export function deleteShow(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM shows WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, stationId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM station_members WHERE station_id = ? AND user_id = ?")
    .get(stationId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createStation(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO stations (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO station_members (station_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getStation(
  db: DatabaseSync,
  stationId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM stations WHERE id = ?")
    .get(stationId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addStationMember(
  db: DatabaseSync,
  stationId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO station_members (station_id, user_id, role) VALUES (?, ?, ?)",
  ).run(stationId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  stationId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; stationId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, station_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, stationId, title, notes, createdBy);
  return { id, stationId, title, notes };
}

export function getTaskStationId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT station_id AS stationId FROM tasks WHERE id = ?")
    .get(taskId) as { stationId: string } | undefined;
  return row?.stationId ?? null;
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
