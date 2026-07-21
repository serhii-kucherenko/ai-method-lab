-- 002_indexes
CREATE INDEX IF NOT EXISTS idx_subjects_study ON subjects(study_id);
CREATE INDEX IF NOT EXISTS idx_visits_study ON visits(study_id);
CREATE INDEX IF NOT EXISTS idx_visits_important ON visits(study_id, important);
CREATE INDEX IF NOT EXISTS idx_versions_study ON protocol_versions(study_id);
