-- 003_bench_workflow
ALTER TABLE benches ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE bench_audit (
  id TEXT PRIMARY KEY,
  bench_id TEXT NOT NULL REFERENCES benches(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
