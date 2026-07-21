-- 003_recall_workflow
ALTER TABLE recalls ADD COLUMN state TEXT NOT NULL DEFAULT 'locked';
ALTER TABLE recalls ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE recall_audit (
  id TEXT PRIMARY KEY,
  recall_id TEXT NOT NULL REFERENCES recalls(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_recall_audit_recall ON recall_audit(recall_id);
