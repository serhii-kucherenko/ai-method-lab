import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type WorkspaceRole } from "./db.js";
import { createMockDep, type DepClient } from "./dep.js";
import {
  attestationValid,
  canAcceptCritical,
  canTransition,
  questionnaireAverage,
  type FindingState,
  type Severity,
} from "./rules.js";

export type Store = {
  db: DatabaseSync;
  dep: DepClient;
  webhookSecret: string;
  sideEffects: number;
  rateLimit: number;
  rateCounts: Map<string, number>;
  nowIso: string;
};

export type CreateStoreOptions = {
  dbPath?: string;
  dep?: DepClient;
  webhookSecret?: string;
  rateLimit?: number;
  nowIso?: string;
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
    nowIso: normalized.nowIso ?? new Date().toISOString(),
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

export function createWorkspace(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO workspaces (id, name, created_by) VALUES (?, ?, ?)").run(
    id,
    name,
    userId,
  );
  db.prepare(
    "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, 'owner')",
  ).run(id, userId);
  return { id, name };
}

export function addMember(
  db: DatabaseSync,
  workspaceId: string,
  userId: string,
  role: WorkspaceRole,
): void {
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
    .prepare(
      "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ?",
    )
    .get(workspaceId, userId) as { role: WorkspaceRole } | undefined;
  return row?.role ?? null;
}

export function getWorkspace(db: DatabaseSync, id: string) {
  return db
    .prepare("SELECT id, name FROM workspaces WHERE id = ?")
    .get(id) as { id: string; name: string } | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  workspaceId: string,
  userId: string,
  mode: "read" | "write" | "accept",
): WorkspaceRole | null {
  const role = getRole(db, workspaceId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "owner" || role === "analyst")) return role;
  if (mode === "accept" && role === "owner") return role;
  return null;
}

export function createVendor(
  db: DatabaseSync,
  workspaceId: string,
  name: string,
  tier = "standard",
) {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO vendors (id, workspace_id, name, tier) VALUES (?, ?, ?, ?)",
  ).run(id, workspaceId, name, tier);
  return { id, workspaceId, name, tier, attestUntil: null as string | null };
}

export function listVendors(
  db: DatabaseSync,
  workspaceId: string,
  limit: number,
  offset: number,
) {
  return db
    .prepare(
      `SELECT id, workspace_id AS workspaceId, name, tier, attest_until AS attestUntil
       FROM vendors WHERE workspace_id = ? ORDER BY name ASC LIMIT ? OFFSET ?`,
    )
    .all(workspaceId, limit, offset) as {
    id: string;
    workspaceId: string;
    name: string;
    tier: string;
    attestUntil: string | null;
  }[];
}

export function getVendor(db: DatabaseSync, vendorId: string) {
  return db
    .prepare(
      `SELECT id, workspace_id AS workspaceId, name, tier, attest_until AS attestUntil
       FROM vendors WHERE id = ?`,
    )
    .get(vendorId) as
    | {
        id: string;
        workspaceId: string;
        name: string;
        tier: string;
        attestUntil: string | null;
      }
    | undefined;
}

export function attestVendor(db: DatabaseSync, vendorId: string, until: string) {
  db.prepare("UPDATE vendors SET attest_until = ? WHERE id = ?").run(until, vendorId);
  return getVendor(db, vendorId);
}

export function addQuestion(db: DatabaseSync, vendorId: string, prompt: string) {
  const id = randomUUID();
  db.prepare("INSERT INTO questions (id, vendor_id, prompt) VALUES (?, ?, ?)").run(
    id,
    vendorId,
    prompt,
  );
  return { id, vendorId, prompt };
}

export function scoreQuestion(db: DatabaseSync, questionId: string, value: number) {
  const existing = db
    .prepare("SELECT id FROM responses WHERE question_id = ?")
    .get(questionId) as { id: string } | undefined;
  if (existing) {
    db.prepare("UPDATE responses SET value = ? WHERE id = ?").run(value, existing.id);
    return { id: existing.id, value };
  }
  const id = randomUUID();
  db.prepare(
    "INSERT INTO responses (id, question_id, value) VALUES (?, ?, ?)",
  ).run(id, questionId, value);
  return { id, value };
}

