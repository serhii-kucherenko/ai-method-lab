-- 003_form_workflow
ALTER TABLE forms ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE form_audit (
  id TEXT PRIMARY KEY,
  form_id TEXT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
