-- 003_piece_workflow
ALTER TABLE pieces ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE piece_audit (
  id TEXT PRIMARY KEY,
  piece_id TEXT NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
