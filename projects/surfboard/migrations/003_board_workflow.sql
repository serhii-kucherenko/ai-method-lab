-- 003_board_workflow
ALTER TABLE boards ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE board_audit (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
