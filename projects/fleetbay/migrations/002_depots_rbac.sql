-- 002_depots_rbac: shared depots, memberships, tasks, comments; task notes migration

CREATE TABLE depots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id)
);

CREATE TABLE depot_members (
  depot_id TEXT NOT NULL REFERENCES depots(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member', 'viewer')),
  PRIMARY KEY (depot_id, user_id)
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  depot_id TEXT NOT NULL REFERENCES depots(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL REFERENCES users(id)
);

CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id),
  body TEXT NOT NULL
);
