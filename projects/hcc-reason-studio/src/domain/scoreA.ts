import {
  type HccInput,
  type HccQuality,
  biasWeight,
  caseLoad,
  clamp,
  round2,
} from "./types";

/**
 * Clinical-reasoning LLM scorer (good path A):
 * rewards pathway coverage, clinical cues, and reasoning depth under case hardness.
 */
export function scoreClinicalReasoning(input: HccInput): HccQuality {
  const reasoning = input.profile === "clinical_reasoning";
  const boost = reasoning ? 1.12 : 0.96;
  const wR = biasWeight(input.hccBias, "reasoning_strict");
  const wFirst = biasWeight(input.hccBias, "reasoner_first");
  const wB = biasWeight(input.hccBias, "baseline_first");
  const avgBias = (wR + wFirst + wB) / 3;
  const load = caseLoad(input.caseHardness, input.pathwayCoverage);

  const riskStratification = round2(
    clamp(
      (input.pathwayCoverage * 55 +
        input.clinicalCueFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (reasoning ? 8 : 0) -
        input.leakageRisk * (reasoning ? 6 : 14) -
        (input.hccBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const reasoningDiagnosis = round2(
    clamp(
      input.clinicalCueFidelity * 60 * boost +
        input.pathwayCoverage * 25 +
        (reasoning ? 8 : 0) -
        input.shortcutOptimism * (reasoning ? 4 : 16) -
        (input.hccBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const schemaReasonScore = round2(
    clamp(
      input.reasoningDepth * 58 * boost * wFirst +
        input.pathwayCoverage * 28 +
        (reasoning ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.schemaFit * 50 * boost * wR +
        input.clinicalCueFidelity * 25 +
        input.pathwayCoverage * 15 +
        (reasoning ? 8 : 0) -
        (input.hccBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineAccuracy * 55 * boost +
        input.shortcutOptimism * 20 -
        input.caseHardness * 18 -
        (reasoning ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.pathwayCoverage * 40 +
        input.clinicalCueFidelity * 30 +
        input.schemaFit * 25 -
        input.shortcutOptimism * 15,
      0,
      100,
    ),
  );
  const reasoningContribution = round2(
    clamp(
      riskStratification * 0.26 +
        reasoningDiagnosis * 0.24 +
        schemaReasonScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.baselineAccuracy * 20 +
        input.shortcutOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      reasoningContribution * (reasoning ? 0.82 : 0.4) +
        baselineContribution * (reasoning ? 0.18 : 0.6) +
        (reasoning ? 4 : 0) -
        (input.hccBias === "baseline_first" && reasoning ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "clinical_reasoning",
    riskStratification,
    reasoningDiagnosis,
    schemaReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    reasoningContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Non-reasoning baseline (path B):
 * rewards baseline accuracy + shortcut optimism, weak on clinical reasoning honesty.
 */
export function scoreNonReasoningBaseline(input: HccInput): HccQuality {
  const baseline = input.profile === "non_reasoning_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.hccBias, "baseline_first");
  const load = caseLoad(input.caseHardness, input.pathwayCoverage);

  const riskStratification = round2(
    clamp(
      input.baselineAccuracy * 35 * boost +
        wB * 10 -
        input.caseHardness * 22 -
        input.leakageRisk * 12 -
        (input.hccBias === "reasoning_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const reasoningDiagnosis = round2(
    clamp(
      input.shortcutOptimism * 40 * boost +
        input.baselineAccuracy * 25 -
        load * 15 -
        input.pathwayCoverage * 8,
      0,
      100,
    ),
  );
  const schemaReasonScore = round2(
    clamp(
      input.shortcutOptimism * 38 * boost +
        input.baselineAccuracy * 20 -
        input.schemaFit * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.baselineAccuracy * 42 * boost +
        input.shortcutOptimism * 28 -
        input.pathwayCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineAccuracy * 58 * boost * wB +
        input.shortcutOptimism * 32 -
        input.caseHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.shortcutOptimism * 45 +
        input.baselineAccuracy * 35 -
        input.caseHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const reasoningContribution = round2(
    clamp(
      riskStratification * 0.2 +
        reasoningDiagnosis * 0.2 +
        schemaReasonScore * 0.2 +
        packIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.shortcutOptimism * 30 +
        input.baselineAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        reasoningContribution * (baseline ? 0.22 : 0.5) -
        input.caseHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "non_reasoning_baseline",
    riskStratification,
    reasoningDiagnosis,
    schemaReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    reasoningContribution,
    baselineContribution,
    overall,
  };
}
