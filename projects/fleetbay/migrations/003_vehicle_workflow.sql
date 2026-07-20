-- 003_vehicle_workflow
ALTER TABLE vehicles ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE vehicle_audit (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
