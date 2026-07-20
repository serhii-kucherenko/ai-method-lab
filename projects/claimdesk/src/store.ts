import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type DeskRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canTransition,
  evidenceReady,
  payoutAllowed,
  type WorkflowState,
} from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

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

export function registerUser(db: DatabaseSync, email: string, password: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)").run(
    id,
    email,
    password,
  );
  return { id, email };
}

export function findUserByEmail(db: DatabaseSync, email: string) {
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

export function createDesk(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO desks (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, 'supervisor')",
  ).run(id, userId);
  return { id, name };
}

export function addDeskMember(
  db: DatabaseSync,
  deskId: string,
  userId: string,
  role: DeskRole,
): void {
  db.prepare(
    "INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, ?)",
  ).run(deskId, userId, role);
}

export function getDeskRole(
  db: DatabaseSync,
  deskId: string,
  userId: string,
): DeskRole | null {
  const row = db
    .prepare("SELECT role FROM desk_members WHERE desk_id = ? AND user_id = ?")
    .get(deskId, userId) as { role: DeskRole } | undefined;
  return row?.role ?? null;
}

export function getDesk(db: DatabaseSync, deskId: string) {
  return db
    .prepare("SELECT id, name FROM desks WHERE id = ?")
    .get(deskId) as { id: string; name: string } | undefined;
}

function canWrite(role: DeskRole | null): boolean {
  return role === "supervisor" || role === "adjuster";
}

function canRead(role: DeskRole | null): boolean {
  return role === "supervisor" || role === "adjuster" || role === "claimant";
}

export function assertDeskAccess(
  db: DatabaseSync,
  deskId: string,
  userId: string,
  mode: "read" | "write",
): DeskRole | null {
  const role = getDeskRole(db, deskId, userId);
  if (!role) return null;
  if (mode === "write" && !canWrite(role)) return null;
  if (mode === "read" && !canRead(role)) return null;
  return role;
}

export function createPolicy(
  db: DatabaseSync,
  deskId: string,
  number: string,
  holder: string,
) {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO policies (id, desk_id, number, holder) VALUES (?, ?, ?, ?)",
  ).run(id, deskId, number, holder);
  return { id, deskId, number, holder };
}

export function listPolicies(
  db: DatabaseSync,
  deskId: string,
  limit: number,
  offset: number,
) {
  return db
    .prepare(
      `SELECT id, desk_id AS deskId, number, holder FROM policies
       WHERE desk_id = ? ORDER BY number ASC LIMIT ? OFFSET ?`,
    )
    .all(deskId, limit, offset) as {
    id: string;
    deskId: string;
    number: string;
    holder: string;
  }[];
}

export function getPolicy(db: DatabaseSync, policyId: string) {
  return db
    .prepare(
      "SELECT id, desk_id AS deskId, number, holder FROM policies WHERE id = ?",
    )
    .get(policyId) as
    | { id: string; deskId: string; number: string; holder: string }
    | undefined;
}

export type Claim = {
  id: string;
  policyId: string;
  title: string;
  state: WorkflowState;
  reserveAmount: number | null;
  payoutAmount: number | null;
  version: number;
  evidenceCount: number;
};

function mapClaim(row: {
  id: string;
  policyId: string;
  title: string;
  state: string;
  reserveAmount: number | null;
  payoutAmount: number | null;
  version: number;
}): Claim {
  return {
    id: row.id,
    policyId: row.policyId,
    title: row.title,
    state: row.state as WorkflowState,
    reserveAmount: row.reserveAmount,
    payoutAmount: row.payoutAmount,
    version: row.version,
    evidenceCount: 0,
  };
}

export function evidenceCount(db: DatabaseSync, claimId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM evidence WHERE claim_id = ?")
    .get(claimId) as { c: number };
  return Number(row.c);
}