export function vendorAverage(db: DatabaseSync, vendorId: string): number | null {
  const rows = db
    .prepare(
      `SELECT r.value AS value FROM responses r
       JOIN questions q ON q.id = r.question_id
       WHERE q.vendor_id = ?`,
    )
    .all(vendorId) as { value: number }[];
  return questionnaireAverage(rows.map((r) => r.value));
}

export type Finding = {
  id: string;
  vendorId: string;
  title: string;
  severity: Severity;
  state: FindingState;
  remediationNote: string | null;
  version: number;
};

export function createFinding(
  db: DatabaseSync,
  vendorId: string,
  title: string,
  severity: Severity,
): Finding {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO findings (id, vendor_id, title, severity, state, version)
     VALUES (?, ?, ?, ?, 'open', 1)`,
  ).run(id, vendorId, title, severity);
  return getFinding(db, id)!;
}

export function getFinding(db: DatabaseSync, findingId: string): Finding | undefined {
  const row = db
    .prepare(
      `SELECT id, vendor_id AS vendorId, title, severity, state,
              remediation_note AS remediationNote, version
       FROM findings WHERE id = ?`,
    )
    .get(findingId) as
    | {
        id: string;
        vendorId: string;
        title: string;
        severity: string;
        state: string;
        remediationNote: string | null;
        version: number;
      }
    | undefined;
  if (!row) return undefined;
  return {
    id: row.id,
    vendorId: row.vendorId,
    title: row.title,
    severity: row.severity as Severity,
    state: row.state as FindingState,
    remediationNote: row.remediationNote,
    version: row.version,
  };
}

export function transitionFinding(
  store: Store,
  findingId: string,
  actorId: string,
  to: FindingState,
  version: number,
  remediationNote: string | null = null,
): { ok: true; finding: Finding } | { ok: false; error: string; status: number } {
  const finding = getFinding(store.db, findingId);
  if (!finding) return { ok: false, error: "not found", status: 404 };
  if (finding.version !== version) {
    return { ok: false, error: "version conflict", status: 409 };
  }
  if (!canTransition(finding.state, to)) {
    return { ok: false, error: "illegal transition", status: 400 };
  }
  if (to === "remediated") {
    const note = remediationNote?.trim() || finding.remediationNote;
    if (!note) {
      return { ok: false, error: "remediation_note required", status: 400 };
    }
    dbNote(store.db, findingId, note);
  }
  if (to === "accepted") {
    const vendor = getVendor(store.db, finding.vendorId)!;
    if (!attestationValid(vendor.attestUntil, store.nowIso)) {
      return { ok: false, error: "attestation expired or missing", status: 400 };
    }
    const avg = vendorAverage(store.db, finding.vendorId);
    if (!canAcceptCritical(finding.severity, avg)) {
      return {
        ok: false,
        error: "critical findings need questionnaire avg >= 3.5",
        status: 400,
      };
    }
  }
  store.db
    .prepare(
      `UPDATE findings SET state = ?, version = version + 1 WHERE id = ?`,
    )
    .run(to, findingId);
  store.db
    .prepare(
      `INSERT INTO finding_audit (id, finding_id, actor_id, from_state, to_state)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(randomUUID(), findingId, actorId, finding.state, to);
  return { ok: true, finding: getFinding(store.db, findingId)! };
}

function dbNote(db: DatabaseSync, findingId: string, note: string): void {
  db.prepare("UPDATE findings SET remediation_note = ? WHERE id = ?").run(
    note,
    findingId,
  );
}

export function recordWebhook(
  db: DatabaseSync,
  event: string,
  findingId: string,
  payload: Record<string, unknown>,
): void {
  db.prepare(
    `INSERT INTO webhook_deliveries (id, event, finding_id, payload)
     VALUES (?, ?, ?, ?)`,
  ).run(randomUUID(), event, findingId, JSON.stringify(payload));
}

export function workspaceIdForFinding(
  db: DatabaseSync,
  findingId: string,
): string | null {
  const f = getFinding(db, findingId);
  if (!f) return null;
  return getVendor(db, f.vendorId)?.workspaceId ?? null;
}
