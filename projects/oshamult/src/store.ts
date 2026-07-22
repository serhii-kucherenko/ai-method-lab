import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type OrgRole } from "./db.js";
import { penalty, type PenaltyInput, type PenaltyResult } from "./domain/penalty.js";

export type Store = {
  db: DatabaseSync;
  rateLimit: number;
  rateCounts: Map<string, number>;
};

export function createStore(opts: { dbPath?: string; rateLimit?: number } = {}): Store {
  return {
    db: openDatabase(opts.dbPath ?? ":memory:"),
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

export function createOrg(db: DatabaseSync, userId: string, name: string) {
  const id = randomUUID();
  const webhookSecret = `whsec_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
  db.prepare("INSERT INTO orgs (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO org_members (org_id, user_id, role) VALUES (?, ?, 'admin')",
  ).run(id, userId);
  db.prepare(
    `INSERT INTO org_settings (org_id, webhook_secret, tokens_note) VALUES (?, ?, ?)`,
  ).run(
    id,
    webhookSecret,
    "API tokens are issued at register. Treat bearer tokens as secrets.",
  );
  return { id, name };
}

export function getOrg(db: DatabaseSync, id: string) {
  return db.prepare("SELECT id, name FROM orgs WHERE id = ?").get(id) as
    | { id: string; name: string }
    | undefined;
}

export function assertAccess(
  db: DatabaseSync,
  orgId: string,
  userId: string,
  roles: OrgRole[],
): OrgRole | null {
  const row = db
    .prepare("SELECT role FROM org_members WHERE org_id = ? AND user_id = ?")
    .get(orgId, userId) as { role: OrgRole } | undefined;
  if (!row) return null;
  if (!roles.includes(row.role)) return null;
  return row.role;
}

export type CitationCreate = PenaltyInput & {
  classification: string;
  gravity_tier: string;
};

export function createCitation(db: DatabaseSync, orgId: string, input: CitationCreate) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO citations (
      id, org_id, classification, gravity_tier, gbp_amount,
      size_pct, history_pct, good_faith_pct, quick_fix_pct,
      use_statutory_max, additive_cheat
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    orgId,
    input.classification,
    input.gravity_tier,
    input.gbp_amount,
    input.size_pct,
    input.history_pct,
    input.good_faith_pct,
    input.quick_fix_pct,
    input.use_statutory_max === true ? 1 : 0,
    input.additive_cheat === true ? 1 : 0,
  );
  return getCitation(db, orgId, id);
}

export function getCitation(db: DatabaseSync, orgId: string, id: string) {
  const row = db
    .prepare("SELECT * FROM citations WHERE id = ? AND org_id = ?")
    .get(id, orgId) as Record<string, unknown> | undefined;
  if (!row) return undefined;
  return rowToCitation(row);
}

function rowToCitation(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    org_id: String(row.org_id),
    classification: String(row.classification),
    gravity_tier: String(row.gravity_tier),
    gbp_amount: Number(row.gbp_amount),
    size_pct: Number(row.size_pct),
    history_pct: Number(row.history_pct),
    good_faith_pct: Number(row.good_faith_pct),
    quick_fix_pct: Number(row.quick_fix_pct),
    use_statutory_max: Number(row.use_statutory_max) === 1,
    additive_cheat: Number(row.additive_cheat) === 1,
  };
}

export function listCitations(
  db: DatabaseSync,
  orgId: string,
  opts: { limit?: number; offset?: number } = {},
) {
  const totalRow = db
    .prepare("SELECT COUNT(*) AS n FROM citations WHERE org_id = ?")
    .get(orgId) as { n: number };
  const total = Number(totalRow.n);
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined ? Math.min(Math.max(opts.limit, 1), 100) : 20;
  const rows = db
    .prepare(
      `SELECT * FROM citations WHERE org_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
    .all(orgId, limit, offset) as Record<string, unknown>[];
  return { total, offset, limit, citations: rows.map(rowToCitation) };
}

export function runForecast(
  db: DatabaseSync,
  orgId: string,
  citationId: string,
): { ok: true; result: PenaltyResult & { citation_id: string } } | { ok: false; status: number; error: string } {
  const citation = getCitation(db, orgId, citationId);
  if (!citation) return { ok: false, status: 404, error: "citation_not_found" };
  const result = penalty(citation);
  const runId = randomUUID();
  if (result.status === "ok") {
    db.prepare(
      `INSERT INTO forecast_runs (
        id, org_id, citation_id, status, penalty, reason, algorithm_version, steps_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      runId,
      orgId,
      citationId,
      result.status,
      result.penalty,
      null,
      result.algorithm_version,
      JSON.stringify(result.steps),
    );
    return { ok: true, result: { ...result, citation_id: citationId } };
  }
  db.prepare(
    `INSERT INTO forecast_runs (
      id, org_id, citation_id, status, penalty, reason, algorithm_version, steps_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(runId, orgId, citationId, result.status, null, result.reason, null, null);
  return { ok: true, result: { ...result, citation_id: citationId } };
}

export function forecastDirect(input: PenaltyInput): PenaltyResult {
  return penalty(input);
}
