-- 003_visit_workflow
ALTER TABLE visits ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE visit_audit (
  id TEXT PRIMARY KEY,
  visit_id TEXT NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
