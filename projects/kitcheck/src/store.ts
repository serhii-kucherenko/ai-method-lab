import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type Role } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";

export type WorkflowState = "requested" | "checked_out" | "returned" | "cancelled";

export type Loan = {
  id: string;
  userId: string;
  itemName: string;
  note: string;
  status: WorkflowState;
  state: WorkflowState;
  version: number;
};

export type AuditEntry = {
  id: string;
  loanId: string;
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
  requested: ["checked_out", "cancelled"],
  checked_out: ["returned"],
  returned: [],
  cancelled: ["requested"],
};

function isState(value: unknown): value is WorkflowState {
  return (
    value === "requested" ||
    value === "checked_out" ||
    value === "returned" ||
    value === "cancelled"
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

function mapLoan(row: {
  id: string;
  user_id: string;
  item_name: string;
  note: string;
  status: string;
  version: number;
}): Loan {
  const state = isState(row.status) ? row.status : "requested";
  return {
    id: row.id,
    userId: row.user_id,
    itemName: row.item_name,
    note: row.note,
    status: state,
    state,
    version: row.version,
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
    "INSERT INTO loans (id, user_id, item_name, note, status, version) VALUES (?, ?, ?, ?, 'requested', 1)",
  ).run(id, userId, itemName, note);
  return getLoan(db, id)!;
}

export function listLoans(
  db: DatabaseSync,
  userId: string,
  opts: { limit?: number; cursor?: string | null } = {},
): { loans: Loan[]; nextCursor: string | null; limit: number } {
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
            `SELECT id, user_id, item_name, note, status, version
             FROM loans WHERE user_id = ? AND id > ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, cursor, limit)
      : db
          .prepare(
            `SELECT id, user_id, item_name, note, status, version
             FROM loans WHERE user_id = ?
             ORDER BY id ASC LIMIT ?`,
          )
          .all(userId, limit)
  ) as Array<Parameters<typeof mapLoan>[0]>;
  const loans = rows.map(mapLoan);
  const nextCursor =
    loans.length === limit ? loans[loans.length - 1]!.id : null;
  return { loans, nextCursor, limit };
}

export function seedLoans(db: DatabaseSync, userId: string, count: number): string[] {
  const ids: string[] = [];
  const insert = db.prepare(
    "INSERT INTO loans (id, user_id, item_name, note, status, version) VALUES (?, ?, ?, '', 'requested', 1)",
  );
  db.exec("BEGIN");
  try {
    for (let i = 0; i < count; i++) {
      const id = `loan_${String(i).padStart(5, "0")}`;
      insert.run(id, userId, `Item ${i}`);
      ids.push(id);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return ids;
}

export function getLoan(db: DatabaseSync, id: string): Loan | undefined {
  const row = db
    .prepare(
      "SELECT id, user_id, item_name, note, status, version FROM loans WHERE id = ?",
    )
    .get(id) as Parameters<typeof mapLoan>[0] | undefined;
  return row ? mapLoan(row) : undefined;
}

export function updateLoan(
  db: DatabaseSync,
  id: string,
  patch: { itemName?: string; note?: string },
): Loan | undefined {
  const existing = getLoan(db, id);
  if (!existing) return undefined;
  const itemName = patch.itemName ?? existing.itemName;
  const note = patch.note ?? existing.note;
  db.prepare("UPDATE loans SET item_name = ?, note = ? WHERE id = ?").run(
    itemName,
    note,
    id,
  );
  return getLoan(db, id);
}

export type TransitionResult =
  | { ok: true; request: Loan }
  | { ok: false; status: 400 | 404 | 409; error: string };

export function transitionLoan(
  db: DatabaseSync,
  loanId: string,
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
  const existing = getLoan(db, loanId);
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
      "UPDATE loans SET status = ?, version = version + 1 WHERE id = ? AND user_id = ? AND version = ?",
    )
    .run(to, loanId, userId, version);
  if (result.changes !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  const at = new Date().toISOString();
  db.prepare(
    "INSERT INTO loan_audit (id, loan_id, actor_id, from_state, to_state, at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(randomUUID(), loanId, userId, existing.state, to, at);
  const updated = getLoan(db, loanId);
  if (!updated) return { ok: false, status: 404, error: "not found" };
  return { ok: true, request: updated };
}

export function listLoanAudit(
  db: DatabaseSync,
  loanId: string,
  userId: string,
): AuditEntry[] | null {
  const loan = getLoan(db, loanId);
  if (!loan || loan.userId !== userId) return null;
  return db
    .prepare(
      `SELECT id, loan_id AS loanId, actor_id AS actorId, from_state AS "from", to_state AS "to", at
       FROM loan_audit WHERE loan_id = ? ORDER BY at ASC`,
    )
    .all(loanId) as AuditEntry[];
}

export function deleteLoan(db: DatabaseSync, id: string): boolean {
  const result = db.prepare("DELETE FROM loans WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function getRole(db: DatabaseSync, kitId: string, userId: string): Role | null {
  const row = db
    .prepare("SELECT role FROM kit_members WHERE kit_id = ? AND user_id = ?")
    .get(kitId, userId) as { role: Role } | undefined;
  return row?.role ?? null;
}

export function createKit(
  db: DatabaseSync,
  ownerId: string,
  name: string,
): { id: string; name: string; ownerId: string } {
  const id = randomUUID();
  db.prepare("INSERT INTO kits (id, name, owner_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerId,
  );
  db.prepare(
    "INSERT INTO kit_members (kit_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, ownerId);
  return { id, name, ownerId };
}

export function getKit(
  db: DatabaseSync,
  kitId: string,
): { id: string; name: string; ownerId: string } | undefined {
  const row = db
    .prepare("SELECT id, name, owner_id AS ownerId FROM kits WHERE id = ?")
    .get(kitId) as { id: string; name: string; ownerId: string } | undefined;
  return row;
}

export function addKitMember(
  db: DatabaseSync,
  kitId: string,
  userId: string,
  role: Role,
): void {
  db.prepare(
    "INSERT INTO kit_members (kit_id, user_id, role) VALUES (?, ?, ?)",
  ).run(kitId, userId, role);
}

export function createTask(
  db: DatabaseSync,
  kitId: string,
  createdBy: string,
  title: string,
  notes = "",
): { id: string; kitId: string; title: string; notes: string } {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO tasks (id, kit_id, title, notes, created_by) VALUES (?, ?, ?, ?, ?)",
  ).run(id, kitId, title, notes, createdBy);
  return { id, kitId, title, notes };
}

export function getTaskKitId(db: DatabaseSync, taskId: string): string | null {
  const row = db
    .prepare("SELECT kit_id AS kitId FROM tasks WHERE id = ?")
    .get(taskId) as { kitId: string } | undefined;
  return row?.kitId ?? null;
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
