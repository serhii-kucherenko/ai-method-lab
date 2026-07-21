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
CREATE TABLE pharmacies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE pharmacy_members (
  pharmacy_id TEXT NOT NULL REFERENCES pharmacies(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('pharmacist', 'rph_manager', 'payer_ops')),
  PRIMARY KEY (pharmacy_id, user_id)
);
CREATE TABLE scripts (
  id TEXT PRIMARY KEY,
  pharmacy_id TEXT NOT NULL REFERENCES pharmacies(id),
  prescribed_ndc TEXT NOT NULL,
  candidate_ndc TEXT NOT NULL,
  te_prescribed TEXT NOT NULL,
  te_candidate TEXT NOT NULL,
  same_isf INTEGER NOT NULL,
  daw INTEGER NOT NULL,
  bmn INTEGER NOT NULL,
  allow_sub INTEGER NOT NULL,
  reason TEXT,
  state TEXT NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE script_audit (
  id TEXT PRIMARY KEY,
  script_id TEXT NOT NULL REFERENCES scripts(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  pharmacy_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at TEXT NOT NULL
);
