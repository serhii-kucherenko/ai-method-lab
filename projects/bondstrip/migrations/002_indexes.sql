-- 002_indexes
CREATE INDEX IF NOT EXISTS idx_strips_desk ON strips(desk_id);
CREATE INDEX IF NOT EXISTS idx_strips_ok ON strips(desk_id, ok);
