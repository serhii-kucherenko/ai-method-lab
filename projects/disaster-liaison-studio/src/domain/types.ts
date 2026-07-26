export type LiaisonProfile =
  | "pediatric_perinatal_liaison"
  | "generic_disaster_hq";

export type ScoreMode = LiaisonProfile;

export type LiaisonBias =
  | "pediatric_first"
  | "balanced"
  | "hq_first"
  | "handoff_first";

export type EventKind =
  | "earthquake_surge"
  | "flood_evac"
  | "pandemic_wave"
  | "multi_hazard_blend"
  | "custom";

export type LiaisonKind =
  | "pediatric_perinatal"
  | "generic_hq"
  | "hybrid_compare"
  | "custom";

export type HandoffKind =
  | "specialty_to_hq"
  | "hq_to_specialty"
  | "interfacility"
  | "surge_overflow"
  | "custom";

/**
 * Soft-simulation inputs for pediatric-perinatal disaster liaison vs
 * generic disaster headquarters coordination.
 * Method-lab scoring only — not live emergency dispatch, not clinical
 * triage authority, not government command systems.
 */
export type LiaisonInput = {
  /** Soft-sim pediatric / perinatal patient load (0–1; higher = heavier). */
  pediatricLoad: number;
  /** Soft-sim perinatal specialty risk index (0–1; higher = worse). */
  perinatalRisk: number;
  /** Soft-sim specialist liaison coverage (0–1; higher = better). */
  liaisonCoverage: number;
  /** Soft-sim handoff delay index (0–1; higher = worse). */
  handoffLatency: number;
  /** Soft-sim generic HQ coordination quality (0–1). */
  hqCoordination: number;
  /** Soft-sim surge pressure (0–1; higher = worse). */
  surgePressure: number;
  /** Soft-sim assay / evidence fidelity (0–1). */
  assaySignal: number;
  /** Risk of claiming live dispatch / triage / command (0–1). */
  overclaimRisk: number;
  liaisonBias: LiaisonBias;
  profile: LiaisonProfile;
};

export type LiaisonQuality = {
  mode: ScoreMode;
  specialtyScore: number;
  coverageScore: number;
  handoffScore: number;
  surgeScore: number;
  hqPenalty: number;
  confidence: number;
  liaisonContribution: number;
  hqContribution: number;
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
  bias: LiaisonBias,
  lane: Exclude<LiaisonBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function surgeLoad(
  pediatricLoad: number,
  perinatalRisk: number,
  surgePressure: number,
): number {
  return clamp(
    pediatricLoad * 0.35 + perinatalRisk * 0.35 + surgePressure * 0.3 - 0.08,
    0,
    1.5,
  );
}
