export type CacheHitProfile =
  | "structured_hit_finding"
  | "naive_docking_baseline";

export type ScoreMode = CacheHitProfile;

export type HitBias =
  | "structure_first"
  | "balanced"
  | "pocket_first"
  | "docking_first";

export type TargetKind =
  | "cblb_tkb"
  | "e3_ligase"
  | "immuno_oncology"
  | "custom";

/**
 * Soft-simulation inputs for structured computational hit-finding
 * vs naive docking baselines.
 * Method-lab scoring only — not wet-lab validated hits, not live ELN
 * write-back, not FDA clearance, not CACHE, not the authors' system.
 */
export type CacheHitInput = {
  /** Soft-sim pocket / binding-site coverage (0–1). */
  pocketCoverage: number;
  /** Soft-sim structured hit-finding fidelity (0–1). */
  hitFidelity: number;
  /** Soft-sim ligand / compound grounding quality (0–1). */
  ligandGrounding: number;
  /** Soft-sim hit-pack completeness (0–1). */
  packCompleteness: number;
  /** Naive docking baseline confidence — path B fuel (0–1). */
  dockingConfidence: number;
  /** Optimism that docking scores “just work” without structure (0–1). */
  dockingOptimism: number;
  /** Hardness of the pocket / prospective hit-finding case (0–1). */
  pocketHardness: number;
  /** Risk of claiming wet-lab / ELN / FDA / CACHE (0–1). */
  overclaimRisk: number;
  hitBias: HitBias;
  profile: CacheHitProfile;
};

export type CacheHitQuality = {
  mode: ScoreMode;
  pocketScore: number;
  fidelityScore: number;
  ligandScore: number;
  completenessScore: number;
  dockingScore: number;
  confidence: number;
  structureContribution: number;
  dockingContribution: number;
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
  bias: HitBias,
  lane: Exclude<HitBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function pocketLoad(
  pocketHardness: number,
  ligandGrounding: number,
): number {
  return clamp(pocketHardness * (1.25 - ligandGrounding * 0.5), 0, 1.5);
}
