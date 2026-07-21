import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type PharmacyRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import { evaluateSwap, type SwapInput } from "./te.js";
import { canTransition, type ScriptState } from "./rules.js";

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

export function createPharmacy(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO pharmacies (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO pharmacy_members (pharmacy_id, user_id, role) VALUES (?, ?, 'pharmacist')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, pharmacyId: string, userId: string, role: PharmacyRole) {
  db.prepare(
    `INSERT INTO pharmacy_members (pharmacy_id, user_id, role) VALUES (?, ?, ?)
     ON CONFLICT(pharmacy_id, user_id) DO UPDATE SET role = excluded.role`,
  ).run(pharmacyId, userId, role);
}

export function getRole(db: DatabaseSync, pharmacyId: string, userId: string): PharmacyRole | null {
  const row = db
    .prepare("SELECT role FROM pharmacy_members WHERE pharmacy_id = ? AND user_id = ?")
    .get(pharmacyId, userId) as { role: PharmacyRole } | undefined;
  return row?.role ?? null;
}

export function getPharmacy(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM pharmacies WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  pharmacyId: string,
  userId: string,
  mode: "read" | "write" | "dispense" | "notify",
): PharmacyRole | null {
  const role = getRole(db, pharmacyId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && role === "pharmacist") return role;
  if (mode === "dispense" && (role === "rph_manager" || role === "payer_ops")) return role;
  if (mode === "notify" && role === "payer_ops") return role;
  return null;
}

export function createScript(
  db: DatabaseSync,
  pharmacyId: string,
  input: SwapInput,
): WriteResult<Record<string, unknown>> {
  const result = evaluateSwap(input);
  const id = randomUUID();
  db.prepare(
    `INSERT INTO scripts (
      id, pharmacy_id, prescribed_ndc, candidate_ndc, te_prescribed, te_candidate,
      same_isf, daw, bmn, allow_sub, reason, state, version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 1)`,
  ).run(
    id,
    pharmacyId,
    input.prescribed_ndc,
    input.candidate_ndc,
    input.te_code_prescribed,
    input.te_code_candidate,
    input.same_ingredient_strength_form ? 1 : 0,
    input.daw,
    input.brand_medically_necessary ? 1 : 0,
    result.allow ? 1 : 0,
    result.reason ?? null,
  );
  return {
    ok: true,
    value: {
      id,
      allow: result.allow,
      reason: result.reason ?? null,
      state: "draft",
      version: 1,
    },
  };
}

export function getScript(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, pharmacy_id AS pharmacyId, allow_sub AS allowSub, state, version, reason
       FROM scripts WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        pharmacyId: string;
        allowSub: number;
        state: ScriptState;
        version: number;
        reason: string | null;
      }
    | undefined;
}

export function listScripts(db: DatabaseSync, pharmacyId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, prescribed_ndc AS prescribedNdc, candidate_ndc AS candidateNdc,
              allow_sub AS allowSub, state, reason
       FROM scripts WHERE pharmacy_id = ?
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(pharmacyId, limit, offset) as Array<{
    id: string;
    prescribedNdc: string;
    candidateNdc: string;
    allowSub: number;
    state: string;
    reason: string | null;
  }>;
}

export function countScripts(db: DatabaseSync, pharmacyId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM scripts WHERE pharmacy_id = ?")
    .get(pharmacyId) as { n: number };
  return Number(row.n);
}

export function listBlocked(db: DatabaseSync, pharmacyId: string, limit: number, offset: number) {
  return db
    .prepare(
      `SELECT id, prescribed_ndc AS prescribedNdc, candidate_ndc AS candidateNdc, reason
       FROM scripts WHERE pharmacy_id = ? AND allow_sub = 0
       ORDER BY id LIMIT ? OFFSET ?`,
    )
    .all(pharmacyId, limit, offset) as Array<{
    id: string;
    prescribedNdc: string;
    candidateNdc: string;
    reason: string | null;
  }>;
}

export function countBlocked(db: DatabaseSync, pharmacyId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM scripts WHERE pharmacy_id = ? AND allow_sub = 0")
    .get(pharmacyId) as { n: number };
  return Number(row.n);
}

export function transitionScript(
  db: DatabaseSync,
  scriptId: string,
  actorId: string,
  to: ScriptState,
  expectedVersion: number,
): WriteResult<{ id: string; version: number; state: ScriptState }> {
  const row = getScript(db, scriptId);
  if (!row) return { ok: false, status: 404, error: "not found" };
  if (row.version !== expectedVersion) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  if (!canTransition(row.state, to)) {
    return { ok: false, status: 400, error: "illegal transition" };
  }
  if (to === "dispensed" && !row.allowSub) {
    return { ok: false, status: 400, error: "cannot dispense blocked substitution" };
  }
  const updated = db
    .prepare(
      "UPDATE scripts SET state = ?, version = version + 1 WHERE id = ? AND version = ?",
    )
    .run(to, scriptId, expectedVersion);
  if (Number(updated.changes) !== 1) {
    return { ok: false, status: 409, error: "version conflict" };
  }
  db.prepare(
    `INSERT INTO script_audit (id, script_id, actor_id, from_state, to_state) VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), scriptId, actorId, row.state, to);
  return { ok: true, value: { id: scriptId, version: expectedVersion + 1, state: to } };
}

export function listScriptAudit(db: DatabaseSync, scriptId: string) {
  return db
    .prepare(
      `SELECT id, actor_id AS actorId, from_state AS fromState, to_state AS toState, at
       FROM script_audit WHERE script_id = ? ORDER BY at`,
    )
    .all(scriptId) as Array<{
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
  pharmacyId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    "INSERT INTO webhook_deliveries (id, event, pharmacy_id, payload) VALUES (?, ?, ?, ?)",
  ).run(randomUUID(), event, pharmacyId, JSON.stringify(payload));
}
