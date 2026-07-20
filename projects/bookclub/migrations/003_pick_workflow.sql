-- 003_pick_workflow
ALTER TABLE picks ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE pick_audit (
  id TEXT PRIMARY KEY,
  pick_id TEXT NOT NULL REFERENCES picks(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
