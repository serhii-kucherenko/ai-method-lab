import type { CoverageDb } from "@/lib/db";
import { DEMO_ORG_ID } from "@/lib/ids";

export type ScoreboardRow = {
  cloudAccountId: string;
  displayName: string;
  provider: string;
  accountKey: string;
  gapUsd: number;
  unusedCommitUsd: number;
  ondemandSpillUsd: number;
  coveragePct: number | null;
};

/**
 * Account/gap leaderboard rollup over gap_findings + latest coverage snapshot.
 */
export function listScoreboard(
  db: CoverageDb,
  opts: {
    orgId?: string;
    provider?: string;
    cloudAccountId?: string;
  } = {},
): ScoreboardRow[] {
  const orgId = opts.orgId ?? DEMO_ORG_ID;
  const accounts = db
    .prepare(
      `SELECT id, provider, account_key, display_name
       FROM cloud_accounts
       WHERE org_id = ?
       ORDER BY display_name ASC`,
    )
    .all(orgId) as Array<{
    id: string;
    provider: string;
    account_key: string;
    display_name: string;
  }>;

  const gapAgg = db
    .prepare(
      `SELECT cloud_account_id,
              COALESCE(SUM(CASE WHEN kind = 'unused_commit' THEN gap_usd ELSE 0 END), 0) AS unused_commit_usd,
              COALESCE(SUM(CASE WHEN kind = 'ondemand_spill' THEN gap_usd ELSE 0 END), 0) AS ondemand_spill_usd,
              COALESCE(SUM(gap_usd), 0) AS gap_usd
       FROM gap_findings
       WHERE org_id = ?
       GROUP BY cloud_account_id`,
    )
    .all(orgId) as Array<{
    cloud_account_id: string;
    unused_commit_usd: number;
    ondemand_spill_usd: number;
    gap_usd: number;
  }>;

  const gapByAccount = new Map(
    gapAgg.map((g) => [g.cloud_account_id, g] as const),
  );

  const latestSnap = db
    .prepare(
      `SELECT cloud_account_id, coverage_pct
       FROM coverage_snapshots
       WHERE org_id = ?
       ORDER BY computed_at DESC`,
    )
    .all(orgId) as Array<{ cloud_account_id: string; coverage_pct: number }>;

  const coverageByAccount = new Map<string, number>();
  for (const snap of latestSnap) {
    if (!coverageByAccount.has(snap.cloud_account_id)) {
      coverageByAccount.set(snap.cloud_account_id, snap.coverage_pct);
    }
  }

  const rows: ScoreboardRow[] = accounts.map((account) => {
    const gaps = gapByAccount.get(account.id);
    return {
      cloudAccountId: account.id,
      displayName: account.display_name,
      provider: account.provider,
      accountKey: account.account_key,
      gapUsd: gaps?.gap_usd ?? 0,
      unusedCommitUsd: gaps?.unused_commit_usd ?? 0,
      ondemandSpillUsd: gaps?.ondemand_spill_usd ?? 0,
      coveragePct: coverageByAccount.get(account.id) ?? null,
    };
  });

  return rows
    .filter((row) => {
      if (opts.provider && row.provider !== opts.provider) return false;
      if (opts.cloudAccountId && row.cloudAccountId !== opts.cloudAccountId) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.gapUsd - a.gapUsd);
}
