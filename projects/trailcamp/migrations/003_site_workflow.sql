-- 003_site_workflow
ALTER TABLE sites ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE site_audit (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
