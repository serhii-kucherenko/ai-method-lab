import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS orgs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cloud_accounts (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  account_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(org_id, provider, account_key)
);

CREATE TABLE IF NOT EXISTS commitments (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  cloud_account_id TEXT NOT NULL,
  name TEXT NOT NULL,
  instrument_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  term_months INTEGER NOT NULL,
  rate_usd REAL NOT NULL,
  lock_start TEXT NOT NULL,
  lock_end TEXT NOT NULL,
  family TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  archived_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS import_batches (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  client_key TEXT,
  status TEXT NOT NULL,
  source_kind TEXT NOT NULL DEFAULT 'usage_json',
  row_count INTEGER NOT NULL DEFAULT 0,
  accepted_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  error_detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(org_id, client_key)
);

CREATE TABLE IF NOT EXISTS usage_slices (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  import_batch_id TEXT NOT NULL,
  cloud_account_id TEXT NOT NULL,
  window_start TEXT NOT NULL,
  window_end TEXT NOT NULL,
  eligible_spend_usd REAL NOT NULL,
  family TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS coverage_snapshots (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  cloud_account_id TEXT NOT NULL,
  window_start TEXT NOT NULL,
  window_end TEXT NOT NULL,
  coverage_pct REAL NOT NULL,
  covered_usd REAL NOT NULL,
  unused_commit_usd REAL NOT NULL,
  ondemand_spill_usd REAL NOT NULL,
  gap_usd REAL NOT NULL,
  computed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gap_findings (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  coverage_snapshot_id TEXT NOT NULL,
  cloud_account_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  gap_usd REAL NOT NULL,
  window_start TEXT NOT NULL,
  window_end TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS compare_results (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  path_a_json TEXT NOT NULL,
  path_b_json TEXT NOT NULL,
  winner TEXT NOT NULL,
  delta_usd REAL NOT NULL,
  window_start TEXT NOT NULL,
  window_end TEXT NOT NULL,
  cloud_account_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_commitments_org ON commitments(org_id);
CREATE INDEX IF NOT EXISTS idx_usage_account ON usage_slices(cloud_account_id);
CREATE INDEX IF NOT EXISTS idx_coverage_account ON coverage_snapshots(cloud_account_id);
`;

export type CoverageDb = Database.Database;

let singleton: CoverageDb | null = null;
let singletonPath: string | null = null;

export function defaultDbPath(): string {
  if (process.env.CCS_DB_PATH) return process.env.CCS_DB_PATH;
  return join(process.cwd(), "data", "coverage.db");
}

export function openDb(dbPath = defaultDbPath()): CoverageDb {
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function migrate(db: CoverageDb): void {
  db.exec(SCHEMA);
  const org = db
    .prepare("SELECT id FROM orgs WHERE id = ?")
    .get("org-demo") as { id: string } | undefined;
  if (!org) {
    db.prepare("INSERT INTO orgs (id, name) VALUES (?, ?)").run(
      "org-demo",
      "Demo Org",
    );
  }
}

export function getDb(dbPath = defaultDbPath()): CoverageDb {
  if (singleton && singletonPath === dbPath) return singleton;
  if (singleton) {
    singleton.close();
  }
  singleton = openDb(dbPath);
  singletonPath = dbPath;
  migrate(singleton);
  return singleton;
}

export function resetDbForTests(dbPath: string): CoverageDb {
  if (singleton) {
    singleton.close();
    singleton = null;
    singletonPath = null;
  }
  const db = openDb(dbPath);
  migrate(db);
  singleton = db;
  singletonPath = dbPath;
  return db;
}

export function closeDb(): void {
  if (singleton) {
    singleton.close();
    singleton = null;
    singletonPath = null;
  }
}
