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
CREATE TABLE desks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE desk_members (
  desk_id TEXT NOT NULL REFERENCES desks(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('analyst', 'trader', 'ops_admin')),
  PRIMARY KEY (desk_id, user_id)
);
CREATE TABLE strips (
  id TEXT PRIMARY KEY,
  desk_id TEXT NOT NULL REFERENCES desks(id),
  day_count TEXT NOT NULL,
  face REAL NOT NULL,
  coupon_rate REAL NOT NULL,
  freq INTEGER NOT NULL,
  prev_coupon TEXT NOT NULL,
  next_coupon TEXT NOT NULL,
  settle TEXT NOT NULL,
  maturity TEXT,
  coupon_dates TEXT,
  periodic_coupon REAL,
  days_elapsed INTEGER,
  days_in_period INTEGER,
  accrued REAL,
  cashflows TEXT,
  ok INTEGER NOT NULL,
  reason TEXT,
  state TEXT NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE strip_audit (
  id TEXT PRIMARY KEY,
  strip_id TEXT NOT NULL REFERENCES strips(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  desk_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at TEXT NOT NULL
);
