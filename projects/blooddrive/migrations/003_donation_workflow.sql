-- 003_donation_workflow
ALTER TABLE donations ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE donation_audit (
  id TEXT PRIMARY KEY,
  donation_id TEXT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
