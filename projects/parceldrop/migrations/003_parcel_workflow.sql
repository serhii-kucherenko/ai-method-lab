-- 003_parcel_workflow
ALTER TABLE parcels ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE parcel_audit (
  id TEXT PRIMARY KEY,
  parcel_id TEXT NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
