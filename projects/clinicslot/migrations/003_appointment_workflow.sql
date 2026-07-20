-- 003_appointment_workflow
ALTER TABLE appointments ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE appointment_audit (
  id TEXT PRIMARY KEY,
  appointment_id TEXT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
