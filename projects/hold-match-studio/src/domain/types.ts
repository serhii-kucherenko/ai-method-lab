export type HoldProfile = "experience_aware" | "first_feasible";

export type ScoreMode = "experience_aware" | "first_feasible";

export type HoldTierBias =
  | "release_now"
  | "hold_short"
  | "hold_long"
  | "guardrail_block"
  | "balanced";

/**
 * Soft-simulation inputs for experience-aware hold vs first-feasible baseline.
 * Method-lab scoring only — not DiDi/EXHOLD production control.
 */
export type HoldInput = {
  /** Passenger wait / cancel-before-accept risk (0–1, higher = worse experience). */
  passengerWaitRisk: number;
  /** Driver idle / wasted-trip cost (0–1, higher = worse). */
  driverIdleCost: number;
  /** Cancel-before-accept pressure (PCBA-like) (0–1). */
  cancelBeforeAccept: number;
  /** Cancel-after-accept pressure (PCAA-like) (0–1). */
  cancelAfterAccept: number;
  /** Local supply–demand stress (0–1). */
  supplyDemandStress: number;
  /** Pickup ETA fitness — closer is better when remapped (0–1 high = long ETA). */
  pickupEtaPressure: number;
  /** Fare / income proxy strength (0–1). */
  fareStrength: number;
  /** Hold budget used vs guardrail (0–1, higher = more holding). */
  holdIntensity: number;
  tierBias: HoldTierBias;
  profile: HoldProfile;
};

export type HoldQuality = {
  mode: ScoreMode;
  passengerScore: number;
  driverScore: number;
  completionScore: number;
  cancelReductionScore: number;
  guardrailScore: number;
  funnelScore: number;
  confidence: number;
  holdContribution: number;
  feasibleContribution: number;
  overall: number;
};

export type HoldReadiness = "hold_policy" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): HoldReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold_policy";
}

export function tierWeight(
  bias: HoldTierBias,
  lane: Exclude<HoldTierBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}
