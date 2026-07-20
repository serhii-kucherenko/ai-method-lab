import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type DomainRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  canTransition,
  closeAllowed,
  isSloBreach,
  type BreachState,
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

export function createDomain(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO domains (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO domain_members (domain_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(db: DatabaseSync, domainId: string, userId: string, role: DomainRole) {
  db.prepare(
    "INSERT INTO domain_members (domain_id, user_id, role) VALUES (?, ?, ?)",
  ).run(domainId, userId, role);
}

export function getRole(db: DatabaseSync, domainId: string, userId: string): DomainRole | null {
  const row = db
    .prepare("SELECT role FROM domain_members WHERE domain_id = ? AND user_id = ?")
    .get(domainId, userId) as { role: DomainRole } | undefined;
  return row?.role ?? null;
}

export function getDomain(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM domains WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  domainId: string,
  userId: string,
  mode: "read" | "write" | "own",
): DomainRole | null {
  const role = getRole(db, domainId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "owner" || role === "producer")) return role;
  if (mode === "own" && role === "owner") return role;
  return null;
}

export function createContract(
  db: DatabaseSync,
  domainId: string,
  name: string,
  schemaJson: string,
  sloLatencyMs = 500,
) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO contracts (id, domain_id, name, schema_json, slo_latency_ms)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(id, domainId, name, schemaJson, sloLatencyMs);
  return { id, domainId, name, schemaJson, sloLatencyMs };
}

export function listContracts(
  db: DatabaseSync,
  domainId: string,
  limit: number,
  offset: number,
) {
  return db
    .prepare(
      `SELECT id, domain_id AS domainId, name, schema_json AS schemaJson,
              slo_latency_ms AS sloLatencyMs
       FROM contracts WHERE domain_id = ? ORDER BY name ASC LIMIT ? OFFSET ?`,
    )
    .all(domainId, limit, offset) as {
    id: string;
    domainId: string;
    name: string;
    schemaJson: string;
    sloLatencyMs: number;
  }[];
}

export function getContract(db: DatabaseSync, id: string) {
  return db
    .prepare(
      `SELECT id, domain_id AS domainId, name, schema_json AS schemaJson,
              slo_latency_ms AS sloLatencyMs FROM contracts WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        domainId: string;
        name: string;
        schemaJson: string;
        sloLatencyMs: number;
      }
    | undefined;
}

export type Breach = {
  id: string;
  contractId: string;
  title: string;
  latencyMs: number | null;
  state: BreachState;
  remediationNote: string | null;
  version: number;
};

export function createBreach(
  db: DatabaseSync,
  contractId: string,
  title: string,
  latencyMs: number | null,
): { ok: true; breach: Breach } | { ok: false; error: string } {
  const contract = getContract(db, contractId);
  if (!contract) return { ok: false, error: "contract not found" };
  if (!isSloBreach(latencyMs, contract.sloLatencyMs) && latencyMs !== null) {
    return { ok: false, error: "latency within SLO — not a breach" };
  }
  const id = randomUUID();
  db.prepare(
    `INSERT INTO breaches (id, contract_id, title, latency_ms, state, version)
     VALUES (?, ?, ?, ?, 'open', 1)`,
  ).run(id, contractId, title, latencyMs);
  return { ok: true, breach: getBreach(db, id)! };
}

export function getBreach(db: DatabaseSync, id: string): Breach | undefined {
  const row = db
    .prepare(
      `SELECT id, contract_id AS contractId, title, latency_ms AS latencyMs,
              state, remediation_note AS remediationNote, version
       FROM breaches WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        contractId: string;
        title: string;
        latencyMs: number | null;
        state: string;
        remediationNote: string | null;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    contractId: row.contractId,
    title: row.title,
    latencyMs: row.latencyMs,
    state: row.state as BreachState,
    remediationNote: row.remediationNote,
    version: row.version,
  };
}

export function transitionBreach(
  db: DatabaseSync,
  breachId: string,
  actorId: string,
  to: BreachState,
  version: number,
  remediationNote: string | null = null,
): { ok: true; breach: Breach } | { ok: false; error: string; status: number } {
  const breach = getBreach(db, breachId);
  if (!breach) return { ok: false, error: "not found", status: 404 };
  if (breach.version !== version) return { ok: false, error: "version conflict", status: 409 };
  if (!canTransition(breach.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  let note = breach.remediationNote;
  if (to === "remediating") {
    const n = remediationNote?.trim();
    if (!n) return { ok: false, error: "remediation_note required", status: 400 };
    note = n;
    db.prepare("UPDATE breaches SET remediation_note = ? WHERE id = ?").run(n, breachId);
  }
  if (to === "closed") {
    if (!closeAllowed(breach.state, note)) {
      return { ok: false, error: "cannot close without remediation note", status: 400 };
    }
  }
  db.prepare("UPDATE breaches SET state = ?, version = version + 1 WHERE id = ?").run(
    to,
    breachId,
  );
  db.prepare(
    `INSERT INTO breach_audit (id, breach_id, actor_id, from_state, to_state)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), breachId, actorId, breach.state, to);
  return { ok: true, breach: getBreach(db, breachId)! };
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  breachId: string,
  payload: Record<string, unknown>,
) {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, breach_id, payload) VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, breachId, JSON.stringify(payload));
}

export function domainIdForBreach(db: DatabaseSync, breachId: string): string | null {
  const b = getBreach(db, breachId);
  if (!b) return null;
  return getContract(db, b.contractId)?.domainId ?? null;
}
