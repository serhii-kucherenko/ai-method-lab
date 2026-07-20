-- 003_tool_workflow
ALTER TABLE tools ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE tool_audit (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
