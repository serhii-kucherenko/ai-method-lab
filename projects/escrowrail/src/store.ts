import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type WorkspaceRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canRelease,
  canTransition,
  dualReleaseReady,
  fitsBalanceFloor,
  availableAboveFloor,
  type DisbursementState,
} from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

export function createStore(
  opts: {
    dbPath?: string;
    dep?: DepClient;
    webhookSecret?: string;
    rateLimit?: number;
  } = {},
): Store {
  return {
    db: openDatabase(opts.dbPath ?? ":memory:"),
    dep: opts.dep ?? createMockDep(),
    webhookSecret: opts.webhookSecret ?? "whsec_test",
    sideEffects: 0,
    rateLimit: opts.rateLimit ?? 1000,
    rateCounts: new Map(),
  };
}

export function registerUser(db: DatabaseSync, email: string, password: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(id, email, password);
  return { id, email };
}

export function findUserByEmail(db: DatabaseSync, email: string) {
  return db.prepare("SELECT id, email, password FROM users WHERE email = ?").get(email) as
    | { id: string; email: string; password: string }
    | undefined;
}

export function issueToken(db: DatabaseSync, userId: string): string {
  const token = randomUUID();
  db.prepare("INSERT INTO tokens (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

export function resolveToken(db: DatabaseSync, token: string): string | null {
  const row = db.prepare("SELECT user_id FROM tokens WHERE token = ?").get(token) as
    | { user_id: string }
    | undefined;
  return row?.user_id ?? null;
}

export function createWorkspace(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO workspaces (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, 'escrow_officer')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(
  db: DatabaseSync,
  workspaceId: string,
  userId: string,
  role: WorkspaceRole,
) {
  db.prepare(
    "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)",
  ).run(workspaceId, userId, role);
}

export function getRole(
  db: DatabaseSync,
  workspaceId: string,
  userId: string,
): WorkspaceRole | null {
  const row = db
    .prepare("SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?")
    .get(workspaceId, userId) as { role: WorkspaceRole } | undefined;
  return row?.role ?? null;
}

export function getWorkspace(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM workspaces WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  workspaceId: string,
  userId: string,
  mode: "read" | "write" | "own" | "release",
): WorkspaceRole | null {
  const role = getRole(db, workspaceId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "escrow_officer" || role === "clerk")) return role;
  if (mode === "own" && role === "escrow_officer") return role;
  if (mode === "release" && canRelease(role)) return role;
  return null;
}

export function createAccount(
  db: DatabaseSync,
  workspaceId: string,
  label: string,
  balance: number,
  floor: number,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO accounts (id, workspace_id, label, balance, floor) VALUES (?, ?, ?, ?, ?)`,
  ).run(id, workspaceId, label, balance, floor);
  return {
    id,
    workspaceId,
    label,
    balance,
    floor,
    available: availableAboveFloor(balance, floor, 0),
  };
}

export function listAccounts(
  db: DatabaseSync,
  workspaceId: string,
  limit: number,
  offset: number,
) {
  return (
    db
      .prepare(
        `SELECT id, workspace_id AS workspaceId, label, balance, floor
         FROM accounts WHERE workspace_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
      )
      .all(workspaceId, limit, offset) as {
      id: string;
      workspaceId: string;
      label: string;
      balance: number;
      floor: number;
    }[]
  ).map((a) => ({
    ...a,
    available: availableAboveFloor(a.balance, a.floor, outstandingAmount(db, a.id)),
  }));
}

export function getAccount(db: DatabaseSync, id: string) {
  const row = db
    .prepare(
      `SELECT id, workspace_id AS workspaceId, label, balance, floor FROM accounts WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        workspaceId: string;
        label: string;
        balance: number;
        floor: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    ...row,
    available: availableAboveFloor(row.balance, row.floor, outstandingAmount(db, id)),
  };
}

function outstandingAmount(db: DatabaseSync, accountId: string): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS s FROM disbursements
       WHERE account_id = ? AND state IN ('requested', 'held')`,
    )
    .get(accountId) as { s: number };
  return row.s;
}

export type Disbursement = {
  id: string;
  accountId: string;
  title: string;
  amount: number;
  state: DisbursementState;
  version: number;
  releaseCount: number;
};

function releaseCount(db: DatabaseSync, disbursementId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM disbursement_releases WHERE disbursement_id = ?")
    .get(disbursementId) as { c: number };
  return row.c;
}

export function getDisbursement(db: DatabaseSync, id: string): Disbursement | undefined {
  const row = db
    .prepare(
      `SELECT id, account_id AS accountId, title, amount, state, version
       FROM disbursements WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        accountId: string;
        title: string;
        amount: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    accountId: row.accountId,
    title: row.title,
    amount: row.amount,
    state: row.state as DisbursementState,
    version: row.version,
    releaseCount: releaseCount(db, id),
  };
}

export function createDisbursement(
  db: DatabaseSync,
  accountId: string,
  title: string,
  amount: number,
): { ok: true; disbursement: Disbursement } | { ok: false; error: string } {
  const account = getAccount(db, accountId);
  if (!account) return { ok: false, error: "account not found" };
  const outstanding = outstandingAmount(db, accountId);
  if (!fitsBalanceFloor(amount, account.balance, account.floor, outstanding)) {
    return { ok: false, error: "disbursement breaches balance floor" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO disbursements (id, account_id, title, amount, state, version)
     VALUES (?, ?, ?, ?, 'requested', 1)`,
  ).run(id, accountId, title, amount);
  return { ok: true, disbursement: getDisbursement(db, id)! };
}

export function addRelease(
  db: DatabaseSync,
  disbursementId: string,
  officerId: string,
): { ok: true; releaseCount: number } | { ok: false; error: string; status: number } {
  const d = getDisbursement(db, disbursementId);
  if (!d) return { ok: false, error: "not found", status: 404 };
  if (d.state !== "held") {
    return { ok: false, error: "releases only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO disbursement_releases (id, disbursement_id, officer_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), disbursementId, officerId);
  } catch {
    return { ok: false, error: "already released by this officer", status: 409 };
  }
  return { ok: true, releaseCount: releaseCount(db, disbursementId) };
}

export function transitionDisbursement(
  db: DatabaseSync,
  disbursementId: string,
  actorId: string,
  to: DisbursementState,
  version: number,
): { ok: true; disbursement: Disbursement } | { ok: false; error: string; status: number } {
  const d = getDisbursement(db, disbursementId);
  if (!d) return { ok: false, error: "not found", status: 404 };
  if (d.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(d.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "released" && !dualReleaseReady(d.releaseCount)) {
    return { ok: false, error: "dual escrow officer release required", status: 400 };
  }
  db.prepare("UPDATE disbursements SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    disbursementId,
  );
  db.prepare(
    `INSERT INTO disbursement_audit (id, disbursement_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), disbursementId, actorId, d.state, to);
  return { ok: true, disbursement: getDisbursement(db, disbursementId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  disbursementId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, disbursement_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, disbursementId, JSON.stringify(payload));
}

export function workspaceIdForDisbursement(
  db: DatabaseSync,
  disbursementId: string,
): string | null {
  const d = getDisbursement(db, disbursementId);
  if (!d) return null;
  return getAccount(db, d.accountId)?.workspaceId ?? null;
}
