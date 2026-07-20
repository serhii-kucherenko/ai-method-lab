-- 002_task_severity

ALTER TABLE tasks ADD COLUMN severity TEXT NOT NULL DEFAULT 'normal';
