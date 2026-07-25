import {
  type HydrogelInput,
  type HydrogelQuality,
  biasWeight,
  clamp,
  round2,
  saltDrag,
} from "./types";

/**
 * Dynamic charge regulation scorer (path A):
 * rewards regulation that decouples ion mobility from binding strength
 * without claiming membrane manufacturing / plant ionics / battery qual.
 */
export function scoreDynamicChargeRegulation(
  input: HydrogelInput,
): HydrogelQuality {
  const only = input.profile === "dynamic_charge_regulation";
  const boost = only ? 1.12 : 0.96;
  const wR = biasWeight(input.chargeBias, "regulation_first");
  const wM = biasWeight(input.chargeBias, "mobility_first");
  const wF = biasWeight(input.chargeBias, "fixed_first");
  const avgBias = (wR + wM + (2 - wF)) / 3;
  const drag = saltDrag(input.saltLoad, input.bindingStrength);

  const regulationScore = round2(
    clamp(
      (input.chargeRegulation * 55 +
        input.ionMobility * 25 -
        drag * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.chargeBias === "fixed_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const mobilityScore = round2(
    clamp(
      input.ionMobility * 60 * boost +
        input.gelPermeability * 25 +
        (only ? 8 : 0) -
        input.bindingStrength * (only ? 4 : 16) -
        (input.chargeBias === "fixed_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const bindingScore = round2(
    clamp(
      (1 - input.bindingStrength) * 40 * boost * wR +
        input.chargeRegulation * 30 +
        input.ionMobility * 20 +
        (only ? 8 : 0) -
        drag * 12 -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const saltScore = round2(
    clamp(
      input.gelPermeability * 45 * boost * wM +
        input.swellingRatio * 25 +
        input.chargeRegulation * 20 +
        (only ? 8 : 0) -
        input.saltLoad * 18 -
        (input.chargeBias === "fixed_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const fixedScore = round2(
    clamp(
      input.fixedChargeDensity * 55 * boost +
        input.saltLoad * 20 -
        input.chargeRegulation * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.chargeRegulation * 30 +
        input.ionMobility * 30 +
        input.gelPermeability * 25 -
        input.bindingStrength * 15,
      0,
      100,
    ),
  );
  const regulationContribution = round2(
    clamp(
      regulationScore * 0.28 +
        mobilityScore * 0.26 +
        bindingScore * 0.24 +
        saltScore * 0.22,
      0,
      100,
    ),
  );
  const fixedContribution = round2(
    clamp(
      fixedScore * 0.7 +
        input.fixedChargeDensity * 20 +
        input.saltLoad * 10 -
        drag * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      regulationContribution * (only ? 0.82 : 0.4) +
        fixedContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.chargeBias === "fixed_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "dynamic_charge_regulation",
    regulationScore,
    mobilityScore,
    bindingScore,
    saltScore,
    fixedScore,
    confidence,
    regulationContribution,
    fixedContribution,
    overall,
  };
}

/**
 * Fixed-charge baseline scorer (path B):
 * rewards classic fixed-density charge coverage and ignores regulation honesty.
 */
export function scoreFixedChargeBaseline(
  input: HydrogelInput,
): HydrogelQuality {
  const baseline = input.profile === "fixed_charge_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wF = biasWeight(input.chargeBias, "fixed_first");
  const drag = saltDrag(input.saltLoad, input.bindingStrength);

  const regulationScore = round2(
    clamp(
      input.fixedChargeDensity * 35 * boost +
        wF * 10 -
        input.saltLoad * 22 -
        input.overclaimRisk * 12 -
        (input.chargeBias === "regulation_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const mobilityScore = round2(
    clamp(
      input.fixedChargeDensity * 40 * boost +
        input.bindingStrength * 25 -
        drag * 15 -
        input.ionMobility * 8,
      0,
      100,
    ),
  );
  const bindingScore = round2(
    clamp(
      input.bindingStrength * 38 * boost +
        input.fixedChargeDensity * 20 -
        input.chargeRegulation * (baseline ? 5 : 0) -
        drag * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const saltScore = round2(
    clamp(
      input.saltLoad * 42 * boost +
        input.fixedChargeDensity * 28 -
        input.ionMobility * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const fixedScore = round2(
    clamp(
      input.fixedChargeDensity * 58 * boost * wF +
        input.bindingStrength * 22 +
        input.saltLoad * 12 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.fixedChargeDensity * 45 +
        input.bindingStrength * 35 -
        input.saltLoad * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const regulationContribution = round2(
    clamp(
      regulationScore * 0.2 +
        mobilityScore * 0.2 +
        bindingScore * 0.2 +
        saltScore * 0.2 +
        fixedScore * 0.2,
      0,
      100,
    ),
  );
  const fixedContribution = round2(
    clamp(
      fixedScore * 0.55 +
        input.fixedChargeDensity * 30 +
        input.bindingStrength * 20 -
        drag * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      fixedContribution * (baseline ? 0.78 : 0.5) +
        regulationContribution * (baseline ? 0.22 : 0.5) -
        input.saltLoad * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "fixed_charge_baseline",
    regulationScore,
    mobilityScore,
    bindingScore,
    saltScore,
    fixedScore,
    confidence,
    regulationContribution,
    fixedContribution,
    overall,
  };
}
