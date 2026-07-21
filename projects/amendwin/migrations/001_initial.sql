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
CREATE TABLE studies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  important_codes_json TEXT NOT NULL DEFAULT '[]'
);
CREATE TABLE study_members (
  study_id TEXT NOT NULL REFERENCES studies(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('cra', 'cdm', 'sponsor')),
  PRIMARY KEY (study_id, user_id)
);
CREATE TABLE protocol_versions (
  study_id TEXT NOT NULL REFERENCES studies(id),
  id TEXT NOT NULL,
  effective_at TEXT NOT NULL,
  visits_json TEXT NOT NULL,
  PRIMARY KEY (study_id, id)
);
CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  study_id TEXT NOT NULL REFERENCES studies(id),
  enrollment TEXT NOT NULL
);
CREATE TABLE visits (
  id TEXT PRIMARY KEY,
  study_id TEXT NOT NULL REFERENCES studies(id),
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  code TEXT NOT NULL,
  actual TEXT,
  locked INTEGER NOT NULL DEFAULT 0,
  scored_version_id TEXT,
  classification TEXT,
  important INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  study_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at TEXT NOT NULL
);
