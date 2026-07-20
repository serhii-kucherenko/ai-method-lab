-- 003_berth_workflow
ALTER TABLE berths ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE berth_audit (
  id TEXT PRIMARY KEY,
  berth_id TEXT NOT NULL REFERENCES berths(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
