import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "held" | "confirmed" | "completed" | "cancelled";

export type Booking = {
  id: string;
  userId: string;
  roomName: string;
  note: string;
  status: WorkflowState;
  state: WorkflowState;
  version: number;
};

export type AuditEntry = {
  id: string;
  bookingId: string;
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
  held: ["confirmed", "cancelled"],
  confirmed: ["completed"],
  completed: [],
  cancelled: ["held"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "held" ||
    value === "confirmed" ||
    value === "completed" ||
    value === "cancelled"
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

function mapBooking(row: {
  id: string;
  user_id: string;
  room_name: string;
  note: string;
  status: string;
  version: number;
}): Booking {
  const state = isState(row.status) ? row.status : "held";
  return {
    id: row.id,
    userId: row.user_id,
    roomName: row.room_name,
    note: row.note,
    status: state,
    state,
    version: row.version,
  };
}

export function createBooking(
  db: DatabaseSync,
  userId: string,
  roomName: string,
  note = "",
): Booking {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO bookings (id, user_id, room_name, note, status, version) VALUES (?, ?, ?, ?, 'held', 1)",
  ).run(id, userId, roomName, note);
  return getBooking(db, id)!;
}

export function listBookings(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { bookings: Booking[]; nextCursor: string | null; limit: number } {
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
            `SELECT id, user_id, room_name, note, status, version
             FROM bookings WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, room_name, note, status, version
             FROM bookings WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapBooking>[0]>;
  const bookings = rows.map(mapBooking);
  const nextCursor =
    bookings.length === limit ? bookings[bookings.length - 1]!.id : null;
  return { bookings, nextCursor, limit };
}

export function seedBookings(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO bookings (id, user_id, room_name, note, status, version) VALUES (?, ?, ?, '', 'held', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `booking_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Room ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getBooking(db: DatabaseSync, id: string): Booking | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, room_name, note, status, version FROM bookings WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapBooking>[0] | undefined;
  return row ? mapBooking(row) : undefined;
}

export function updateBooking(
  db: DatabaseSync,
  id: string,
  patch: { roomName?: string; note?: string },
): Booking | undefined {
  const existing = getBooking(db, id);
  if (!existing) return undefined;
  const roomName = patch.roomName ?? existing.roomName;
  const note = patch.note ?? existing.note;
  db.prepare("UPDATE bookings SET room_name = ?, note = ? WHERE id = ?").run(
    roomName,
    note,
    id,
  );
  return getBooking(db, id);
}

export type TransitionResult =
  | { ok: true; request: Booking }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionBooking(
  db: DatabaseSync,
  bookingId: string,
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
  const existing = getBooking(db, bookingId);
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
      "UPDATE bookings SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, bookingId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO booking_audit (id, booking_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), bookingId, userId, existing.state, to, at);
  const updated = getBooking(db, bookingId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listBookingAudit(
  db: DatabaseSync,
  bookingId: string,
  userId: string,
): AuditEntry[] | null {
  const booking = getBooking(db, bookingId);
  if (!booking || booking.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, booking_id AS bookingId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM booking_audit WHERE booking_id = ? ORDER BY at ASC`,
    )
    .all(bookingId) as AuditEntry[];
}

export function deleteBooking(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM bookings WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, roomId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM room_members WHERE room_id = ? AND user_id = ?")
    .get(roomId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createRoom(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO rooms (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO room_members (room_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getRoom(
  db: DatabaseSync,
  roomId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM rooms WHERE id = ?")
    .get(roomId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addRoomMember(
  db: DatabaseSync,
  roomId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO room_members (room_id, user_id, role) VALUES (?, ?, ?)",
  ).run(roomId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  roomId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; roomId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, room_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, roomId, title, notes, createdBy);
  return { id, roomId, title, notes };
}

export function getTaskRoomId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT room_id AS roomId FROM tasks WHERE id = ?")
    .get(taskId) as { roomId: string } | undefined;
  return row?.roomId ?? null;
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
