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
CREATE TABLE vehicles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'staged'
);
