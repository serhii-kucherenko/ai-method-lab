import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "available" | "loaned" | "returned" | "discarded";

export type Piece = {
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
  pieceId: string;
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
  available: ["loaned", "discarded"],
  loaned: ["returned"],
  returned: [],
  discarded: ["available"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "available" ||
    value === "loaned" ||
    value === "returned" ||
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

function mapPiece(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Piece {
  const state = isState(row.status) ? row.status : "available";
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

export function createPiece(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Piece {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO pieces (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'available', 1)",
  ).run(id, userId, title, body);
  return getPiece(db, id)!;
}

export function listPieces(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { pieces: Piece[]; nextCursor: string | null; limit: number } {
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
             FROM pieces WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM pieces WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapPiece>[0]>;
  const pieces = rows.map(mapPiece);
  const nextCursor =
    pieces.length === limit ? pieces[pieces.length - 1]!.id : null;
  return { pieces, nextCursor, limit };
}

export function seedPieces(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO pieces (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'available', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `piece_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Gallery ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getPiece(db: DatabaseSync, id: string): Piece | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM pieces WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapPiece>[0] | undefined;
  return row ? mapPiece(row) : undefined;
}

export function updatePiece(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Piece | undefined {
  const existing = getPiece(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE pieces SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getPiece(db, id);
}

export type TransitionResult =
  | { ok: true; request: Piece }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionPiece(
  db: DatabaseSync,
  pieceId: string,
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
  const existing = getPiece(db, pieceId);
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
      "UPDATE pieces SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, pieceId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO piece_audit (id, piece_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), pieceId, userId, existing.state, to, at);
  const updated = getPiece(db, pieceId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listPieceAudit(
  db: DatabaseSync,
  pieceId: string,
  userId: string,
): AuditEntry[] | null {
  const piece = getPiece(db, pieceId);
  if (!piece || piece.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, piece_id AS pieceId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM piece_audit WHERE piece_id = ? ORDER BY at ASC`,
    )
    .all(pieceId) as AuditEntry[];
}

export function deletePiece(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM pieces WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, galleryId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM gallery_members WHERE gallery_id = ? AND user_id = ?")
    .get(galleryId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createGallery(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO galleries (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO gallery_members (gallery_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getGallery(
  db: DatabaseSync,
  galleryId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM galleries WHERE id = ?")
    .get(galleryId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addGalleryMember(
  db: DatabaseSync,
  galleryId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO gallery_members (gallery_id, user_id, role) VALUES (?, ?, ?)",
  ).run(galleryId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  galleryId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; galleryId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, gallery_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, galleryId, title, notes, createdBy);
  return { id, galleryId, title, notes };
}

export function getTaskGalleryId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT gallery_id AS galleryId FROM tasks WHERE id = ?")
    .get(taskId) as { galleryId: string } | undefined;
  return row?.galleryId ?? null;
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
