import {
  type CostInput,
  type CostQuality,
  biasWeight,
  clamp,
  infraLoad,
  round2,
} from "./types";

/**
 * Sovereign-infra water–energy–emissions accounting scorer (good path A):
 * rewards water intensity coverage, energy clarity, emissions factors,
 * and scenario stability.
 */
export function scoreSovereignInfraWeeAccounting(
  input: CostInput,
): CostQuality {
  const only = input.profile === "sovereign_infra_wee_accounting";
  const boost = only ? 1.12 : 0.96;
  const wW = biasWeight(input.costBias, "water_first");
  const wE = biasWeight(input.costBias, "energy_first");
  const wC = biasWeight(input.costBias, "cloud_first");
  const avgBias = (wW + wE + wC) / 3;
  const load = infraLoad(input.infraHardness, input.waterIntensity);

  const waterScore = round2(
    clamp(
      (input.waterIntensity * 55 +
        input.energyIntensity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.costBias === "cloud_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const energyScore = round2(
    clamp(
      input.energyIntensity * 60 * boost +
        input.waterIntensity * 25 +
        (only ? 8 : 0) -
        input.cloudOptimism * (only ? 4 : 16) -
        (input.costBias === "cloud_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const emissionsScore = round2(
    clamp(
      input.emissionsClarity * 58 * boost * wW +
        input.waterIntensity * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const scenarioIntegrity = round2(
    clamp(
      input.scenarioStability * 50 * boost * wE +
        input.energyIntensity * 25 +
        input.waterIntensity * 15 +
        (only ? 8 : 0) -
        (input.costBias === "cloud_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const cloudBaselineScore = round2(
    clamp(
      input.cloudFootprintRate * 55 * boost +
        input.cloudOptimism * 20 -
        input.infraHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.waterIntensity * 40 +
        input.energyIntensity * 30 +
        input.emissionsClarity * 25 -
        input.cloudOptimism * 15,
      0,
      100,
    ),
  );
  const sovereignContribution = round2(
    clamp(
      waterScore * 0.26 +
        energyScore * 0.24 +
        emissionsScore * 0.28 +
        scenarioIntegrity * 0.22,
      0,
      100,
    ),
  );
  const cloudContribution = round2(
    clamp(
      cloudBaselineScore * 0.7 +
        input.cloudFootprintRate * 20 +
        input.cloudOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      sovereignContribution * (only ? 0.82 : 0.4) +
        cloudContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.costBias === "cloud_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "sovereign_infra_wee_accounting",
    waterScore,
    energyScore,
    emissionsScore,
    scenarioIntegrity,
    cloudBaselineScore,
    confidence,
    sovereignContribution,
    cloudContribution,
    overall,
  };
}

/**
 * Naive cloud-footprint baseline (path B):
 * rewards ungated cloud-only footprint pass-rate + optimism,
 * weak on water–energy–emissions honesty.
 */
export function scoreNaiveCloudFootprintBaseline(
  input: CostInput,
): CostQuality {
  const baseline = input.profile === "naive_cloud_footprint_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wC = biasWeight(input.costBias, "cloud_first");
  const load = infraLoad(input.infraHardness, input.waterIntensity);

  const waterScore = round2(
    clamp(
      input.cloudFootprintRate * 35 * boost +
        wC * 10 -
        input.infraHardness * 22 -
        input.overclaimRisk * 12 -
        (input.costBias === "water_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const energyScore = round2(
    clamp(
      input.cloudOptimism * 40 * boost +
        input.cloudFootprintRate * 25 -
        load * 15 -
        input.waterIntensity * 8,
      0,
      100,
    ),
  );
  const emissionsScore = round2(
    clamp(
      input.cloudOptimism * 38 * boost +
        input.cloudFootprintRate * 20 -
        input.emissionsClarity * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const scenarioIntegrity = round2(
    clamp(
      input.cloudFootprintRate * 42 * boost +
        input.cloudOptimism * 28 -
        input.waterIntensity * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const cloudBaselineScore = round2(
    clamp(
      input.cloudFootprintRate * 58 * boost * wC +
        input.cloudOptimism * 32 -
        input.infraHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cloudOptimism * 45 +
        input.cloudFootprintRate * 35 -
        input.infraHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const sovereignContribution = round2(
    clamp(
      waterScore * 0.2 +
        energyScore * 0.2 +
        emissionsScore * 0.2 +
        scenarioIntegrity * 0.2 +
        cloudBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const cloudContribution = round2(
    clamp(
      cloudBaselineScore * 0.55 +
        input.cloudOptimism * 30 +
        input.cloudFootprintRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      cloudContribution * (baseline ? 0.78 : 0.5) +
        sovereignContribution * (baseline ? 0.22 : 0.5) -
        input.infraHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_cloud_footprint_baseline",
    waterScore,
    energyScore,
    emissionsScore,
    scenarioIntegrity,
    cloudBaselineScore,
    confidence,
    sovereignContribution,
    cloudContribution,
    overall,
  };
}
