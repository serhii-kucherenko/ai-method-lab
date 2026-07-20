-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE domains (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE domain_members (
  domain_id TEXT NOT NULL REFERENCES domains(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'producer', 'consumer')),
  PRIMARY KEY (domain_id, user_id)
);
CREATE TABLE contracts (
  id TEXT PRIMARY KEY,
  domain_id TEXT NOT NULL REFERENCES domains(id),
  name TEXT NOT NULL,
  schema_json TEXT NOT NULL,
  slo_latency_ms INTEGER NOT NULL DEFAULT 500
);
CREATE TABLE breaches (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id),
  title TEXT NOT NULL,
  latency_ms INTEGER,
  state TEXT NOT NULL DEFAULT 'open',
  remediation_note TEXT,
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE breach_audit (
  id TEXT PRIMARY KEY,
  breach_id TEXT NOT NULL REFERENCES breaches(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  breach_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
