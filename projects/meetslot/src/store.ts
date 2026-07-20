import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase } from "./db.js";

export type Booking = {
  id: string;
  userId: string;
  roomName: string;
  note: string;
  status: string;
};

export type Store = { db: DatabaseSync };

export function createStore(dbPath = ":memory:"): Store {
  return { db: openDatabase(dbPath) };
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
}): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    roomName: row.room_name,
    note: row.note,
    status: row.status,
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
    "INSERT INTO bookings (id, user_id, room_name, note, status) VALUES (?, ?, ?, ?, 'held')",
  ).run(id, userId, roomName, note);
  return getBooking(db, id)!;
}

export function listBookings(db: DatabaseSync, userId: string): Booking[] {
  return db
    .prepare(
      "SELECT id, user_id, room_name, note, status FROM bookings WHERE user_id = ? ORDER BY id",
    )
    .all(userId)
    .map((r) => mapBooking(r as Parameters<typeof mapBooking>[0]));
}

export function getBooking(db: DatabaseSync, id: string): Booking | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, room_name, note, status FROM bookings WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapBooking>[0] | undefined;
  return row ? mapBooking(row) : undefined;
}

export function updateBooking(
  db: DatabaseSync,
  id: string,
  patch: { roomName?: string; note?: string; status?: string },
): Booking | undefined {
  const existing = getBooking(db, id);
  if (!existing) return undefined;
  const roomName = patch.roomName ?? existing.roomName;
  const note = patch.note ?? existing.note;
  const status = patch.status ?? existing.status;
  db.prepare(
    "UPDATE bookings SET room_name = ?, note = ?, status = ? WHERE id = ?",
  ).run(roomName, note, status, id);
  return getBooking(db, id);
}

export function deleteBooking(db: DatabaseSync, id: string): boolean {
  return Number(db.prepare("DELETE FROM bookings WHERE id = ?").run(id).changes) > 0;
}
