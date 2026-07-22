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
  db.prepare("INSERT INTO orgs (id, name, created_by) VALUES (?, ?, ?)").run(id, name, userId);
  db.prepare(
    "INSERT INTO org_members (org_id, user_id, role) VALUES (?, ?, 'analyst')",
  ).run(id, userId);
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
  return {
    ...row,
    skip_interest: row.skip_interest === 1,
  };
}

export function runForecast(
  db: DatabaseSync,
  entryId: string,
  override?: Partial<ForecastInput>,
): WriteResult<ForecastResult & { entry_id: string; run_id: string }> {
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
