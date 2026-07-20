import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "todo" | "doing" | "done" | "discarded";

export type Card = {
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
  cardId: string;
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
  todo: ["doing", "discarded"],
  doing: ["done"],
  done: [],
  discarded: ["todo"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "todo" ||
    value === "doing" ||
    value === "done" ||
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

function mapCard(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Card {
  const state = isState(row.status) ? row.status : "todo";
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

export function createCard(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Card {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO cards (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'todo', 1)",
  ).run(id, userId, title, body);
  return getCard(db, id)!;
}

export function listCards(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { cards: Card[]; nextCursor: string | null; limit: number } {
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
             FROM cards WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM cards WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapCard>[0]>;
  const cards = rows.map(mapCard);
  const nextCursor =
    cards.length === limit ? cards[cards.length - 1]!.id : null;
  return { cards, nextCursor, limit };
}

export function seedCards(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO cards (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'todo', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `card_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Lane ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getCard(db: DatabaseSync, id: string): Card | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM cards WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapCard>[0] | undefined;
  return row ? mapCard(row) : undefined;
}

export function updateCard(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Card | undefined {
  const existing = getCard(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE cards SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getCard(db, id);
}

export type TransitionResult =
  | { ok: true; request: Card }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionCard(
  db: DatabaseSync,
  cardId: string,
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
  const existing = getCard(db, cardId);
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
      "UPDATE cards SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, cardId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO card_audit (id, card_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), cardId, userId, existing.state, to, at);
  const updated = getCard(db, cardId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listCardAudit(
  db: DatabaseSync,
  cardId: string,
  userId: string,
): AuditEntry[] | null {
  const card = getCard(db, cardId);
  if (!card || card.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, card_id AS cardId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM card_audit WHERE card_id = ? ORDER BY at ASC`,
    )
    .all(cardId) as AuditEntry[];
}

export function deleteCard(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM cards WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, laneId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM lane_members WHERE lane_id = ? AND user_id = ?")
    .get(laneId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createLane(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO lanes (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO lane_members (lane_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getLane(
  db: DatabaseSync,
  laneId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM lanes WHERE id = ?")
    .get(laneId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addLaneMember(
  db: DatabaseSync,
  laneId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO lane_members (lane_id, user_id, role) VALUES (?, ?, ?)",
  ).run(laneId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  laneId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; laneId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, lane_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, laneId, title, notes, createdBy);
  return { id, laneId, title, notes };
}

export function getTaskLaneId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT lane_id AS laneId FROM tasks WHERE id = ?")
    .get(taskId) as { laneId: string } | undefined;
  return row?.laneId ?? null;
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
