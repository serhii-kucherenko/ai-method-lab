-- smoke schema: org + citations
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
  role TEXT NOT NULL,
  PRIMARY KEY (org_id, user_id)
);

CREATE TABLE org_settings (
  org_id TEXT PRIMARY KEY REFERENCES orgs(id),
  webhook_secret TEXT NOT NULL,
  tokens_note TEXT NOT NULL
);

CREATE TABLE citations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  classification TEXT NOT NULL,
  gravity_tier TEXT NOT NULL,
  gbp_amount REAL NOT NULL,
  size_pct REAL NOT NULL,
  history_pct REAL NOT NULL,
  good_faith_pct REAL NOT NULL,
  quick_fix_pct REAL NOT NULL,
  use_statutory_max INTEGER NOT NULL DEFAULT 0,
  additive_cheat INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE forecast_runs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  citation_id TEXT REFERENCES citations(id),
  status TEXT NOT NULL,
  penalty REAL,
  reason TEXT,
  algorithm_version TEXT,
  steps_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
