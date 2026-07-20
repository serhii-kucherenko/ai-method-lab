import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "draft" | "published" | "archived" | "discarded";

export type Clip = {
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
  clipId: string;
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
  draft: ["published", "discarded"],
  published: ["archived"],
  archived: [],
  discarded: ["draft"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "draft" ||
    value === "published" ||
    value === "archived" ||
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

function mapClip(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Clip {
  const state = isState(row.status) ? row.status : "draft";
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

export function createClip(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Clip {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO clips (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'draft', 1)",
  ).run(id, userId, title, body);
  return getClip(db, id)!;
}

export function listClips(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { clips: Clip[]; nextCursor: string | null; limit: number } {
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
             FROM clips WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM clips WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapClip>[0]>;
  const clips = rows.map(mapClip);
  const nextCursor =
    clips.length === limit ? clips[clips.length - 1]!.id : null;
  return { clips, nextCursor, limit };
}

export function seedClips(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO clips (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'draft', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `clip_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Vault ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getClip(db: DatabaseSync, id: string): Clip | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM clips WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapClip>[0] | undefined;
  return row ? mapClip(row) : undefined;
}

export function updateClip(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Clip | undefined {
  const existing = getClip(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE clips SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getClip(db, id);
}

export type TransitionResult =
  | { ok: true; request: Clip }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionClip(
  db: DatabaseSync,
  clipId: string,
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
  const existing = getClip(db, clipId);
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
      "UPDATE clips SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, clipId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO clip_audit (id, clip_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), clipId, userId, existing.state, to, at);
  const updated = getClip(db, clipId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listClipAudit(
  db: DatabaseSync,
  clipId: string,
  userId: string,
): AuditEntry[] | null {
  const clip = getClip(db, clipId);
  if (!clip || clip.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, clip_id AS clipId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM clip_audit WHERE clip_id = ? ORDER BY at ASC`,
    )
    .all(clipId) as AuditEntry[];
}

export function deleteClip(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM clips WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, vaultId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM vault_members WHERE vault_id = ? AND user_id = ?")
    .get(vaultId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createVault(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO vaults (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO vault_members (vault_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getVault(
  db: DatabaseSync,
  vaultId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM vaults WHERE id = ?")
    .get(vaultId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addVaultMember(
  db: DatabaseSync,
  vaultId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO vault_members (vault_id, user_id, role) VALUES (?, ?, ?)",
  ).run(vaultId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  vaultId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; vaultId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, vault_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, vaultId, title, notes, createdBy);
  return { id, vaultId, title, notes };
}

export function getTaskVaultId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT vault_id AS vaultId FROM tasks WHERE id = ?")
    .get(taskId) as { vaultId: string } | undefined;
  return row?.vaultId ?? null;
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
