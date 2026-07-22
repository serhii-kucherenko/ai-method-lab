CREATE TABLE org_settings (
  org_id TEXT PRIMARY KEY REFERENCES orgs(id),
  webhook_secret TEXT NOT NULL,
  tokens_note TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE webhook_deliveries (
  idempotency_key TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  claim_line_id TEXT NOT NULL REFERENCES claim_lines(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
