-- 003_meal_workflow
ALTER TABLE meals ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE meal_audit (
  id TEXT PRIMARY KEY,
  meal_id TEXT NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
