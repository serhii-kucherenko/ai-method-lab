-- 003_status_workflow

ALTER TABLE statuses ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE statuses ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE status_audit (
  id TEXT PRIMARY KEY,
  status_id TEXT NOT NULL REFERENCES statuses(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
