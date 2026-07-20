-- 003_invoice_workflow
ALTER TABLE invoices ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE invoice_audit (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
