-- 002_indexes
CREATE INDEX idx_applications_program ON applications(program_id);
CREATE INDEX idx_milestones_application ON milestones(application_id);
CREATE INDEX idx_signoffs_application ON application_signoffs(application_id);
CREATE INDEX idx_audit_application ON application_audit(application_id);
