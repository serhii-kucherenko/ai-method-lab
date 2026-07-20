import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";

export type Status = {
  id: string;
  userId: string;
  title: string;
  body: string;
};

export type Store = { db: DatabaseSync };

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
    .prepare("SELECT role FROM memberships WHERE project_id = ? AND user_id = ?")
    .get(projectId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createStatus(
  db: DatabaseSync,
  userId: string,
  title: string,
  body: string,
): Status {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO statuses (id, user_id, title, body) VALUES (?, ?, ?, ?)",
  ).run(id, userId, title, body);
  return { id, userId, title, body };
}

export function listStatuses(db: DatabaseSync, userId: string): Status[] {
  return db
    .prepare(
      "SELECT id, user_id AS userId, title, body FROM statuses WHERE user_id = ?",
    )
    .all(userId) as Status[];
}

export function getStatus(
  db: DatabaseSync,
  statusId: string,
  userId: string,
): Status | undefined {
  return db
    .prepare(
      "SELECT id, user_id AS userId, title, body FROM statuses WHERE id = ? AND user_id = ?",
    )
    .get(statusId, userId) as Status | undefined;
}

export function updateStatus(
  db: DatabaseSync,
  statusId: string,
  userId: string,
  patch: { title?: string; body?: string },
): Status | undefined {
  const existing = getStatus(db, statusId, userId);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE statuses SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    statusId,
  );
  return { ...existing, title, body };
}

export function deleteStatus(
  db: DatabaseSync,
  statusId: string,
  userId: string,
): boolean {
  return (
    db.prepare("DELETE FROM statuses WHERE id = ? AND user_id = ?").run(statusId, userId)
      .changes > 0
  );
}
