export type InferStageKind =
  | "vision_encode"
  | "token_merge"
  | "prefill"
  | "decode";

export type PlanKind = "stage_validated" | "naive_offload";

export type ScoreMode = "stage_validated" | "naive_offload";

/**
 * Soft-simulation inputs for legacy-GPU inference plan quality.
 * Method-lab model only — not live CUDA on Tesla C2075.
 */
export type InferInput = {
  /** Usable device VRAM in GB (e.g. 5.3 of 6). */
  vramGb: number;
  /** Resident model + scratch footprint in GB. */
  residentGb: number;
  /** Stage-validation agreement (0–1, higher = closer to reference). */
  stageAgreement: number;
  /** Kernel efficiency vs vendor ceiling (0–1). */
  kernelEfficiency: number;
  /** Host spill fraction under naive plans (0–1, higher = worse). */
  hostSpill: number;
  /** Prefill throughput score (0–1). */
  prefillThroughput: number;
  /** Decode throughput score (0–1). */
  decodeThroughput: number;
  /** Vision tower port confidence (0–1). */
  visionPortFit: number;
  /** Context length pressure (tokens / 10k, clamped). */
  contextK: number;
  stage: InferStageKind;
  plan: PlanKind;
};

export type InferQuality = {
  mode: ScoreMode;
  vramFit: number;
  stagePass: number;
  kernelScore: number;
  throughputScore: number;
  visionScore: number;
  spillRisk: number;
  overall: number;
};

export type InferReadiness = {
  vramReady: boolean;
  stagesReady: boolean;
  kernelsReady: boolean;
  visionReady: boolean;
  decodeReady: boolean;
  overallReady: boolean;
  vramGapGb: number;
  spillGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: InferQuality,
  input: InferInput,
): InferReadiness {
  const vramGapGb = round2(Math.max(0, input.residentGb - input.vramGb * 0.92));
  const spillGap = round2(
    Math.max(0, quality.spillRisk - (100 - input.hostSpill * 80)),
  );
  const vramReady = quality.vramFit >= 62 && vramGapGb < 0.35;
  const stagesReady = quality.stagePass >= 58 + input.stageAgreement * 20;
  const kernelsReady = quality.kernelScore >= 52 + input.kernelEfficiency * 22;
  const visionReady = quality.visionScore >= 50 + input.visionPortFit * 24;
  const decodeReady =
    quality.throughputScore >= 48 + input.decodeThroughput * 22;
  return {
    vramReady,
    stagesReady,
    kernelsReady,
    visionReady,
    decodeReady,
    overallReady:
      vramReady && stagesReady && kernelsReady && visionReady && decodeReady,
    vramGapGb,
    spillGap,
  };
}
