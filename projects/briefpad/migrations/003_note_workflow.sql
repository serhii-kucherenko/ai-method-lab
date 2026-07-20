-- 003_note_workflow: version + audit

ALTER TABLE notes ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE note_audit (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
