import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";

export type Entry = {
  id: string;
  userId: string;
  memo: string;
  amount: number;
};

export type Store = {
  db: DatabaseSync;
};

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
    "INSERT INTO entries (id, user_id, memo, amount) VALUES (?, ?, ?, ?)",
  ).run(id, userId, memo, amount);
  return { id, userId, memo, amount };
}

export function listEntries(db: DatabaseSync, userId: string): Entry[] {
  return db
    .prepare(
      "SELECT id, user_id AS userId, memo, amount FROM entries WHERE user_id = ?",
    )
    .all(userId) as Entry[];
}

export function getEntry(
  db: DatabaseSync,
  entryId: string,
  userId: string,
): Entry | undefined {
  return db
    .prepare(
      "SELECT id, user_id AS userId, memo, amount FROM entries WHERE id = ? AND user_id = ?",
    )
    .get(entryId, userId) as Entry | undefined;
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
