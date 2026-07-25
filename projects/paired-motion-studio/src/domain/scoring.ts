import {
  type PairedMotionInput,
  type PairedMotionQuality,
  biasWeight,
  clamp,
  captureLoad,
  round2,
} from "./types";

/**
 * Distributed ego+exo fusion scorer (path A):
 * rewards ego coverage, exo coverage, fusion clarity,
 * and pack completeness without ego-only theater.
 */
export function scoreDistributedEgoExoFusion(
  input: PairedMotionInput,
): PairedMotionQuality {
  const only = input.profile === "distributed_ego_exo_fusion";
  const boost = only ? 1.12 : 0.96;
  const wF = biasWeight(input.motionBias, "fusion_first");
  const wX = biasWeight(input.motionBias, "exo_first");
  const wE = biasWeight(input.motionBias, "ego_first");
  const avgBias = (wF + wX + (2 - wE)) / 3;
  const load = captureLoad(input.occlusionHardness, input.fusionClarity);

  const egoScore = round2(
    clamp(
      (input.egoCoverage * 55 +
        input.fusionClarity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.motionBias === "ego_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const exoScore = round2(
    clamp(
      input.exoCoverage * 60 * boost +
        input.egoCoverage * 25 +
        (only ? 8 : 0) -
        input.driftRisk * (only ? 4 : 16) -
        (input.motionBias === "ego_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const fusionScore = round2(
    clamp(
      input.fusionClarity * 58 * boost * wF +
        input.egoCoverage * 14 +
        input.exoCoverage * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.packCompleteness * 50 * boost * wX +
        input.exoCoverage * 25 +
        input.egoCoverage * 15 +
        (only ? 8 : 0) -
        (input.motionBias === "ego_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const egoOnlyScore = round2(
    clamp(
      input.egoOnlyAdherence * 55 * boost +
        input.driftRisk * 20 -
        input.occlusionHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.egoCoverage * 30 +
        input.exoCoverage * 30 +
        input.packCompleteness * 25 -
        input.driftRisk * 15,
      0,
      100,
    ),
  );
  const fusionContribution = round2(
    clamp(
      egoScore * 0.24 +
        exoScore * 0.26 +
        fusionScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const egoOnlyContribution = round2(
    clamp(
      egoOnlyScore * 0.7 +
        input.egoOnlyAdherence * 20 +
        input.driftRisk * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      fusionContribution * (only ? 0.82 : 0.4) +
        egoOnlyContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.motionBias === "ego_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "distributed_ego_exo_fusion",
    egoScore,
    exoScore,
    fusionScore,
    completenessScore,
    egoOnlyScore,
    confidence,
    fusionContribution,
    egoOnlyContribution,
    overall,
  };
}

/**
 * Ego-only baseline (path B):
 * rewards ego-only adherence + ignores exo fusion honesty.
 */
export function scoreEgoOnlyBaseline(
  input: PairedMotionInput,
): PairedMotionQuality {
  const baseline = input.profile === "ego_only_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wE = biasWeight(input.motionBias, "ego_first");
  const load = captureLoad(input.occlusionHardness, input.fusionClarity);

  const egoScore = round2(
    clamp(
      input.egoOnlyAdherence * 35 * boost +
        wE * 10 -
        input.occlusionHardness * 22 -
        input.overclaimRisk * 12 -
        (input.motionBias === "fusion_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const exoScore = round2(
    clamp(
      input.driftRisk * 40 * boost +
        input.egoOnlyAdherence * 25 -
        load * 15 -
        input.exoCoverage * 8,
      0,
      100,
    ),
  );
  const fusionScore = round2(
    clamp(
      input.driftRisk * 38 * boost +
        input.egoOnlyAdherence * 20 -
        input.packCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.egoOnlyAdherence * 42 * boost +
        input.driftRisk * 28 -
        input.egoCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const egoOnlyScore = round2(
    clamp(
      input.egoOnlyAdherence * 58 * boost * wE +
        input.driftRisk * 32 -
        input.occlusionHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.driftRisk * 45 +
        input.egoOnlyAdherence * 35 -
        input.occlusionHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const fusionContribution = round2(
    clamp(
      egoScore * 0.2 +
        exoScore * 0.2 +
        fusionScore * 0.2 +
        completenessScore * 0.2 +
        egoOnlyScore * 0.2,
      0,
      100,
    ),
  );
  const egoOnlyContribution = round2(
    clamp(
      egoOnlyScore * 0.55 +
        input.driftRisk * 30 +
        input.egoOnlyAdherence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      egoOnlyContribution * (baseline ? 0.78 : 0.5) +
        fusionContribution * (baseline ? 0.22 : 0.5) -
        input.occlusionHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "ego_only_baseline",
    egoScore,
    exoScore,
    fusionScore,
    completenessScore,
    egoOnlyScore,
    confidence,
    fusionContribution,
    egoOnlyContribution,
    overall,
  };
}
