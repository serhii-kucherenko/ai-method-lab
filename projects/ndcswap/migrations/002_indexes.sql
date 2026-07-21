-- 002_indexes
CREATE INDEX IF NOT EXISTS idx_scripts_pharmacy ON scripts(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_scripts_blocked ON scripts(pharmacy_id, allow_sub);
