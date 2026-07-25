import {
  type TherapyInput,
  type TherapyQuality,
  biasWeight,
  clamp,
  scenarioLoad,
  round2,
} from "./types";

/**
 * Structured therapy-safety gates scorer (good path A):
 * rewards gate coverage, refusal strength, crisis escalation,
 * and boundary clarity for soft-sim.
 */
export function scoreStructuredTherapySafetyGates(
  input: TherapyInput,
): TherapyQuality {
  const only = input.profile === "structured_therapy_safety_gates";
  const boost = only ? 1.12 : 0.96;
  const wG = biasWeight(input.therapyBias, "gates_first");
  const wR = biasWeight(input.therapyBias, "refusal_first");
  const wP = biasWeight(input.therapyBias, "prompt_first");
  const avgBias = (wG + wR + wP) / 3;
  const load = scenarioLoad(input.scenarioHardness, input.refusalStrength);

  const gateScore = round2(
    clamp(
      (input.gateCoverage * 55 +
        input.refusalStrength * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.therapyBias === "prompt_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const refusalScore = round2(
    clamp(
      input.refusalStrength * 60 * boost +
        input.gateCoverage * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.therapyBias === "prompt_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const crisisScore = round2(
    clamp(
      input.crisisEscalation * 58 * boost * wR +
        input.gateCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const boundaryScore = round2(
    clamp(
      input.boundaryClarity * 50 * boost * wG +
        input.refusalStrength * 25 +
        input.gateCoverage * 15 +
        (only ? 8 : 0) -
        (input.therapyBias === "prompt_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const promptOnlyScore = round2(
    clamp(
      input.promptOnlyConfidence * 55 * boost +
        input.baselineOptimism * 20 -
        input.scenarioHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.gateCoverage * 40 +
        input.refusalStrength * 30 +
        input.boundaryClarity * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const gatesContribution = round2(
    clamp(
      gateScore * 0.26 +
        refusalScore * 0.24 +
        crisisScore * 0.28 +
        boundaryScore * 0.22,
      0,
      100,
    ),
  );
  const promptContribution = round2(
    clamp(
      promptOnlyScore * 0.7 +
        input.promptOnlyConfidence * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      gatesContribution * (only ? 0.82 : 0.4) +
        promptContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.therapyBias === "prompt_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "structured_therapy_safety_gates",
    gateScore,
    refusalScore,
    crisisScore,
    boundaryScore,
    promptOnlyScore,
    confidence,
    gatesContribution,
    promptContribution,
    overall,
  };
}

/**
 * Prompt-only safety baseline (path B):
 * rewards prompt-only confidence + baseline optimism,
 * weak on structured therapy-safety gate honesty.
 */
export function scorePromptOnlySafetyBaseline(
  input: TherapyInput,
): TherapyQuality {
  const baseline = input.profile === "prompt_only_safety_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wP = biasWeight(input.therapyBias, "prompt_first");
  const load = scenarioLoad(input.scenarioHardness, input.refusalStrength);

  const gateScore = round2(
    clamp(
      input.promptOnlyConfidence * 35 * boost +
        wP * 10 -
        input.scenarioHardness * 22 -
        input.overclaimRisk * 12 -
        (input.therapyBias === "gates_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const refusalScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.promptOnlyConfidence * 25 -
        load * 15 -
        input.gateCoverage * 8,
      0,
      100,
    ),
  );
  const crisisScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.promptOnlyConfidence * 20 -
        input.boundaryClarity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const boundaryScore = round2(
    clamp(
      input.promptOnlyConfidence * 42 * boost +
        input.baselineOptimism * 28 -
        input.gateCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const promptOnlyScore = round2(
    clamp(
      input.promptOnlyConfidence * 58 * boost * wP +
        input.baselineOptimism * 32 -
        input.scenarioHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.promptOnlyConfidence * 35 -
        input.scenarioHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const gatesContribution = round2(
    clamp(
      gateScore * 0.2 +
        refusalScore * 0.2 +
        crisisScore * 0.2 +
        boundaryScore * 0.2 +
        promptOnlyScore * 0.2,
      0,
      100,
    ),
  );
  const promptContribution = round2(
    clamp(
      promptOnlyScore * 0.55 +
        input.baselineOptimism * 30 +
        input.promptOnlyConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      promptContribution * (baseline ? 0.78 : 0.5) +
        gatesContribution * (baseline ? 0.22 : 0.5) -
        input.scenarioHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "prompt_only_safety_baseline",
    gateScore,
    refusalScore,
    crisisScore,
    boundaryScore,
    promptOnlyScore,
    confidence,
    gatesContribution,
    promptContribution,
    overall,
  };
}
