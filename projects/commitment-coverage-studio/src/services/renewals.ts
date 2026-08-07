import { randomUUID } from "node:crypto";
import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

export type RecommendedAction = "buy" | "reduce" | "hold";
export type RenewalStatus = "open" | "acted" | "dismissed";

export type RenewalCaseRow = {
  id: string;
  org_id: string;
  commitment_id: string;
  cloud_account_id: string;
  renew_by: string;
  gap_usd: number;
  recommended_action: RecommendedAction;
  status: RenewalStatus;
  linked_gap_ids: string;
  created_at: string;
  updated_at: string;
};

export type RenewalCaseApi = {
  id: string;
  commitmentId: string;
  commitmentName: string;
  cloudAccountId: string;
  provider: string;
  renewBy: string;
  gapUsd: number;
  recommendedAction: RecommendedAction;
  status: RenewalStatus;
  linkedGapIds: string[];
  createdAt: string;
  updatedAt: string;
};

type CommitmentPackRow = {
  id: string;
  name: string;
  cloud_account_id: string;
  lock_end: string;
  provider: string;
};

type GapAgg = {
  unused: number;
  spill: number;
  ids: string[];
};

const NEAR_ZERO_USD = 1;

/** D-01: spill-dominant → buy; unused-dominant → reduce; near-zero/balanced → hold. */
export function recommendAction(
  unusedUsd: number,
  spillUsd: number,
): RecommendedAction {
  const unused = Math.max(0, unusedUsd);
  const spill = Math.max(0, spillUsd);
  const total = unused + spill;
  if (total < NEAR_ZERO_USD) return "hold";
  if (spill > unused) return "buy";
  if (unused > spill) return "reduce";
  return "hold";
}

function gapAggForAccount(db: CoverageDb, orgId: string, cloudAccountId: string): GapAgg {
  const gaps = db
    .prepare(
      `SELECT id, kind, gap_usd FROM gap_findings
       WHERE org_id = ? AND cloud_account_id = ?`,
    )
    .all(orgId, cloudAccountId) as {
    id: string;
    kind: string;
    gap_usd: number;
  }[];
  const agg: GapAgg = { unused: 0, spill: 0, ids: [] };
  for (const g of gaps) {
    agg.ids.push(g.id);
    if (g.kind === "unused_commit") agg.unused += g.gap_usd;
    else if (g.kind === "ondemand_spill") agg.spill += g.gap_usd;
  }
  return agg;
}

