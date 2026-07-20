-- 003_bike_workflow
ALTER TABLE bikes ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE bike_audit (
  id TEXT PRIMARY KEY,
  bike_id TEXT NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
