-- 003_item_workflow
ALTER TABLE items ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE item_audit (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
