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
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE account_members (
  account_id TEXT NOT NULL REFERENCES accounts(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('analyst', 'settler', 'ops_admin')),
  PRIMARY KEY (account_id, user_id)
);
CREATE TABLE intervals (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id),
  interval_start TEXT NOT NULL,
  meter_kwh REAL NOT NULL,
  schedule_kwh REAL NOT NULL,
  delivery_factor REAL NOT NULL,
  imbalance_price REAL NOT NULL,
  adjusted_kwh REAL,
  imbalance_kwh REAL,
  charge REAL,
  ok INTEGER NOT NULL,
  reason TEXT,
  state TEXT NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE interval_audit (
  id TEXT PRIMARY KEY,
  interval_id TEXT NOT NULL REFERENCES intervals(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  account_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at TEXT NOT NULL
);
