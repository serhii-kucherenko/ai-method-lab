-- 002_indexes
CREATE INDEX idx_contracts_domain ON contracts(domain_id);
CREATE INDEX idx_breaches_contract ON breaches(contract_id);
