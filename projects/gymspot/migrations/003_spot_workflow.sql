-- 003_spot_workflow
ALTER TABLE spots ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE spot_audit (
  id TEXT PRIMARY KEY,
  spot_id TEXT NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
