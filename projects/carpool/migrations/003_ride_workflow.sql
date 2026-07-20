-- 003_ride_workflow
ALTER TABLE rides ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE ride_audit (
  id TEXT PRIMARY KEY,
  ride_id TEXT NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
