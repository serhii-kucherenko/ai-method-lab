-- 002_indexes
CREATE INDEX idx_lots_warehouse ON lots(warehouse_id);
CREATE INDEX idx_inspections_lot ON inspections(lot_id);
CREATE INDEX idx_clears_lot ON lot_clears(lot_id);
