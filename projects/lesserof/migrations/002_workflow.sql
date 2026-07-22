CREATE TABLE recover_runs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  claim_line_id TEXT REFERENCES claim_lines(id),
  batch_id TEXT,
  status TEXT NOT NULL,
  refund REAL,
  reason TEXT,
  algorithm_version TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_recover_runs_org ON recover_runs(org_id, created_at);
