import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export type FleetRole = "owner" | "dispatcher" | "mechanic";

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "../migrations");

export function openDatabase(dbPath: string): DatabaseSync {
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY
    );
  `);
  const applied = new Set(
    (
      db.prepare("SELECT version FROM schema_migrations").all() as { version: string }[]
    ).map((r) => r.version),
  );
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const version = file.replace(/\.sql$/, "");
    if (applied.has(version)) continue;
    db.exec(readFileSync(join(migrationsDir, file), "utf8"));
    db.prepare("INSERT INTO schema_migrations (version) VALUES (?)").run(version);
  }
  return db;
}

export function listMigrations(db: DatabaseSync): string[] {
  return (
    db.prepare("SELECT version FROM schema_migrations ORDER BY version").all() as {
      version: string;
    }[]
  ).map((r) => r.version);
}

export function migrationCount(db: DatabaseSync): number {
  return listMigrations(db).length;
}
