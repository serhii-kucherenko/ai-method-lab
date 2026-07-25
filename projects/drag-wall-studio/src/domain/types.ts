export type ControlProfile = "es_closed_loop" | "open_loop_gradient";

export type ScoreMode = "es_closed_loop" | "open_loop_gradient";

export type ControlBias =
  | "es_strict"
  | "balanced"
  | "sensor_first"
  | "open_loop_first";

export type OutcomeLabel = "negative" | "indeterminate" | "positive" | "critical";

/**
 * Soft-simulation inputs for ES closed-loop wall control vs open-loop/gradient baseline.
 * Method-lab scoring only — not live plant control or certified CFD.
 */
export type DragWallInput = {
  /** Fraction of wall actuation surface that is controllable (0–1). */
  wallCoverage: number;
  /** How informative wall sensors are for shear feedback (0–1). */
  sensorFidelity: number;
  /** How well the actuator plan matches the channel geometry (0–1). */
  channelFit: number;
  /** Agreement of closed-loop outcomes with gold under sensor cues (0–1). */
  closedLoopAgreement: number;
  /** Open-loop / gradient baseline accuracy proxy — baseline B fuel (0–1). */
  openLoopAccuracy: number;
  /** Optimism that open-loop recovers missing closed-loop feedback (0–1). Inflates B. */
  openLoopOptimism: number;
  /** Severity of turbulent drag pressure (0–1, higher = harder for A). */
  dragPressure: number;
  /** Risk of leaking unavailable plant CFD into the score (0–1). */
  leakageRisk: number;
  controlBias: ControlBias;
  profile: ControlProfile;
};

export type DragWallQuality = {
  mode: ScoreMode;
  dragDiagnosis: number;
  shearDiagnosis: number;
  actuatorReasonScore: number;
  sensorIntegrity: number;
  openLoopScore: number;
  confidence: number;
  closedLoopContribution: number;
  openLoopContribution: number;
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
  bias: ControlBias,
  lane: Exclude<ControlBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function dragLoad(dragPressure: number, wallCoverage: number): number {
  return clamp(dragPressure * (1.25 - wallCoverage * 0.5), 0, 1.5);
}
