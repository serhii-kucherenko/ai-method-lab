export type DeployProfile = "full" | "fast";

export type ScoreMode = "harnessed" | "naive";

/**
 * Soft-simulation inputs for a realtime multimodal deploy plan.
 * Not a production autoscaler — method-lab plan quality only.
 */
export type DeployInput = {
  /** Pipeline stage count (2–12). */
  pipelineStages: number;
  /** GPU budget available for the deployment (1–8). */
  gpuBudget: number;
  /** Distinct modalities in the app (1–4: text/audio/video/vision). */
  modalityCount: number;
  /** Weight on TTFO / response latency (0–1). */
  latencyWeight: number;
  /** Weight on sustainable throughput (0–1). */
  throughputWeight: number;
  /** Streaming overlap / pipelining opportunity (0–1). */
  streamingOverlap: number;
  /** Persistent-state scope complexity — caches, buffers (0–1). */
  stateScopeComplexity: number;
  /** Freedom to choose placement / co-location (0–1). */
  placementFlexibility: number;
  /** IR validation depth before transform (0–1). */
  irValidationDepth: number;
  /** Measurement-gated loop strictness (0–1). */
  measurementGateStrictness: number;
  /** Candidate transform passes explored (1–8). */
  candidatePassCount: number;
  profile: DeployProfile;
};

export type DeployQuality = {
  mode: ScoreMode;
  ttfoScore: number;
  throughputScore: number;
  correctnessConfidence: number;
  readinessScore: number;
  harnessLift: number;
  criticalPathScore: number;
  placementScore: number;
  confidence: number;
  overall: number;
};

export type ReadinessView = {
  latencyReady: boolean;
  throughputReady: boolean;
  multimodalReady: boolean;
  correctnessReady: boolean;
  overallReady: boolean;
  latencyGap: number;
  throughputGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: DeployQuality,
  input: DeployInput,
): ReadinessView {
  const latencyTarget = 55 + input.latencyWeight * 25;
  const throughputTarget = 50 + input.throughputWeight * 25;
  const latencyGap = round2(latencyTarget - quality.ttfoScore);
  const throughputGap = round2(throughputTarget - quality.throughputScore);
  const latencyReady = quality.ttfoScore >= latencyTarget;
  const throughputReady = quality.throughputScore >= throughputTarget;
  const multimodalReady =
    quality.readinessScore >= 58 + input.modalityCount * 4;
  const correctnessReady = quality.correctnessConfidence >= 62;
  return {
    latencyReady,
    throughputReady,
    multimodalReady,
    correctnessReady,
    overallReady:
      latencyReady && throughputReady && multimodalReady && correctnessReady,
    latencyGap,
    throughputGap,
  };
}
