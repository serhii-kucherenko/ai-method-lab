export type MembraneProfile =
  | "chemgnn_surrogate"
  | "classical_physics_baseline";

export type ScoreMode = MembraneProfile;

export type MembraneBias =
  | "graph_first"
  | "balanced"
  | "flux_first"
  | "physics_first";

export type GraphKind =
  | "cnt_bundle"
  | "aligned_cnt"
  | "mixed_chirality"
  | "defect_aware"
  | "hybrid_graph"
  | "custom";

/**
 * Soft-simulation inputs for ChemGNN graph-surrogate CNT membrane
 * design vs classical physics baselines.
 * Method-lab scoring only — not wet-lab validated desalination,
 * not live plant write-back, not the authors' system.
 */
export type MembraneInput = {
  /** How well the CNT graph covers membrane design space (0–1). */
  graphCoverage: number;
  /** Fidelity of pore / chirality geometry encoding (0–1). */
  poreGeometryFidelity: number;
  /** Soft-sim salt rejection proxy (0–1). */
  saltRejectionProxy: number;
  /** Soft-sim water flux proxy (0–1). */
  waterFluxProxy: number;
  /** Classical physics screen breadth — path B fuel (0–1). */
  classicalPhysicsBreadth: number;
  /** Optimism that classical physics “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of the membrane desalination design task (0–1). */
  membraneHardness: number;
  /** Risk of claiming wet-lab validated / plant write-back (0–1). */
  overclaimRisk: number;
  membraneBias: MembraneBias;
  profile: MembraneProfile;
};

export type MembraneQuality = {
  mode: ScoreMode;
  graphScore: number;
  poreScore: number;
  rejectionScore: number;
  fluxIntegrity: number;
  baselineScore: number;
  confidence: number;
  surrogateContribution: number;
  physicsContribution: number;
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
  bias: MembraneBias,
  lane: Exclude<MembraneBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function membraneLoad(
  membraneHardness: number,
  waterFluxProxy: number,
): number {
  return clamp(membraneHardness * (1.25 - waterFluxProxy * 0.5), 0, 1.5);
}
