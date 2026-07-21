-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE firms (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE firm_members (
  firm_id TEXT NOT NULL REFERENCES firms(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('counsel', 'clerk', 'viewer')),
  PRIMARY KEY (firm_id, user_id)
);
CREATE TABLE rounds (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id),
  label TEXT NOT NULL,
  authorized REAL NOT NULL
);
CREATE TABLE allocations (
  id TEXT PRIMARY KEY,
  round_id TEXT NOT NULL REFERENCES rounds(id),
  title TEXT NOT NULL,
  shares REAL NOT NULL,
  state TEXT NOT NULL DEFAULT 'proposed',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE allocation_closes (
  id TEXT PRIMARY KEY,
  allocation_id TEXT NOT NULL REFERENCES allocations(id),
  counsel_id TEXT NOT NULL REFERENCES users(id),
  at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (allocation_id, counsel_id)
);
CREATE TABLE allocation_audit (
  id TEXT PRIMARY KEY,
  allocation_id TEXT NOT NULL REFERENCES allocations(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  allocation_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
