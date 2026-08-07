import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_ORG = "org_demo";

export type Db = Database.Database;

let singleton: Db | null = null;

export function dbPath(root = process.cwd()): string {
  return join(root, "data", "coverage.db");
}

export function openDb(path = dbPath()): Db {
  mkdirSync(join(path, ".."), { recursive: true });
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

export function getDb(): Db {
  if (!singleton) {
    singleton = openDb();
  }
  return singleton;
}

export function closeDb(): void {
  if (singleton) {
    singleton.close();
    singleton = null;
  }
}

/** Open a fresh DB at a path (tests). Closes prior singleton if any. */
export function openTestDb(path: string): Db {
  closeDb();
  singleton = openDb(path);
  return singleton;
}

export function migrate(db: Db): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orgs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cloud_accounts (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      external_key TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(org_id, provider, external_key)
    );

    CREATE TABLE IF NOT EXISTS commitments (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      cloud_account_id TEXT NOT NULL,
      name TEXT NOT NULL,
      instrument_type TEXT NOT NULL,
      provider_tag TEXT NOT NULL,
      term_months INTEGER NOT NULL,
      rate_usd REAL NOT NULL,
      lock_start TEXT NOT NULL,
      lock_end TEXT NOT NULL,
      family TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      archived_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (cloud_account_id) REFERENCES cloud_accounts(id)
    );

    CREATE TABLE IF NOT EXISTS import_batches (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      client_key TEXT,
      status TEXT NOT NULL,
      accepted_count INTEGER NOT NULL DEFAULT 0,
      failed_count INTEGER NOT NULL DEFAULT 0,
      error_detail TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(org_id, client_key)
    );

    CREATE TABLE IF NOT EXISTS usage_slices (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      cloud_account_id TEXT NOT NULL,
      import_batch_id TEXT NOT NULL,
      window_start TEXT NOT NULL,
      window_end TEXT NOT NULL,
      eligible_spend_usd REAL NOT NULL,
      family TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (cloud_account_id) REFERENCES cloud_accounts(id),
      FOREIGN KEY (import_batch_id) REFERENCES import_batches(id)
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
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gap_findings (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      cloud_account_id TEXT NOT NULL,
      snapshot_id TEXT,
      kind TEXT NOT NULL,
      gap_usd REAL NOT NULL,
      window_start TEXT NOT NULL,
      window_end TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS compare_results (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      cloud_account_id TEXT NOT NULL,
      mode TEXT NOT NULL,
      window_start TEXT NOT NULL,
      window_end TEXT NOT NULL,
      path_a_json TEXT NOT NULL,
      path_b_json TEXT NOT NULL,
      delta_usd REAL NOT NULL,
      winner TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const org = db
    .prepare("SELECT id FROM orgs WHERE id = ?")
    .get(DEFAULT_ORG) as { id: string } | undefined;
  if (!org) {
    db.prepare("INSERT INTO orgs (id, name) VALUES (?, ?)").run(
      DEFAULT_ORG,
      "Demo Org",
    );
  }
}

export const DEMO_ORG_ID = DEFAULT_ORG;
