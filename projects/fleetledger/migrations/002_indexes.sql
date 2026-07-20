-- 002_indexes
CREATE INDEX idx_assets_fleet ON assets(fleet_id);
CREATE INDEX idx_work_orders_asset ON work_orders(asset_id);
CREATE INDEX idx_signoffs_wo ON work_order_signoffs(work_order_id);
CREATE INDEX idx_audit_wo ON work_order_audit(work_order_id);
