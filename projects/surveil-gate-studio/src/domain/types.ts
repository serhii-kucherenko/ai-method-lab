export type SurveilGateProfile =
  | "trust_gph_six_pillar"
  | "explainability_only_baseline";

export type ScoreMode = SurveilGateProfile;

export type GovernanceBias =
  | "pillar_first"
  | "balanced"
  | "policy_first"
  | "explain_first";

export type PillarKind =
  | "transparency"
  | "accountability"
  | "equity"
  | "safety"
  | "privacy"
  | "public_trust"
  | "custom";

export type PolicyKind =
  | "audit_recipe"
  | "escalation"
  | "red_team"
  | "disclosure"
  | "custom";

/**
 * Soft-simulation inputs for six-pillar trust governance of generative AI
 * in digital public health surveillance vs explainability-only baselines.
 * Method-lab scoring only — not live national surveillance deployment,
 * not clinical diagnostic use, not regulatory certification, not TRUST-GPH brand.
 */
export type SurveilGateInput = {
  /** Soft-sim coverage of six TRUST-inspired pillars (0–1). */
  pillarCoverage: number;
  /** Soft-sim policy / audit recipe completeness (0–1). */
  policyCompleteness: number;
  /** Soft-sim signal-batch integrity under noisy surveillance feeds (0–1). */
  signalIntegrity: number;
  /** Soft-sim pack readiness for governance lock (0–1). */
  packReadiness: number;
  /** Explainability-only adherence — path B fuel (0–1). */
  explainOnlyAdherence: number;
  /** Hallucinated outbreak / biased allocation hardness (0–1). */
  hallucinationHardness: number;
  /** Trust erosion risk when explainability is the only gate (0–1). */
  trustErosionRisk: number;
  /** Risk of claiming live national deploy / certification / TRUST-GPH (0–1). */
  overclaimRisk: number;
  governanceBias: GovernanceBias;
  profile: SurveilGateProfile;
};

export type SurveilGateQuality = {
  mode: ScoreMode;
  pillarScore: number;
  policyScore: number;
  signalScore: number;
  readinessScore: number;
  explainOnlyScore: number;
  confidence: number;
  trustContribution: number;
  explainContribution: number;
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
  bias: GovernanceBias,
  lane: Exclude<GovernanceBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function surveillanceLoad(
  hallucinationHardness: number,
  signalIntegrity: number,
): number {
  return clamp(
    hallucinationHardness * (1.25 - signalIntegrity * 0.5),
    0,
    1.5,
  );
}
