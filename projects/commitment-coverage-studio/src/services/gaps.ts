import { randomUUID } from "node:crypto";
import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

export type GapFindingRow = {
  id: string;
  org_id: string;
  coverage_snapshot_id: string;
  cloud_account_id: string;
  kind: "unused_commit" | "ondemand_spill";
  gap_usd: number;
  window_start: string;
  window_end: string;
  created_at: string;
};

/**
 * GapMaterializer — derive unused_commit and ondemand_spill from scorer A.
 */
export function materializeGaps(
  db: CoverageDb,
  input: {
    orgId?: string;
    cloudAccountId: string;
    snapshotId: string;
    windowStart: string;
    windowEnd: string;
    unusedCommitUsd: number;
    onDemandSpillUsd: number;
  },
): GapFindingRow[] {
  const orgId = input.orgId ?? DEMO_ORG_ID;
  const rows: GapFindingRow[] = [];
  const insert = db.prepare(
    `INSERT INTO gap_findings (
      id, org_id, coverage_snapshot_id, cloud_account_id, kind,
      gap_usd, window_start, window_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  if (input.unusedCommitUsd > 0) {
    const id = randomUUID();
    insert.run(
      id,
      orgId,
      input.snapshotId,
      input.cloudAccountId,
      "unused_commit",
      input.unusedCommitUsd,
      input.windowStart,
      input.windowEnd,
    );
    rows.push(
      db.prepare("SELECT * FROM gap_findings WHERE id = ?").get(id) as GapFindingRow,
    );
  }
  if (input.onDemandSpillUsd > 0) {
    const id = randomUUID();
    insert.run(
      id,
      orgId,
      input.snapshotId,
      input.cloudAccountId,
      "ondemand_spill",
      input.onDemandSpillUsd,
      input.windowStart,
      input.windowEnd,
    );
    rows.push(
      db.prepare("SELECT * FROM gap_findings WHERE id = ?").get(id) as GapFindingRow,
    );
  }
  return rows;
}

export function listGaps(
  db: CoverageDb,
  opts: {
    orgId?: string;
    cloudAccountId?: string;
    windowStart?: string;
    windowEnd?: string;
  } = {},
): GapFindingRow[] {
  const orgId = opts.orgId ?? DEMO_ORG_ID;
  let sql = "SELECT * FROM gap_findings WHERE org_id = ?";
  const params: unknown[] = [orgId];
  if (opts.cloudAccountId) {
    sql += " AND cloud_account_id = ?";
    params.push(opts.cloudAccountId);
  }
  if (opts.windowStart) {
    sql += " AND window_start = ?";
    params.push(opts.windowStart);
  }
  if (opts.windowEnd) {
    sql += " AND window_end = ?";
    params.push(opts.windowEnd);
  }
  sql += " ORDER BY created_at DESC";
  return db.prepare(sql).all(...params) as GapFindingRow[];
}
