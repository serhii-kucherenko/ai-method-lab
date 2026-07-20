-- 003_trip_workflow
ALTER TABLE trips ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE trip_audit (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
