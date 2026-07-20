-- 003_show_workflow
ALTER TABLE shows ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE show_audit (
  id TEXT PRIMARY KEY,
  show_id TEXT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
