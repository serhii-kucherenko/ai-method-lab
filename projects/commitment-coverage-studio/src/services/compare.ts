import { randomUUID } from "node:crypto";
import {
  scoreCommitMatched,
  scoreOnDemandBlind,
} from "@/domain/scoring";
import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";
import { buildScoreInputForAccount } from "@/services/coverage";

export type CompareResultRow = {
  id: string;
  org_id: string;
  mode: string;
  path_a_json: string;
  path_b_json: string;
  winner: string;
  delta_usd: number;
  window_start: string;
  window_end: string;
  cloud_account_id: string | null;
  created_at: string;
};

/**
 * CompareService — A+B on identical ScoreInput; mode commit_vs_ondemand.
 */
export function runCompare(
  db: CoverageDb,
  input: {
    cloudAccountId: string;
    windowStart: string;
    windowEnd: string;
    mode: string;
    orgId?: string;
  },
):
  | CompareResultRow
  | { error: "no_usage" }
  | { error: "unknown_mode" } {
  if (input.mode !== "commit_vs_ondemand") {
    return { error: "unknown_mode" };
  }
  const orgId = input.orgId ?? DEMO_ORG_ID;
  const scoreInput = buildScoreInputForAccount(
    db,
    input.cloudAccountId,
    input.windowStart,
    input.windowEnd,
    orgId,
  );
  if ("error" in scoreInput) return scoreInput;

  const pathA = scoreCommitMatched(scoreInput);
  const pathB = scoreOnDemandBlind(scoreInput);
  const deltaUsd = Math.round((pathA.gapUsd - pathB.gapUsd) * 100) / 100;
  const winner =
    pathA.gapUsd < pathB.gapUsd
      ? "pathA"
      : pathB.gapUsd < pathA.gapUsd
        ? "pathB"
        : "tie";

  const id = randomUUID();
  db.prepare(
    `INSERT INTO compare_results (
      id, org_id, mode, path_a_json, path_b_json, winner, delta_usd,
      window_start, window_end, cloud_account_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    orgId,
    input.mode,
    JSON.stringify(pathA),
    JSON.stringify(pathB),
    winner,
    deltaUsd,
    input.windowStart,
    input.windowEnd,
    input.cloudAccountId,
  );

  return db
    .prepare("SELECT * FROM compare_results WHERE id = ?")
    .get(id) as CompareResultRow;
}

export function getCompare(
  db: CoverageDb,
  id: string,
): CompareResultRow | undefined {
  return db
    .prepare("SELECT * FROM compare_results WHERE id = ?")
    .get(id) as CompareResultRow | undefined;
}
