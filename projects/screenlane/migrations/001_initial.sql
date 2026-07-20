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
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE board_members (
  board_id TEXT NOT NULL REFERENCES boards(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'recruiter', 'reviewer')),
  PRIMARY KEY (board_id, user_id)
);
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES boards(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);
CREATE TABLE candidates (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES boards(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL
);
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  candidate_id TEXT NOT NULL REFERENCES candidates(id),
  state TEXT NOT NULL DEFAULT 'applied',
  decision TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  UNIQUE (job_id, candidate_id)
);
CREATE TABLE criteria (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  label TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 1.0
);
CREATE TABLE scores (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id),
  criterion_id TEXT NOT NULL REFERENCES criteria(id),
  reviewer_id TEXT NOT NULL REFERENCES users(id),
  value REAL NOT NULL CHECK (value >= 0 AND value <= 5),
  UNIQUE (application_id, criterion_id, reviewer_id)
);
CREATE TABLE application_audit (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  application_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
