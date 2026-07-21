-- 002_indexes
CREATE INDEX idx_accounts_workspace ON accounts(workspace_id);
CREATE INDEX idx_disbursements_account ON disbursements(account_id);
CREATE INDEX idx_releases_disbursement ON disbursement_releases(disbursement_id);
CREATE INDEX idx_tokens_user ON tokens(user_id);
