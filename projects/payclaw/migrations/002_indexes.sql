-- 002_indexes
CREATE INDEX idx_runs_firm ON payroll_runs(firm_id);
CREATE INDEX idx_clawbacks_run ON clawbacks(run_id);
CREATE INDEX idx_releases_clawback ON clawback_releases(clawback_id);
