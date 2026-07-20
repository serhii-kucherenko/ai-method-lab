-- 003_share_workflow
ALTER TABLE shares ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE share_audit (
  id TEXT PRIMARY KEY,
  share_id TEXT NOT NULL REFERENCES shares(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
