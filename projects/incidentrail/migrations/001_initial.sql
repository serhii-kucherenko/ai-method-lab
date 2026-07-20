-- 001_initial
CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);
CREATE TABLE tokens (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id));
CREATE TABLE rooms (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE room_members (
  room_id TEXT NOT NULL REFERENCES rooms(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('commander', 'responder', 'observer')),
  PRIMARY KEY (room_id, user_id)
);
CREATE TABLE incidents (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id),
  title TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity IN (1, 2, 3)),
  state TEXT NOT NULL DEFAULT 'open',
  commander_acked INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE actions (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL REFERENCES incidents(id),
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE postmortems (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL UNIQUE REFERENCES incidents(id),
  body TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE incident_audit (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL REFERENCES incidents(id),
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
