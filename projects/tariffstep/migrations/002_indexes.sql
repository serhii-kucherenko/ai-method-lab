-- 002_indexes
CREATE INDEX IF NOT EXISTS idx_bills_account ON bills(account_id);
CREATE INDEX IF NOT EXISTS idx_bills_ok ON bills(account_id, ok);
