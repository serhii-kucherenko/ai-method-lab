export type ProbeProfile =
  | "cooperative_multi_domain_probe"
  | "single_domain_melting_baseline";

export type ScoreMode = ProbeProfile;

export type ProbeBias =
  | "cooperative"
  | "balanced"
  | "melting_first"
  | "specificity_first";

export type DomainLayout =
  | "dual_strand"
  | "capture_detect"
  | "hetero_multivalent"
  | "tandem"
  | "custom";

export type ProbeKind =
  | "cooperative_split"
  | "bridge_assembly"
  | "avidity_pair"
  | "linear_control"
  | "custom";

export type TargetKind =
  | "wild_type"
  | "snp_neighbor"
  | "incomplete"
  | "noisy_physio"
  | "custom";

/**
 * Soft-simulation inputs for cooperative multi-domain DNA probes
 * vs single-domain melting baselines.
 * Method-lab scoring only — not wet-lab validated IVD, not whole-blood
 * device deployment, not authors’ probe system brand.
 */
export type ProbeInput = {
  /** Soft-sim cooperativity / avidity strength across domains (0–1). */
  cooperativity: number;
  /** Soft-sim multi-domain coverage of the recognition site (0–1). */
  domainCoverage: number;
  /** Soft-sim bridge completeness when the target joins domains (0–1). */
  bridgeCompleteness: number;
  /** Soft-sim specificity delta vs near-neighbor (0–1). */
  specificityDelta: number;
  /** Classic melting sharpness — path B fuel (0–1). */
  meltingSharpness: number;
  /** Physiological / assay noise hardness (0–1). */
  physioNoise: number;
  /** Incomplete-target / missing-bridge risk (0–1). */
  incompleteRisk: number;
  /** Risk of claiming wet-lab IVD / whole-blood device (0–1). */
  overclaimRisk: number;
  probeBias: ProbeBias;
  profile: ProbeProfile;
};

export type ProbeQuality = {
  mode: ScoreMode;
  cooperativityScore: number;
  coverageScore: number;
  bridgeScore: number;
  specificityScore: number;
  meltingScore: number;
  confidence: number;
  cooperativeContribution: number;
  meltingContribution: number;
  overall: number;
};

export type PackLockState = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackLockState {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: ProbeBias,
  lane: Exclude<ProbeBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function noiseLoad(physioNoise: number, cooperativity: number): number {
  return clamp(physioNoise * (1.25 - cooperativity * 0.5), 0, 1.5);
}
