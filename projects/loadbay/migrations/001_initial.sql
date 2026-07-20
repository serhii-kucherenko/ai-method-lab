-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE bays (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE bay_members (
  bay_id TEXT NOT NULL REFERENCES bays(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'dispatcher', 'checker')),
  PRIMARY KEY (bay_id, user_id)
);
CREATE TABLE docks (
  id TEXT PRIMARY KEY,
  bay_id TEXT NOT NULL REFERENCES bays(id),
  label TEXT NOT NULL,
  max_weight_kg INTEGER NOT NULL DEFAULT 10000
);
CREATE TABLE loads (
  id TEXT PRIMARY KEY,
  dock_id TEXT NOT NULL REFERENCES docks(id),
  title TEXT NOT NULL,
  weight_kg INTEGER NOT NULL,
  state TEXT NOT NULL DEFAULT 'staged',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE load_seals (
  id TEXT PRIMARY KEY,
  load_id TEXT NOT NULL REFERENCES loads(id),
  checker_id TEXT NOT NULL REFERENCES users(id),
  at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (load_id, checker_id)
);
CREATE TABLE load_audit (
  id TEXT PRIMARY KEY,
  load_id TEXT NOT NULL REFERENCES loads(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  load_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
