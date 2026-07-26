import {
  type FluInput,
  type FluQuality,
  biasWeight,
  clamp,
  round2,
  winterLoad,
} from "./types";

/**
 * Expanded EIV program scorer (path A):
 * rewards coverage among adults ≥65, enhanced-vaccine uptake, Nordic parity,
 * and winter-burden relief — without claiming live immunization logistics,
 * clinical prescribing, or national policy adoption.
 */
export function scoreExpandedEiv(input: FluInput): FluQuality {
  const only = input.profile === "expanded_eiv_program";
  const boost = only ? 1.12 : 0.96;
  const wE = biasWeight(input.programBias, "eiv_first");
  const wC = biasWeight(input.programBias, "coverage_first");
  const wB = biasWeight(input.programBias, "baseline_first");
  const avgBias = (wE + wC + (2 - wB)) / 3;
  const load = winterLoad(input.winterBurdenIndex, input.hospitalPressure);

  const coverageScore = round2(
    clamp(
      (input.coverage65Plus * 55 +
        input.nordicParity * 25 +
        input.assaySignal * 15 -
        load * 6) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.programBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const eivScore = round2(
    clamp(
      input.eivUptakeShare * 55 * boost * wE +
        input.coverage65Plus * 25 +
        (only ? 8 : 0) -
        (input.programBias === "baseline_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const winterScore = round2(
    clamp(
      ((1 - input.winterBurdenIndex) * 50 +
        (1 - input.hospitalPressure) * 20 +
        input.nordicParity * 20) *
        boost *
        wC +
        (only ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const hospitalScore = round2(
    clamp(
      (1 - input.hospitalPressure) * 45 * boost +
        input.eivUptakeShare * 20 +
        input.coverage65Plus * 20 -
        (only ? 0 : 6) -
        input.policyStickiness * 12,
      0,
      100,
    ),
  );
  const policyPenalty = round2(
    clamp(
      input.policyStickiness * 55 * boost +
        load * 15 -
        input.eivUptakeShare * 15 +
        (1 - input.nordicParity) * 10,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.coverage65Plus * 30 +
        input.eivUptakeShare * 25 +
        input.assaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const expandedContribution = round2(
    clamp(
      coverageScore * 0.3 +
        eivScore * 0.28 +
        winterScore * 0.24 +
        (100 - policyPenalty) * 0.18,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      hospitalScore * 0.35 +
        eivScore * 0.25 +
        winterScore * 0.25 +
        policyPenalty * 0.15 -
        input.eivUptakeShare * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      expandedContribution * (only ? 0.82 : 0.4) +
        baselineContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.programBias === "baseline_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "expanded_eiv_program",
    coverageScore,
    eivScore,
    winterScore,
    hospitalScore,
    policyPenalty,
    confidence,
    expandedContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Current policy baseline scorer (path B):
 * rewards policy stickiness and underweights expanded EIV uptake.
 */
export function scoreCurrentPolicy(input: FluInput): FluQuality {
  const baseline = input.profile === "current_policy_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.programBias, "baseline_first");
  const wC = biasWeight(input.programBias, "coverage_first");
  const load = winterLoad(input.winterBurdenIndex, input.hospitalPressure);

  const coverageScore = round2(
    clamp(
      input.coverage65Plus * 20 * boost +
        input.nordicParity * 20 * boost +
        (wB + wC) * 5 -
        input.eivUptakeShare * 18 -
        input.overclaimRisk * 12 -
        (input.programBias === "eiv_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const eivScore = round2(
    clamp(
      input.coverage65Plus * 42 * boost * Math.max(wB, wC) +
        input.policyStickiness * 18 +
        (baseline ? 8 : 0) -
        load * 8,
      0,
      100,
    ),
  );
  const winterScore = round2(
    clamp(
      input.policyStickiness * 38 * boost +
        input.assaySignal * 25 -
        (1 - input.winterBurdenIndex) * 20 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const hospitalScore = round2(
    clamp(
      (1 - input.hospitalPressure) * 50 * boost * Math.max(wB, wC) +
        input.assaySignal * 20 +
        (baseline ? 8 : 0) -
        input.eivUptakeShare * 10,
      0,
      100,
    ),
  );
  const policyPenalty = round2(
    clamp(
      (1 - input.policyStickiness) * 40 * boost +
        load * 25 -
        input.eivUptakeShare * (baseline ? 5 : 12) -
        input.nordicParity * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.coverage65Plus + input.nordicParity) * 22 +
        input.assaySignal * 30 -
        input.overclaimRisk * 15 -
        load * 10,
      0,
      100,
    ),
  );
  const expandedContribution = round2(
    clamp(
      coverageScore * 0.2 +
        eivScore * 0.2 +
        winterScore * 0.2 +
        (100 - policyPenalty) * 0.2 +
        hospitalScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      hospitalScore * 0.55 +
        eivScore * 0.25 +
        winterScore * 0.2 -
        load * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        expandedContribution * (baseline ? 0.22 : 0.5) -
        input.eivUptakeShare * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "current_policy_baseline",
    coverageScore,
    eivScore,
    winterScore,
    hospitalScore,
    policyPenalty,
    confidence,
    expandedContribution,
    baselineContribution,
    overall,
  };
}
