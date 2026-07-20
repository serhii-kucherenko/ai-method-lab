-- 003_load_workflow
ALTER TABLE loads ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE load_audit (
  id TEXT PRIMARY KEY,
  load_id TEXT NOT NULL REFERENCES loads(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
