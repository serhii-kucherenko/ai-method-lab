export type CommitmentLike = {
  id: string;
  rateUsd: number;
  termMonths: number;
  lockStart: string;
  lockEnd: string;
  family?: string;
};

export type UsageLike = {
  windowStart: string;
  windowEnd: string;
  eligibleSpendUsd: number;
  family?: string;
};

export type ScoreWindow = {
  start: string;
  end: string;
};

export type ScoreInput = {
  commitments: CommitmentLike[];
  usage: UsageLike[];
  window: ScoreWindow;
};

export type ScoreOutput = {
  coveragePct: number;
  coveredUsd: number;
  unusedCommitUsd: number;
  onDemandSpillUsd: number;
  gapUsd: number;
  rationale: string;
};

export type GapKind = "unused_commit" | "ondemand_spill";
