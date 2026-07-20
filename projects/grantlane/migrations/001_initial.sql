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
CREATE TABLE programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE program_members (
  program_id TEXT NOT NULL REFERENCES programs(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('admin', 'officer', 'reviewer')),
  PRIMARY KEY (program_id, user_id)
);
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES programs(id),
  org_name TEXT NOT NULL,
  amount_requested REAL NOT NULL,
  approved_amount REAL,
  state TEXT NOT NULL DEFAULT 'submitted',
  paid_total REAL NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE milestones (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id),
  label TEXT NOT NULL,
  amount REAL NOT NULL,
  state TEXT NOT NULL DEFAULT 'planned'
);
CREATE TABLE application_signoffs (
  application_id TEXT NOT NULL REFERENCES applications(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  signed_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (application_id, user_id)
);
CREATE TABLE application_audit (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  detail TEXT,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  application_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
