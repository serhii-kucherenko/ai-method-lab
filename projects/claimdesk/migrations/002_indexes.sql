-- 002_indexes
CREATE INDEX idx_policies_desk ON policies(desk_id);
CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_evidence_claim ON evidence(claim_id);
CREATE INDEX idx_audit_claim ON claim_audit(claim_id);
