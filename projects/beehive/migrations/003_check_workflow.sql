-- 003_check_workflow
ALTER TABLE checks ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE check_audit (
  id TEXT PRIMARY KEY,
  check_id TEXT NOT NULL REFERENCES checks(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
