import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "nominated" | "reading" | "discussed" | "discarded";

export type Pick = {
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
  pickId: string;
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
  nominated: ["reading", "discarded"],
  reading: ["discussed"],
  discussed: [],
  discarded: ["nominated"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "nominated" ||
    value === "reading" ||
    value === "discussed" ||
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

function mapPick(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Pick {
  const state = isState(row.status) ? row.status : "nominated";
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

export function createPick(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Pick {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO picks (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'nominated', 1)",
  ).run(id, userId, title, body);
  return getPick(db, id)!;
}

export function listPicks(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { picks: Pick[]; nextCursor: string | null; limit: number } {
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
             FROM picks WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM picks WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapPick>[0]>;
  const picks = rows.map(mapPick);
  const nextCursor =
    picks.length === limit ? picks[picks.length - 1]!.id : null;
  return { picks, nextCursor, limit };
}

export function seedPicks(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO picks (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'nominated', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `pick_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Club ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getPick(db: DatabaseSync, id: string): Pick | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM picks WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapPick>[0] | undefined;
  return row ? mapPick(row) : undefined;
}

export function updatePick(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Pick | undefined {
  const existing = getPick(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE picks SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getPick(db, id);
}

export type TransitionResult =
  | { ok: true; request: Pick }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionPick(
  db: DatabaseSync,
  pickId: string,
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
  const existing = getPick(db, pickId);
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
      "UPDATE picks SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, pickId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO pick_audit (id, pick_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), pickId, userId, existing.state, to, at);
  const updated = getPick(db, pickId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listPickAudit(
  db: DatabaseSync,
  pickId: string,
  userId: string,
): AuditEntry[] | null {
  const pick = getPick(db, pickId);
  if (!pick || pick.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, pick_id AS pickId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM pick_audit WHERE pick_id = ? ORDER BY at ASC`,
    )
    .all(pickId) as AuditEntry[];
}

export function deletePick(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM picks WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, clubId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM club_members WHERE club_id = ? AND user_id = ?")
    .get(clubId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createClub(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO clubs (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO club_members (club_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getClub(
  db: DatabaseSync,
  clubId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM clubs WHERE id = ?")
    .get(clubId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addClubMember(
  db: DatabaseSync,
  clubId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO club_members (club_id, user_id, role) VALUES (?, ?, ?)",
  ).run(clubId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  clubId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; clubId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, club_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, clubId, title, notes, createdBy);
  return { id, clubId, title, notes };
}

export function getTaskClubId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT club_id AS clubId FROM tasks WHERE id = ?")
    .get(taskId) as { clubId: string } | undefined;
  return row?.clubId ?? null;
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
