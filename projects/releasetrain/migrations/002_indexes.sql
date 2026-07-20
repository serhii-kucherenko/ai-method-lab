-- 002_indexes
CREATE INDEX idx_services_train ON services(train_id);
CREATE INDEX idx_releases_service ON releases(service_id);
CREATE INDEX idx_checklist_release ON checklist_items(release_id);
CREATE INDEX idx_approvals_release ON release_approvals(release_id);
CREATE INDEX idx_audit_release ON release_audit(release_id);
