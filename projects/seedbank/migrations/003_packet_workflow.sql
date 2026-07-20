-- 003_packet_workflow
ALTER TABLE packets ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE packet_audit (
  id TEXT PRIMARY KEY,
  packet_id TEXT NOT NULL REFERENCES packets(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
