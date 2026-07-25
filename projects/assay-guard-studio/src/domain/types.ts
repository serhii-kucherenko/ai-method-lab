export type AssayProfile =
  | "assay_aware"
  | "naive_protocol_runner";

export type ScoreMode = AssayProfile;

export type AssayBias =
  | "assay_strict"
  | "balanced"
  | "monitor_first"
  | "runner_first";

export type OutcomeLabel =
  | "hold_pack"
  | "review"
  | "lock_soft_sim"
  | "strong_lock";

/**
 * Soft-simulation inputs for assay-aware protocol validation
 * vs naive protocol runners. Method-lab scoring only — not certified
 * compliance, not live robot control.
 */
export type AssayInput = {
  /** How completely the deck pack covers the protocol scope (0–1). */
  deckCoverage: number;
  /** How faithfully assay rules are encoded for the validator (0–1). */
  assayFidelity: number;
  /** How well protocol steps match locked assay constraints (0–1). */
  assayFit: number;
  /** Integrity of the assay-aware validation path (0–1). */
  protocolIntegrity: number;
  /** Naive runner pass rate proxy — baseline B fuel (0–1). */
  naivePassRate: number;
  /** Optimism that skipping assay checks still “passes” (0–1). */
  skipOptimism: number;
  /** Protocol hardness / multi-step load (0–1, higher = harder for A). */
  protocolHardness: number;
  /** Risk of claiming certified compliance / live robot control (0–1). */
  leakageRisk: number;
  assayBias: AssayBias;
  profile: AssayProfile;
};

export type AssayQuality = {
  mode: ScoreMode;
  ruleCoverage: number;
  assayDiagnosis: number;
  protocolOptScore: number;
  deckIntegrity: number;
  runnerScore: number;
  confidence: number;
  assayContribution: number;
  runnerContribution: number;
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
  bias: AssayBias,
  lane: Exclude<AssayBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function protocolLoad(
  protocolHardness: number,
  deckCoverage: number,
): number {
  return clamp(protocolHardness * (1.25 - deckCoverage * 0.5), 0, 1.5);
}
