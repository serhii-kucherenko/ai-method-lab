-- 003_match_workflow
ALTER TABLE matches ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE match_audit (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
