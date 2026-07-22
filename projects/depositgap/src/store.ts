import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { openDatabase, type OrgRole } from "./db.js";
import { trueUp, type ForecastInput, type ForecastResult } from "./domain/forecast.js";

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

type WriteResult<T> = { ok: true; value: T } | { ok: false; status: number; error: string };

export type EntryRow = {
  id: string;
  orgId: string;
  por: string | null;
  order_type: string;
  rate_class: string;
  deposit_rate: number;
  assessed_rate: number | null;
  entered_value: number;
  order_published_on: string;
  liquidated_on: string;
  interest_annual_rate: number | null;
  skip_interest: boolean;
};

export type EntryCreateInput = {
  por?: string;
  order_type: string;
  rate_class: string;
  deposit_rate: number;
  assessed_rate?: number | null;
  entered_value: number;
  order_published_on: string;
  liquidated_on: string;
  interest_annual_rate?: number | null;
  skip_interest?: boolean;
};

export type EntryListOpts = {
  limit?: number;
  offset?: number;
};

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

export function getRole(db: DatabaseSync, orgId: string, userId: string): OrgRole | null {
  const row = db
    .prepare("SELECT role FROM org_members WHERE org_id = ? AND user_id = ?")
    .get(orgId, userId) as { role: OrgRole } | undefined;
  return row?.role ?? null;
}

export function assertAccess(
  db: DatabaseSync,
  orgId: string,
  userId: string,
  mode: "read" | "write" | "forecast",
): OrgRole | null {
  const role = getRole(db, orgId, userId);
  if (!role) return null;
  if (mode === "read") return role;
  if (mode === "write" && (role === "analyst" || role === "admin")) return role;
  if (mode === "forecast" && (role === "analyst" || role === "admin")) return role;
  return null;
}

export function addMember(
  db: DatabaseSync,
  orgId: string,
  userId: string,
  role: OrgRole,
): WriteResult<{ orgId: string; userId: string; role: OrgRole }> {
  if (!getOrg(db, orgId)) return { ok: false, status: 404, error: "not found" };
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId) as
    | { id: string }
    | undefined;
  if (!user) return { ok: false, status: 404, error: "user not found" };
  try {
    db.prepare(
      `INSERT INTO org_members (org_id, user_id, role) VALUES (?, ?, ?)
       ON CONFLICT(org_id, user_id) DO UPDATE SET role = excluded.role`,
    ).run(orgId, userId, role);
  } catch {
    return { ok: false, status: 409, error: "member exists" };
  }
  return { ok: true, value: { orgId, userId, role } };
}

function mapEntryRow(row: {
  id: string;
  orgId: string;
  por: string | null;
  order_type: string;
  rate_class: string;
  deposit_rate: number;
  assessed_rate: number | null;
  entered_value: number;
  order_published_on: string;
  liquidated_on: string;
  interest_annual_rate: number | null;
  skip_interest: number;
}): EntryRow {
  return {
    ...row,
    skip_interest: row.skip_interest === 1,
  };
}

export function listEntries(
  db: DatabaseSync,
  orgId: string,
  opts: EntryListOpts = {},
): { entries: EntryRow[]; total: number; limit: number; offset: number } {
  const totalRow = db
    .prepare("SELECT COUNT(*) AS n FROM entries WHERE org_id = ?")
    .get(orgId) as { n: number };
  const total = Number(totalRow.n);
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined
      ? Math.min(Math.max(opts.limit, 1), 500)
      : Math.max(total, 1);
  const rows = db
    .prepare(
      `SELECT id, org_id AS orgId, por, order_type, rate_class, deposit_rate, assessed_rate,
              entered_value, order_published_on, liquidated_on, interest_annual_rate, skip_interest
       FROM entries WHERE org_id = ?
       ORDER BY created_at ASC, id ASC
       LIMIT ? OFFSET ?`,
    )
    .all(orgId, limit, offset) as Array<{
    id: string;
    orgId: string;
    por: string | null;
    order_type: string;
    rate_class: string;
    deposit_rate: number;
    assessed_rate: number | null;
    entered_value: number;
    order_published_on: string;
    liquidated_on: string;
    interest_annual_rate: number | null;
    skip_interest: number;
  }>;
  return {
    entries: rows.map(mapEntryRow),
    total,
    limit,
    offset,
  };
}

