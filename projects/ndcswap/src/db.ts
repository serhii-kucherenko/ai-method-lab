import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "../migrations");

export type PharmacyRole = "pharmacist" | "rph_manager" | "payer_ops";

export function openDatabase(path = ":memory:"): DatabaseSync {
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON;");
  runMigrations(db);
  return db;
}

function runMigrations(db: DatabaseSync): void {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);
  const applied = new Set(
    db
      .prepare("SELECT version FROM schema_migrations")
      .all()
      .map((r) => String((r as { version: string }).version)),
  );
  for (const file of readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort()) {
    const version = file.replace(/\.sql$/, "");
    if (applied.has(version)) continue;
    db.exec(readFileSync(join(migrationsDir, file), "utf8"));
    db.prepare("INSERT INTO schema_migrations (version) VALUES (?)").run(version);
  }
}

export function listMigrations(db: DatabaseSync): string[] {
  return db
    .prepare("SELECT version FROM schema_migrations ORDER BY version")
    .all()
    .map((r) => String((r as { version: string }).version));
}

export function migrationCount(db: DatabaseSync): number {
  return listMigrations(db).length;
}
