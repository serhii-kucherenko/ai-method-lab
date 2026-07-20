import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "draft" | "sent" | "paid" | "discarded";

export type Invoice = {
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
  invoiceId: string;
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
  draft: ["sent", "discarded"],
  sent: ["paid"],
  paid: [],
  discarded: ["draft"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "draft" ||
    value === "sent" ||
    value === "paid" ||
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

function mapInvoice(row: {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: string;
  version: number;
}): Invoice {
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

export function createInvoice(
  db: DatabaseSync,
  userId: string,
  title: string,
  body = "",
): Invoice {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO invoices (id, user_id, title, body, status, version) VALUES (?, ?, ?, ?, 'draft', 1)",
  ).run(id, userId, title, body);
  return getInvoice(db, id)!;
}

export function listInvoices(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { invoices: Invoice[]; nextCursor: string | null; limit: number } {
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
             FROM invoices WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, title, body, status, version
             FROM invoices WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapInvoice>[0]>;
  const invoices = rows.map(mapInvoice);
  const nextCursor =
    invoices.length === limit ? invoices[invoices.length - 1]!.id : null;
  return { invoices, nextCursor, limit };
}

export function seedInvoices(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO invoices (id, user_id, title, body, status, version) VALUES (?, ?, ?, '', 'draft', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `invoice_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Book ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getInvoice(db: DatabaseSync, id: string): Invoice | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, title, body, status, version FROM invoices WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapInvoice>[0] | undefined;
  return row ? mapInvoice(row) : undefined;
}

export function updateInvoice(
  db: DatabaseSync,
  id: string,
  patch: { title?: string; body?: string },
): Invoice | undefined {
  const existing = getInvoice(db, id);
  if (!existing) return undefined;
  const title = patch.title ?? existing.title;
  const body = patch.body ?? existing.body;
  db.prepare("UPDATE invoices SET title = ?, body = ? WHERE id = ?").run(
    title,
    body,
    id,
  );
  return getInvoice(db, id);
}

export type TransitionResult =
  | { ok: true; request: Invoice }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionInvoice(
  db: DatabaseSync,
  invoiceId: string,
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
  const existing = getInvoice(db, invoiceId);
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
      "UPDATE invoices SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, invoiceId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO invoice_audit (id, invoice_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), invoiceId, userId, existing.state, to, at);
  const updated = getInvoice(db, invoiceId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listInvoiceAudit(
  db: DatabaseSync,
  invoiceId: string,
  userId: string,
): AuditEntry[] | null {
  const invoice = getInvoice(db, invoiceId);
  if (!invoice || invoice.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, invoice_id AS invoiceId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM invoice_audit WHERE invoice_id = ? ORDER BY at ASC`,
    )
    .all(invoiceId) as AuditEntry[];
}

export function deleteInvoice(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM invoices WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, bookId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM book_members WHERE book_id = ? AND user_id = ?")
    .get(bookId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createBook(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO books (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO book_members (book_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getBook(
  db: DatabaseSync,
  bookId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM books WHERE id = ?")
    .get(bookId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addBookMember(
  db: DatabaseSync,
  bookId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO book_members (book_id, user_id, role) VALUES (?, ?, ?)",
  ).run(bookId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  bookId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; bookId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, book_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, bookId, title, notes, createdBy);
  return { id, bookId, title, notes };
}

export function getTaskBookId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT book_id AS bookId FROM tasks WHERE id = ?")
    .get(taskId) as { bookId: string } | undefined;
  return row?.bookId ?? null;
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
