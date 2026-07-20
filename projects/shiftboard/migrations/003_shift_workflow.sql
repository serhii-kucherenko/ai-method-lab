-- 003_shift_workflow
ALTER TABLE shifts ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE shift_audit (
  id TEXT PRIMARY KEY,
  shift_id TEXT NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
