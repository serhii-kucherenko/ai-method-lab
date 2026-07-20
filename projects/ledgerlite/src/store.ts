import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";

export type WorkflowState = "draft" | "in_review" | "approved" | "rejected";

export type Entry = {
  id: string;
  userId: string;
  memo: string;
  amount: number;
  status: WorkflowState;
  state: WorkflowState;
  version: number;
};

export type AuditEntry = {
  id: string;
  entryId: string;
  actorId: string;
  from: WorkflowState;
  to: WorkflowState;
  at: string;
};

export type Store = {
  db: DatabaseSync;
};

const LEGAL: Record<WorkflowState, WorkflowState[]> = {
  draft: ["in_review"],
  in_review: ["approved", "rejected"],
  approved: [],
  rejected: ["draft"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "draft" ||
    value === "in_review" ||
    value === "approved" ||
    value === "rejected"
  );
}

function mapEntry(row: {
  id: string;
  userId: string;
  memo: string;
  amount: number;
  status: string;
  version: number;
}): Entry {
  const state = isState(row.status) ? row.status : "draft";
  return {
    id: row.id,
    userId: row.userId,
    memo: row.memo,
    amount: row.amount,
    status: state,
    state,
    version: row.version,
  };
}

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
    .prepare("SELECT user_id FROM tokens WHERE token = ?")
    .get(token) as { user_id: string } | undefined;
  return row?.user_id ?? null;
}

export function getRole(
  db: DatabaseSync,
  projectId: string,
  userId: string,
): Role | null {
  const row = db
    .prepare("SELECT role FROM memberships WHERE ledger_id = ? AND user_id = ?")
    .get(projectId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createEntry(
  db: DatabaseSync,
  userId: string,
  memo: string,
  amount: number,
): Entry {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO entries (id, user_id, memo, amount, status, version) VALUES (?, ?, ?, ?, 'draft', 1)",
  ).run(id, userId, memo, amount);
  return {
    id,
    userId,
    memo,
    amount,
    status: "draft",
    state: "draft",
    version: 1,
  };
}

export function listEntries(db: DatabaseSync, userId: string): Entry[] {
  const rows = db
    .prepare(
      "SELECT id, user_id AS userId, memo, amount, status, version FROM entries WHERE user_id = ?",
    )
    .all(userId) as Array<{
    id: string;
    userId: string;
    memo: string;
    amount: number;
    status: string;
    version: number;
  }>;
  return rows.map(mapEntry);
}

export function getEntry(
  db: DatabaseSync,
  entryId: string,
  userId: string,
): Entry | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id AS userId, memo, amount, status, version FROM entries WHERE id = ? AND user_id = ?",
    )
    .get(entryId, userId) as
    | {
        id: string;
        userId: string;
        memo: string;
        amount: number;
        status: string;
        version: number;
      }
    | undefined;
  return row ? mapEntry(row) : undefined;
}

export function updateEntry(
  db: DatabaseSync,
  entryId: string,
  userId: string,
  patch: { memo?: string; amount?: number },
): Entry | undefined {
  const existing = getEntry(db, entryId, userId);
  if (!existing) return undefined;
  const memo = patch.memo ?? existing.memo;
  const amount = patch.amount ?? existing.amount;
  db.prepare("UPDATE entries SET memo = ?, amount = ? WHERE id = ?").run(
    memo,
    amount,
    entryId,
  );
  return { ...existing, memo, amount };
}

export function deleteEntry(
  db: DatabaseSync,
  entryId: string,
  userId: string,
): boolean {
  return (
    db.prepare("DELETE FROM entries WHERE id = ? AND user_id = ?").run(entryId, userId)
      .changes > 0
  );
}

export type TransitionResult =
  | { ok: true; request: Entry }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionEntry(
  db: DatabaseSync,
  entryId: string,
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
  const existing = getEntry(db, entryId, userId);
  if (!existing) {
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
      "UPDATE entries SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, entryId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO entry_audit (id, entry_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), entryId, userId, existing.state, to, at);
  const updated = getEntry(db, entryId, userId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listEntryAudit(
  db: DatabaseSync,
  entryId: string,
  userId: string,
): AuditEntry[] | null {
  if (!getEntry(db, entryId, userId)) return null;
  return db
    .prepare(
      `SELECT id, entry_id AS entryId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM entry_audit WHERE entry_id = ? ORDER BY at ASC`,
    )
    .all(entryId) as AuditEntry[];
}
