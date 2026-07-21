import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type FirmRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canClose,
  canTransition,
  dualCloseReady,
  fitsAuthorized,
  shareHeadroom,
  type AllocationState,
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

export function createFirm(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO firms (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO firm_members (firm_id, user_id, role) VALUES (?, ?, 'counsel')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, firmId: string, userId: string, role: FirmRole) {
  db.prepare("INSERT INTO firm_members (firm_id, user_id, role) VALUES (?, ?, ?)").run(
    firmId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, firmId: string, userId: string): FirmRole | null {
  const row = db
    .prepare("SELECT role FROM firm_members WHERE firm_id = ? AND user_id = ?")
    .get(firmId, userId) as { role: FirmRole } | undefined;
  return row?.role ?? null;
}

export function getFirm(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM firms WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  firmId: string,
  userId: string,
  mode: "read" | "write" | "own" | "close",
): FirmRole | null {
  const role = getRole(db, firmId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "counsel" || role === "clerk")) return role;
  if (mode === "own" && role === "counsel") return role;
  if (mode === "close" && canClose(role)) return role;
  return null;
}

export function createRound(
  db: DatabaseSync,
  firmId: string,
  label: string,
  authorized: number,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO rounds (id, firm_id, label, authorized) VALUES (?, ?, ?, ?)`,
  ).run(id, firmId, label, authorized);
  return {
    id,
    firmId,
    label,
    authorized,
    headroom: shareHeadroom(authorized, 0),
  };
}

export function listRounds(db: DatabaseSync, firmId: string, limit: number, offset: number) {
  return (
    db
      .prepare(
        `SELECT id, firm_id AS firmId, label, authorized
         FROM rounds WHERE firm_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
      )
      .all(firmId, limit, offset) as {
      id: string;
      firmId: string;
      label: string;
      authorized: number;
    }[]
  ).map((r) => ({
    ...r,
    headroom: shareHeadroom(r.authorized, outstandingAmount(db, r.id)),
  }));
}

export function getRound(db: DatabaseSync, id: string) {
  const row = db
    .prepare(
      `SELECT id, firm_id AS firmId, label, authorized FROM rounds WHERE id = ?`,
    )
    .get(id) as
    | { id: string; firmId: string; label: string; authorized: number }
    | undefined;
  if (!row) return undefined;
  return {
    ...row,
    headroom: shareHeadroom(row.authorized, outstandingAmount(db, id)),
  };
}

function outstandingAmount(db: DatabaseSync, roundId: string): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(shares), 0) AS s FROM allocations
       WHERE round_id = ? AND state IN ('proposed', 'held')`,
    )
    .get(roundId) as { s: number };
  return row.s;
}

export type Allocation = {
  id: string;
  roundId: string;
  title: string;
  shares: number;
  state: AllocationState;
  version: number;
  closeCount: number;
};

function closeCount(db: DatabaseSync, allocationId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM allocation_closes WHERE allocation_id = ?")
    .get(allocationId) as { c: number };
  return row.c;
}

export function getAllocation(db: DatabaseSync, id: string): Allocation | undefined {
  const row = db
    .prepare(
      `SELECT id, round_id AS roundId, title, shares, state, version
       FROM allocations WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        roundId: string;
        title: string;
        shares: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    roundId: row.roundId,
    title: row.title,
    shares: row.shares,
    state: row.state as AllocationState,
    version: row.version,
    closeCount: closeCount(db, id),
  };
}

export function createAllocation(
  db: DatabaseSync,
  roundId: string,
  title: string,
  shares: number,
): { ok: true; allocation: Allocation } | { ok: false; error: string } {
  const round = getRound(db, roundId);
  if (!round) return { ok: false, error: "round not found" };
  const outstanding = outstandingAmount(db, roundId);
  if (!fitsAuthorized(shares, round.authorized, outstanding)) {
    return { ok: false, error: "allocation oversubscribes round" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO allocations (id, round_id, title, shares, state, version)
     VALUES (?, ?, ?, ?, 'proposed', 1)`,
  ).run(id, roundId, title, shares);
  return { ok: true, allocation: getAllocation(db, id)! };
}

export function addClose(
  db: DatabaseSync,
  allocationId: string,
  counselId: string,
): { ok: true; closeCount: number } | { ok: false; error: string; status: number } {
  const allocation = getAllocation(db, allocationId);
  if (!allocation) return { ok: false, error: "not found", status: 404 };
  if (allocation.state !== "held") {
    return { ok: false, error: "closes only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO allocation_closes (id, allocation_id, counsel_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), allocationId, counselId);
  } catch {
    return { ok: false, error: "already closed by this counsel", status: 409 };
  }
  return { ok: true, closeCount: closeCount(db, allocationId) };
}

export function transitionAllocation(
  db: DatabaseSync,
  allocationId: string,
  actorId: string,
  to: AllocationState,
  version: number,
): { ok: true; allocation: Allocation } | { ok: false; error: string; status: number } {
  const allocation = getAllocation(db, allocationId);
  if (!allocation) return { ok: false, error: "not found", status: 404 };
  if (allocation.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(allocation.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "closed" && !dualCloseReady(allocation.closeCount)) {
    return { ok: false, error: "dual counsel close required", status: 400 };
  }
  db.prepare("UPDATE allocations SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    allocationId,
  );
  db.prepare(
    `INSERT INTO allocation_audit (id, allocation_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), allocationId, actorId, allocation.state, to);
  return { ok: true, allocation: getAllocation(db, allocationId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  allocationId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, allocation_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, allocationId, JSON.stringify(payload));
}

export function firmIdForAllocation(db: DatabaseSync, allocationId: string): string | null {
  const allocation = getAllocation(db, allocationId);
  if (!allocation) return null;
  return getRound(db, allocation.roundId)?.firmId ?? null;
}
