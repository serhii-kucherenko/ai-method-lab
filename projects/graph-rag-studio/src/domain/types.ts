export type ConstructionProfile = "compact" | "heavy";

export type PipelineStage =
  | "queued"
  | "extract"
  | "consolidate"
  | "ready"
  | "failed";

export type GraphInput = {
  /** Document chunks in the corpus slice */
  docs: number;
  /** Raw entity mentions extracted before dedupe */
  rawMentions: number;
  /** Distinct entities after multi-step consolidate */
  uniqueEntities: number;
  /** Fraction of mentions that are duplicates (0–1) */
  duplicateRate: number;
  /** Weak / noisy edges from single-pass extraction */
  weakEdges: number;
  /** Strong relations kept after consolidate */
  strongEdges: number;
  /** Useful hop depth for typical queries (1–4) */
  hopDepthUseful: number;
  /** Query answer coverage after retrieval (0–1) */
  queryCoverage: number;
  profile: ConstructionProfile;
};

export type GraphQuality = {
  mode: "multi_step" | "single_shot";
  extractScore: number;
  consolidateScore: number;
  retrievalScore: number;
  overall: number;
  entitiesKept: number;
  edgesKept: number;
  duplicatesRemoved: number;
  noiseEdges: number;
  hopTrailLength: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
