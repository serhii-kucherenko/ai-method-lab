import {
  type ColearnInput,
  type ColearnQuality,
  biasWeight,
  clamp,
  labelingLoad,
  round2,
} from "./types";

/**
 * Human–AI co-learning labeling scorer (good path A):
 * rewards clinician agreement, activity signal, EHR completeness,
 * and label stability for soft-sim.
 */
export function scoreHumanAiColearningLabeling(
  input: ColearnInput,
): ColearnQuality {
  const only = input.profile === "human_ai_colearning_labeling";
  const boost = only ? 1.12 : 0.96;
  const wC = biasWeight(input.labelingBias, "clinician_first");
  const wA = biasWeight(input.labelingBias, "activity_first");
  const wI = biasWeight(input.labelingBias, "ai_first");
  const avgBias = (wC + wA + wI) / 3;
  const load = labelingLoad(input.labelingHardness, input.ehrCompleteness);

  const agreementScore = round2(
    clamp(
      (input.clinicianAgreement * 55 +
        input.activitySignal * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.labelingBias === "ai_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const activityScore = round2(
    clamp(
      input.activitySignal * 60 * boost +
        input.clinicianAgreement * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.labelingBias === "ai_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const ehrScore = round2(
    clamp(
      input.ehrCompleteness * 58 * boost * wA +
        input.clinicianAgreement * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const stabilityIntegrity = round2(
    clamp(
      input.labelStability * 50 * boost * wC +
        input.activitySignal * 25 +
        input.clinicianAgreement * 15 +
        (only ? 8 : 0) -
        (input.labelingBias === "ai_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const aiOnlyScore = round2(
    clamp(
      input.aiOnlyConfidence * 55 * boost +
        input.baselineOptimism * 20 -
        input.labelingHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.clinicianAgreement * 40 +
        input.activitySignal * 30 +
        input.labelStability * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const humanAiContribution = round2(
    clamp(
      agreementScore * 0.26 +
        activityScore * 0.24 +
        ehrScore * 0.28 +
        stabilityIntegrity * 0.22,
      0,
      100,
    ),
  );
  const aiOnlyContribution = round2(
    clamp(
      aiOnlyScore * 0.7 +
        input.aiOnlyConfidence * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      humanAiContribution * (only ? 0.82 : 0.4) +
        aiOnlyContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.labelingBias === "ai_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "human_ai_colearning_labeling",
    agreementScore,
    activityScore,
    ehrScore,
    stabilityIntegrity,
    aiOnlyScore,
    confidence,
    humanAiContribution,
    aiOnlyContribution,
    overall,
  };
}

/**
 * AI-only labeling baseline (path B):
 * rewards AI-only confidence + baseline optimism,
 * weak on clinician co-learning honesty.
 */
export function scoreAiOnlyLabelingBaseline(
  input: ColearnInput,
): ColearnQuality {
  const baseline = input.profile === "ai_only_labeling_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wI = biasWeight(input.labelingBias, "ai_first");
  const load = labelingLoad(input.labelingHardness, input.ehrCompleteness);

  const agreementScore = round2(
    clamp(
      input.aiOnlyConfidence * 35 * boost +
        wI * 10 -
        input.labelingHardness * 22 -
        input.overclaimRisk * 12 -
        (input.labelingBias === "clinician_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const activityScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.aiOnlyConfidence * 25 -
        load * 15 -
        input.clinicianAgreement * 8,
      0,
      100,
    ),
  );
  const ehrScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.aiOnlyConfidence * 20 -
        input.labelStability * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const stabilityIntegrity = round2(
    clamp(
      input.aiOnlyConfidence * 42 * boost +
        input.baselineOptimism * 28 -
        input.clinicianAgreement * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const aiOnlyScore = round2(
    clamp(
      input.aiOnlyConfidence * 58 * boost * wI +
        input.baselineOptimism * 32 -
        input.labelingHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.aiOnlyConfidence * 35 -
        input.labelingHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const humanAiContribution = round2(
    clamp(
      agreementScore * 0.2 +
        activityScore * 0.2 +
        ehrScore * 0.2 +
        stabilityIntegrity * 0.2 +
        aiOnlyScore * 0.2,
      0,
      100,
    ),
  );
  const aiOnlyContribution = round2(
    clamp(
      aiOnlyScore * 0.55 +
        input.baselineOptimism * 30 +
        input.aiOnlyConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      aiOnlyContribution * (baseline ? 0.78 : 0.5) +
        humanAiContribution * (baseline ? 0.22 : 0.5) -
        input.labelingHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "ai_only_labeling_baseline",
    agreementScore,
    activityScore,
    ehrScore,
    stabilityIntegrity,
    aiOnlyScore,
    confidence,
    humanAiContribution,
    aiOnlyContribution,
    overall,
  };
}
