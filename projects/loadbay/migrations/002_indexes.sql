-- 002_indexes
CREATE INDEX IF NOT EXISTS idx_docks_bay ON docks(bay_id);
CREATE INDEX IF NOT EXISTS idx_loads_dock ON loads(dock_id);
CREATE INDEX IF NOT EXISTS idx_load_seals_load ON load_seals(load_id);
CREATE INDEX IF NOT EXISTS idx_tokens_user ON tokens(user_id);
