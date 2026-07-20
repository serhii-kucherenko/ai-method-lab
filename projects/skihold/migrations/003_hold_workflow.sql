-- 003_hold_workflow
ALTER TABLE holds ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE hold_audit (
  id TEXT PRIMARY KEY,
  hold_id TEXT NOT NULL REFERENCES holds(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
