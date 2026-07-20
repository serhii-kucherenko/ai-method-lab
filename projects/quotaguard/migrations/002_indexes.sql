-- 002_indexes
CREATE INDEX idx_quotas_org ON quotas(org_id);
CREATE INDEX idx_charges_quota ON charges(quota_id);
CREATE INDEX idx_releases_charge ON charge_releases(charge_id);
