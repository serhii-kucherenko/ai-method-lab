-- 002_kitchens_rbac: shared kitchens, memberships, tasks, comments; task notes migration

CREATE TABLE kitchens (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id)
);

CREATE TABLE kitchen_members (
  kitchen_id TEXT NOT NULL REFERENCES kitchens(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member', 'viewer')),
  PRIMARY KEY (kitchen_id, user_id)
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  kitchen_id TEXT NOT NULL REFERENCES kitchens(id) ON DELETE CASCADE,
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
