-- 003_locker_workflow
ALTER TABLE lockers ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE locker_audit (
  id TEXT PRIMARY KEY,
  locker_id TEXT NOT NULL REFERENCES lockers(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
