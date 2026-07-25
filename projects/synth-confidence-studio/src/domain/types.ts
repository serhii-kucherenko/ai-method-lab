export type SynthProfile =
  | "confidence_gated_ai_retrosynthesis"
  | "naive_ai_route_baseline";

export type ScoreMode = SynthProfile;

export type RouteBias =
  | "confidence_first"
  | "balanced"
  | "route_first"
  | "naive_first";

export type CandidateKind =
  | "linear"
  | "convergent"
  | "divergent"
  | "biomimetic"
  | "mixed";

/**
 * Soft-simulation inputs for confidence-gated AI retrosynthesis vs naive
 * AI route baselines. Method-lab scoring only — not wet-lab validated
 * manufacturing routes, not live ELN write-back, not the authors' system.
 */
export type SynthInput = {
  /** Route pack coverage of reaction classes (0–1). */
  packCoverage: number;
  /** Confidence-score fidelity to Synthetic Confidence Score axes (0–1). */
  confidenceFidelity: number;
  /** Candidate-route clarity (0–1). */
  candidateClarity: number;
  /** Synth-run stability across packs (0–1). */
  runStability: number;
  /** Naive AI route baseline pass-rate proxy — path B fuel (0–1). */
  naiveBaselineRate: number;
  /** Optimism that flashy ungated AI routes “just work” (0–1). */
  skipOptimism: number;
  /** Route / reaction hardness (0–1, higher = harder for A). */
  routeHardness: number;
  /** Risk of claiming wet-lab / live ELN clearance (0–1). */
  overclaimRisk: number;
  routeBias: RouteBias;
  profile: SynthProfile;
};

export type SynthQuality = {
  mode: ScoreMode;
  routeCoverage: number;
  confidenceScore: number;
  candidateOptScore: number;
  packIntegrity: number;
  naiveBaselineScore: number;
  confidence: number;
  gatedContribution: number;
  naiveContribution: number;
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
  bias: RouteBias,
  lane: Exclude<RouteBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function routeLoad(routeHardness: number, packCoverage: number): number {
  return clamp(routeHardness * (1.25 - packCoverage * 0.5), 0, 1.5);
}
