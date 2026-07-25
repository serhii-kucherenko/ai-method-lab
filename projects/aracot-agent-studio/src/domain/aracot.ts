import {
  type AgentInput,
  type AgentQuality,
  biasWeight,
  clamp,
  reasoningLoad,
  round2,
} from "./types";

/**
 * Arabic CoT distilled agent scorer (good path A):
 * rewards CoT step quality, Arabic fluency, distill fidelity,
 * and agent grounding for multilingual soft-sim.
 */
export function scoreArabicCotDistilled(input: AgentInput): AgentQuality {
  const only = input.profile === "arabic_cot_distilled_agent";
  const boost = only ? 1.12 : 0.96;
  const wC = biasWeight(input.agentBias, "cot_first");
  const wD = biasWeight(input.agentBias, "distill_first");
  const wB = biasWeight(input.agentBias, "baseline_first");
  const avgBias = (wC + wD + wB) / 3;
  const load = reasoningLoad(input.reasoningHardness, input.distillFidelity);

  const cotScore = round2(
    clamp(
      (input.cotStepQuality * 55 +
        input.arabicFluency * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.agentBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const arabicScore = round2(
    clamp(
      input.arabicFluency * 60 * boost +
        input.cotStepQuality * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.agentBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const distillScore = round2(
    clamp(
      input.distillFidelity * 58 * boost * wD +
        input.cotStepQuality * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const groundingIntegrity = round2(
    clamp(
      input.agentGrounding * 50 * boost * wC +
        input.arabicFluency * 25 +
        input.cotStepQuality * 15 +
        (only ? 8 : 0) -
        (input.agentBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.multilingualCoverage * 55 * boost +
        input.baselineOptimism * 20 -
        input.reasoningHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cotStepQuality * 40 +
        input.arabicFluency * 30 +
        input.distillFidelity * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const distilledContribution = round2(
    clamp(
      cotScore * 0.26 +
        arabicScore * 0.24 +
        distillScore * 0.28 +
        groundingIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.multilingualCoverage * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      distilledContribution * (only ? 0.82 : 0.4) +
        baselineContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.agentBias === "baseline_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "arabic_cot_distilled_agent",
    cotScore,
    arabicScore,
    distillScore,
    groundingIntegrity,
    baselineScore,
    confidence,
    distilledContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Non-distilled multilingual baseline (path B):
 * rewards multilingual coverage + baseline optimism,
 * weak on Arabic CoT distillation honesty.
 */
export function scoreNondistilledBaseline(input: AgentInput): AgentQuality {
  const baseline = input.profile === "nondistilled_multilingual_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.agentBias, "baseline_first");
  const load = reasoningLoad(input.reasoningHardness, input.distillFidelity);

  const cotScore = round2(
    clamp(
      input.multilingualCoverage * 35 * boost +
        wB * 10 -
        input.reasoningHardness * 22 -
        input.overclaimRisk * 12 -
        (input.agentBias === "cot_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const arabicScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.multilingualCoverage * 25 -
        load * 15 -
        input.cotStepQuality * 8,
      0,
      100,
    ),
  );
  const distillScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.multilingualCoverage * 20 -
        input.distillFidelity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const groundingIntegrity = round2(
    clamp(
      input.multilingualCoverage * 42 * boost +
        input.baselineOptimism * 28 -
        input.cotStepQuality * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.multilingualCoverage * 58 * boost * wB +
        input.baselineOptimism * 32 -
        input.reasoningHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.multilingualCoverage * 35 -
        input.reasoningHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const distilledContribution = round2(
    clamp(
      cotScore * 0.2 +
        arabicScore * 0.2 +
        distillScore * 0.2 +
        groundingIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.baselineOptimism * 30 +
        input.multilingualCoverage * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        distilledContribution * (baseline ? 0.22 : 0.5) -
        input.reasoningHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "nondistilled_multilingual_baseline",
    cotScore,
    arabicScore,
    distillScore,
    groundingIntegrity,
    baselineScore,
    confidence,
    distilledContribution,
    baselineContribution,
    overall,
  };
}
