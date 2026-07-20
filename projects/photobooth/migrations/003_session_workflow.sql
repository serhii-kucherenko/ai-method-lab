-- 003_session_workflow
ALTER TABLE sessions ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE session_audit (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
