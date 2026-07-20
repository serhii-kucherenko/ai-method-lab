-- 003_stall_workflow
ALTER TABLE stalls ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE stall_audit (
  id TEXT PRIMARY KEY,
  stall_id TEXT NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
