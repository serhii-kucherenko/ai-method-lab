export type PlannerKind = "on_device" | "cloud_style";

export type ScoreMode = "pla_feasibility" | "desire_first";

/**
 * Soft-simulation inputs for on-device itinerary plan quality.
 * Method-lab model only — not a live maps / booking API.
 */
export type TripInput = {
  /** Hard schedule slot fit (0–1). */
  scheduleFeasibility: number;
  /** Battery / time / budget headroom (0–1). */
  resourceHeadroom: number;
  /** Transfer / connection reliability (0–1). */
  transferReliability: number;
  /** Subjective desire alignment after constraints (0–1). */
  desireAlignment: number;
  /** How strictly hard constraints are enforced (0–1). */
  constraintStrictness: number;
  /** Weight given to desires vs constraints (0–1). */
  desireWeight: number;
  /** Planned stops (3–40). */
  stopCount: number;
  /** Weather disruption risk (0–1, higher = riskier). */
  weatherRisk: number;
  /** Offline map / cache coverage (0–1). */
  offlineMapCoverage: number;
  /** Mobility / mode adaptability (0–1). */
  mobilityAdaptability: number;
  /** Trip duration in hours (4–168). */
  tripHours: number;
  planner: PlannerKind;
};

export type TripQuality = {
  mode: ScoreMode;
  feasibility: number;
  desireFit: number;
  resourceMargin: number;
  transferHealth: number;
  adaptGain: number;
  auditTrail: number;
  overall: number;
};

export type TripReadiness = {
  constraintsReady: boolean;
  desiresReady: boolean;
  planReady: boolean;
  adaptReady: boolean;
  offlineReady: boolean;
  overallReady: boolean;
  feasibilityGap: number;
  desireGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: TripQuality,
  input: TripInput,
): TripReadiness {
  const feasTarget =
    52 + input.scheduleFeasibility * 22 + input.constraintStrictness * 14;
  const desireTarget =
    48 + input.desireAlignment * 24 + input.desireWeight * 12;
  const feasibilityGap = round2(feasTarget - quality.feasibility);
  const desireGap = round2(desireTarget - quality.desireFit);
  const constraintsReady = quality.feasibility >= feasTarget - 8;
  const desiresReady = quality.desireFit >= desireTarget - 10;
  const planReady = quality.overall >= 46 + input.desireAlignment * 16;
  const adaptReady =
    quality.adaptGain >= 48 + input.mobilityAdaptability * 22;
  const offlineReady =
    quality.resourceMargin >= 50 + input.offlineMapCoverage * 18;
  return {
    constraintsReady,
    desiresReady,
    planReady,
    adaptReady,
    offlineReady,
    overallReady:
      constraintsReady &&
      desiresReady &&
      planReady &&
      adaptReady &&
      offlineReady,
    feasibilityGap,
    desireGap,
  };
}
