import {
  type SepsisTherapyInput,
  type SepsisTherapyQuality,
  biasWeight,
  clamp,
  round2,
  sepsisLoad,
} from "./types";

/**
 * Continuous-time HMM therapy effectiveness scorer (good path A):
 * rewards onset coverage, regimen fidelity, HMM state clarity,
 * and pack completeness without guideline-theater.
 */
export function scoreCtHmmTherapyEffectiveness(
  input: SepsisTherapyInput,
): SepsisTherapyQuality {
  const only = input.profile === "ct_hmm_therapy_effectiveness";
  const boost = only ? 1.12 : 0.96;
  const wH = biasWeight(input.therapyBias, "hmm_first");
  const wR = biasWeight(input.therapyBias, "regimen_first");
  const wG = biasWeight(input.therapyBias, "guideline_first");
  const avgBias = (wH + wR + (2 - wG)) / 3;
  const load = sepsisLoad(input.sepsisHardness, input.hmmStateClarity);

  const onsetScore = round2(
    clamp(
      (input.onsetCoverage * 55 +
        input.hmmStateClarity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.therapyBias === "guideline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const regimenScore = round2(
    clamp(
      input.regimenFidelity * 60 * boost +
        input.onsetCoverage * 25 +
        (only ? 8 : 0) -
        input.cultureLagOptimism * (only ? 4 : 16) -
        (input.therapyBias === "guideline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const hmmScore = round2(
    clamp(
      input.hmmStateClarity * 58 * boost * wH +
        input.onsetCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.packCompleteness * 50 * boost * wR +
        input.regimenFidelity * 25 +
        input.onsetCoverage * 15 +
        (only ? 8 : 0) -
        (input.therapyBias === "guideline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const guidelineScore = round2(
    clamp(
      input.guidelineAdherence * 55 * boost +
        input.cultureLagOptimism * 20 -
        input.sepsisHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.onsetCoverage * 40 +
        input.regimenFidelity * 30 +
        input.packCompleteness * 25 -
        input.cultureLagOptimism * 15,
      0,
      100,
    ),
  );
  const ctHmmContribution = round2(
    clamp(
      onsetScore * 0.26 +
        regimenScore * 0.24 +
        hmmScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const guidelineContribution = round2(
    clamp(
      guidelineScore * 0.7 +
        input.guidelineAdherence * 20 +
        input.cultureLagOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      ctHmmContribution * (only ? 0.82 : 0.4) +
        guidelineContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.therapyBias === "guideline_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "ct_hmm_therapy_effectiveness",
    onsetScore,
    regimenScore,
    hmmScore,
    completenessScore,
    guidelineScore,
    confidence,
    ctHmmContribution,
    guidelineContribution,
    overall,
  };
}

/**
 * Static guideline baseline (path B):
 * rewards guideline adherence + culture-lag optimism,
 * weak on continuous-time HMM onset honesty.
 */
export function scoreStaticGuidelineBaseline(
  input: SepsisTherapyInput,
): SepsisTherapyQuality {
  const baseline = input.profile === "static_guideline_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wG = biasWeight(input.therapyBias, "guideline_first");
  const load = sepsisLoad(input.sepsisHardness, input.hmmStateClarity);

  const onsetScore = round2(
    clamp(
      input.guidelineAdherence * 35 * boost +
        wG * 10 -
        input.sepsisHardness * 22 -
        input.overclaimRisk * 12 -
        (input.therapyBias === "hmm_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const regimenScore = round2(
    clamp(
      input.cultureLagOptimism * 40 * boost +
        input.guidelineAdherence * 25 -
        load * 15 -
        input.onsetCoverage * 8,
      0,
      100,
    ),
  );
  const hmmScore = round2(
    clamp(
      input.cultureLagOptimism * 38 * boost +
        input.guidelineAdherence * 20 -
        input.packCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.guidelineAdherence * 42 * boost +
        input.cultureLagOptimism * 28 -
        input.onsetCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const guidelineScore = round2(
    clamp(
      input.guidelineAdherence * 58 * boost * wG +
        input.cultureLagOptimism * 32 -
        input.sepsisHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cultureLagOptimism * 45 +
        input.guidelineAdherence * 35 -
        input.sepsisHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const ctHmmContribution = round2(
    clamp(
      onsetScore * 0.2 +
        regimenScore * 0.2 +
        hmmScore * 0.2 +
        completenessScore * 0.2 +
        guidelineScore * 0.2,
      0,
      100,
    ),
  );
  const guidelineContribution = round2(
    clamp(
      guidelineScore * 0.55 +
        input.cultureLagOptimism * 30 +
        input.guidelineAdherence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      guidelineContribution * (baseline ? 0.78 : 0.5) +
        ctHmmContribution * (baseline ? 0.22 : 0.5) -
        input.sepsisHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "static_guideline_baseline",
    onsetScore,
    regimenScore,
    hmmScore,
    completenessScore,
    guidelineScore,
    confidence,
    ctHmmContribution,
    guidelineContribution,
    overall,
  };
}
