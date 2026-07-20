-- 003_seat_workflow
ALTER TABLE seats ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE seat_audit (
  id TEXT PRIMARY KEY,
  seat_id TEXT NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
