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
  role TEXT NOT NULL CHECK (role IN ('supervisor', 'adjuster', 'claimant')),
  PRIMARY KEY (desk_id, user_id)
);
CREATE TABLE policies (
  id TEXT PRIMARY KEY,
  desk_id TEXT NOT NULL REFERENCES desks(id),
  number TEXT NOT NULL,
  holder TEXT NOT NULL
);
CREATE TABLE claims (
  id TEXT PRIMARY KEY,
  policy_id TEXT NOT NULL REFERENCES policies(id),
  title TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'filed',
  reserve_amount REAL,
  payout_amount REAL,
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE evidence (
  id TEXT PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES claims(id),
  label TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'note',
  added_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE claim_audit (
  id TEXT PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES claims(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  claim_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
