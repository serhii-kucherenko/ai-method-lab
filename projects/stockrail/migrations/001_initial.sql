-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE stores (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE store_members (
  store_id TEXT NOT NULL REFERENCES stores(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('manager', 'clerk', 'viewer')),
  PRIMARY KEY (store_id, user_id)
);
CREATE TABLE skus (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES stores(id),
  code TEXT NOT NULL,
  qty REAL NOT NULL DEFAULT 0
);
CREATE TABLE adjustments (
  id TEXT PRIMARY KEY,
  sku_id TEXT NOT NULL REFERENCES skus(id),
  title TEXT NOT NULL,
  delta REAL NOT NULL,
  state TEXT NOT NULL DEFAULT 'drafted',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE adjust_approvals (
  id TEXT PRIMARY KEY,
  adjustment_id TEXT NOT NULL REFERENCES adjustments(id),
  manager_id TEXT NOT NULL REFERENCES users(id),
  at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (adjustment_id, manager_id)
);
CREATE TABLE adjust_audit (
  id TEXT PRIMARY KEY,
  adjustment_id TEXT NOT NULL REFERENCES adjustments(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  adjustment_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
