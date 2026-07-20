-- 003_desk_workflow
ALTER TABLE desks ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE desk_audit (
  id TEXT PRIMARY KEY,
  desk_id TEXT NOT NULL REFERENCES desks(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
