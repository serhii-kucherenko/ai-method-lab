import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase } from "./db.js";

export type Loan = {
  id: string;
  userId: string;
  itemName: string;
  note: string;
  status: string;
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
    .prepare("SELECT user_id AS userId FROM tokens WHERE token = ?")
    .get(token) as { userId: string } | undefined;
  return row?.userId ?? null;
}

function mapLoan(row: {
  id: string;
  user_id: string;
  item_name: string;
  note: string;
  status: string;
}): Loan {
  return {
    id: row.id,
    userId: row.user_id,
    itemName: row.item_name,
    note: row.note,
    status: row.status,
  };
}

export function createLoan(
  db: DatabaseSync,
  userId: string,
  itemName: string,
  note = "",
): Loan {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO loans (id, user_id, item_name, note, status) VALUES (?, ?, ?, ?, 'open')",
  ).run(id, userId, itemName, note);
  return getLoan(db, id)!;
}

export function listLoans(db: DatabaseSync, userId: string): Loan[] {
  return db
    .prepare(
      "SELECT id, user_id, item_name, note, status FROM loans WHERE user_id = ? ORDER BY id",
    )
    .all(userId)
    .map((r) => mapLoan(r as Parameters<typeof mapLoan>[0]));
}

export function getLoan(db: DatabaseSync, id: string): Loan | undefined {
  const row = db
    .prepare("SELECT id, user_id, item_name, note, status FROM loans WHERE id = ?")
    .get(id) as Parameters<typeof mapLoan>[0] | undefined;
  return row ? mapLoan(row) : undefined;
}

export function updateLoan(
  db: DatabaseSync,
  id: string,
  patch: { itemName?: string; note?: string; status?: string },
): Loan | undefined {
  const existing = getLoan(db, id);
  if (!existing) return undefined;
  const itemName = patch.itemName ?? existing.itemName;
  const note = patch.note ?? existing.note;
  const status = patch.status ?? existing.status;
  db.prepare(
    "UPDATE loans SET item_name = ?, note = ?, status = ? WHERE id = ?",
  ).run(itemName, note, status, id);
  return getLoan(db, id);
}

export function deleteLoan(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM loans WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}
