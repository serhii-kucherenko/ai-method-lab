export type KineticsProfile =
  | "entropy_constrained"
  | "full_rate_baseline";

export type ScoreMode =
  | "entropy_constrained"
  | "full_rate_baseline";

export type KineticsBias =
  | "entropy_strict"
  | "balanced"
  | "surrogate_first"
  | "full_rate_first";

export type OutcomeLabel =
  | "negative"
  | "indeterminate"
  | "positive"
  | "critical";

/**
 * Soft-simulation inputs for entropy-constrained kinetics surrogates vs full-rate baselines.
 * Method-lab scoring only — not certified CFD or live plant control.
 */
export type KineticsInput = {
  /** Fraction of mechanism rate space covered by the surrogate (0–1). */
  rateCoverage: number;
  /** How faithfully the entropy constraint is satisfied (0–1). */
  entropyFidelity: number;
  /** How well the surrogate matches the target chemistry mechanism (0–1). */
  mechanismFit: number;
  /** Agreement of surrogate rates with gold / full-rate reference (0–1). */
  rateAgreement: number;
  /** Full-rate / unconstrained baseline accuracy proxy — baseline B fuel (0–1). */
  fullRateAccuracy: number;
  /** Optimism that unconstrained ML recovers rates without entropy (0–1). Inflates B. */
  unconstrainedOptimism: number;
  /** Severity of stiff kinetics / multi-scale coupling (0–1, higher = harder for A). */
  stiffnessHardness: number;
  /** Risk of leaking certified-CFD / live-plant claims into the score (0–1). */
  leakageRisk: number;
  kineticsBias: KineticsBias;
  profile: KineticsProfile;
};

export type KineticsQuality = {
  mode: ScoreMode;
  rateDiagnosis: number;
  entropyDiagnosis: number;
  mechanismReasonScore: number;
  packIntegrity: number;
  baselineScore: number;
  confidence: number;
  surrogateContribution: number;
  baselineContribution: number;
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
  bias: KineticsBias,
  lane: Exclude<KineticsBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function stiffnessLoad(
  stiffnessHardness: number,
  rateCoverage: number,
): number {
  return clamp(stiffnessHardness * (1.25 - rateCoverage * 0.5), 0, 1.5);
}
