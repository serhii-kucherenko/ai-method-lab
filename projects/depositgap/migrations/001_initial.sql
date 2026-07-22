-- 001_initial
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
CREATE TABLE tokens (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE orgs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE org_members (
  org_id TEXT NOT NULL REFERENCES orgs(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('analyst', 'auditor', 'admin')),
  PRIMARY KEY (org_id, user_id)
);
CREATE TABLE entries (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  por TEXT,
  order_type TEXT NOT NULL,
  rate_class TEXT NOT NULL,
  deposit_rate REAL NOT NULL,
  assessed_rate REAL,
  entered_value REAL NOT NULL,
  order_published_on TEXT NOT NULL,
  liquidated_on TEXT NOT NULL,
  interest_annual_rate REAL,
  skip_interest INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE forecast_runs (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL REFERENCES entries(id),
  status TEXT NOT NULL,
  duty_delta REAL,
  days INTEGER,
  interest REAL,
  true_up REAL,
  reason TEXT,
  algorithm_version TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
