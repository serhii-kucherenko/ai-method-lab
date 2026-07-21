-- 002_indexes
CREATE INDEX idx_rounds_firm ON rounds(firm_id);
CREATE INDEX idx_allocations_round ON allocations(round_id);
CREATE INDEX idx_closes_allocation ON allocation_closes(allocation_id);
CREATE INDEX idx_tokens_user ON tokens(user_id);
