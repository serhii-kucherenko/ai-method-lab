-- 003_lesson_workflow
ALTER TABLE lessons ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE lesson_audit (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
