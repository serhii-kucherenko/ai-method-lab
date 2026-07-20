-- 003_bottle_workflow
ALTER TABLE bottles ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE bottle_audit (
  id TEXT PRIMARY KEY,
  bottle_id TEXT NOT NULL REFERENCES bottles(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