export function createClaim(db: DatabaseSync, policyId: string, title: string): Claim {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO claims (id, policy_id, title, state, version)
     VALUES (?, ?, ?, 'filed', 1)`,
  ).run(id, policyId, title);
  return getClaim(db, id)!;
}

export function getClaim(db: DatabaseSync, claimId: string): Claim | undefined {
  const row = db
    .prepare(
      `SELECT id, policy_id AS policyId, title, state,
              reserve_amount AS reserveAmount, payout_amount AS payoutAmount, version
       FROM claims WHERE id = ?`,
    )
    .get(claimId) as
    | {
        id: string;
        policyId: string;
        title: string;
        state: string;
        reserveAmount: number | null;
        payoutAmount: number | null;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  const claim = mapClaim(row);
  claim.evidenceCount = evidenceCount(db, claimId);
  return claim;
}

export function listClaims(
  db: DatabaseSync,
  policyId: string,
  limit: number,
  offset: number,
): Claim[] {
  const rows = db
    .prepare(
      `SELECT id, policy_id AS policyId, title, state,
              reserve_amount AS reserveAmount, payout_amount AS payoutAmount, version
       FROM claims WHERE policy_id = ?
       ORDER BY title ASC LIMIT ? OFFSET ?`,
    )
    .all(policyId, limit, offset) as {
    id: string;
    policyId: string;
    title: string;
    state: string;
    reserveAmount: number | null;
    payoutAmount: number | null;
    version: number;
  }[];
  return rows.map((r) => {
    const c = mapClaim(r);
    c.evidenceCount = evidenceCount(db, r.id);
    return c;
  });
}

export function setReserve(
  db: DatabaseSync,
  claimId: string,
  amount: number,
): Claim | undefined {
  db.prepare("UPDATE claims SET reserve_amount = ? WHERE id = ?").run(amount, claimId);
  return getClaim(db, claimId);
}

export function addEvidence(
  db: DatabaseSync,
  claimId: string,
  label: string,
  kind: string,
  addedBy: string,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO evidence (id, claim_id, label, kind, added_by)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(id, claimId, label, kind, addedBy);
  return { id, claimId, label, kind };
}

export function transitionClaim(
  db: DatabaseSync,
  claimId: string,
  actorId: string,
  to: WorkflowState,
  version: number,
  payout: number | null = null,
): { ok: true; claim: Claim } | { ok: false; error: string; status: number } {
  const claim = getClaim(db, claimId);
  if (!claim) return { ok: false, error: "not found", status: 404 };
  if (claim.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(claim.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "review") {
    if (claim.reserveAmount === null) {
      return { ok: false, error: "reserve required before review", status: 400 };
    }
  }
  if (to === "settled") {
    if (!evidenceReady(claim.evidenceCount)) {
      return { ok: false, error: "evidence required before settle", status: 400 };
    }
    if (!payoutAllowed(claim.reserveAmount, payout)) {
      return { ok: false, error: "payout must be <= reserve", status: 400 };
    }
  }
  db.prepare(
    `UPDATE claims SET state = ?, payout_amount = ?, version = version + 1 WHERE id = ?`,
  ).run(to, to === "settled" ? payout : null, claimId);
  db.prepare(
    `INSERT INTO claim_audit (id, claim_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), claimId, actorId, claim.state, to);
  return { ok: true, claim: getClaim(db, claimId)! };
}

export function listAudit(db: DatabaseSync, claimId: string) {
  return db
    .prepare(
      `SELECT id, from_state AS "from", to_state AS "to", actor_id AS actorId, at
       FROM claim_audit WHERE claim_id = ? ORDER BY at ASC`,
    )
    .all(claimId) as {
    id: string;
    from: string;
    to: string;
    actorId: string;
    at: string;
  }[];
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  claimId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, claim_id, payload)
     VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, claimId, JSON.stringify(payload));
}

export function deskIdForPolicy(db: DatabaseSync, policyId: string): string | null {
  return getPolicy(db, policyId)?.deskId ?? null;
}

export function deskIdForClaim(db: DatabaseSync, claimId: string): string | null {
  const claim = getClaim(db, claimId);
  if (!claim) return null;
  return deskIdForPolicy(db, claim.policyId);
}
