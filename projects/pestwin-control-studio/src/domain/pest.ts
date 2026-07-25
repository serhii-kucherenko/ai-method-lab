import {
  type PestInput,
  type PestQuality,
  biasWeight,
  clamp,
  controlLoad,
  round2,
} from "./types";

/**
 * Modular multi-agent pest control scorer (good path A):
 * rewards agent coverage, module coordination,
 * suppression and vector-pressure proxies for soft-sim.
 */
export function scoreModularMultiagentPestControl(
  input: PestInput,
): PestQuality {
  const only = input.profile === "modular_multiagent_pest_control";
  const boost = only ? 1.12 : 0.96;
  const wA = biasWeight(input.controlBias, "agent_first");
  const wC = biasWeight(input.controlBias, "coverage_first");
  const wS = biasWeight(input.controlBias, "species_first");
  const avgBias = (wA + wC + wS) / 3;
  const load = controlLoad(input.controlHardness, input.vectorPressureProxy);

  const agentScore = round2(
    clamp(
      (input.agentCoverage * 55 +
        input.moduleCoordination * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.controlBias === "species_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const coordinationScore = round2(
    clamp(
      input.moduleCoordination * 60 * boost +
        input.agentCoverage * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.controlBias === "species_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const suppressionScore = round2(
    clamp(
      input.suppressionProxy * 58 * boost * wC +
        input.agentCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const coverageIntegrity = round2(
    clamp(
      input.vectorPressureProxy * 50 * boost * wA +
        input.moduleCoordination * 25 +
        input.agentCoverage * 15 +
        (only ? 8 : 0) -
        (input.controlBias === "species_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.singleSpeciesBreadth * 55 * boost +
        input.baselineOptimism * 20 -
        input.controlHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.agentCoverage * 40 +
        input.moduleCoordination * 30 +
        input.vectorPressureProxy * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const multiagentContribution = round2(
    clamp(
      agentScore * 0.26 +
        coordinationScore * 0.24 +
        suppressionScore * 0.28 +
        coverageIntegrity * 0.22,
      0,
      100,
    ),
  );
  const speciesContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.singleSpeciesBreadth * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      multiagentContribution * (only ? 0.82 : 0.4) +
        speciesContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.controlBias === "species_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "modular_multiagent_pest_control",
    agentScore,
    coordinationScore,
    suppressionScore,
    coverageIntegrity,
    baselineScore,
    confidence,
    multiagentContribution,
    speciesContribution,
    overall,
  };
}

/**
 * Single-species baseline (path B):
 * rewards wide single-species screens + baseline optimism,
 * weak on modular multi-agent honesty.
 */
export function scoreSingleSpeciesBaseline(input: PestInput): PestQuality {
  const baseline = input.profile === "single_species_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wS = biasWeight(input.controlBias, "species_first");
  const load = controlLoad(input.controlHardness, input.vectorPressureProxy);

  const agentScore = round2(
    clamp(
      input.singleSpeciesBreadth * 35 * boost +
        wS * 10 -
        input.controlHardness * 22 -
        input.overclaimRisk * 12 -
        (input.controlBias === "agent_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const coordinationScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.singleSpeciesBreadth * 25 -
        load * 15 -
        input.agentCoverage * 8,
      0,
      100,
    ),
  );
  const suppressionScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.singleSpeciesBreadth * 20 -
        input.vectorPressureProxy * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const coverageIntegrity = round2(
    clamp(
      input.singleSpeciesBreadth * 42 * boost +
        input.baselineOptimism * 28 -
        input.agentCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.singleSpeciesBreadth * 58 * boost * wS +
        input.baselineOptimism * 32 -
        input.controlHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.singleSpeciesBreadth * 35 -
        input.controlHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const multiagentContribution = round2(
    clamp(
      agentScore * 0.2 +
        coordinationScore * 0.2 +
        suppressionScore * 0.2 +
        coverageIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const speciesContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.baselineOptimism * 30 +
        input.singleSpeciesBreadth * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      speciesContribution * (baseline ? 0.78 : 0.5) +
        multiagentContribution * (baseline ? 0.22 : 0.5) -
        input.controlHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "single_species_baseline",
    agentScore,
    coordinationScore,
    suppressionScore,
    coverageIntegrity,
    baselineScore,
    confidence,
    multiagentContribution,
    speciesContribution,
    overall,
  };
}
