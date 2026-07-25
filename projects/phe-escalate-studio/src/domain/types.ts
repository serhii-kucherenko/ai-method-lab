export type PheProfile =
  | "ai_assisted_phe_escalation"
  | "manual_triage_baseline";

export type ScoreMode = PheProfile;

export type EscalationBias =
  | "signal_first"
  | "balanced"
  | "case_first"
  | "triage_first";

export type ClassificationKind =
  | "case_velocity"
  | "geo_cluster"
  | "lab_confirm"
  | "syndromic"
  | "hybrid_signal"
  | "custom";

/**
 * Soft-simulation inputs for AI-assisted public-health emergency
 * classification and escalation vs manual triage baselines.
 * Method-lab scoring only — not operational MoH authority,
 * not live write-back, not clinical diagnosis, not the authors' system.
 */
export type PheInput = {
  /** How clear the outbreak signal is (0–1). */
  signalClarity: number;
  /** Soft-sim case growth / velocity proxy (0–1). */
  caseVelocity: number;
  /** Soft-sim geospatial spread proxy (0–1). */
  geoSpreadProxy: number;
  /** Soft-sim lab confirmation proxy (0–1). */
  labConfirmProxy: number;
  /** Manual triage screen breadth — path B fuel (0–1). */
  manualTriageBreadth: number;
  /** Optimism that manual triage “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of the escalation decision (0–1). */
  escalationHardness: number;
  /** Risk of claiming MoH authority / live write-back / diagnosis (0–1). */
  overclaimRisk: number;
  escalationBias: EscalationBias;
  profile: PheProfile;
};

export type PheQuality = {
  mode: ScoreMode;
  signalScore: number;
  velocityScore: number;
  spreadScore: number;
  confirmIntegrity: number;
  triageScore: number;
  confidence: number;
  aiContribution: number;
  triageContribution: number;
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
  bias: EscalationBias,
  lane: Exclude<EscalationBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function escalationLoad(
  escalationHardness: number,
  geoSpreadProxy: number,
): number {
  return clamp(escalationHardness * (1.25 - geoSpreadProxy * 0.5), 0, 1.5);
}
