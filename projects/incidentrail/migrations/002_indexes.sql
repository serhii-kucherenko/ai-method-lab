-- 002_indexes
CREATE INDEX idx_incidents_room ON incidents(room_id);
CREATE INDEX idx_actions_incident ON actions(incident_id);
