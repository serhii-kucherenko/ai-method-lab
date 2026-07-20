import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase } from "./db.js";

export type RequestItem = {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: "draft";
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

export function createRequest(
  db: DatabaseSync,
  userId: string,
  title: string,
  body: string,
): RequestItem {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO requests (id, user_id, title, body, status) VALUES (?, ?, ?, ?, 'draft')",
  ).run(id, userId, title, body);
  return { id, userId, title, body, status: "draft" };
}

export function listRequests(db: DatabaseSync, userId: string): RequestItem[] {
  return db
    .prepare(
      "SELECT id, user_id AS userId, title, body, status FROM requests WHERE user_id = ?",
    )
    .all(userId) as RequestItem[];
}

export function getRequest(
  db: DatabaseSync,
  requestId: string,
  userId: string,
): RequestItem | undefined {
  return db
    .prepare(
      "SELECT id, user_id AS userId, title, body, status FROM requests WHERE id = ? AND user_id = ?",
    )
    .get(requestId, userId) as RequestItem | undefined;
}

export function updateRequest(
  db: DatabaseSync,
  requestId: string,
  userId: string,
  patch: { title?: string; body?: string },
): RequestItem | undefined {
  const existing = getRequest(db, requestId, userId);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE requests SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    requestId,
  );
  return { ...existing, title, body };
}

export function deleteRequest(
  db: DatabaseSync,
  requestId: string,
  userId: string,
): boolean {
  const result = db
    .prepare("DELETE FROM requests WHERE id = ? AND user_id = ?")
    .run(requestId, userId);
  return result.changes > 0;
}
