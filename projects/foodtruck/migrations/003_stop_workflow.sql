-- 003_stop_workflow
ALTER TABLE stops ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE stop_audit (
  id TEXT PRIMARY KEY,
  stop_id TEXT NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
