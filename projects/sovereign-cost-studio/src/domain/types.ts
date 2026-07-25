export type CostProfile =
  | "sovereign_infra_wee_accounting"
  | "naive_cloud_footprint_baseline";

export type ScoreMode = CostProfile;

export type CostBias =
  | "water_first"
  | "balanced"
  | "energy_first"
  | "cloud_first";

export type ModelKind =
  | "hydro"
  | "grid"
  | "hybrid"
  | "cooling"
  | "mixed";

/**
 * Soft-simulation inputs for sovereign AI infrastructure
 * water–energy–emissions accounting vs naive cloud-footprint baselines.
 * Method-lab scoring only — not certified carbon audits, not live grid
 * metering, not national policy authority, not the authors' system.
 */
export type CostInput = {
  /** Water intensity coverage of sovereign infra loads (0–1). */
  waterIntensity: number;
  /** Energy intensity of compute + cooling stacks (0–1). */
  energyIntensity: number;
  /** Emissions factor clarity for regional grids (0–1). */
  emissionsClarity: number;
  /** Scenario / pack stability across cost versions (0–1). */
  scenarioStability: number;
  /** Naive cloud-only footprint pass-rate proxy — path B fuel (0–1). */
  cloudFootprintRate: number;
  /** Optimism that cloud-only footprints “just work” (0–1). */
  cloudOptimism: number;
  /** Cooling / hydro / grid mismatch hardness (0–1). */
  infraHardness: number;
  /** Risk of claiming certified audit / live metering / policy (0–1). */
  overclaimRisk: number;
  costBias: CostBias;
  profile: CostProfile;
};

export type CostQuality = {
  mode: ScoreMode;
  waterScore: number;
  energyScore: number;
  emissionsScore: number;
  scenarioIntegrity: number;
  cloudBaselineScore: number;
  confidence: number;
  sovereignContribution: number;
  cloudContribution: number;
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
  bias: CostBias,
  lane: Exclude<CostBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function infraLoad(
  infraHardness: number,
  waterIntensity: number,
): number {
  return clamp(infraHardness * (1.25 - waterIntensity * 0.5), 0, 1.5);
}
