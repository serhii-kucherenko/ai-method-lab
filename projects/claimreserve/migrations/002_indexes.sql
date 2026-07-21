-- 002_indexes
CREATE INDEX idx_policies_desk ON policies(desk_id);
CREATE INDEX idx_claims_policy ON claims(policy_id);
CREATE INDEX idx_settlements_claim ON claim_settlements(claim_id);
CREATE INDEX idx_tokens_user ON tokens(user_id);
