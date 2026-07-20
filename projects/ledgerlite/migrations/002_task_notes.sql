-- 002_task_notes: mid-project schema evolution

ALTER TABLE tasks ADD COLUMN notes TEXT NOT NULL DEFAULT '';
