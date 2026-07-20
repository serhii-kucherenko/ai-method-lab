import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "cataloged" | "reserved" | "sown" | "discarded";

export type Packet = {
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
  packetId: string;
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
  cataloged: ["reserved", "discarded"],
  reserved: ["sown"],
  sown: [],
  discarded: ["cataloged"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "cataloged" ||
    value === "reserved" ||
    value === "sown" ||
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

function mapPacket(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Packet {
  const state = isState(row.status) ? row.status : "cataloged";
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

export function createPacket(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Packet {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO packets (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'cataloged', 1)",
  ).run(id, userId, title, body);
  return getPacket(db, id)!;
}

export function listPackets(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { packets: Packet[]; nextCursor: string | null; limit: number } {
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
             FROM packets WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM packets WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapPacket>[0]>;
  const packets = rows.map(mapPacket);
  const nextCursor =
    packets.length === limit ? packets[packets.length - 1]!.id : null;
  return { packets, nextCursor, limit };
}

export function seedPackets(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO packets (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'cataloged', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `packet_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Bank ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getPacket(db: DatabaseSync, id: string): Packet | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM packets WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapPacket>[0] | undefined;
  return row ? mapPacket(row) : undefined;
}

export function updatePacket(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Packet | undefined {
  const existing = getPacket(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE packets SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getPacket(db, id);
}

export type TransitionResult =
  | { ok: true; request: Packet }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionPacket(
  db: DatabaseSync,
  packetId: string,
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
  const existing = getPacket(db, packetId);
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
      "UPDATE packets SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, packetId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO packet_audit (id, packet_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), packetId, userId, existing.state, to, at);
  const updated = getPacket(db, packetId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listPacketAudit(
  db: DatabaseSync,
  packetId: string,
  userId: string,
): AuditEntry[] | null {
  const packet = getPacket(db, packetId);
  if (!packet || packet.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, packet_id AS packetId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM packet_audit WHERE packet_id = ? ORDER BY at ASC`,
    )
    .all(packetId) as AuditEntry[];
}

export function deletePacket(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM packets WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, bankId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM bank_members WHERE bank_id = ? AND user_id = ?")
    .get(bankId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createBank(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO banks (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO bank_members (bank_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getBank(
  db: DatabaseSync,
  bankId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM banks WHERE id = ?")
    .get(bankId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addBankMember(
  db: DatabaseSync,
  bankId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO bank_members (bank_id, user_id, role) VALUES (?, ?, ?)",
  ).run(bankId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  bankId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; bankId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, bank_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, bankId, title, notes, createdBy);
  return { id, bankId, title, notes };
}

export function getTaskBankId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT bank_id AS bankId FROM tasks WHERE id = ?")
    .get(taskId) as { bankId: string } | undefined;
  return row?.bankId ?? null;
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
