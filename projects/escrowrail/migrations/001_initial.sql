-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE workspaces (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE workspace_members (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('escrow_officer', 'clerk', 'viewer')),
  PRIMARY KEY (workspace_id, user_id)
);
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  label TEXT NOT NULL,
  balance REAL NOT NULL,
  floor REAL NOT NULL
);
CREATE TABLE disbursements (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  state TEXT NOT NULL DEFAULT 'requested',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE disbursement_releases (
  id TEXT PRIMARY KEY,
  disbursement_id TEXT NOT NULL REFERENCES disbursements(id),
  officer_id TEXT NOT NULL REFERENCES users(id),
  at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (disbursement_id, officer_id)
);
CREATE TABLE disbursement_audit (
  id TEXT PRIMARY KEY,
  disbursement_id TEXT NOT NULL REFERENCES disbursements(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  disbursement_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
