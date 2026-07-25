import {
  type R2Input,
  type R2Quality,
  biasWeight,
  clamp,
  translationLoad,
  round2,
} from "./types";

/**
 * GAN R2map translation scorer (good path A):
 * rewards T1W/T2W fidelity, GAN stability, and map coherence
 * for Parkinson neuroimaging soft-sim.
 */
export function scoreGanR2mapTranslation(input: R2Input): R2Quality {
  const only = input.profile === "gan_r2map_translation";
  const boost = only ? 1.12 : 0.96;
  const wG = biasWeight(input.translateBias, "gan_first");
  const wM = biasWeight(input.translateBias, "map_first");
  const wC = biasWeight(input.translateBias, "conventional_first");
  const avgBias = (wG + wM + wC) / 3;
  const load = translationLoad(input.translationHardness, input.ganStability);

  const t1wScore = round2(
    clamp(
      (input.t1wFidelity * 55 +
        input.t2wFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.translateBias === "conventional_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const t2wScore = round2(
    clamp(
      input.t2wFidelity * 60 * boost +
        input.t1wFidelity * 25 +
        (only ? 8 : 0) -
        input.conventionalOptimism * (only ? 4 : 16) -
        (input.translateBias === "conventional_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const ganScore = round2(
    clamp(
      input.ganStability * 58 * boost * wG +
        input.t1wFidelity * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const mapIntegrity = round2(
    clamp(
      input.mapCoherence * 50 * boost * wM +
        input.t2wFidelity * 25 +
        input.t1wFidelity * 15 +
        (only ? 8 : 0) -
        (input.translateBias === "conventional_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const conventionalBaselineScore = round2(
    clamp(
      input.conventionalMatchRate * 55 * boost +
        input.conventionalOptimism * 20 -
        input.translationHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.t1wFidelity * 40 +
        input.t2wFidelity * 30 +
        input.ganStability * 25 -
        input.conventionalOptimism * 15,
      0,
      100,
    ),
  );
  const ganContribution = round2(
    clamp(
      t1wScore * 0.26 +
        t2wScore * 0.24 +
        ganScore * 0.28 +
        mapIntegrity * 0.22,
      0,
      100,
    ),
  );
  const conventionalContribution = round2(
    clamp(
      conventionalBaselineScore * 0.7 +
        input.conventionalMatchRate * 20 +
        input.conventionalOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      ganContribution * (only ? 0.82 : 0.4) +
        conventionalContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.translateBias === "conventional_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "gan_r2map_translation",
    t1wScore,
    t2wScore,
    ganScore,
    mapIntegrity,
    conventionalBaselineScore,
    confidence,
    ganContribution,
    conventionalContribution,
    overall,
  };
}

/**
 * Conventional R2 estimation baseline (path B):
 * rewards conventional match rate + optimism,
 * weak on GAN T1W/T2W→R2map honesty.
 */
export function scoreConventionalR2Baseline(input: R2Input): R2Quality {
  const baseline = input.profile === "conventional_r2_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wC = biasWeight(input.translateBias, "conventional_first");
  const load = translationLoad(input.translationHardness, input.ganStability);

  const t1wScore = round2(
    clamp(
      input.conventionalMatchRate * 35 * boost +
        wC * 10 -
        input.translationHardness * 22 -
        input.overclaimRisk * 12 -
        (input.translateBias === "gan_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const t2wScore = round2(
    clamp(
      input.conventionalOptimism * 40 * boost +
        input.conventionalMatchRate * 25 -
        load * 15 -
        input.t1wFidelity * 8,
      0,
      100,
    ),
  );
  const ganScore = round2(
    clamp(
      input.conventionalOptimism * 38 * boost +
        input.conventionalMatchRate * 20 -
        input.ganStability * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const mapIntegrity = round2(
    clamp(
      input.conventionalMatchRate * 42 * boost +
        input.conventionalOptimism * 28 -
        input.t1wFidelity * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const conventionalBaselineScore = round2(
    clamp(
      input.conventionalMatchRate * 58 * boost * wC +
        input.conventionalOptimism * 32 -
        input.translationHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.conventionalOptimism * 45 +
        input.conventionalMatchRate * 35 -
        input.translationHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const ganContribution = round2(
    clamp(
      t1wScore * 0.2 +
        t2wScore * 0.2 +
        ganScore * 0.2 +
        mapIntegrity * 0.2 +
        conventionalBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const conventionalContribution = round2(
    clamp(
      conventionalBaselineScore * 0.55 +
        input.conventionalOptimism * 30 +
        input.conventionalMatchRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      conventionalContribution * (baseline ? 0.78 : 0.5) +
        ganContribution * (baseline ? 0.22 : 0.5) -
        input.translationHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "conventional_r2_baseline",
    t1wScore,
    t2wScore,
    ganScore,
    mapIntegrity,
    conventionalBaselineScore,
    confidence,
    ganContribution,
    conventionalContribution,
    overall,
  };
}
