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
CREATE TABLE carriers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE carrier_members (
  carrier_id TEXT NOT NULL REFERENCES carriers(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('scheduler', 'legal', 'ops_admin')),
  PRIMARY KEY (carrier_id, user_id)
);
CREATE TABLE pairings (
  id TEXT PRIMARY KEY,
  carrier_id TEXT NOT NULL REFERENCES carriers(id),
  report_local TEXT NOT NULL,
  segments INTEGER NOT NULL,
  acclimated INTEGER NOT NULL,
  fdp_hours REAL NOT NULL,
  rest_hours REAL,
  max_consecutive_off_in_168h REAL,
  legal INTEGER NOT NULL,
  max_fdp REAL NOT NULL,
  state TEXT NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  reasons_json TEXT NOT NULL DEFAULT '[]'
);
CREATE TABLE pairing_audit (
  id TEXT PRIMARY KEY,
  pairing_id TEXT NOT NULL REFERENCES pairings(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  carrier_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at TEXT NOT NULL
);
