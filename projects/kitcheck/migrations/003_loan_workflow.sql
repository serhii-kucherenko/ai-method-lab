-- 003_loan_workflow: version + audit for loan checkout cycle

ALTER TABLE loans ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE loan_audit (
  id TEXT PRIMARY KEY,
  loan_id TEXT NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);

UPDATE loans SET status = 'requested' WHERE status = 'open';
UPDATE loans SET status = 'returned' WHERE status = 'closed';
