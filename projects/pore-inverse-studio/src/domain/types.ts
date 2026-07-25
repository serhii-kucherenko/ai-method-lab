export type PoreProfile = "unified_inverse" | "naive_generative";

export type ScoreMode = PoreProfile;

export type PoreBias =
  | "pore_first"
  | "balanced"
  | "target_first"
  | "generative_first";

export type MaterialsDomain =
  | "mof"
  | "zeolite"
  | "co2_capture"
  | "energy_storage"
  | "catalysis"
  | "mixed";

/**
 * Soft-simulation inputs for unified nanoporous inverse design vs
 * naive generative baselines. Method-lab scoring only — not certified
 * materials performance, not live plant, not the authors' PoreForge system.
 */
export type PoreInput = {
  /** Unified inverse-design coverage across applications (0–1). */
  inverseCoverage: number;
  /** Pore-target fidelity vs stated metrics (0–1). */
  poreFidelity: number;
  /** Target clarity under soft-sim (0–1). */
  targetClarity: number;
  /** Designer config stability across packs (0–1). */
  designerStability: number;
  /** Naive generative baseline pass-rate proxy — path B fuel (0–1). */
  generativePassRate: number;
  /** Optimism that naive generative “just works” (0–1). */
  generativeOptimism: number;
  /** Pore hardness (0–1, higher = harder for A). */
  poreHardness: number;
  /** Risk of claiming certified performance / live plant (0–1). */
  overclaimRisk: number;
  poreBias: PoreBias;
  profile: PoreProfile;
};

export type PoreQuality = {
  mode: ScoreMode;
  inverseScore: number;
  poreScore: number;
  targetScore: number;
  designerScore: number;
  generativeScore: number;
  confidence: number;
  unifiedInverseContribution: number;
  naiveGenerativeContribution: number;
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
  bias: PoreBias,
  lane: Exclude<PoreBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function poreLoad(poreHardness: number, inverseCoverage: number): number {
  return clamp(poreHardness * (1.25 - inverseCoverage * 0.5), 0, 1.5);
}
