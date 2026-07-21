-- 002_indexes
CREATE INDEX IF NOT EXISTS idx_lots_plant ON lots(plant_id);
CREATE INDEX IF NOT EXISTS idx_receiving_plant ON receiving_events(plant_id);
CREATE INDEX IF NOT EXISTS idx_transform_plant ON transform_events(plant_id);
CREATE INDEX IF NOT EXISTS idx_shipping_plant ON shipping_events(plant_id);
CREATE INDEX IF NOT EXISTS idx_recalls_plant ON recalls(plant_id);
