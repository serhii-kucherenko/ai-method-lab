import { randomUUID } from "node:crypto";
import { scoreCommitMatched } from "@/domain/scoring";
import type { ScoreInput } from "@/domain/types";
import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";
import { materializeGaps } from "@/services/gaps";

export type CoverageSnapshotRow = {
  id: string;
  org_id: string;
  cloud_account_id: string;
  window_start: string;
  window_end: string;
  coverage_pct: number;
  covered_usd: number;
  unused_commit_usd: number;
  ondemand_spill_usd: number;
  gap_usd: number;
  computed_at: string;
};

export function buildScoreInputForAccount(
  db: CoverageDb,
  cloudAccountId: string,
  windowStart: string,
  windowEnd: string,
  orgId = DEMO_ORG_ID,
): ScoreInput | { error: "no_usage" } {
  const commitments = db
    .prepare(
      `SELECT id, rate_usd, term_months, lock_start, lock_end, family
       FROM commitments
       WHERE org_id = ? AND cloud_account_id = ? AND archived_at IS NULL`,
    )
    .all(orgId, cloudAccountId) as Array<{
    id: string;
    rate_usd: number;
    term_months: number;
    lock_start: string;
    lock_end: string;
    family: string | null;
  }>;

  const usage = db
    .prepare(
      `SELECT window_start, window_end, eligible_spend_usd, family
       FROM usage_slices
       WHERE org_id = ? AND cloud_account_id = ?
         AND window_start < ? AND window_end > ?`,
    )
    .all(orgId, cloudAccountId, windowEnd, windowStart) as Array<{
    window_start: string;
    window_end: string;
    eligible_spend_usd: number;
    family: string | null;
  }>;

  if (usage.length === 0) {
    return { error: "no_usage" };
  }

  return {
    window: { start: windowStart, end: windowEnd },
    commitments: commitments.map((c) => ({
      id: c.id,
      rateUsd: c.rate_usd,
      termMonths: c.term_months,
      lockStart: c.lock_start,
      lockEnd: c.lock_end,
      family: c.family ?? undefined,
    })),
    usage: usage.map((u) => ({
      windowStart: u.window_start,
      windowEnd: u.window_end,
      eligibleSpendUsd: u.eligible_spend_usd,
      family: u.family ?? undefined,
    })),
  };
}

/**
 * CoverageEngine — scoreCommitMatched (A) only for persisted snapshots.
 */
export function computeCoverage(
  db: CoverageDb,
  input: {
    cloudAccountId: string;
    windowStart: string;
    windowEnd: string;
    orgId?: string;
  },
): CoverageSnapshotRow | { error: "no_usage" } {
  const orgId = input.orgId ?? DEMO_ORG_ID;
  const scoreInput = buildScoreInputForAccount(
    db,
    input.cloudAccountId,
    input.windowStart,
    input.windowEnd,
    orgId,
  );
  if ("error" in scoreInput) return scoreInput;

  const scored = scoreCommitMatched(scoreInput);
  const id = randomUUID();
  db.prepare(
    `INSERT INTO coverage_snapshots (
      id, org_id, cloud_account_id, window_start, window_end,
      coverage_pct, covered_usd, unused_commit_usd, ondemand_spill_usd, gap_usd
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    orgId,
    input.cloudAccountId,
    input.windowStart,
    input.windowEnd,
    scored.coveragePct,
    scored.coveredUsd,
    scored.unusedCommitUsd,
    scored.onDemandSpillUsd,
    scored.gapUsd,
  );

  materializeGaps(db, {
    orgId,
    cloudAccountId: input.cloudAccountId,
    snapshotId: id,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    unusedCommitUsd: scored.unusedCommitUsd,
    onDemandSpillUsd: scored.onDemandSpillUsd,
  });

  return db
    .prepare("SELECT * FROM coverage_snapshots WHERE id = ?")
    .get(id) as CoverageSnapshotRow;
}

export function listCoverageSnapshots(
  db: CoverageDb,
  orgId = DEMO_ORG_ID,
): CoverageSnapshotRow[] {
  return db
    .prepare(
      "SELECT * FROM coverage_snapshots WHERE org_id = ? ORDER BY computed_at DESC",
    )
    .all(orgId) as CoverageSnapshotRow[];
}
