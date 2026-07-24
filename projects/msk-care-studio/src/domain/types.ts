export type CareStage = "admission" | "acute" | "rehab" | "discharge";

export type PlannerKind = "grounded" | "ungrounded_llm";

export type ScoreMode = "evidence_grounded" | "ungrounded_llm";

/**
 * Soft-simulation inputs for MSK care plan quality.
 * Method-lab model only — not a live EHR or clinical certification.
 */
export type CareInput = {
  /** Hospital state stream coverage / freshness (0–1). */
  streamCoverage: number;
  /** External medical knowledge grounding (0–1). */
  knowledgeGrounding: number;
  /** Admission → rehab pathway progress (0–1). */
  pathwayProgress: number;
  /** Decision ledger traceability (0–1). */
  decisionTraceability: number;
  /** Patient clinical stability signal (0–1). */
  patientStability: number;
  /** Rehab readiness (0–1). */
  rehabReadiness: number;
  /** Evidence freshness vs stale notes (0–1). */
  evidenceFreshness: number;
  /** Comorbidity / complexity load (0–1, higher = harder). */
  comorbidityLoad: number;
  /** Episode length in days (1–120). */
  episodeDays: number;
  careStage: CareStage;
  planner: PlannerKind;
};

export type CareQuality = {
  mode: ScoreMode;
  streamFit: number;
  knowledgeFit: number;
  pathwayCoherence: number;
  decisionQuality: number;
  rehabOutlook: number;
  auditTrail: number;
  overall: number;
};

export type CareReadiness = {
  streamsReady: boolean;
  knowledgeReady: boolean;
  decisionsReady: boolean;
  pathwayReady: boolean;
  rehabReady: boolean;
  overallReady: boolean;
  groundingGap: number;
  pathwayGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: CareQuality,
  input: CareInput,
): CareReadiness {
  const groundTarget =
    50 +
    input.streamCoverage * 20 +
    input.knowledgeGrounding * 18 +
    input.evidenceFreshness * 10;
  const pathwayTarget =
    48 + input.pathwayProgress * 24 + input.rehabReadiness * 14;
  const groundingGap = round2(
    groundTarget - (quality.streamFit * 0.5 + quality.knowledgeFit * 0.5),
  );
  const pathwayGap = round2(pathwayTarget - quality.pathwayCoherence);
  const streamsReady = quality.streamFit >= groundTarget - 12;
  const knowledgeReady = quality.knowledgeFit >= groundTarget - 14;
  const decisionsReady =
    quality.decisionQuality >= 46 + input.decisionTraceability * 18;
  const pathwayReady = quality.pathwayCoherence >= pathwayTarget - 10;
  const rehabReady =
    quality.rehabOutlook >= 48 + input.rehabReadiness * 20;
  return {
    streamsReady,
    knowledgeReady,
    decisionsReady,
    pathwayReady,
    rehabReady,
    overallReady:
      streamsReady &&
      knowledgeReady &&
      decisionsReady &&
      pathwayReady &&
      rehabReady,
    groundingGap,
    pathwayGap,
  };
}
