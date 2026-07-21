import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type CarrierRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import { evaluatePairing, type PairingInput } from "./legality.js";
import { canTransition, type PairingState } from "./rules.js";

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

type WriteResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

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

export function createCarrier(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO carriers (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO carrier_members (carrier_id, user_id, role) VALUES (?, ?, 'scheduler')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, carrierId: string, userId: string, role: CarrierRole) {
  db.prepare(
    `INSERT INTO carrier_members (carrier_id, user_id, role) VALUES (?, ?, ?)
     ON CONFLICT(carrier_id, user_id) DO UPDATE SET role = excluded.role`,
  ).run(carrierId, userId, role);
}

export function getRole(db: DatabaseSync, carrierId: string, userId: string): CarrierRole | null {
  const row = db
    .prepare("SELECT role FROM carrier_members WHERE carrier_id = ? AND user_id = ?")
    .get(carrierId, userId) as { role: CarrierRole } | undefined;
  return row?.role ?? null;
}

export function getCarrier(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM carriers WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  carrierId: string,
  userId: string,
  mode: "read" | "write" | "release" | "notify",
): CarrierRole | null {
  const role = getRole(db, carrierId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && role === "scheduler") return role;
  if (mode === "release" && (role === "legal" || role === "ops_admin")) return role;
  if (mode === "notify" && role === "ops_admin") return role;
  return null;
}

export function createPairing(
  db: DatabaseSync,
  carrierId: string,
  input: PairingInput,
): WriteResult<Record<string, unknown>> {
  if (input.claims_augmented && !input.has_rest_facility) {
    return { ok: false, status: 400, error: "reject_augmented_claim" };
  }
  const result = evaluatePairing(input);
  const id = randomUUID();
  db.prepare(
    `INSERT INTO pairings (
      id, carrier_id, report_local, segments, acclimated, fdp_hours, rest_hours,
      max_consecutive_off_in_168h, legal, max_fdp, state, version, reasons_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 1, ?)`,
  ).run(
    id,
    carrierId,
    input.report_local,
    input.segments,
    input.acclimated ? 1 : 0,
    input.fdp_hours,
    input.rest_hours ?? null,
    input.max_consecutive_off_in_168h ?? null,
    result.legal ? 1 : 0,
    result.max_fdp,
    JSON.stringify(result.reasons),
  );
  return {
    ok: true,
    value: {
      id,
      legal: result.legal,
      max_fdp: result.max_fdp,
      reasons: result.reasons,
      state: "draft",
      version: 1,
    },
  };
}

export function getPairing(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, carrier_id AS carrierId, report_local AS reportLocal, segments, acclimated,
              fdp_hours AS fdpHours, rest_hours AS restHours, legal, max_fdp AS maxFdp,
              state, version, reasons_json AS reasonsJson
       FROM pairings WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        carrierId: string;
        reportLocal: string;
        segments: number;
        acclimated: number;
        fdpHours: number;
        restHours: number | null;
        legal: number;
        maxFdp: number;
        state: PairingState;
        version: number;
        reasonsJson: string;
      }
    | undefined;
}

export function listPairings(db: DatabaseSync, carrierId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, report_local AS reportLocal, segments, legal, state, max_fdp AS maxFdp
       FROM pairings WHERE carrier_id = ?
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(carrierId, limit, offset) as Array<{
    id: string;
    reportLocal: string;
    segments: number;
    legal: number;
    state: string;
    maxFdp: number;
  }>;
}

export function countPairings(db: DatabaseSync, carrierId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM pairings WHERE carrier_id = ?")
    .get(carrierId) as { n: number };
  return Number(row.n);
}

export function listIllegal(db: DatabaseSync, carrierId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, report_local AS reportLocal, segments, max_fdp AS maxFdp, reasons_json AS reasonsJson
       FROM pairings WHERE carrier_id = ? AND legal = 0
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(carrierId, limit, offset) as Array<{
    id: string;
    reportLocal: string;
    segments: number;
    maxFdp: number;
    reasonsJson: string;
  }>;
}

export function countIllegal(db: DatabaseSync, carrierId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM pairings WHERE carrier_id = ? AND legal = 0")
    .get(carrierId) as { n: number };
  return Number(row.n);
}

export function transitionPairing(
  db: DatabaseSync,
  pairingId: string,
  actorId: string,
  to: PairingState,
  expectedVersion: number,
): WriteResult<{ id: string; version: number; state: PairingState }> {
  const row = getPairing(db, pairingId);
  if (!row) return { ok: false, status: 404, error: "not found" };
  if (row.version !== expectedVersion) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  if (!canTransition(row.state, to)) {
    return { ok: false, status: 400, error: "illegal transition" };
  }
  if (to === "released" && !row.legal) {
    return { ok: false, status: 400, error: "cannot release illegal pairing" };
  }
  const updated = db
    .prepare(
      "UPDATE pairings SET state = ?, version = version + 1 WHERE id = ? AND version = ?",
    )
    .run(to, pairingId, expectedVersion);
  if (Number(updated.changes) !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  db.prepare(
    `INSERT INTO pairing_audit (id, pairing_id, actor_id, from_state, to_state) VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), pairingId, actorId, row.state, to);
  return { ok: true, value: { id: pairingId, version: expectedVersion + 1, state: to } };
}

export function listPairingAudit(db: DatabaseSync, pairingId: string) {
  return db
    .prepare(
      `SELECT id, actor_id AS actorId, from_state AS fromState, to_state AS toState, at
       FROM pairing_audit WHERE pairing_id = ? ORDER BY at`,
    )
    .all(pairingId) as Array<{
    id: string;
    actorId: string;
    fromState: string;
    toState: string;
    at: string;
  }>;
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  carrierId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    "INSERT INTO webhook_deliveries (id, event, carrier_id, payload) VALUES (?, ?, ?, ?)",
  ).run(randomUUID(), event, carrierId, JSON.stringify(payload));
}
