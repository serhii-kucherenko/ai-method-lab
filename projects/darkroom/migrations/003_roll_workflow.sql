-- 003_roll_workflow
ALTER TABLE rolls ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE roll_audit (
  id TEXT PRIMARY KEY,
  roll_id TEXT NOT NULL REFERENCES rolls(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
