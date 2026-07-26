import {
  type SuitInput,
  type SuitQuality,
  biasWeight,
  clamp,
  round2,
  thermalLoad,
} from "./types";

/**
 * CMIP6 thermal suitability scorer (path A):
 * rewards climate-shifted thermal suitability, population-at-risk, and vector
 * niche fidelity — without claiming live outbreak prediction, clinical
 * diagnosis, or operational mosquito control deployment.
 */
export function scoreCmip6Thermal(input: SuitInput): SuitQuality {
  const only = input.profile === "cmip6_thermal_suitability";
  const boost = only ? 1.12 : 0.96;
  const wS = biasWeight(input.climateBias, "ssp585_first");
  const wH = biasWeight(input.climateBias, "historical_first");
  const wL = biasWeight(input.climateBias, "ssp126_first");
  const avgBias = (wS + (2 - wH) + (2 - wL)) / 3;
  const load = thermalLoad(input.thermalSuitIndex, input.climateShiftSignal);

  const thermalScore = round2(
    clamp(
      (input.thermalSuitIndex * 55 +
        input.vectorNicheFidelity * 25 +
        input.assaySignal * 15 -
        load * 6) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.climateBias === "historical_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const populationScore = round2(
    clamp(
      input.populationAtRisk * 55 * boost * wS +
        input.spatialCoverage * 25 +
        (only ? 8 : 0) -
        (input.climateBias === "ssp126_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const shiftScore = round2(
    clamp(
      (input.climateShiftSignal * 50 +
        input.spatialCoverage * 20 +
        (1 - input.historicalStickiness) * 20) *
        boost *
        wS +
        (only ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const nicheScore = round2(
    clamp(
      input.vectorNicheFidelity * 45 * boost +
        input.thermalSuitIndex * 20 +
        input.populationAtRisk * 20 -
        (only ? 0 : 6) -
        input.historicalStickiness * 12,
      0,
      100,
    ),
  );
  const historicalPenalty = round2(
    clamp(
      input.historicalStickiness * 55 * boost +
        load * 15 -
        input.thermalSuitIndex * 15 +
        (1 - input.vectorNicheFidelity) * 10,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.thermalSuitIndex * 30 +
        input.vectorNicheFidelity * 25 +
        input.assaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const cmip6Contribution = round2(
    clamp(
      thermalScore * 0.3 +
        populationScore * 0.28 +
        shiftScore * 0.24 +
        (100 - historicalPenalty) * 0.18,
      0,
      100,
    ),
  );
  const historicalContribution = round2(
    clamp(
      nicheScore * 0.35 +
        populationScore * 0.25 +
        shiftScore * 0.25 +
        historicalPenalty * 0.15 -
        input.thermalSuitIndex * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      cmip6Contribution * (only ? 0.82 : 0.4) +
        historicalContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.climateBias === "historical_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "cmip6_thermal_suitability",
    thermalScore,
    populationScore,
    shiftScore,
    nicheScore,
    historicalPenalty,
    confidence,
    cmip6Contribution,
    historicalContribution,
    overall,
  };
}

/**
 * Static historical baseline scorer (path B):
 * rewards historical stickiness and underweights climate-shifted suitability.
 */
export function scoreStaticHistorical(input: SuitInput): SuitQuality {
  const baseline = input.profile === "static_historical_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wH = biasWeight(input.climateBias, "historical_first");
  const wL = biasWeight(input.climateBias, "ssp126_first");
  const load = thermalLoad(input.thermalSuitIndex, input.climateShiftSignal);

  const thermalScore = round2(
    clamp(
      input.populationAtRisk * 20 * boost +
        input.spatialCoverage * 20 * boost +
        (wH + wL) * 5 -
        input.thermalSuitIndex * 18 -
        input.overclaimRisk * 12 -
        (input.climateBias === "ssp585_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const populationScore = round2(
    clamp(
      input.populationAtRisk * 42 * boost * Math.max(wH, wL) +
        (1 - input.climateShiftSignal) * 18 +
        (baseline ? 8 : 0) -
        load * 8,
      0,
      100,
    ),
  );
  const shiftScore = round2(
    clamp(
      input.historicalStickiness * 38 * boost +
        input.assaySignal * 25 -
        input.climateShiftSignal * 20 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const nicheScore = round2(
    clamp(
      input.vectorNicheFidelity * 50 * boost * Math.max(wH, wL) +
        input.assaySignal * 20 +
        (baseline ? 8 : 0) -
        input.thermalSuitIndex * 10,
      0,
      100,
    ),
  );
  const historicalPenalty = round2(
    clamp(
      (1 - input.historicalStickiness) * 40 * boost +
        load * 25 -
        input.thermalSuitIndex * (baseline ? 5 : 12) -
        input.vectorNicheFidelity * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.populationAtRisk + input.spatialCoverage) * 22 +
        input.assaySignal * 30 -
        input.overclaimRisk * 15 -
        load * 10,
      0,
      100,
    ),
  );
  const cmip6Contribution = round2(
    clamp(
      thermalScore * 0.2 +
        populationScore * 0.2 +
        shiftScore * 0.2 +
        (100 - historicalPenalty) * 0.2 +
        nicheScore * 0.2,
      0,
      100,
    ),
  );
  const historicalContribution = round2(
    clamp(
      nicheScore * 0.55 +
        populationScore * 0.25 +
        shiftScore * 0.2 -
        load * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      historicalContribution * (baseline ? 0.78 : 0.5) +
        cmip6Contribution * (baseline ? 0.22 : 0.5) -
        input.thermalSuitIndex * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "static_historical_baseline",
    thermalScore,
    populationScore,
    shiftScore,
    nicheScore,
    historicalPenalty,
    confidence,
    cmip6Contribution,
    historicalContribution,
    overall,
  };
}
