-- 003_booking_workflow: version + audit

ALTER TABLE bookings ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE booking_audit (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
