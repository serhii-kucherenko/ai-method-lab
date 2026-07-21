-- 002_indexes
CREATE INDEX idx_periods_desk ON periods(desk_id);
CREATE INDEX idx_filings_period ON filings(period_id);
CREATE INDEX idx_approvals_filing ON file_approvals(filing_id);
