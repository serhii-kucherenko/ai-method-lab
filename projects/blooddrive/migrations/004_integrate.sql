-- 004_integrate: deposit payments + webhook idempotency

CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  amount REAL NOT NULL,
  provider_id TEXT NOT NULL
);

CREATE TABLE webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at TEXT NOT NULL
);
