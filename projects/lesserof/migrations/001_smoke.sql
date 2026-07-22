-- smoke schema: org + claim lines
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE tokens (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id)
);

CREATE TABLE orgs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id)
);

CREATE TABLE org_members (
  org_id TEXT NOT NULL REFERENCES orgs(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL,
  PRIMARY KEY (org_id, user_id)
);

CREATE TABLE claim_lines (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  claim_type TEXT NOT NULL,
  duties_paid REAL NOT NULL,
  substitute_basis REAL NOT NULL,
  apply_usmca_lesser_of INTEGER NOT NULL DEFAULT 0,
  usmca_partner_duty REAL,
  basket_other_ineligible INTEGER NOT NULL DEFAULT 0,
  force_lesser_of INTEGER NOT NULL DEFAULT 0,
  skip_lesser_of INTEGER NOT NULL DEFAULT 0,
  relabel_from_substitution INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
