import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type CalendarRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canOverride,
  canTransition,
  dualOverrideReady,
  rangesOverlap,
  type BookingState,
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

export function createCalendar(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO calendars (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO calendar_members (calendar_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(
  db: DatabaseSync,
  calendarId: string,
  userId: string,
  role: CalendarRole,
) {
  db.prepare(
    "INSERT INTO calendar_members (calendar_id, user_id, role) VALUES (?, ?, ?)",
  ).run(calendarId, userId, role);
}

export function getRole(
  db: DatabaseSync,
  calendarId: string,
  userId: string,
): CalendarRole | null {
  const row = db
    .prepare("SELECT role FROM calendar_members WHERE calendar_id = ? AND user_id = ?")
    .get(calendarId, userId) as { role: CalendarRole } | undefined;
  return row?.role ?? null;
}

export function getCalendar(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM calendars WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  calendarId: string,
  userId: string,
  mode: "read" | "write" | "own" | "override",
): CalendarRole | null {
  const role = getRole(db, calendarId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "owner" || role === "admin")) return role;
  if (mode === "own" && role === "owner") return role;
  if (mode === "override" && canOverride(role)) return role;
  return null;
}

export type Booking = {
  id: string;
  calendarId: string;
  title: string;
  startsAt: number;
  endsAt: number;
  state: BookingState;
  version: number;
  overrideCount: number;
  hasConflict: boolean;
};

function overrideCount(db: DatabaseSync, bookingId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM booking_overrides WHERE booking_id = ?")
    .get(bookingId) as { c: number };
  return row.c;
}

function hasConfirmedConflict(
  db: DatabaseSync,
  calendarId: string,
  startsAt: number,
  endsAt: number,
  excludeId?: string,
): boolean {
  const rows = db
    .prepare(
      `SELECT id, starts_at AS startsAt, ends_at AS endsAt FROM bookings
       WHERE calendar_id = ? AND state = 'confirmed'`,
    )
    .all(calendarId) as { id: string; startsAt: number; endsAt: number }[];
  return rows.some(
    (r) =>
      r.id !== excludeId && rangesOverlap(startsAt, endsAt, r.startsAt, r.endsAt),
  );
}

export function getBooking(db: DatabaseSync, id: string): Booking | undefined {
  const row = db
    .prepare(
      `SELECT id, calendar_id AS calendarId, title,
              starts_at AS startsAt, ends_at AS endsAt, state, version
       FROM bookings WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        calendarId: string;
        title: string;
        startsAt: number;
        endsAt: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    calendarId: row.calendarId,
    title: row.title,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
    state: row.state as BookingState,
    version: row.version,
    overrideCount: overrideCount(db, id),
    hasConflict: hasConfirmedConflict(
      db,
      row.calendarId,
      row.startsAt,
      row.endsAt,
      row.id,
    ),
  };
}

export function createBooking(
  db: DatabaseSync,
  calendarId: string,
  title: string,
  startsAt: number,
  endsAt: number,
): { ok: true; booking: Booking } | { ok: false; error: string } {
  if (!(endsAt > startsAt)) return { ok: false, error: "endsAt must be after startsAt" };
  const id = randomUUID();
  db.prepare(
    `INSERT INTO bookings (id, calendar_id, title, starts_at, ends_at, state, version)
     VALUES (?, ?, ?, ?, ?, 'held', 1)`,
  ).run(id, calendarId, title, startsAt, endsAt);
  return { ok: true, booking: getBooking(db, id)! };
}

export function listBookings(
  db: DatabaseSync,
  calendarId: string,
  limit: number,
  offset: number,
) {
  const rows = db
    .prepare(
      `SELECT id FROM bookings WHERE calendar_id = ?
       ORDER BY starts_at ASC LIMIT ? OFFSET ?`,
    )
    .all(calendarId, limit, offset) as { id: string }[];
  return rows.map((r) => getBooking(db, r.id)!);
}

export function addOverride(
  db: DatabaseSync,
  bookingId: string,
  adminId: string,
): { ok: true; overrideCount: number } | { ok: false; error: string; status: number } {
  const booking = getBooking(db, bookingId);
  if (!booking) return { ok: false, error: "not found", status: 404 };
  if (booking.state !== "held") {
    return { ok: false, error: "overrides only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO booking_overrides (id, booking_id, admin_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), bookingId, adminId);
  } catch {
    return { ok: false, error: "already overridden by this admin", status: 409 };
  }
  return { ok: true, overrideCount: overrideCount(db, bookingId) };
}

export function transitionBooking(
  db: DatabaseSync,
  bookingId: string,
  actorId: string,
  to: BookingState,
  version: number,
): { ok: true; booking: Booking } | { ok: false; error: string; status: number } {
  const booking = getBooking(db, bookingId);
  if (!booking) return { ok: false, error: "not found", status: 404 };
  if (booking.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(booking.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "confirmed") {
    const conflict = hasConfirmedConflict(
      db,
      booking.calendarId,
      booking.startsAt,
      booking.endsAt,
      booking.id,
    );
    if (!dualOverrideReady(booking.overrideCount, conflict)) {
      return { ok: false, error: "overlap requires dual admin override", status: 400 };
    }
  }
  db.prepare("UPDATE bookings SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    bookingId,
  );
  db.prepare(
    `INSERT INTO booking_audit (id, booking_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), bookingId, actorId, booking.state, to);
  return { ok: true, booking: getBooking(db, bookingId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  bookingId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, booking_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, bookingId, JSON.stringify(payload));
}
