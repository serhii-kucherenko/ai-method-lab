-- 002_indexes
CREATE INDEX idx_jobs_board ON jobs(board_id);
CREATE INDEX idx_candidates_board ON candidates(board_id);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_scores_application ON scores(application_id);
CREATE INDEX idx_audit_application ON application_audit(application_id);
