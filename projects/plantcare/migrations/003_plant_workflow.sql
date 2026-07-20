-- 003_plant_workflow
ALTER TABLE plants ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE plant_audit (
  id TEXT PRIMARY KEY,
  plant_id TEXT NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
