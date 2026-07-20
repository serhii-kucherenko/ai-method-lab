-- 003_pass_workflow
ALTER TABLE passes ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE pass_audit (
  id TEXT PRIMARY KEY,
  pass_id TEXT NOT NULL REFERENCES passes(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
