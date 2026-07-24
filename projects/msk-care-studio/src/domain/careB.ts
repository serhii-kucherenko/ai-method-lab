import {
  type CareInput,
  type CareQuality,
  clamp,
  round2,
} from "./types";

function stageBoost(stage: CareInput["careStage"]): number {
  switch (stage) {
    case "admission":
      return 0.92;
    case "acute":
      return 1.0;
    case "rehab":
      return 1.06;
    case "discharge":
      return 1.02;
    default: {
      const _exhaustive: never = stage;
      return _exhaustive;
    }
  }
}

function groundingSignal(input: CareInput): number {
  return clamp(
    input.streamCoverage * 30 +
      input.knowledgeGrounding * 28 +
      input.evidenceFreshness * 22 +
      input.decisionTraceability * 14 +
      (1 - input.comorbidityLoad) * 6,
    0,
    100,
  );
}

function pathwaySignal(input: CareInput): number {
  return clamp(
    input.pathwayProgress * 34 +
      input.rehabReadiness * 26 +
      input.patientStability * 22 +
      Math.min(90, input.episodeDays) * 0.12 +
      (1 - input.comorbidityLoad) * 8,
    0,
    100,
  );
}

/**
 * Dual-impl twin of scoreEvidenceGrounded — must stay bitwise-equal on goldens.
 */
export function scoreEvidenceGrounded(input: CareInput): CareQuality {
  const grounded = input.planner === "grounded";
  const boost = (grounded ? 1.06 : 0.98) * stageBoost(input.careStage);
  const ground = groundingSignal(input);
  const path = pathwaySignal(input);

  const streamFit = round2(
    clamp(
      (ground * 0.45 +
        input.streamCoverage * 32 +
        input.evidenceFreshness * 16) *
        boost -
        input.comorbidityLoad * 6,
      0,
      100,
    ),
  );

  const knowledgeFit = round2(
    clamp(
      (ground * 0.4 +
        input.knowledgeGrounding * 34 +
        input.decisionTraceability * 14) *
        boost -
        (1 - input.evidenceFreshness) * 5,
      0,
      100,
    ),
  );

  const pathwayCoherence = round2(
    clamp(
      (path * 0.5 +
        input.pathwayProgress * 28 +
        input.patientStability * 14) *
        boost,
      0,
      100,
    ),
  );

  const decisionQuality = round2(
    clamp(
      (input.decisionTraceability * 36 +
        input.streamCoverage * 22 +
        input.knowledgeGrounding * 22 +
        input.evidenceFreshness * 14) *
        boost,
      0,
      100,
    ),
  );

  const rehabOutlook = round2(
    clamp(
      (input.rehabReadiness * 38 +
        input.pathwayProgress * 24 +
        input.patientStability * 20 +
        (1 - input.comorbidityLoad) * 12) *
        boost,
      0,
      100,
    ),
  );

  const auditTrail = round2(
    clamp(
      input.decisionTraceability * 24 +
        input.streamCoverage * 18 +
        input.knowledgeGrounding * 16 +
        input.evidenceFreshness * 14 +
        Math.min(90, input.episodeDays) * 0.1 +
        (grounded ? 8 : 3),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      streamFit * 0.18 +
        knowledgeFit * 0.18 +
        pathwayCoherence * 0.18 +
        decisionQuality * 0.2 +
        rehabOutlook * 0.16 +
        auditTrail * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "evidence_grounded",
    streamFit,
    knowledgeFit,
    pathwayCoherence,
    decisionQuality,
    rehabOutlook,
    auditTrail,
    overall,
  };
}

/**
 * Dual-impl twin of scoreUngroundedLlm — must stay bitwise-equal on goldens.
 */
export function scoreUngroundedLlm(input: CareInput): CareQuality {
  const skipPenalty = clamp(
    0.4 +
      (1 - input.streamCoverage) * 0.2 +
      (1 - input.knowledgeGrounding) * 0.22 +
      input.comorbidityLoad * 0.18,
    0.32,
    0.92,
  );
  const path = pathwaySignal(input);

  const decisionQuality = round2(
    clamp(
      path * 0.55 +
        input.rehabReadiness * 18 +
        input.patientStability * 12 -
        (input.planner === "ungrounded_llm" ? 0 : 2),
      0,
      100,
    ),
  );

  const streamFit = round2(
    clamp(
      (input.streamCoverage * 16 + input.evidenceFreshness * 10) * skipPenalty,
      0,
      100,
    ),
  );

  const knowledgeFit = round2(
    clamp(
      (input.knowledgeGrounding * 18 + input.decisionTraceability * 8) *
        skipPenalty,
      0,
      100,
    ),
  );

  const pathwayCoherence = round2(
    clamp(
      (input.pathwayProgress * 28 + input.rehabReadiness * 16) * skipPenalty +
        input.patientStability * 8,
      0,
      100,
    ),
  );

  const rehabOutlook = round2(
    clamp(
      (input.rehabReadiness * 22 +
        input.patientStability * 14 +
        (1 - input.comorbidityLoad) * 10) *
        skipPenalty,
      0,
      100,
    ),
  );

  const auditTrail = round2(
    clamp(
      input.decisionTraceability * 12 +
        input.rehabReadiness * 10 +
        Math.min(90, input.episodeDays) * 0.06 -
        10,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      decisionQuality * 0.34 +
        streamFit * 0.1 +
        knowledgeFit * 0.1 +
        pathwayCoherence * 0.16 +
        rehabOutlook * 0.18 +
        auditTrail * 0.12,
      0,
      100,
    ),
  );

  return {
    mode: "ungrounded_llm",
    streamFit,
    knowledgeFit,
    pathwayCoherence,
    decisionQuality,
    rehabOutlook,
    auditTrail,
    overall,
  };
}
