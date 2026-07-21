-- 002_indexes
CREATE INDEX IF NOT EXISTS idx_intervals_account ON intervals(account_id);
CREATE INDEX IF NOT EXISTS idx_intervals_imbalance ON intervals(account_id, imbalance_kwh);
