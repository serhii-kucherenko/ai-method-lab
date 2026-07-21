-- 003_visit_audit
ALTER TABLE visits ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE visit_audit (
  id TEXT PRIMARY KEY,
  visit_id TEXT NOT NULL REFERENCES visits(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_visit_audit_visit ON visit_audit(visit_id);
