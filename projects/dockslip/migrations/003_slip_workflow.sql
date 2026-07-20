-- 003_slip_workflow
ALTER TABLE slips ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE slip_audit (
  id TEXT PRIMARY KEY,
  slip_id TEXT NOT NULL REFERENCES slips(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
