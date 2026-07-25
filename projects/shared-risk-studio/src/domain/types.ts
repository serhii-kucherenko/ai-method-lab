export type RiskProfile =
  | "shared_multi_disease"
  | "disease_specific_baseline";

export type ScoreMode = RiskProfile;

export type QueryBias =
  | "shared_first"
  | "balanced"
  | "modality_first"
  | "disease_first";

export type ModalityKind =
  | "ehr"
  | "imaging"
  | "omics"
  | "wearable"
  | "mixed";

/**
 * Soft-simulation inputs for shared multi-disease health representations
 * vs disease-specific baselines. Method-lab scoring only — not CDS cleared,
 * not live EHR, not the authors' system / not RisQ brand.
 */
export type RiskInput = {
  /** Cohort pack coverage (0–1). */
  cohortCoverage: number;
  /** Modality-schema fidelity (0–1). */
  modalityFidelity: number;
  /** Risk-query clarity (0–1). */
  queryClarity: number;
  /** Run stability across cohorts (0–1). */
  runStability: number;
  /** Disease-specific baseline pass-rate proxy — path B fuel (0–1). */
  diseaseBaselineRate: number;
  /** Optimism that disease-specific models “just work” (0–1). */
  skipOptimism: number;
  /** Multi-disease hardness (0–1, higher = harder for A). */
  diseaseHardness: number;
  /** Risk of claiming CDS / live EHR clearance (0–1). */
  overclaimRisk: number;
  queryBias: QueryBias;
  profile: RiskProfile;
};

export type RiskQuality = {
  mode: ScoreMode;
  sharedCoverage: number;
  modalityScore: number;
  queryOptScore: number;
  packIntegrity: number;
  diseaseBaselineScore: number;
  confidence: number;
  sharedContribution: number;
  diseaseContribution: number;
  overall: number;
};

export type PackReadiness = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackReadiness {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: QueryBias,
  lane: Exclude<QueryBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function diseaseLoad(
  diseaseHardness: number,
  cohortCoverage: number,
): number {
  return clamp(diseaseHardness * (1.25 - cohortCoverage * 0.5), 0, 1.5);
}
