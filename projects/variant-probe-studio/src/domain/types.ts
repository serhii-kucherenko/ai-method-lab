export type ProbeProfile =
  | "interpretable_fm_probe"
  | "opaque_pathogenicity_baseline";

export type ScoreMode = ProbeProfile;

export type ProbeBias =
  | "probe_first"
  | "balanced"
  | "mechanism_first"
  | "opaque_first";

export type ProbeKind =
  | "embedding"
  | "attention"
  | "saliency"
  | "linear_probe"
  | "mixed";

/**
 * Soft-simulation inputs for interpretable genomic foundation-model probes
 * vs opaque pathogenicity baselines. Method-lab scoring only — not diagnostic
 * cleared, not live LIMS, not the authors' system.
 */
export type ProbeInput = {
  /** Panel pack coverage of variant classes (0–1). */
  panelCoverage: number;
  /** Probe-config fidelity to FM embedding axes (0–1). */
  probeFidelity: number;
  /** Mechanism-link clarity (0–1). */
  mechanismClarity: number;
  /** Run stability across panels (0–1). */
  runStability: number;
  /** Opaque pathogenicity baseline pass-rate proxy — path B fuel (0–1). */
  opaqueBaselineRate: number;
  /** Optimism that opaque scores “just work” (0–1). */
  skipOptimism: number;
  /** Mechanism / variant hardness (0–1, higher = harder for A). */
  mechanismHardness: number;
  /** Risk of claiming diagnostic / live LIMS clearance (0–1). */
  overclaimRisk: number;
  probeBias: ProbeBias;
  profile: ProbeProfile;
};

export type ProbeQuality = {
  mode: ScoreMode;
  probeCoverage: number;
  probeScore: number;
  mechanismOptScore: number;
  packIntegrity: number;
  opaqueBaselineScore: number;
  confidence: number;
  probeContribution: number;
  opaqueContribution: number;
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
  bias: ProbeBias,
  lane: Exclude<ProbeBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function mechanismLoad(
  mechanismHardness: number,
  panelCoverage: number,
): number {
  return clamp(mechanismHardness * (1.25 - panelCoverage * 0.5), 0, 1.5);
}
