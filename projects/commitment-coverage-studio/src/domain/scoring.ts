import type { ScoreInput, ScoreOutput } from "./types";

function toMs(iso: string): number {
  return Date.parse(iso);
}

function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return toMs(aStart) < toMs(bEnd) && toMs(bStart) < toMs(aEnd);
}

function overlapMs(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): number {
  const start = Math.max(toMs(aStart), toMs(bStart));
  const end = Math.min(toMs(aEnd), toMs(bEnd));
  return Math.max(0, end - start);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function familyKey(family?: string): string {
  return family?.trim() ? family.trim() : "__all__";
}

/**
 * Scorer A — commit-matched coverage.
 * Match commitments to usage by overlapping lock/window and optional family.
 */
export function scoreCommitMatched(input: ScoreInput): ScoreOutput {
  const { window } = input;
  const buckets = new Map<
    string,
    { obligationUsd: number; eligibleUsd: number }
  >();

  for (const c of input.commitments) {
    if (!overlaps(c.lockStart, c.lockEnd, window.start, window.end)) continue;
    const lockMs = Math.max(1, toMs(c.lockEnd) - toMs(c.lockStart));
    const oMs = overlapMs(c.lockStart, c.lockEnd, window.start, window.end);
    const obligation = (c.rateUsd * oMs) / lockMs;
    const key = familyKey(c.family);
    const row = buckets.get(key) ?? { obligationUsd: 0, eligibleUsd: 0 };
    row.obligationUsd += obligation;
    buckets.set(key, row);
  }

  for (const u of input.usage) {
    if (!overlaps(u.windowStart, u.windowEnd, window.start, window.end)) {
      continue;
    }
    const key = familyKey(u.family);
    const row = buckets.get(key) ?? { obligationUsd: 0, eligibleUsd: 0 };
    row.eligibleUsd += u.eligibleSpendUsd;
    buckets.set(key, row);
  }

  let coveredUsd = 0;
  let unusedCommitUsd = 0;
  let onDemandSpillUsd = 0;
  let eligibleTotal = 0;

  for (const row of buckets.values()) {
    const covered = Math.min(row.obligationUsd, row.eligibleUsd);
    coveredUsd += covered;
    unusedCommitUsd += row.obligationUsd - covered;
    onDemandSpillUsd += row.eligibleUsd - covered;
    eligibleTotal += row.eligibleUsd;
  }

  coveredUsd = round2(coveredUsd);
  unusedCommitUsd = round2(unusedCommitUsd);
  onDemandSpillUsd = round2(onDemandSpillUsd);
  const gapUsd = round2(unusedCommitUsd + onDemandSpillUsd);
  const coveragePct =
    eligibleTotal <= 0 ? 0 : round2((coveredUsd / eligibleTotal) * 100);

  return {
    coveragePct,
    coveredUsd,
    unusedCommitUsd,
    onDemandSpillUsd,
    gapUsd,
    rationale: `Commit-matched covered=${coveredUsd} unused=${unusedCommitUsd} spill=${onDemandSpillUsd}`,
  };
}

/**
 * Scorer B — on-demand blind. Ignores commitments entirely.
 * Never aliases scorer A.
 */
export function scoreOnDemandBlind(input: ScoreInput): ScoreOutput {
  let eligible = 0;
  for (const u of input.usage) {
    if (!overlaps(u.windowStart, u.windowEnd, input.window.start, input.window.end)) {
      continue;
    }
    eligible += u.eligibleSpendUsd;
  }
  const onDemandSpillUsd = round2(eligible);
  return {
    coveragePct: 0,
    coveredUsd: 0,
    unusedCommitUsd: 0,
    onDemandSpillUsd,
    gapUsd: onDemandSpillUsd,
    rationale: `On-demand-blind ignores commits; spill=${onDemandSpillUsd}`,
  };
}
