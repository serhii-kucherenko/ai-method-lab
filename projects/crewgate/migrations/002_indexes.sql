-- 002_indexes
CREATE INDEX idx_crews_site ON crews(site_id);
CREATE INDEX idx_shifts_crew ON shifts(crew_id);
CREATE INDEX idx_approvals_shift ON shift_approvals(shift_id);
