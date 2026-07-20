import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "booked" | "running" | "cleaned" | "discarded";

export type Bench = {
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
  benchId: string;
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
  booked: ["running", "discarded"],
  running: ["cleaned"],
  cleaned: [],
  discarded: ["booked"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "booked" ||
    value === "running" ||
    value === "cleaned" ||
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

function mapBench(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Bench {
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

export function createBench(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Bench {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO benches (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'booked', 1)",
  ).run(id, userId, title, body);
  return getBench(db, id)!;
}

export function listBenchs(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { benches: Bench[]; nextCursor: string | null; limit: number } {
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
             FROM benches WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM benches WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapBench>[0]>;
  const benches = rows.map(mapBench);
  const nextCursor =
    benches.length === limit ? benches[benches.length - 1]!.id : null;
  return { benches, nextCursor, limit };
}

export function seedBenchs(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO benches (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'booked', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `bench_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Lab ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getBench(db: DatabaseSync, id: string): Bench | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM benches WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapBench>[0] | undefined;
  return row ? mapBench(row) : undefined;
}

export function updateBench(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Bench | undefined {
  const existing = getBench(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE benches SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getBench(db, id);
}

export type TransitionResult =
  | { ok: true; request: Bench }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionBench(
  db: DatabaseSync,
  benchId: string,
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
  const existing = getBench(db, benchId);
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
      "UPDATE benches SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, benchId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO bench_audit (id, bench_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), benchId, userId, existing.state, to, at);
  const updated = getBench(db, benchId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listBenchAudit(
  db: DatabaseSync,
  benchId: string,
  userId: string,
): AuditEntry[] | null {
  const bench = getBench(db, benchId);
  if (!bench || bench.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, bench_id AS benchId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM bench_audit WHERE bench_id = ? ORDER BY at ASC`,
    )
    .all(benchId) as AuditEntry[];
}

export function deleteBench(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM benches WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, labId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM lab_members WHERE lab_id = ? AND user_id = ?")
    .get(labId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createLab(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO labs (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO lab_members (lab_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getLab(
  db: DatabaseSync,
  labId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM labs WHERE id = ?")
    .get(labId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addLabMember(
  db: DatabaseSync,
  labId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO lab_members (lab_id, user_id, role) VALUES (?, ?, ?)",
  ).run(labId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  labId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; labId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, lab_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, labId, title, notes, createdBy);
  return { id, labId, title, notes };
}

export function getTaskLabId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT lab_id AS labId FROM tasks WHERE id = ?")
    .get(taskId) as { labId: string } | undefined;
  return row?.labId ?? null;
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
