export type RouteProfile = "structured_memory" | "naive_local";

export type ScoreMode = "structured_memory" | "naive_local";

export type MemoryBias =
  | "memory_first"
  | "balanced"
  | "intermediate_first"
  | "greedy_first";

/**
 * Soft-simulation inputs for structured-memory agentic retrosynthesis
 * vs naive local / greedy reaction search. Method-lab scoring only —
 * not wet-lab execution or regulatory synthesis certification.
 */
export type RouteInput = {
  /** Coverage of structured search memory (0–1). */
  memoryCoverage: number;
  /** Recall of previously tried routes / dead ends (0–1). */
  triedPathRecall: number;
  /** Intermediate property coverage across the tree (0–1). */
  intermediateCoverage: number;
  /** Evidence that branches were avoided after failure (0–1). */
  branchAvoidance: number;
  /** Global route coherence across steps (0–1). */
  routeCoherence: number;
  /** Local single-step reaction fit (0–1) — baseline B fuel. */
  localGreedyFit: number;
  /** Single-step fluency theater (0–1) — inflates B, discounted by A. */
  singleStepFluency: number;
  /** Dead-end pressure from crowded search (0–1, higher = harder). */
  deadEndPressure: number;
  /** Route drift / lost context (0–1). */
  routeDrift: number;
  memoryBias: MemoryBias;
  profile: RouteProfile;
};

export type RouteQuality = {
  mode: ScoreMode;
  memoryScore: number;
  intermediateScore: number;
  branchScore: number;
  routeIntegrity: number;
  greedyLocalScore: number;
  confidence: number;
  structuredContribution: number;
  naiveContribution: number;
  overall: number;
};

export type RouteReadiness = "hold_pack" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): RouteReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: MemoryBias,
  lane: Exclude<MemoryBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function deadEndLoad(
  deadEndPressure: number,
  branchAvoidance: number,
): number {
  return clamp(deadEndPressure * (1.15 - branchAvoidance * 0.4), 0, 1.5);
}
