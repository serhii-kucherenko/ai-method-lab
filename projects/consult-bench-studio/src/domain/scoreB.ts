import {
  type ConsultInput,
  type ConsultQuality,
  clamp,
  round2,
} from "./types";

function departmentBoost(kind: ConsultInput["department"]): number {
  switch (kind) {
    case "dermatology":
      return 1.06;
    case "radiology":
      return 1.07;
    case "ophthalmology":
      return 1.05;
    case "orthopedics":
      return 1.04;
    case "general":
      return 1.03;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function clinicalSignal(input: ConsultInput): number {
  return clamp(
    46 +
      input.clinicalCoherence * 26 +
      input.historyCoverage * 14 +
      input.urgencyRecognition * 12 -
      input.hallucinationRisk * 16,
    0,
    100,
  );
}

function imageSignal(input: ConsultInput): number {
  return clamp(
    input.imageRelevance * 34 +
      input.visualGrounding * 36 +
      input.departmentFit * 18 -
      input.hallucinationRisk * 20 -
      (1 - input.visualGrounding) * input.imageRelevance * 14,
    0,
    100,
  );
}

/**
 * Dual-impl twin of score.ts — must stay bitwise-equal on goldens.
 */
export function scoreMultimodal(input: ConsultInput): ConsultQuality {
  const multi = input.plan === "multimodal";
  const boost = (multi ? 1.12 : 0.93) * departmentBoost(input.department);
  const clinical = clinicalSignal(input);
  const image = imageSignal(input);

  const visualFidelity = round2(
    clamp(
      (image * 0.48 +
        input.visualGrounding * 28 +
        input.imageRelevance * 16 +
        (multi ? 14 : 2) -
        (multi ? 0 : input.textFluency * 18)) *
        boost,
      0,
      100,
    ),
  );

  const clinicalPlan = round2(
    clamp(
      (clinical * 0.42 +
        input.clinicalCoherence * 22 +
        input.historyCoverage * 14 +
        (multi ? 12 : 4) -
        input.hallucinationRisk * (multi ? 8 : 20)) *
        boost,
      0,
      100,
    ),
  );

  const safetyScore = round2(
    clamp(
      (input.safetyDiscipline * 38 +
        input.urgencyRecognition * 24 +
        visualFidelity * 0.12 +
        (multi ? 12 : 4) -
        input.hallucinationRisk * (multi ? 6 : 18)) *
        boost,
      0,
      100,
    ),
  );

  const departmentAlignment = round2(
    clamp(
      (input.departmentFit * 36 +
        clinical * 0.18 +
        image * 0.16 +
        (multi ? 12 : 2) -
        (multi ? 0 : input.textFluency * 14)) *
        boost,
      0,
      100,
    ),
  );

  const responseClarity = round2(
    clamp(
      (input.turnClarity * 32 +
        clinicalPlan * 0.2 +
        visualFidelity * 0.18 +
        (multi ? 10 : 0) -
        input.textFluency * (multi ? 6 : 22)) *
        boost,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      visualFidelity * 0.24 +
        clinicalPlan * 0.22 +
        safetyScore * 0.2 +
        departmentAlignment * 0.18 +
        responseClarity * 0.16,
      0,
      100,
    ),
  );

  return {
    mode: "multimodal",
    visualFidelity,
    clinicalPlan,
    safetyScore,
    departmentAlignment,
    responseClarity,
    overall,
  };
}

/**
 * Text-only baseline — ignores image context (Score B).
 */
export function scoreTextOnly(input: ConsultInput): ConsultQuality {
  const fluentBias = clamp(
    0.48 +
      input.textFluency * 0.3 +
      (1 - input.imageRelevance) * 0.14 +
      (1 - input.visualGrounding) * 0.1,
    0.34,
    0.94,
  );
  const clinical = clinicalSignal(input);
  const pretendedVisual = clamp(
    input.textFluency * 0.7 + (1 - input.imageRelevance) * 0.3,
    0,
    1,
  );

  const visualFidelity = round2(
    clamp(
      (pretendedVisual * 28 + input.textFluency * 22 + clinical * 0.12) *
        fluentBias -
        input.imageRelevance * 22 -
        input.visualGrounding * 10,
      0,
      100,
    ),
  );

  const clinicalPlan = round2(
    clamp(
      (clinical * 0.28 +
        input.textFluency * 24 +
        input.clinicalCoherence * 12) *
        fluentBias -
        input.imageRelevance * 12,
      0,
      100,
    ),
  );

  const safetyScore = round2(
    clamp(
      (input.textFluency * 26 +
        input.safetyDiscipline * 14 +
        (1 - input.urgencyRecognition) * 8) *
        fluentBias -
        input.hallucinationRisk * 12 -
        input.imageRelevance * 10,
      0,
      100,
    ),
  );

  const departmentAlignment = round2(
    clamp(
      (input.textFluency * 22 +
        input.departmentFit * 16 +
        (1 - input.visualGrounding) * 8) *
        fluentBias -
        input.imageRelevance * 14,
      0,
      100,
    ),
  );

  const responseClarity = round2(
    clamp(
      (input.textFluency * 30 + input.turnClarity * 12) * fluentBias -
        input.visualGrounding * 16 -
        input.imageRelevance * 14,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      visualFidelity * 0.16 +
        clinicalPlan * 0.22 +
        safetyScore * 0.22 +
        departmentAlignment * 0.18 +
        responseClarity * 0.22,
      0,
      100,
    ),
  );

  return {
    mode: "text_only",
    visualFidelity,
    clinicalPlan,
    safetyScore,
    departmentAlignment,
    responseClarity,
    overall,
  };
}
