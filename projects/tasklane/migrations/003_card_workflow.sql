-- 003_card_workflow
ALTER TABLE cards ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE card_audit (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
