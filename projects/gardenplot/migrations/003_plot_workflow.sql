-- 003_plot_workflow
ALTER TABLE plots ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
CREATE TABLE plot_audit (
  id TEXT PRIMARY KEY,
  plot_id TEXT NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL REFERENCES users(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  at TEXT NOT NULL
);