export function createEntry(
  db: DatabaseSync,
  orgId: string,
  input: EntryCreateInput,
): WriteResult<EntryRow> {
  const id = randomUUID();
  const skip = input.skip_interest === true ? 1 : 0;
  db.prepare(
    `INSERT INTO entries (
      id, org_id, por, order_type, rate_class, deposit_rate, assessed_rate, entered_value,
      order_published_on, liquidated_on, interest_annual_rate, skip_interest
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    orgId,
    input.por ?? null,
    input.order_type,
    input.rate_class,
    input.deposit_rate,
    input.assessed_rate ?? null,
    input.entered_value,
    input.order_published_on,
    input.liquidated_on,
    input.interest_annual_rate ?? null,
    skip,
  );
  const row = getEntry(db, id);
  if (!row) return { ok: false, status: 500, error: "create failed" };
  return { ok: true, value: row };
}

export function getEntry(db: DatabaseSync, id: string): EntryRow | undefined {
  const row = db
    .prepare(
      `SELECT id, org_id AS orgId, por, order_type, rate_class, deposit_rate, assessed_rate,
              entered_value, order_published_on, liquidated_on, interest_annual_rate, skip_interest
       FROM entries WHERE id = ?`,
    )
    .get(id) as
    | {
        id: string;
        orgId: string;
        por: string | null;
        order_type: string;
        rate_class: string;
        deposit_rate: number;
        assessed_rate: number | null;
        entered_value: number;
        order_published_on: string;
        liquidated_on: string;
        interest_annual_rate: number | null;
        skip_interest: number;
      }
    | undefined;
  if (!row) return undefined;
  return mapEntryRow(row);
}

export function patchEntry(
  db: DatabaseSync,
  entryId: string,
  patch: Partial<EntryCreateInput>,
): WriteResult<EntryRow> {
  const existing = getEntry(db, entryId);
  if (!existing) return { ok: false, status: 404, error: "not found" };

  const next = {
    por: patch.por !== undefined ? patch.por : existing.por,
    order_type: patch.order_type ?? existing.order_type,
    rate_class: patch.rate_class ?? existing.rate_class,
    deposit_rate: patch.deposit_rate ?? existing.deposit_rate,
    assessed_rate:
      patch.assessed_rate !== undefined ? patch.assessed_rate : existing.assessed_rate,
    entered_value: patch.entered_value ?? existing.entered_value,
    order_published_on: patch.order_published_on ?? existing.order_published_on,
    liquidated_on: patch.liquidated_on ?? existing.liquidated_on,
    interest_annual_rate:
      patch.interest_annual_rate !== undefined
        ? patch.interest_annual_rate
        : existing.interest_annual_rate,
    skip_interest:
      patch.skip_interest !== undefined ? patch.skip_interest : existing.skip_interest,
  };

  db.prepare(
    `UPDATE entries SET
      por = ?, order_type = ?, rate_class = ?, deposit_rate = ?, assessed_rate = ?,
      entered_value = ?, order_published_on = ?, liquidated_on = ?, interest_annual_rate = ?,
      skip_interest = ?
     WHERE id = ?`,
  ).run(
    next.por,
    next.order_type,
    next.rate_class,
    next.deposit_rate,
    next.assessed_rate,
    next.entered_value,
    next.order_published_on,
    next.liquidated_on,
    next.interest_annual_rate,
    next.skip_interest ? 1 : 0,
    entryId,
  );

  const row = getEntry(db, entryId);
  if (!row) return { ok: false, status: 500, error: "patch failed" };
  return { ok: true, value: row };
}

export type ForecastRunResult = ForecastResult & { entry_id: string; run_id: string };

export function runForecast(
  db: DatabaseSync,
  entryId: string,
  override?: Partial<ForecastInput>,
): WriteResult<ForecastRunResult> {
  const entry = getEntry(db, entryId);
  if (!entry) return { ok: false, status: 404, error: "not found" };

  const input: ForecastInput = {
    order_type: override?.order_type ?? entry.order_type,
    deposit_rate: override?.deposit_rate ?? entry.deposit_rate,
    assessed_rate: override?.assessed_rate ?? entry.assessed_rate,
    rate_class: override?.rate_class ?? entry.rate_class,
    entered_value: override?.entered_value ?? entry.entered_value,
    order_published_on: override?.order_published_on ?? entry.order_published_on,
    liquidated_on: override?.liquidated_on ?? entry.liquidated_on,
    interest_annual_rate: override?.interest_annual_rate ?? entry.interest_annual_rate,
    skip_interest: override?.skip_interest ?? entry.skip_interest,
  };

  const result = trueUp(input);
  const runId = randomUUID();
  db.prepare(
    `INSERT INTO forecast_runs (
      id, entry_id, status, duty_delta, days, interest, true_up, reason, algorithm_version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    runId,
    entryId,
    result.status,
    result.status === "ok" ? result.duty_delta : null,
    result.status === "ok" ? result.days : null,
    result.status === "ok" ? result.interest : null,
    result.status === "ok" ? result.true_up : null,
    result.status === "reject" ? (result.reason ?? "reject") : null,
    result.status === "ok" ? result.algorithm_version : null,
  );

  return {
    ok: true,
    value: { ...result, entry_id: entryId, run_id: runId },
  };
}

export type BatchForecastItem =
  | ForecastRunResult
  | { entry_id: string; status: "reject"; reason: string; run_id?: string };

/** Run true-up independently per entry — one failure must not rewrite siblings. */
export function runBatchForecast(
  db: DatabaseSync,
  orgId: string,
  entryIds: string[],
  override?: Partial<ForecastInput>,
): { results: BatchForecastItem[] } {
  const results: BatchForecastItem[] = [];
  for (const entryId of entryIds) {
    try {
      const entry = getEntry(db, entryId);
      if (!entry || entry.orgId !== orgId) {
        results.push({ entry_id: entryId, status: "reject", reason: "not_found" });
        continue;
      }
      const outcome = runForecast(db, entryId, override);
      if (!outcome.ok) {
        results.push({
          entry_id: entryId,
          status: "reject",
          reason: outcome.error,
        });
        continue;
      }
      results.push(outcome.value);
    } catch (err) {
      results.push({
        entry_id: entryId,
        status: "reject",
        reason: err instanceof Error ? err.message : "batch_error",
      });
    }
  }
  return { results };
}

export type CashImpactLine = {
  por: string;
  entry_count: number;
  duty_delta: number;
  interest: number;
  true_up: number;
};

export type CashImpactOpts = {
  limit?: number;
  offset?: number;
};

export type CashImpact = {
  lines: CashImpactLine[];
  totals: { duty_delta: number; interest: number; true_up: number; entry_count: number };
  total: number;
  limit: number;
  offset: number;
};

/** POR rollup from each entry's latest successful forecast run. */
export function getCashImpact(
  db: DatabaseSync,
  orgId: string,
  opts: CashImpactOpts = {},
): CashImpact {
  const rows = db
    .prepare(
      `SELECT e.id AS entry_id, e.por AS por,
              fr.duty_delta AS duty_delta, fr.interest AS interest, fr.true_up AS true_up
       FROM entries e
       INNER JOIN forecast_runs fr ON fr.entry_id = e.id
       WHERE e.org_id = ?
         AND fr.status = 'ok'
         AND fr.id = (
           SELECT fr2.id FROM forecast_runs fr2
           WHERE fr2.entry_id = e.id AND fr2.status = 'ok'
           ORDER BY fr2.created_at DESC, fr2.id DESC
           LIMIT 1
         )
       ORDER BY e.por ASC, e.id ASC`,
    )
    .all(orgId) as Array<{
    entry_id: string;
    por: string | null;
    duty_delta: number;
    interest: number;
    true_up: number;
  }>;

  const byPor = new Map<string, CashImpactLine>();
  for (const row of rows) {
    const por = row.por && row.por.trim() ? row.por : "(none)";
    const line = byPor.get(por) ?? {
      por,
      entry_count: 0,
      duty_delta: 0,
      interest: 0,
      true_up: 0,
    };
    line.entry_count += 1;
    line.duty_delta += Number(row.duty_delta);
    line.interest += Number(row.interest);
    line.true_up += Number(row.true_up);
    byPor.set(por, line);
  }

  const allLines = [...byPor.values()].sort((a, b) => a.por.localeCompare(b.por));
  const totals = allLines.reduce(
    (acc, line) => ({
      duty_delta: acc.duty_delta + line.duty_delta,
      interest: acc.interest + line.interest,
      true_up: acc.true_up + line.true_up,
      entry_count: acc.entry_count + line.entry_count,
    }),
    { duty_delta: 0, interest: 0, true_up: 0, entry_count: 0 },
  );
  const total = allLines.length;
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined
      ? Math.min(Math.max(opts.limit, 1), 500)
      : Math.max(total, 1);
  const lines = allLines.slice(offset, offset + limit);
  return { lines, totals, total, limit, offset };
}

export type AuditEvent = {
  id: string;
  entry_id: string;
  por: string | null;
  status: string;
  duty_delta: number | null;
  days: number | null;
  interest: number | null;
  true_up: number | null;
  reason: string | null;
  algorithm_version: string | null;
  action: string;
  created_at: string;
};

export type AuditListOpts = {
  entryId?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

export function listAudit(
  db: DatabaseSync,
  orgId: string,
  opts: AuditListOpts = {},
): { events: AuditEvent[]; total: number; limit: number; offset: number } {
  const filters: string[] = ["e.org_id = ?"];
  const params: (string | number)[] = [orgId];
  if (opts.entryId) {
    filters.push("fr.entry_id = ?");
    params.push(opts.entryId);
  }
  if (opts.status) {
    filters.push("fr.status = ?");
    params.push(opts.status);
  }
  const where = filters.join(" AND ");

  const totalRow = db
    .prepare(
      `SELECT COUNT(*) AS n FROM forecast_runs fr
       INNER JOIN entries e ON e.id = fr.entry_id
       WHERE ${where}`,
    )
    .get(...params) as { n: number };
  const total = Number(totalRow.n);
  const offset = Math.max(opts.offset ?? 0, 0);
  const limit =
    opts.limit !== undefined
      ? Math.min(Math.max(opts.limit, 1), 500)
      : Math.min(Math.max(total, 1), 500);

  const rows = db
    .prepare(
      `SELECT fr.id, fr.entry_id, e.por, fr.status, fr.duty_delta, fr.days, fr.interest,
              fr.true_up, fr.reason, fr.algorithm_version, fr.created_at
       FROM forecast_runs fr
       INNER JOIN entries e ON e.id = fr.entry_id
       WHERE ${where}
       ORDER BY fr.created_at DESC, fr.id DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset) as Array<{
    id: string;
    entry_id: string;
    por: string | null;
    status: string;
    duty_delta: number | null;
    days: number | null;
    interest: number | null;
    true_up: number | null;
    reason: string | null;
    algorithm_version: string | null;
    created_at: string;
  }>;

  return {
    events: rows.map((row) => ({
      ...row,
      action: row.status === "ok" ? "forecast_lock" : "forecast_reject",
    })),
    total,
    limit,
    offset,
  };
}

export function auditToCsv(events: AuditEvent[]): string {
  const header = [
    "id",
    "entry_id",
    "por",
    "action",
    "status",
    "duty_delta",
    "days",
    "interest",
    "true_up",
    "reason",
    "algorithm_version",
    "created_at",
  ];
  const escape = (v: unknown): string => {
    const s = v === null || v === undefined ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [header.join(",")];
  for (const ev of events) {
    lines.push(
      [
        ev.id,
        ev.entry_id,
        ev.por,
        ev.action,
        ev.status,
        ev.duty_delta,
        ev.days,
        ev.interest,
        ev.true_up,
        ev.reason,
        ev.algorithm_version,
        ev.created_at,
      ]
        .map(escape)
        .join(","),
    );
  }
  return lines.join("\n") + "\n";
}

export type OrgSettings = {
  orgId: string;
  webhook_secret: string;
  tokens_note: string;
  token_count: number;
  updated_at: string;
};

function ensureOrgSettings(db: DatabaseSync, orgId: string): void {
  const existing = db
    .prepare("SELECT org_id FROM org_settings WHERE org_id = ?")
    .get(orgId) as { org_id: string } | undefined;
  if (existing) return;
  db.prepare(
    `INSERT INTO org_settings (org_id, webhook_secret, tokens_note)
     VALUES (?, ?, ?)`,
  ).run(
    orgId,
    `whsec_${randomUUID().replace(/-/g, "").slice(0, 24)}`,
    "API tokens are issued at register. Treat bearer tokens as secrets.",
  );
}

export function getOrgSettings(db: DatabaseSync, orgId: string): OrgSettings | null {
  if (!getOrg(db, orgId)) return null;
  ensureOrgSettings(db, orgId);
  const row = db
    .prepare(
      `SELECT org_id AS orgId, webhook_secret, tokens_note, updated_at
       FROM org_settings WHERE org_id = ?`,
    )
    .get(orgId) as
    | {
        orgId: string;
        webhook_secret: string;
        tokens_note: string;
        updated_at: string;
      }
    | undefined;
  if (!row) return null;
  const tokenCount = db
    .prepare(
      `SELECT COUNT(*) AS n FROM tokens t
       INNER JOIN org_members m ON m.user_id = t.user_id
       WHERE m.org_id = ?`,
    )
    .get(orgId) as { n: number };
  return {
    orgId: row.orgId,
    webhook_secret: row.webhook_secret,
    tokens_note: row.tokens_note,
    token_count: Number(tokenCount.n),
    updated_at: row.updated_at,
  };
}

export function patchOrgSettings(
  db: DatabaseSync,
  orgId: string,
  patch: { webhook_secret?: string; tokens_note?: string },
): WriteResult<OrgSettings> {
  if (!getOrg(db, orgId)) return { ok: false, status: 404, error: "not found" };
  ensureOrgSettings(db, orgId);
  const current = getOrgSettings(db, orgId);
  if (!current) return { ok: false, status: 404, error: "not found" };
  const nextSecret =
    patch.webhook_secret !== undefined ? patch.webhook_secret : current.webhook_secret;
  const nextNote =
    patch.tokens_note !== undefined ? patch.tokens_note : current.tokens_note;
  db.prepare(
    `UPDATE org_settings
     SET webhook_secret = ?, tokens_note = ?, updated_at = datetime('now')
     WHERE org_id = ?`,
  ).run(nextSecret, nextNote, orgId);
  const updated = getOrgSettings(db, orgId);
  if (!updated) return { ok: false, status: 500, error: "patch failed" };
  return { ok: true, value: updated };
}

export function rotateWebhookSecret(
  db: DatabaseSync,
  orgId: string,
): WriteResult<OrgSettings> {
  return patchOrgSettings(db, orgId, {
    webhook_secret: `whsec_${randomUUID().replace(/-/g, "").slice(0, 24)}`,
  });
}

export type WebhookIngestResult =
  | { ok: true; status: 201 | 200; entry: EntryRow; replay: boolean }
  | { ok: false; status: number; error: string };

/** Ingest ACE-ish entry push; same idempotency key returns prior entry. */
export function ingestWebhookEntry(
  db: DatabaseSync,
  orgId: string,
  idempotencyKey: string,
  input: EntryCreateInput,
): WebhookIngestResult {
  if (!getOrg(db, orgId)) return { ok: false, status: 404, error: "org not found" };
  if (!idempotencyKey.trim()) {
    return { ok: false, status: 400, error: "idempotency key required" };
  }
  const prior = db
    .prepare(
      `SELECT entry_id FROM webhook_deliveries WHERE idempotency_key = ?`,
    )
    .get(idempotencyKey) as { entry_id: string } | undefined;
  if (prior) {
    const entry = getEntry(db, prior.entry_id);
    if (!entry) return { ok: false, status: 500, error: "replay entry missing" };
    return { ok: true, status: 200, entry, replay: true };
  }
  const created = createEntry(db, orgId, input);
  if (!created.ok) return { ok: false, status: created.status, error: created.error };
  try {
    db.prepare(
      `INSERT INTO webhook_deliveries (idempotency_key, org_id, entry_id) VALUES (?, ?, ?)`,
    ).run(idempotencyKey, orgId, created.value.id);
  } catch {
    const again = db
      .prepare(`SELECT entry_id FROM webhook_deliveries WHERE idempotency_key = ?`)
      .get(idempotencyKey) as { entry_id: string } | undefined;
    if (again) {
      const entry = getEntry(db, again.entry_id);
      if (entry) return { ok: true, status: 200, entry, replay: true };
    }
    return { ok: false, status: 409, error: "idempotency conflict" };
  }
  return { ok: true, status: 201, entry: created.value, replay: false };
}

/** Alias used by app routes — pagination lives on getCashImpact. */
export function getCashImpactPage(
  db: DatabaseSync,
  orgId: string,
  opts: CashImpactOpts = {},
): CashImpact {
  return getCashImpact(db, orgId, opts);
}

