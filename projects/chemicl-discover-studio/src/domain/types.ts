export type DiscoverProfile =
  | "multimodal_chemicl"
  | "text_only_icl_baseline";

export type ScoreMode = DiscoverProfile;

export type DiscoverBias =
  | "multimodal_first"
  | "balanced"
  | "exemplar_first"
  | "text_first";

export type ModalityKind =
  | "structure_graph"
  | "spectrum"
  | "reaction_scheme"
  | "text_smiles"
  | "hybrid_multimodal"
  | "custom";

/**
 * Soft-simulation inputs for multimodal ChemICL vs
 * text-only ICL baselines in chemistry discovery.
 * Method-lab scoring only — not wet-lab validated discovery,
 * not live ELN write-back, not the authors' system.
 */
export type DiscoverInput = {
  /** How well multimodal exemplars cover chemistry context (0–1). */
  multimodalCoverage: number;
  /** Fidelity of multimodal channels (structure/spectrum/scheme) (0–1). */
  modalityFidelity: number;
  /** Exemplar set alignment to the discover task (0–1). */
  exemplarAlignment: number;
  /** In-context learning soft-sim precision (0–1). */
  iclPrecision: number;
  /** Text-only ICL breadth — path B fuel (0–1). */
  textOnlyBreadth: number;
  /** Optimism that text-only ICL “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of the chemistry discovery task (0–1). */
  chemistryHardness: number;
  /** Risk of claiming wet-lab validated / ELN write-back (0–1). */
  overclaimRisk: number;
  discoverBias: DiscoverBias;
  profile: DiscoverProfile;
};

export type DiscoverQuality = {
  mode: ScoreMode;
  coverageScore: number;
  modalityScore: number;
  exemplarScore: number;
  precisionIntegrity: number;
  baselineScore: number;
  confidence: number;
  multimodalContribution: number;
  textContribution: number;
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
  bias: DiscoverBias,
  lane: Exclude<DiscoverBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function chemistryLoad(
  chemistryHardness: number,
  iclPrecision: number,
): number {
  return clamp(chemistryHardness * (1.25 - iclPrecision * 0.5), 0, 1.5);
}
