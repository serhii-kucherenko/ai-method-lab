import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "placed" | "brewing" | "served" | "discarded";

export type Ticket = {
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
  ticketId: string;
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
  placed: ["brewing", "discarded"],
  brewing: ["served"],
  served: [],
  discarded: ["placed"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "placed" ||
    value === "brewing" ||
    value === "served" ||
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

function mapTicket(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Ticket {
  const state = isState(row.status) ? row.status : "placed";
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

export function createTicket(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Ticket {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tickets (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'placed', 1)",
  ).run(id, userId, title, body);
  return getTicket(db, id)!;
}

export function listTickets(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { tickets: Ticket[]; nextCursor: string | null; limit: number } {
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
             FROM tickets WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM tickets WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapTicket>[0]>;
  const tickets = rows.map(mapTicket);
  const nextCursor =
    tickets.length === limit ? tickets[tickets.length - 1]!.id : null;
  return { tickets, nextCursor, limit };
}

export function seedTickets(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO tickets (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'placed', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `ticket_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Counter ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getTicket(db: DatabaseSync, id: string): Ticket | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM tickets WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapTicket>[0] | undefined;
  return row ? mapTicket(row) : undefined;
}

export function updateTicket(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Ticket | undefined {
  const existing = getTicket(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE tickets SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getTicket(db, id);
}

export type TransitionResult =
  | { ok: true; request: Ticket }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionTicket(
  db: DatabaseSync,
  ticketId: string,
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
  const existing = getTicket(db, ticketId);
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
      "UPDATE tickets SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, ticketId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO ticket_audit (id, ticket_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), ticketId, userId, existing.state, to, at);
  const updated = getTicket(db, ticketId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listTicketAudit(
  db: DatabaseSync,
  ticketId: string,
  userId: string,
): AuditEntry[] | null {
  const ticket = getTicket(db, ticketId);
  if (!ticket || ticket.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, ticket_id AS ticketId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM ticket_audit WHERE ticket_id = ? ORDER BY at ASC`,
    )
    .all(ticketId) as AuditEntry[];
}

export function deleteTicket(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM tickets WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, counterId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM counter_members WHERE counter_id = ? AND user_id = ?")
    .get(counterId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createCounter(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO counters (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO counter_members (counter_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getCounter(
  db: DatabaseSync,
  counterId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM counters WHERE id = ?")
    .get(counterId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addCounterMember(
  db: DatabaseSync,
  counterId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO counter_members (counter_id, user_id, role) VALUES (?, ?, ?)",
  ).run(counterId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  counterId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; counterId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, counter_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, counterId, title, notes, createdBy);
  return { id, counterId, title, notes };
}

export function getTaskCounterId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT counter_id AS counterId FROM tasks WHERE id = ?")
    .get(taskId) as { counterId: string } | undefined;
  return row?.counterId ?? null;
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
