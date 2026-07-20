import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "reserved" | "occupied" | "vacated" | "discarded";

export type Site = {
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
  siteId: string;
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
  reserved: ["occupied", "discarded"],
  occupied: ["vacated"],
  vacated: [],
  discarded: ["reserved"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "reserved" ||
    value === "occupied" ||
    value === "vacated" ||
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

function mapSite(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Site {
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

export function createSite(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Site {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO sites (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'reserved', 1)",
  ).run(id, userId, title, body);
  return getSite(db, id)!;
}

export function listSites(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { sites: Site[]; nextCursor: string | null; limit: number } {
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
             FROM sites WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM sites WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapSite>[0]>;
  const sites = rows.map(mapSite);
  const nextCursor =
    sites.length === limit ? sites[sites.length - 1]!.id : null;
  return { sites, nextCursor, limit };
}

export function seedSites(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO sites (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'reserved', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `site_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Trail ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getSite(db: DatabaseSync, id: string): Site | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM sites WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapSite>[0] | undefined;
  return row ? mapSite(row) : undefined;
}

export function updateSite(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Site | undefined {
  const existing = getSite(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE sites SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getSite(db, id);
}

export type TransitionResult =
  | { ok: true; request: Site }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionSite(
  db: DatabaseSync,
  siteId: string,
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
  const existing = getSite(db, siteId);
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
      "UPDATE sites SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, siteId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO site_audit (id, site_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), siteId, userId, existing.state, to, at);
  const updated = getSite(db, siteId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listSiteAudit(
  db: DatabaseSync,
  siteId: string,
  userId: string,
): AuditEntry[] | null {
  const site = getSite(db, siteId);
  if (!site || site.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, site_id AS siteId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM site_audit WHERE site_id = ? ORDER BY at ASC`,
    )
    .all(siteId) as AuditEntry[];
}

export function deleteSite(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM sites WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, trailId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM trail_members WHERE trail_id = ? AND user_id = ?")
    .get(trailId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createTrail(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO trails (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO trail_members (trail_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getTrail(
  db: DatabaseSync,
  trailId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM trails WHERE id = ?")
    .get(trailId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addTrailMember(
  db: DatabaseSync,
  trailId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO trail_members (trail_id, user_id, role) VALUES (?, ?, ?)",
  ).run(trailId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  trailId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; trailId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, trail_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, trailId, title, notes, createdBy);
  return { id, trailId, title, notes };
}

export function getTaskTrailId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT trail_id AS trailId FROM tasks WHERE id = ?")
    .get(taskId) as { trailId: string } | undefined;
  return row?.trailId ?? null;
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
