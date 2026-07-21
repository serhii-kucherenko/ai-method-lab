-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE desks (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE desk_members (
  desk_id TEXT NOT NULL REFERENCES desks(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('tax_officer', 'clerk', 'viewer')),
  PRIMARY KEY (desk_id, user_id)
);
CREATE TABLE periods (
  id TEXT PRIMARY KEY,
  desk_id TEXT NOT NULL REFERENCES desks(id),
  label TEXT NOT NULL,
  due_at TEXT NOT NULL,
  late_days INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE filings (
  id TEXT PRIMARY KEY,
  period_id TEXT NOT NULL REFERENCES periods(id),
  title TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'open',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE file_approvals (
  id TEXT PRIMARY KEY,
  filing_id TEXT NOT NULL REFERENCES filings(id),
  officer_id TEXT NOT NULL REFERENCES users(id),
  at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (filing_id, officer_id)
);
CREATE TABLE filing_audit (
  id TEXT PRIMARY KEY,
  filing_id TEXT NOT NULL REFERENCES filings(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  filing_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
