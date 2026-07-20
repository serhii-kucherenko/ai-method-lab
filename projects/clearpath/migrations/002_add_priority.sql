-- 002_add_priority: schema evolution mid-project

ALTER TABLE tasks ADD COLUMN priority INTEGER NOT NULL DEFAULT 0;
