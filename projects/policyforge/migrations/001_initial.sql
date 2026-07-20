-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE packs (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE pack_members (
  pack_id TEXT NOT NULL REFERENCES packs(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'author', 'auditor')),
  PRIMARY KEY (pack_id, user_id)
);
CREATE TABLE rules (
  id TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL REFERENCES packs(id),
  name TEXT NOT NULL,
  expression TEXT NOT NULL,
  severity_threshold INTEGER NOT NULL DEFAULT 3
);
CREATE TABLE violations (
  id TEXT PRIMARY KEY,
  rule_id TEXT NOT NULL REFERENCES rules(id),
  title TEXT NOT NULL,
  severity INTEGER NOT NULL,
  state TEXT NOT NULL DEFAULT 'open',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE violation_waive_approvals (
  id TEXT PRIMARY KEY,
  violation_id TEXT NOT NULL REFERENCES violations(id),
  approver_id TEXT NOT NULL REFERENCES users(id),
  at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (violation_id, approver_id)
);
CREATE TABLE violation_audit (
  id TEXT PRIMARY KEY,
  violation_id TEXT NOT NULL REFERENCES violations(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  violation_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
