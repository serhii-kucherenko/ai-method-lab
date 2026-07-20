import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type RoomRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canTransition,
  closeAllowed,
  resolveAllowed,
  type IncidentState,
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

export function createRoom(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO rooms (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO room_members (room_id, user_id, role) VALUES (?, ?, 'commander')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, roomId: string, userId: string, role: RoomRole) {
  db.prepare("INSERT INTO room_members (room_id, user_id, role) VALUES (?, ?, ?)").run(
    roomId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, roomId: string, userId: string): RoomRole | null {
  const row = db
    .prepare("SELECT role FROM room_members WHERE room_id = ? AND user_id = ?")
    .get(roomId, userId) as { role: RoomRole } | undefined;
  return row?.role ?? null;
}

export function getRoom(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM rooms WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  roomId: string,
  userId: string,
  mode: "read" | "write" | "command",
): RoomRole | null {
  const role = getRole(db, roomId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "commander" || role === "responder")) return role;
  if (mode === "command" && role === "commander") return role;
  return null;
}

export type Incident = {
  id: string;
  roomId: string;
  title: string;
  severity: number;
  state: IncidentState;
  commanderAcked: boolean;
  version: number;
};

export function createIncident(
  db: DatabaseSync,
  roomId: string,
  title: string,
  severity: number,
): Incident {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO incidents (id, room_id, title, severity, state, version)
     VALUES (?, ?, ?, ?, 'open', 1)`,
  ).run(id, roomId, title, severity);
  return getIncident(db, id)!;
}

export function getIncident(db: DatabaseSync, id: string): Incident | undefined {
  const row = db
    .prepare(
      `SELECT id, room_id AS roomId, title, severity, state,
              commander_acked AS commanderAcked, version FROM incidents WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        roomId: string;
        title: string;
        severity: number;
        state: string;
        commanderAcked: number;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    roomId: row.roomId,
    title: row.title,
    severity: row.severity,
    state: row.state as IncidentState,
    commanderAcked: Boolean(row.commanderAcked),
    version: row.version,
  };
}

export function listIncidents(
  db: DatabaseSync,
  roomId: string,
  limit: number,
  offset: number,
): Incident[] {
  const rows = db
    .prepare(
      `SELECT id, room_id AS roomId, title, severity, state,
              commander_acked AS commanderAcked, version
       FROM incidents WHERE room_id = ? ORDER BY title ASC LIMIT ? OFFSET ?`,
    )
    .all(roomId, limit, offset) as {
    id: string;
    roomId: string;
    title: string;
    severity: number;
    state: string;
    commanderAcked: number;
    version: number;
  }[];
  return rows.map((r) => ({
    id: r.id,
    roomId: r.roomId,
    title: r.title,
    severity: r.severity,
    state: r.state as IncidentState,
    commanderAcked: Boolean(r.commanderAcked),
    version: r.version,
  }));
}

export function ackCommander(db: DatabaseSync, incidentId: string) {
  db.prepare("UPDATE incidents SET commander_acked = 1 WHERE id = ?").run(incidentId);
  return getIncident(db, incidentId);
}

export function addAction(db: DatabaseSync, incidentId: string, title: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO actions (id, incident_id, title, done) VALUES (?, ?, ?, 0)").run(
    id,
    incidentId,
    title,
  );
  return { id, incidentId, title, done: false };
}

export function completeAction(db: DatabaseSync, actionId: string) {
  db.prepare("UPDATE actions SET done = 1 WHERE id = ?").run(actionId);
}

export function completedActionCount(db: DatabaseSync, incidentId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM actions WHERE incident_id = ? AND done = 1")
    .get(incidentId) as { c: number };
  return Number(row.c);
}

export function addPostmortem(
  db: DatabaseSync,
  incidentId: string,
  body: string,
  authorId: string,
) {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO postmortems (id, incident_id, body, author_id) VALUES (?, ?, ?, ?)",
  ).run(id, incidentId, body, authorId);
  return { id, incidentId, body };
}

export function hasPostmortem(db: DatabaseSync, incidentId: string): boolean {
  const row = db
    .prepare("SELECT 1 AS ok FROM postmortems WHERE incident_id = ?")
    .get(incidentId);
  return Boolean(row);
}

export function transitionIncident(
  db: DatabaseSync,
  incidentId: string,
  actorId: string,
  to: IncidentState,
  version: number,
): { ok: true; incident: Incident } | { ok: false; error: string; status: number } {
  const inc = getIncident(db, incidentId);
  if (!inc) return { ok: false, error: "not found", status: 404 };
  if (inc.version !== version) return { ok: false, error: "version conflict", status: 409 };
  if (!canTransition(inc.state, to)) return { ok: false, error: "illegal transition", status: 400 };
  if (to === "resolved") {
    if (
      !resolveAllowed(
        inc.severity,
        inc.commanderAcked,
        completedActionCount(db, incidentId),
      )
    ) {
      return {
        ok: false,
        error: "need completed action; sev1 also needs commander ack",
        status: 400,
      };
    }
  }
  if (to === "closed") {
    if (!closeAllowed(inc.severity, hasPostmortem(db, incidentId))) {
      return { ok: false, error: "sev1 requires postmortem before close", status: 400 };
    }
  }
  db.prepare("UPDATE incidents SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    incidentId,
  );
  db.prepare(
    `INSERT INTO incident_audit (id, incident_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), incidentId, actorId, inc.state, to);
  return { ok: true, incident: getIncident(db, incidentId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  incidentId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, incident_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, incidentId, JSON.stringify(payload));
}
