-- 002_marinas_rbac: shared marinas, memberships, tasks, comments; task notes migration

CREATE TABLE marinas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id)
);

CREATE TABLE marina_members (
  marina_id TEXT NOT NULL REFERENCES marinas(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member', 'viewer')),
  PRIMARY KEY (marina_id, user_id)
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  marina_id TEXT NOT NULL REFERENCES marinas(id) ON DELETE CASCADE,
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
