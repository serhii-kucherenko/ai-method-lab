import { randomUUID } from "node:crypto";
import type { CoverageDb } from "./db";
import { DEMO_ORG_ID } from "./ids";

export type CloudAccountRow = {
  id: string;
  org_id: string;
  provider: string;
  account_key: string;
  display_name: string;
  created_at: string;
};

export type CommitmentRow = {
  id: string;
  org_id: string;
  cloud_account_id: string;
  name: string;
  instrument_type: string;
  provider: string;
  term_months: number;
  rate_usd: number;
  lock_start: string;
  lock_end: string;
  family: string | null;
  tags: string;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export function createAccount(
  db: CoverageDb,
  input: {
    provider: string;
    accountKey: string;
    displayName: string;
    orgId?: string;
  },
): CloudAccountRow {
  const id = randomUUID();
  const orgId = input.orgId ?? DEMO_ORG_ID;
  db.prepare(
    `INSERT INTO cloud_accounts (id, org_id, provider, account_key, display_name)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(id, orgId, input.provider, input.accountKey, input.displayName);
  return db
    .prepare("SELECT * FROM cloud_accounts WHERE id = ?")
    .get(id) as CloudAccountRow;
}

export function listAccounts(db: CoverageDb, orgId = DEMO_ORG_ID): CloudAccountRow[] {
  return db
    .prepare(
      "SELECT * FROM cloud_accounts WHERE org_id = ? ORDER BY created_at ASC",
    )
    .all(orgId) as CloudAccountRow[];
}

export function createCommitment(
  db: CoverageDb,
  input: {
    cloudAccountId: string;
    name: string;
    instrumentType: string;
    provider: string;
    termMonths: number;
    rateUsd: number;
    lockStart: string;
    lockEnd: string;
    family?: string;
    tags?: string[];
    orgId?: string;
  },
): CommitmentRow {
  const id = randomUUID();
  const orgId = input.orgId ?? DEMO_ORG_ID;
  db.prepare(
    `INSERT INTO commitments (
      id, org_id, cloud_account_id, name, instrument_type, provider,
      term_months, rate_usd, lock_start, lock_end, family, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    orgId,
    input.cloudAccountId,
    input.name,
    input.instrumentType,
    input.provider,
    input.termMonths,
    input.rateUsd,
    input.lockStart,
    input.lockEnd,
    input.family ?? null,
    JSON.stringify(input.tags ?? []),
  );
  return db
    .prepare("SELECT * FROM commitments WHERE id = ?")
    .get(id) as CommitmentRow;
}

export function listCommitments(
  db: CoverageDb,
  opts: {
    orgId?: string;
    search?: string;
    includeArchived?: boolean;
  } = {},
): CommitmentRow[] {
  const orgId = opts.orgId ?? DEMO_ORG_ID;
  let sql = `SELECT c.* FROM commitments c
    LEFT JOIN cloud_accounts a ON a.id = c.cloud_account_id
    WHERE c.org_id = ?`;
  const params: unknown[] = [orgId];
  if (!opts.includeArchived) {
    sql += " AND c.archived_at IS NULL";
  }
  if (opts.search?.trim()) {
    const q = `%${opts.search.trim().toLowerCase()}%`;
    sql += ` AND (
      lower(c.name) LIKE ? OR lower(c.tags) LIKE ? OR lower(c.provider) LIKE ?
      OR lower(a.provider) LIKE ? OR lower(c.instrument_type) LIKE ?
    )`;
    params.push(q, q, q, q, q);
  }
  sql += " ORDER BY c.created_at DESC";
  return db.prepare(sql).all(...params) as CommitmentRow[];
}

export function getCommitment(
  db: CoverageDb,
  id: string,
): CommitmentRow | undefined {
  return db
    .prepare("SELECT * FROM commitments WHERE id = ?")
    .get(id) as CommitmentRow | undefined;
}

export function updateCommitment(
  db: CoverageDb,
  id: string,
  patch: {
    rateUsd?: number;
    lockStart?: string;
    lockEnd?: string;
    name?: string;
    archive?: boolean;
  },
): CommitmentRow | undefined {
  const existing = getCommitment(db, id);
  if (!existing) return undefined;

  const rateUsd = patch.rateUsd ?? existing.rate_usd;
  const lockStart = patch.lockStart ?? existing.lock_start;
  const lockEnd = patch.lockEnd ?? existing.lock_end;
  const name = patch.name ?? existing.name;
  let archivedAt = existing.archived_at;
  if (patch.archive === true) {
    archivedAt = new Date().toISOString();
  } else if (patch.archive === false) {
    archivedAt = null;
  }

  db.prepare(
    `UPDATE commitments SET
      rate_usd = ?, lock_start = ?, lock_end = ?, name = ?,
      archived_at = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).run(rateUsd, lockStart, lockEnd, name, archivedAt, id);

  return getCommitment(db, id);
}

export function seedMultiCloud(db: CoverageDb): {
  aws: CloudAccountRow;
  gcp: CloudAccountRow;
} {
  const existing = listAccounts(db);
  let aws = existing.find((a) => a.provider === "aws");
  let gcp = existing.find((a) => a.provider === "gcp");
  if (!aws) {
    aws = createAccount(db, {
      provider: "aws",
      accountKey: "aws-111",
      displayName: "AWS Production",
    });
  }
  if (!gcp) {
    gcp = createAccount(db, {
      provider: "gcp",
      accountKey: "gcp-222",
      displayName: "GCP Analytics",
    });
  }
  return { aws, gcp };
}
