import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type BookRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canClear,
  canTransition,
  dualClearReady,
  isBreached,
  type PositionState,
} from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

export function createStore(
  opts: {
    dbPath?: string;
    dep?: DepClient;
    webhookSecret?: string;
    rateLimit?: number;
  } = {},
): Store {
  return {
    db: openDatabase(opts.dbPath ?? ":memory:"),
    dep: opts.dep ?? createMockDep(),
    webhookSecret: opts.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: opts.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(db: DatabaseSync, email: string, password: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(id, email, password);
  return { id, email };
}

export function findUserByEmail(db: DatabaseSync, email: string) {
  return db.prepare("SELECT id, email, password FROM users WHERE email = ?").get(email) as
    | { id: string; email: string; password: string }
    | undefined;
}

export function issueToken(db: DatabaseSync, userId: string): string {
  const token = randomUUID();
  db.prepare("INSERT INTO tokens (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

export function resolveToken(db: DatabaseSync, token: string): string | null {
  const row = db.prepare("SELECT user_id FROM tokens WHERE token = ?").get(token) as
    | { user_id: string }
    | undefined;
  return row?.user_id ?? null;
}

export function createBook(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO books (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO book_members (book_id, user_id, role) VALUES (?, ?, 'risk_officer')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, bookId: string, userId: string, role: BookRole) {
  db.prepare("INSERT INTO book_members (book_id, user_id, role) VALUES (?, ?, ?)").run(
    bookId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, bookId: string, userId: string): BookRole | null {
  const row = db
    .prepare("SELECT role FROM book_members WHERE book_id = ? AND user_id = ?")
    .get(bookId, userId) as { role: BookRole } | undefined;
  return row?.role ?? null;
}

export function getBook(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM books WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  bookId: string,
  userId: string,
  mode: "read" | "write" | "own" | "clear",
): BookRole | null {
  const role = getRole(db, bookId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "risk_officer" || role === "trader")) return role;
  if (mode === "own" && role === "risk_officer") return role;
  if (mode === "clear" && canClear(role)) return role;
  return null;
}

export type Position = {
  id: string;
  bookId: string;
  label: string;
  exposure: number;
  riskLimit: number;
  state: PositionState;
  version: number;
  clearCount: number;
  breached: boolean;
};

function clearCount(db: DatabaseSync, positionId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM position_clears WHERE position_id = ?")
    .get(positionId) as { c: number };
  return row.c;
}

export function getPosition(db: DatabaseSync, id: string): Position | undefined {
  const row = db
    .prepare(
      `SELECT id, book_id AS bookId, label, exposure, risk_limit AS riskLimit, state, version
       FROM positions WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        bookId: string;
        label: string;
        exposure: number;
        riskLimit: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    bookId: row.bookId,
    label: row.label,
    exposure: row.exposure,
    riskLimit: row.riskLimit,
    state: row.state as PositionState,
    version: row.version,
    clearCount: clearCount(db, id),
    breached: isBreached(row.exposure, row.riskLimit),
  };
}

export function createPosition(
  db: DatabaseSync,
  bookId: string,
  label: string,
  exposure: number,
  riskLimit: number,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO positions (id, book_id, label, exposure, risk_limit, state, version)
     VALUES (?, ?, ?, ?, ?, 'open', 1)`,
  ).run(id, bookId, label, exposure, riskLimit);
  return getPosition(db, id)!;
}

export function listPositions(db: DatabaseSync, bookId: string, limit: number, offset: number) {
  const rows = db
    .prepare(
      `SELECT id FROM positions WHERE book_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
    )
    .all(bookId, limit, offset) as { id: string }[];
  return rows.map((r) => getPosition(db, r.id)!);
}

export function addClear(
  db: DatabaseSync,
  positionId: string,
  officerId: string,
): { ok: true; clearCount: number } | { ok: false; error: string; status: number } {
  const position = getPosition(db, positionId);
  if (!position) return { ok: false, error: "not found", status: 404 };
  if (position.state !== "held") {
    return { ok: false, error: "clears only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO position_clears (id, position_id, officer_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), positionId, officerId);
  } catch {
    return { ok: false, error: "already cleared by this officer", status: 409 };
  }
  return { ok: true, clearCount: clearCount(db, positionId) };
}

export function transitionPosition(
  db: DatabaseSync,
  positionId: string,
  actorId: string,
  to: PositionState,
  version: number,
): { ok: true; position: Position } | { ok: false; error: string; status: number } {
  const position = getPosition(db, positionId);
  if (!position) return { ok: false, error: "not found", status: 404 };
  if (position.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(position.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "held" && !position.breached) {
    return { ok: false, error: "hold requires risk limit breach", status: 400 };
  }
  if (to === "cleared" && !dualClearReady(position.clearCount, position.breached)) {
    return { ok: false, error: "dual risk officer clear required", status: 400 };
  }
  db.prepare("UPDATE positions SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    positionId,
  );
  db.prepare(
    `INSERT INTO position_audit (id, position_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), positionId, actorId, position.state, to);
  return { ok: true, position: getPosition(db, positionId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  positionId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, position_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, positionId, JSON.stringify(payload));
}
