import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "booked" | "checked_in" | "completed" | "discarded";

export type Appointment = {
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
  appointmentId: string;
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
  booked: ["checked_in", "discarded"],
  checked_in: ["completed"],
  completed: [],
  discarded: ["booked"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "booked" ||
    value === "checked_in" ||
    value === "completed" ||
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

function mapAppointment(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Appointment {
  const state = isState(row.status) ? row.status : "booked";
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

export function createAppointment(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Appointment {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO appointments (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'booked', 1)",
  ).run(id, userId, title, body);
  return getAppointment(db, id)!;
}

export function listAppointments(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { appointments: Appointment[]; nextCursor: string | null; limit: number } {
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
             FROM appointments WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM appointments WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapAppointment>[0]>;
  const appointments = rows.map(mapAppointment);
  const nextCursor =
    appointments.length === limit ? appointments[appointments.length - 1]!.id : null;
  return { appointments, nextCursor, limit };
}

export function seedAppointments(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO appointments (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'booked', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `appointment_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Clinic ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getAppointment(db: DatabaseSync, id: string): Appointment | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM appointments WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapAppointment>[0] | undefined;
  return row ? mapAppointment(row) : undefined;
}

export function updateAppointment(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Appointment | undefined {
  const existing = getAppointment(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE appointments SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getAppointment(db, id);
}

export type TransitionResult =
  | { ok: true; request: Appointment }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionAppointment(
  db: DatabaseSync,
  appointmentId: string,
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
  const existing = getAppointment(db, appointmentId);
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
      "UPDATE appointments SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, appointmentId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO appointment_audit (id, appointment_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), appointmentId, userId, existing.state, to, at);
  const updated = getAppointment(db, appointmentId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listAppointmentAudit(
  db: DatabaseSync,
  appointmentId: string,
  userId: string,
): AuditEntry[] | null {
  const appointment = getAppointment(db, appointmentId);
  if (!appointment || appointment.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, appointment_id AS appointmentId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM appointment_audit WHERE appointment_id = ? ORDER BY at ASC`,
    )
    .all(appointmentId) as AuditEntry[];
}

export function deleteAppointment(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM appointments WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, clinicId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM clinic_members WHERE clinic_id = ? AND user_id = ?")
    .get(clinicId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createClinic(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO clinics (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO clinic_members (clinic_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getClinic(
  db: DatabaseSync,
  clinicId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM clinics WHERE id = ?")
    .get(clinicId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addClinicMember(
  db: DatabaseSync,
  clinicId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO clinic_members (clinic_id, user_id, role) VALUES (?, ?, ?)",
  ).run(clinicId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  clinicId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; clinicId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, clinic_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, clinicId, title, notes, createdBy);
  return { id, clinicId, title, notes };
}

export function getTaskClinicId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT clinic_id AS clinicId FROM tasks WHERE id = ?")
    .get(taskId) as { clinicId: string } | undefined;
  return row?.clinicId ?? null;
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
