-- 003_entry_workflow: version + audit for entry approval-style flow

ALTER TABLE entries ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE entries ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE entry_audit (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
