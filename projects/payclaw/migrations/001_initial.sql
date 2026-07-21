-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE firms (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE firm_members (
  firm_id TEXT NOT NULL REFERENCES firms(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('hr_lead', 'payroll', 'viewer')),
  PRIMARY KEY (firm_id, user_id)
);
CREATE TABLE payroll_runs (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id),
  label TEXT NOT NULL,
  owed REAL NOT NULL,
  paid REAL NOT NULL
);
CREATE TABLE clawbacks (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES payroll_runs(id),
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  state TEXT NOT NULL DEFAULT 'requested',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE clawback_releases (
  id TEXT PRIMARY KEY,
  clawback_id TEXT NOT NULL REFERENCES clawbacks(id),
  hr_id TEXT NOT NULL REFERENCES users(id),
  at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (clawback_id, hr_id)
);
CREATE TABLE clawback_audit (
  id TEXT PRIMARY KEY,
  clawback_id TEXT NOT NULL REFERENCES clawbacks(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  clawback_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
