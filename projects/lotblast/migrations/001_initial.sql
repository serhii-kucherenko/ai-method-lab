-- 001_initial
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
CREATE TABLE tokens (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE plants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);
CREATE TABLE plant_members (
  plant_id TEXT NOT NULL REFERENCES plants(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('ops', 'qa', 'recall_admin')),
  PRIMARY KEY (plant_id, user_id)
);
CREATE TABLE lots (
  plant_id TEXT NOT NULL REFERENCES plants(id),
  tlc TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('ingredient', 'intermediate', 'finished')),
  qty REAL NOT NULL,
  uom TEXT NOT NULL,
  product_json TEXT NOT NULL,
  PRIMARY KEY (plant_id, tlc)
);
CREATE TABLE receiving_events (
  id TEXT PRIMARY KEY,
  plant_id TEXT NOT NULL REFERENCES plants(id),
  tlc TEXT NOT NULL,
  qty REAL NOT NULL,
  uom TEXT NOT NULL,
  product_json TEXT NOT NULL,
  previous_source_json TEXT NOT NULL,
  received_at_json TEXT NOT NULL,
  event_date TEXT NOT NULL,
  tlc_source_json TEXT NOT NULL,
  reference_documents_json TEXT NOT NULL
);
CREATE TABLE transform_events (
  id TEXT PRIMARY KEY,
  plant_id TEXT NOT NULL REFERENCES plants(id),
  output_tlc TEXT NOT NULL,
  output_qty REAL NOT NULL,
  output_uom TEXT NOT NULL,
  output_kind TEXT NOT NULL,
  output_product_json TEXT NOT NULL,
  scrap_qty REAL,
  scrap_uom TEXT,
  transformed_at_json TEXT NOT NULL,
  tlc_source_json TEXT NOT NULL,
  event_date TEXT NOT NULL,
  reference_documents_json TEXT NOT NULL
);
CREATE TABLE transform_inputs (
  transform_id TEXT NOT NULL REFERENCES transform_events(id),
  from_tlc TEXT NOT NULL,
  qty REAL NOT NULL,
  PRIMARY KEY (transform_id, from_tlc)
);
CREATE TABLE shipping_events (
  id TEXT PRIMARY KEY,
  plant_id TEXT NOT NULL REFERENCES plants(id),
  tlc TEXT NOT NULL,
  qty REAL NOT NULL,
  uom TEXT NOT NULL,
  product_json TEXT NOT NULL,
  subsequent_recipient_json TEXT NOT NULL,
  shipped_from_json TEXT NOT NULL,
  event_date TEXT NOT NULL,
  tlc_source_json TEXT NOT NULL,
  reference_documents_json TEXT NOT NULL
);
CREATE TABLE recalls (
  id TEXT PRIMARY KEY,
  plant_id TEXT NOT NULL REFERENCES plants(id),
  suspect_tlc TEXT NOT NULL,
  locked_at TEXT NOT NULL,
  export_json TEXT NOT NULL
);
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  recall_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
