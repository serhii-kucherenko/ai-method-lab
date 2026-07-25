export type QuantProfile = "channel" | "uniform";

export type ScoreMode = "channel_aware" | "uniform";

export type CpuClass = "workstation" | "laptop" | "mobile";

/**
 * Soft-simulation inputs for a channel-aware vs uniform quantization plan.
 * Not measured silicon — plan quality only.
 */
export type QuantInput = {
  /** How skewed activation saliency is across channels (0–1). */
  saliencySkew: number;
  /** Mean activation energy proxy from calibration (0–1). */
  activationEnergy: number;
  /** User fractional average-bit budget (2–16). */
  avgBitBudget: number;
  /** How much of the {2,3,4,8,16} palette is usable (0–1). */
  paletteSpan: number;
  /** How regularly channels cluster into bit-homogeneous blocks (0–1). */
  clusterRegularity: number;
  /** Compile-time layout / permutation merge affinity (0–1). */
  layoutMerge: number;
  /** Remaining memory headroom vs target envelope (0–1). */
  memoryHeadroom: number;
  /** Affinity of the plan to the chosen edge CPU class (0–1). */
  targetAffinity: number;
  profile: QuantProfile;
};

export type QuantQuality = {
  mode: ScoreMode;
  budgetFit: number;
  saliencyMatch: number;
  clusterScore: number;
  runtimeScore: number;
  memoryScore: number;
  confidence: number;
  saliencyContribution: number;
  budgetContribution: number;
  layoutContribution: number;
  overall: number;
};

export type PlanReadiness = "hold" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function budgetNorm(avgBitBudget: number): number {
  return clamp((avgBitBudget - 2) / 14, 0, 1);
}

export function readinessFromQuality(overall: number): PlanReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold";
}
