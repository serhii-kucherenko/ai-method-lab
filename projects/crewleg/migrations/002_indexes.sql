-- 002_indexes
CREATE INDEX IF NOT EXISTS idx_pairings_carrier ON pairings(carrier_id);
CREATE INDEX IF NOT EXISTS idx_pairings_illegal ON pairings(carrier_id, legal);
