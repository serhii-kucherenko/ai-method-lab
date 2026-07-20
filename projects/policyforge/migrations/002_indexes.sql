-- 002_indexes
CREATE INDEX idx_rules_pack ON rules(pack_id);
CREATE INDEX idx_violations_rule ON violations(rule_id);
CREATE INDEX idx_waive_approvals_violation ON violation_waive_approvals(violation_id);
CREATE INDEX idx_audit_violation ON violation_audit(violation_id);
