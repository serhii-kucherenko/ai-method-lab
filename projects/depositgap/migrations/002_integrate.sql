-- 002_integrate
CREATE TABLE org_settings (
  org_id TEXT PRIMARY KEY REFERENCES orgs(id),
  webhook_secret TEXT NOT NULL,
  tokens_note TEXT NOT NULL DEFAULT 'API tokens are issued at register. Treat bearer tokens as secrets.',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE webhook_deliveries (
  idempotency_key TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  entry_id TEXT NOT NULL REFERENCES entries(id),
  processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
