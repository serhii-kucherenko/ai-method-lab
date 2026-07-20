-- 003_stock_workflow
ALTER TABLE stocks ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE stock_audit (
  id TEXT PRIMARY KEY,
  stock_id TEXT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
