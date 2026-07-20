-- 003_clip_workflow
ALTER TABLE clips ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE clip_audit (
  id TEXT PRIMARY KEY,
  clip_id TEXT NOT NULL REFERENCES clips(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
