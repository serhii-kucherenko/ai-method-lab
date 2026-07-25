import {
  type DetectInput,
  type DetectQuality,
  biasWeight,
  clamp,
  detectLoad,
  round2,
} from "./types";

/**
 * CNN stigma-image adulteration detection scorer (good path A):
 * rewards stigma clarity, adulterant contrast, CNN confidence,
 * and texture integrity for soft-sim.
 */
export function scoreCnnAdulterationDetection(input: DetectInput): DetectQuality {
  const only = input.profile === "cnn_adulteration_detection";
  const boost = only ? 1.12 : 0.96;
  const wC = biasWeight(input.detectBias, "cnn_first");
  const wS = biasWeight(input.detectBias, "stigma_first");
  const wV = biasWeight(input.detectBias, "visual_first");
  const avgBias = (wC + wS + wV) / 3;
  const load = detectLoad(input.detectHardness, input.cnnConfidence);

  const stigmaScore = round2(
    clamp(
      (input.stigmaClarity * 55 +
        input.adulterantContrast * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.detectBias === "visual_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const contrastScore = round2(
    clamp(
      input.adulterantContrast * 60 * boost +
        input.stigmaClarity * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.detectBias === "visual_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const cnnScore = round2(
    clamp(
      input.cnnConfidence * 58 * boost * wS +
        input.stigmaClarity * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const textureIntegrity = round2(
    clamp(
      input.textureIntegrity * 50 * boost * wC +
        input.adulterantContrast * 25 +
        input.stigmaClarity * 15 +
        (only ? 8 : 0) -
        (input.detectBias === "visual_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const visualScore = round2(
    clamp(
      input.visualConfidence * 55 * boost +
        input.baselineOptimism * 20 -
        input.detectHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.stigmaClarity * 40 +
        input.adulterantContrast * 30 +
        input.textureIntegrity * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const cnnContribution = round2(
    clamp(
      stigmaScore * 0.26 +
        contrastScore * 0.24 +
        cnnScore * 0.28 +
        textureIntegrity * 0.22,
      0,
      100,
    ),
  );
  const visualContribution = round2(
    clamp(
      visualScore * 0.7 +
        input.visualConfidence * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      cnnContribution * (only ? 0.82 : 0.4) +
        visualContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.detectBias === "visual_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "cnn_adulteration_detection",
    stigmaScore,
    contrastScore,
    cnnScore,
    textureIntegrity,
    visualScore,
    confidence,
    cnnContribution,
    visualContribution,
    overall,
  };
}

/**
 * Visual inspection baseline (path B):
 * rewards visual-inspector confidence + baseline optimism,
 * weak on CNN stigma-image detection honesty.
 */
export function scoreVisualInspectionBaseline(
  input: DetectInput,
): DetectQuality {
  const baseline = input.profile === "visual_inspection_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wV = biasWeight(input.detectBias, "visual_first");
  const load = detectLoad(input.detectHardness, input.cnnConfidence);

  const stigmaScore = round2(
    clamp(
      input.visualConfidence * 35 * boost +
        wV * 10 -
        input.detectHardness * 22 -
        input.overclaimRisk * 12 -
        (input.detectBias === "cnn_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const contrastScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.visualConfidence * 25 -
        load * 15 -
        input.stigmaClarity * 8,
      0,
      100,
    ),
  );
  const cnnScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.visualConfidence * 20 -
        input.textureIntegrity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const textureIntegrity = round2(
    clamp(
      input.visualConfidence * 42 * boost +
        input.baselineOptimism * 28 -
        input.stigmaClarity * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const visualScore = round2(
    clamp(
      input.visualConfidence * 58 * boost * wV +
        input.baselineOptimism * 32 -
        input.detectHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.visualConfidence * 35 -
        input.detectHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const cnnContribution = round2(
    clamp(
      stigmaScore * 0.2 +
        contrastScore * 0.2 +
        cnnScore * 0.2 +
        textureIntegrity * 0.2 +
        visualScore * 0.2,
      0,
      100,
    ),
  );
  const visualContribution = round2(
    clamp(
      visualScore * 0.55 +
        input.baselineOptimism * 30 +
        input.visualConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      visualContribution * (baseline ? 0.78 : 0.5) +
        cnnContribution * (baseline ? 0.22 : 0.5) -
        input.detectHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "visual_inspection_baseline",
    stigmaScore,
    contrastScore,
    cnnScore,
    textureIntegrity,
    visualScore,
    confidence,
    cnnContribution,
    visualContribution,
    overall,
  };
}
