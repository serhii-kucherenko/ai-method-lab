export type StreamProfile = "realtime_stream" | "offline_batch";

export type ScoreMode = "realtime_stream" | "offline_batch";

export type SegmentBias =
  | "early_flush"
  | "balanced"
  | "wait_boundary"
  | "batch_only";

/**
 * Soft-simulation inputs for real-time sentence stream vs offline-batch baseline.
 * Method-lab scoring only — not live interpreter certification.
 */
export type StreamInput = {
  /** Gloss / sign clarity (0–1, higher = clearer). */
  glossClarity: number;
  /** Motion / tracking stability (0–1). */
  motionStability: number;
  /** Sentence boundary confidence (0–1). */
  boundaryConfidence: number;
  /** Observed end-to-end latency in ms. */
  latencyMs: number;
  /** Allowed latency budget in ms. */
  budgetMs: number;
  /** Glossary / vocab coverage (0–1). */
  vocabularyCoverage: number;
  /** Signer pace pressure (0–1, higher = faster / harder). */
  signerPace: number;
  /** Occlusion / noise (0–1, higher = worse). */
  occlusionNoise: number;
  /** Stream jitter (0–1). */
  streamJitter: number;
  segmentBias: SegmentBias;
  profile: StreamProfile;
};

export type StreamQuality = {
  mode: ScoreMode;
  sentenceScore: number;
  latencyScore: number;
  continuityScore: number;
  glossaryScore: number;
  boundaryScore: number;
  fidelityScore: number;
  confidence: number;
  streamContribution: number;
  batchContribution: number;
  overall: number;
};

export type StreamReadiness = "hold_stream" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): StreamReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold_stream";
}

export function biasWeight(
  bias: SegmentBias,
  lane: Exclude<SegmentBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function latencyPressure(latencyMs: number, budgetMs: number): number {
  if (budgetMs <= 0) return 1;
  return clamp(latencyMs / budgetMs, 0, 2);
}
