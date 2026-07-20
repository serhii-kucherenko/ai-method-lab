import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "paired" | "playing" | "scored" | "discarded";

export type Match = {
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
  matchId: string;
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
  paired: ["playing", "discarded"],
  playing: ["scored"],
  scored: [],
  discarded: ["paired"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "paired" ||
    value === "playing" ||
    value === "scored" ||
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

function mapMatch(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Match {
  const state = isState(row.status) ? row.status : "paired";
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

export function createMatch(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Match {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO matches (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'paired', 1)",
  ).run(id, userId, title, body);
  return getMatch(db, id)!;
}

export function listMatchs(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { matches: Match[]; nextCursor: string | null; limit: number } {
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
             FROM matches WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM matches WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapMatch>[0]>;
  const matches = rows.map(mapMatch);
  const nextCursor =
    matches.length === limit ? matches[matches.length - 1]!.id : null;
  return { matches, nextCursor, limit };
}

export function seedMatchs(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO matches (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'paired', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `match_${String(i).padStart(5, "0")}`;
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

export function getMatch(db: DatabaseSync, id: string): Match | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM matches WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapMatch>[0] | undefined;
  return row ? mapMatch(row) : undefined;
}

export function updateMatch(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Match | undefined {
  const existing = getMatch(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE matches SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getMatch(db, id);
}

export type TransitionResult =
  | { ok: true; request: Match }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionMatch(
  db: DatabaseSync,
  matchId: string,
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
  const existing = getMatch(db, matchId);
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
      "UPDATE matches SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, matchId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO match_audit (id, match_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), matchId, userId, existing.state, to, at);
  const updated = getMatch(db, matchId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listMatchAudit(
  db: DatabaseSync,
  matchId: string,
  userId: string,
): AuditEntry[] | null {
  const match = getMatch(db, matchId);
  if (!match || match.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, match_id AS matchId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM match_audit WHERE match_id = ? ORDER BY at ASC`,
    )
    .all(matchId) as AuditEntry[];
}

export function deleteMatch(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM matches WHERE id = ?").run(id);
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
