-- 002_indexes
CREATE INDEX idx_skus_store ON skus(store_id);
CREATE INDEX idx_adjustments_sku ON adjustments(sku_id);
CREATE INDEX idx_approvals_adj ON adjust_approvals(adjustment_id);
