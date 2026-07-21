-- 002_indexes
CREATE INDEX idx_matters_firm ON matters(firm_id);
CREATE INDEX idx_evidence_matter ON evidence(matter_id);
CREATE INDEX idx_approvals_matter ON archive_approvals(matter_id);
