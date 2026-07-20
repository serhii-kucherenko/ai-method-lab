-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE workspaces (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE workspace_members (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('treasurer', 'clerk', 'viewer')),
  PRIMARY KEY (workspace_id, user_id)
);
CREATE TABLE bonds (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  label TEXT NOT NULL,
  collateral REAL NOT NULL,
  floor REAL NOT NULL DEFAULT 0
);
CREATE TABLE draws (
  id TEXT PRIMARY KEY,
  bond_id TEXT NOT NULL REFERENCES bonds(id),
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  state TEXT NOT NULL DEFAULT 'requested',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE draw_releases (
  id TEXT PRIMARY KEY,
  draw_id TEXT NOT NULL REFERENCES draws(id),
  treasurer_id TEXT NOT NULL REFERENCES users(id),
  at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (draw_id, treasurer_id)
);
CREATE TABLE draw_audit (
  id TEXT PRIMARY KEY,
  draw_id TEXT NOT NULL REFERENCES draws(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  draw_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
