export type MhcDesignProfile =
  | "hybrid_quantum_classical_de_novo"
  | "classical_generative_baseline";

export type ScoreMode = MhcDesignProfile;

export type DesignBias =
  | "hybrid_first"
  | "balanced"
  | "allele_first"
  | "classical_first";

export type AlleleKind =
  | "hla_class_i"
  | "hla_class_ii"
  | "mixed_panel"
  | "custom";

/**
 * Soft-simulation inputs for hybrid quantum–classical de novo
 * MHC-binding peptide design vs classical generative baselines.
 * Method-lab scoring only — not wet-lab validated binders,
 * not live ELN write-back, not FDA clearance,
 * not the authors' system.
 */
export type MhcDesignInput = {
  /** Soft-sim peptide-space coverage for limited-data targets (0–1). */
  peptideCoverage: number;
  /** Soft-sim MHC allele encoding fidelity (0–1). */
  alleleFidelity: number;
  /** Soft-sim hybrid quantum–classical prior clarity (0–1). */
  hybridClarity: number;
  /** Soft-sim peptide pack completeness (0–1). */
  packCompleteness: number;
  /** Classical generative adherence strength — path B fuel (0–1). */
  classicalAdherence: number;
  /** Optimism that classical generative priors are enough (0–1). */
  generativeOptimism: number;
  /** Hardness of the limited-training-data design case (0–1). */
  designHardness: number;
  /** Risk of claiming wet-lab / ELN write-back / FDA (0–1). */
  overclaimRisk: number;
  designBias: DesignBias;
  profile: MhcDesignProfile;
};

export type MhcDesignQuality = {
  mode: ScoreMode;
  peptideScore: number;
  alleleScore: number;
  hybridScore: number;
  completenessScore: number;
  classicalScore: number;
  confidence: number;
  hybridContribution: number;
  classicalContribution: number;
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
  bias: DesignBias,
  lane: Exclude<DesignBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function designLoad(
  designHardness: number,
  hybridClarity: number,
): number {
  return clamp(designHardness * (1.25 - hybridClarity * 0.5), 0, 1.5);
}
