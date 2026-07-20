-- 003_request_workflow: version + audit for approval state machine

ALTER TABLE requests ADD COLUMN version INTEGER NOT NULL DEFAULT 1;

CREATE TABLE request_audit (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
