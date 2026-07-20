-- 002_indexes
CREATE INDEX idx_vendors_workspace ON vendors(workspace_id);
CREATE INDEX idx_findings_vendor ON findings(vendor_id);
CREATE INDEX idx_questions_vendor ON questions(vendor_id);
