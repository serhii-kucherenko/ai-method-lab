import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "queued" | "printing" | "finished" | "discarded";

export type Job = {
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
  jobId: string;
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
  queued: ["printing", "discarded"],
  printing: ["finished"],
  finished: [],
  discarded: ["queued"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "queued" ||
    value === "printing" ||
    value === "finished" ||
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

function mapJob(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Job {
  const state = isState(row.status) ? row.status : "queued";
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

export function createJob(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Job {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO jobs (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'queued', 1)",
  ).run(id, userId, title, body);
  return getJob(db, id)!;
}

export function listJobs(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { jobs: Job[]; nextCursor: string | null; limit: number } {
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
             FROM jobs WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM jobs WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapJob>[0]>;
  const jobs = rows.map(mapJob);
  const nextCursor =
    jobs.length === limit ? jobs[jobs.length - 1]!.id : null;
  return { jobs, nextCursor, limit };
}

export function seedJobs(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO jobs (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'queued', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `job_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Shop ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getJob(db: DatabaseSync, id: string): Job | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM jobs WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapJob>[0] | undefined;
  return row ? mapJob(row) : undefined;
}

export function updateJob(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Job | undefined {
  const existing = getJob(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE jobs SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getJob(db, id);
}

export type TransitionResult =
  | { ok: true; request: Job }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionJob(
  db: DatabaseSync,
  jobId: string,
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
  const existing = getJob(db, jobId);
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
      "UPDATE jobs SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, jobId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO job_audit (id, job_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), jobId, userId, existing.state, to, at);
  const updated = getJob(db, jobId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listJobAudit(
  db: DatabaseSync,
  jobId: string,
  userId: string,
): AuditEntry[] | null {
  const job = getJob(db, jobId);
  if (!job || job.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, job_id AS jobId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM job_audit WHERE job_id = ? ORDER BY at ASC`,
    )
    .all(jobId) as AuditEntry[];
}

export function deleteJob(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM jobs WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, shopId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM shop_members WHERE shop_id = ? AND user_id = ?")
    .get(shopId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createShop(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO shops (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO shop_members (shop_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getShop(
  db: DatabaseSync,
  shopId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM shops WHERE id = ?")
    .get(shopId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addShopMember(
  db: DatabaseSync,
  shopId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO shop_members (shop_id, user_id, role) VALUES (?, ?, ?)",
  ).run(shopId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  shopId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; shopId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, shop_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, shopId, title, notes, createdBy);
  return { id, shopId, title, notes };
}

export function getTaskShopId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT shop_id AS shopId FROM tasks WHERE id = ?")
    .get(taskId) as { shopId: string } | undefined;
  return row?.shopId ?? null;
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