function toApi(
  row: RenewalCaseRow,
  meta: { name: string; provider: string },
): RenewalCaseApi {
  let linkedGapIds: string[] = [];
  try {
    linkedGapIds = JSON.parse(row.linked_gap_ids) as string[];
  } catch {
    linkedGapIds = [];
  }
  return {
    id: row.id,
    commitmentId: row.commitment_id,
    commitmentName: meta.name,
    cloudAccountId: row.cloud_account_id,
    provider: meta.provider,
    renewBy: row.renew_by,
    gapUsd: row.gap_usd,
    recommendedAction: row.recommended_action,
    status: row.status,
    linkedGapIds,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * RenewalPacker — build RenewalCase rows from commitments.lock_end + linked gaps (D-01, D-02).
 * Replaces open cases for the org (acted/dismissed kept).
 */
export function packRenewalCases(
  db: CoverageDb,
  opts: { orgId?: string; cloudAccountId?: string } = {},
): RenewalCaseApi[] {
  const orgId = opts.orgId ?? DEMO_ORG_ID;
  let sql = `SELECT id, name, cloud_account_id, lock_end, provider
             FROM commitments
             WHERE org_id = ? AND archived_at IS NULL`;
  const params: unknown[] = [orgId];
  if (opts.cloudAccountId) {
    sql += " AND cloud_account_id = ?";
    params.push(opts.cloudAccountId);
  }
  sql += " ORDER BY lock_end ASC";
  const commitments = db.prepare(sql).all(...params) as CommitmentPackRow[];

  const deleteOpen = opts.cloudAccountId
    ? db.prepare(
        `DELETE FROM renewal_cases WHERE org_id = ? AND status = 'open' AND cloud_account_id = ?`,
      )
    : db.prepare(
        `DELETE FROM renewal_cases WHERE org_id = ? AND status = 'open'`,
      );
  if (opts.cloudAccountId) deleteOpen.run(orgId, opts.cloudAccountId);
  else deleteOpen.run(orgId);

  const insert = db.prepare(
    `INSERT INTO renewal_cases (
      id, org_id, commitment_id, cloud_account_id, renew_by, gap_usd,
      recommended_action, status, linked_gap_ids
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?)`,
  );

  const built: RenewalCaseApi[] = [];
  for (const cm of commitments) {
    const agg = gapAggForAccount(db, orgId, cm.cloud_account_id);
    const recommended = recommendAction(agg.unused, agg.spill);
    const gapUsd = agg.unused + agg.spill;
    const id = randomUUID();
    insert.run(
      id,
      orgId,
      cm.id,
      cm.cloud_account_id,
      cm.lock_end,
      gapUsd,
      recommended,
      JSON.stringify(agg.ids),
    );
    const row = db
      .prepare("SELECT * FROM renewal_cases WHERE id = ?")
      .get(id) as RenewalCaseRow;
    built.push(toApi(row, { name: cm.name, provider: cm.provider }));
  }
  return built;
}

export function listRenewalCases(
  db: CoverageDb,
  opts: { orgId?: string; cloudAccountId?: string; status?: RenewalStatus } = {},
): RenewalCaseApi[] {
  const orgId = opts.orgId ?? DEMO_ORG_ID;
  let sql = `SELECT rc.*, c.name AS commitment_name, c.provider AS commitment_provider
             FROM renewal_cases rc
             JOIN commitments c ON c.id = rc.commitment_id
             WHERE rc.org_id = ?`;
  const params: unknown[] = [orgId];
  if (opts.cloudAccountId) {
    sql += " AND rc.cloud_account_id = ?";
    params.push(opts.cloudAccountId);
  }
  if (opts.status) {
    sql += " AND rc.status = ?";
    params.push(opts.status);
  }
  sql += " ORDER BY rc.renew_by ASC";
  const rows = db.prepare(sql).all(...params) as (RenewalCaseRow & {
    commitment_name: string;
    commitment_provider: string;
  })[];
  return rows.map((row) =>
    toApi(row, {
      name: row.commitment_name,
      provider: row.commitment_provider,
    }),
  );
}

export function getRenewalCase(
  db: CoverageDb,
  id: string,
  orgId = DEMO_ORG_ID,
): RenewalCaseApi | null {
  const row = db
    .prepare(
      `SELECT rc.*, c.name AS commitment_name, c.provider AS commitment_provider
       FROM renewal_cases rc
       JOIN commitments c ON c.id = rc.commitment_id
       WHERE rc.id = ? AND rc.org_id = ?`,
    )
    .get(id, orgId) as
    | (RenewalCaseRow & {
        commitment_name: string;
        commitment_provider: string;
      })
    | undefined;
  if (!row) return null;
  return toApi(row, {
    name: row.commitment_name,
    provider: row.commitment_provider,
  });
}

export function updateRenewalStatus(
  db: CoverageDb,
  id: string,
  status: "acted" | "dismissed",
  orgId = DEMO_ORG_ID,
): RenewalCaseApi | null {
  const existing = getRenewalCase(db, id, orgId);
  if (!existing) return null;
  if (existing.status !== "open") {
    return existing;
  }
  db.prepare(
    `UPDATE renewal_cases
     SET status = ?, updated_at = datetime('now')
     WHERE id = ? AND org_id = ? AND status = 'open'`,
  ).run(status, id, orgId);
  return getRenewalCase(db, id, orgId);
}
