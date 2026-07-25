export type FailProfile = "fail_gate" | "correctness_only";

export type ScoreMode = "fail_gate" | "correctness_only";

export type GateBias =
  | "taxonomy_strict"
  | "balanced"
  | "boundary_first"
  | "accuracy_first";

export type GateType =
  | "refusal"
  | "scope"
  | "harm"
  | "dosage"
  | "disclaimer"
  | "hallucination";

/**
 * Soft-simulation inputs for fail-gate taxonomy diagnosis vs correctness-only.
 * Method-lab scoring only — not clinical decision support.
 */
export type FailGateInput = {
  /** How well claimed severity matches case signals (0–1). */
  severityFit: number;
  /** Gate-type match strength (0–1). */
  gateTypeFit: number;
  /** Boundary-reason coherence (0–1). */
  boundaryCoherence: number;
  /** Evidence strength for the boundary call (0–1). */
  evidenceStrength: number;
  /** Taxonomy coverage across gate families (0–1). */
  taxonomyCoverage: number;
  /** Lexical / answer-match accuracy proxy (0–1) — baseline B fuel. */
  answerMatch: number;
  /** Fluency / confidence theater (0–1) — inflates B, ignored by A. */
  fluencyScore: number;
  /** Harm proximity pressure (0–1, higher = worse if ungated). */
  harmProximity: number;
  /** Scope-drift pressure (0–1). */
  scopeDrift: number;
  gateBias: GateBias;
  profile: FailProfile;
};

export type FailGateQuality = {
  mode: ScoreMode;
  severityDiagnosis: number;
  gateTypeDiagnosis: number;
  boundaryReasonScore: number;
  taxonomyIntegrity: number;
  correctnessScore: number;
  confidence: number;
  failGateContribution: number;
  correctnessContribution: number;
  overall: number;
};

export type GateReadiness = "hold_release" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): GateReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold_release";
}

export function biasWeight(
  bias: GateBias,
  lane: Exclude<GateBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function harmPressure(harmProximity: number, evidenceStrength: number): number {
  return clamp(harmProximity * (1.15 - evidenceStrength * 0.4), 0, 1.5);
}
