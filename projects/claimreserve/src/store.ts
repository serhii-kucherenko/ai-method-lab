import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type DeskRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canSettle,
  canTransition,
  dualSettleReady,
  fitsReserveCeiling,
  reserveHeadroom,
  type ClaimState,
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

export function createDesk(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO desks (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, 'adjuster')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, deskId: string, userId: string, role: DeskRole) {
  db.prepare("INSERT INTO desk_members (desk_id, user_id, role) VALUES (?, ?, ?)").run(
    deskId,
    userId,
    role,
  );
}

export function getRole(db: DatabaseSync, deskId: string, userId: string): DeskRole | null {
  const row = db
    .prepare("SELECT role FROM desk_members WHERE desk_id = ? AND user_id = ?")
    .get(deskId, userId) as { role: DeskRole } | undefined;
  return row?.role ?? null;
}

export function getDesk(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM desks WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  deskId: string,
  userId: string,
  mode: "read" | "write" | "own" | "settle",
): DeskRole | null {
  const role = getRole(db, deskId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "adjuster" || role === "clerk")) return role;
  if (mode === "own" && role === "adjuster") return role;
  if (mode === "settle" && canSettle(role)) return role;
  return null;
}

export function createPolicy(
  db: DatabaseSync,
  deskId: string,
  label: string,
  reserveCeiling: number,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO policies (id, desk_id, label, reserve_ceiling) VALUES (?, ?, ?, ?)`,
  ).run(id, deskId, label, reserveCeiling);
  return {
    id,
    deskId,
    label,
    reserveCeiling,
    headroom: reserveHeadroom(reserveCeiling, 0),
  };
}

export function listPolicies(db: DatabaseSync, deskId: string, limit: number, offset: number) {
  return (
    db
      .prepare(
        `SELECT id, desk_id AS deskId, label, reserve_ceiling AS reserveCeiling
         FROM policies WHERE desk_id = ? ORDER BY label ASC LIMIT ? OFFSET ?`,
      )
      .all(deskId, limit, offset) as {
      id: string;
      deskId: string;
      label: string;
      reserveCeiling: number;
    }[]
  ).map((p) => ({
    ...p,
    headroom: reserveHeadroom(p.reserveCeiling, outstandingAmount(db, p.id)),
  }));
}

export function getPolicy(db: DatabaseSync, id: string) {
  const row = db
    .prepare(
      `SELECT id, desk_id AS deskId, label, reserve_ceiling AS reserveCeiling
       FROM policies WHERE id = ?`,
    )
    .get(id) as
    | { id: string; deskId: string; label: string; reserveCeiling: number }
    | undefined;
  if (!row) return undefined;
  return {
    ...row,
    headroom: reserveHeadroom(row.reserveCeiling, outstandingAmount(db, id)),
  };
}

function outstandingAmount(db: DatabaseSync, policyId: string): number {
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(reserve_amount), 0) AS s FROM claims
       WHERE policy_id = ? AND state IN ('filed', 'held')`,
    )
    .get(policyId) as { s: number };
  return row.s;
}

export type Claim = {
  id: string;
  policyId: string;
  title: string;
  reserveAmount: number;
  state: ClaimState;
  version: number;
  settleCount: number;
};

function settleCount(db: DatabaseSync, claimId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS c FROM claim_settlements WHERE claim_id = ?")
    .get(claimId) as { c: number };
  return row.c;
}

export function getClaim(db: DatabaseSync, id: string): Claim | undefined {
  const row = db
    .prepare(
      `SELECT id, policy_id AS policyId, title, reserve_amount AS reserveAmount, state, version
       FROM claims WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        policyId: string;
        title: string;
        reserveAmount: number;
        state: string;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    policyId: row.policyId,
    title: row.title,
    reserveAmount: row.reserveAmount,
    state: row.state as ClaimState,
    version: row.version,
    settleCount: settleCount(db, id),
  };
}

export function createClaim(
  db: DatabaseSync,
  policyId: string,
  title: string,
  reserveAmount: number,
): { ok: true; claim: Claim } | { ok: false; error: string } {
  const policy = getPolicy(db, policyId);
  if (!policy) return { ok: false, error: "policy not found" };
  const outstanding = outstandingAmount(db, policyId);
  if (!fitsReserveCeiling(reserveAmount, policy.reserveCeiling, outstanding)) {
    return { ok: false, error: "claim exceeds reserve ceiling" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO claims (id, policy_id, title, reserve_amount, state, version)
     VALUES (?, ?, ?, ?, 'filed', 1)`,
  ).run(id, policyId, title, reserveAmount);
  return { ok: true, claim: getClaim(db, id)! };
}

export function addSettlement(
  db: DatabaseSync,
  claimId: string,
  adjusterId: string,
): { ok: true; settleCount: number } | { ok: false; error: string; status: number } {
  const claim = getClaim(db, claimId);
  if (!claim) return { ok: false, error: "not found", status: 404 };
  if (claim.state !== "held") {
    return { ok: false, error: "settlements only while held", status: 400 };
  }
  try {
    db.prepare(
      `INSERT INTO claim_settlements (id, claim_id, adjuster_id) VALUES (?, ?, ?)`,
    ).run(randomUUID(), claimId, adjusterId);
  } catch {
    return { ok: false, error: "already settled by this adjuster", status: 409 };
  }
  return { ok: true, settleCount: settleCount(db, claimId) };
}

export function transitionClaim(
  db: DatabaseSync,
  claimId: string,
  actorId: string,
  to: ClaimState,
  version: number,
): { ok: true; claim: Claim } | { ok: false; error: string; status: number } {
  const claim = getClaim(db, claimId);
  if (!claim) return { ok: false, error: "not found", status: 404 };
  if (claim.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(claim.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "settled" && !dualSettleReady(claim.settleCount)) {
    return { ok: false, error: "dual adjuster settle required", status: 400 };
  }
  db.prepare("UPDATE claims SET state = ?, version = version + 1 WHERE id = ?").run(to, claimId);
  db.prepare(
    `INSERT INTO claim_audit (id, claim_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), claimId, actorId, claim.state, to);
  return { ok: true, claim: getClaim(db, claimId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  claimId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, claim_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, claimId, JSON.stringify(payload));
}

export function deskIdForClaim(db: DatabaseSync, claimId: string): string | null {
  const claim = getClaim(db, claimId);
  if (!claim) return null;
  return getPolicy(db, claim.policyId)?.deskId ?? null;
}
