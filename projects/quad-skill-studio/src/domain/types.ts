export type SkillKind = "trot" | "pace" | "bound" | "crawl" | "climb";

export type PlanKind = "multi_skill" | "single_gait";

export type ScoreMode = "multi_skill" | "single_gait";

/**
 * Soft-simulation inputs for multi-skill perceptive locomotion plans.
 * Method-lab model only — not live robot control or field deployment.
 */
export type LocoInput = {
  /** Terrain roughness (0–1, higher = rockier / more uneven). */
  terrainRoughness: number;
  /** Perception / heightmap quality (0–1). */
  perceptionQuality: number;
  /** Coverage of motor skills for this terrain (0–1). */
  skillCoverage: number;
  /** Gait transition smoothness (0–1). */
  transitionSmoothness: number;
  /** Nominal gait stability (0–1). */
  gaitStability: number;
  /** Energy efficiency under plan (0–1). */
  energyEfficiency: number;
  /** Slip / fall risk pressure (0–1, higher = worse). */
  slipRisk: number;
  /** Slope grade pressure (0–1). */
  slopeGrade: number;
  /** Trajectory dataset density signal (0–1). */
  trajectoryDensity: number;
  skill: SkillKind;
  plan: PlanKind;
};

export type LocoQuality = {
  mode: ScoreMode;
  traversalScore: number;
  transitionScore: number;
  perceptionScore: number;
  stabilityScore: number;
  energyScore: number;
  stallRisk: number;
  overall: number;
};

export type LocoReadiness = {
  terrainReady: boolean;
  skillsReady: boolean;
  transitionsReady: boolean;
  perceptionReady: boolean;
  energyReady: boolean;
  overallReady: boolean;
  stallGap: number;
  slipGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: LocoQuality,
  input: LocoInput,
): LocoReadiness {
  const stallGap = round2(Math.max(0, 72 - quality.stallRisk));
  const slipGap = round2(Math.max(0, input.slipRisk * 100 - 28));
  const terrainReady =
    quality.traversalScore >= 58 + (1 - input.terrainRoughness) * 18;
  const skillsReady =
    quality.transitionScore >= 52 + input.skillCoverage * 22;
  const transitionsReady =
    quality.transitionScore >= 50 + input.transitionSmoothness * 24;
  const perceptionReady =
    quality.perceptionScore >= 48 + input.perceptionQuality * 22;
  const energyReady =
    quality.energyScore >= 46 + input.energyEfficiency * 20;
  return {
    terrainReady,
    skillsReady,
    transitionsReady,
    perceptionReady,
    energyReady,
    overallReady:
      terrainReady &&
      skillsReady &&
      transitionsReady &&
      perceptionReady &&
      energyReady,
    stallGap,
    slipGap,
  };
}
