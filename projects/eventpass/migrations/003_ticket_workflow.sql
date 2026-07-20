-- 003_ticket_workflow
ALTER TABLE tickets ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE ticket_audit (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
