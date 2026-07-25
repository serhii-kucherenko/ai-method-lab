import {
  type PbpkInput,
  type PbpkQuality,
  biasWeight,
  clamp,
  topologyLoad,
  round2,
} from "./types";

/**
 * Structure-only topology-compiled PBPK scorer (good path A):
 * rewards structure coverage, topology fidelity, ADME clarity, compile stability.
 */
export function scoreStructureOnly(input: PbpkInput): PbpkQuality {
  const only = input.profile === "structure_only";
  const boost = only ? 1.12 : 0.96;
  const wT = biasWeight(input.pbpkBias, "topology_first");
  const wA = biasWeight(input.pbpkBias, "adme_first");
  const wL = biasWeight(input.pbpkBias, "lab_first");
  const avgBias = (wT + wA + wL) / 3;
  const load = topologyLoad(input.topologyHardness, input.structureCoverage);

  const structureScore = round2(
    clamp(
      (input.structureCoverage * 55 +
        input.topologyFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.pbpkBias === "lab_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const topologyScore = round2(
    clamp(
      input.topologyFidelity * 60 * boost +
        input.structureCoverage * 25 +
        (only ? 8 : 0) -
        input.labOptimism * (only ? 4 : 16) -
        (input.pbpkBias === "lab_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const admeScore = round2(
    clamp(
      input.admeClarity * 58 * boost * wA +
        input.structureCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const compileScore = round2(
    clamp(
      input.compileStability * 50 * boost * wT +
        input.topologyFidelity * 25 +
        input.structureCoverage * 15 +
        (only ? 8 : 0) -
        (input.pbpkBias === "lab_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const labScore = round2(
    clamp(
      input.labPassRate * 55 * boost +
        input.labOptimism * 20 -
        input.topologyHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.structureCoverage * 40 +
        input.topologyFidelity * 30 +
        input.admeClarity * 25 -
        input.labOptimism * 15,
      0,
      100,
    ),
  );
  const structureOnlyContribution = round2(
    clamp(
      structureScore * 0.26 +
        topologyScore * 0.24 +
        admeScore * 0.28 +
        compileScore * 0.22,
      0,
      100,
    ),
  );
  const measuredLabContribution = round2(
    clamp(
      labScore * 0.7 +
        input.labPassRate * 20 +
        input.labOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      structureOnlyContribution * (only ? 0.82 : 0.4) +
        measuredLabContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.pbpkBias === "lab_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "structure_only",
    structureScore,
    topologyScore,
    admeScore,
    compileScore,
    labScore,
    confidence,
    structureOnlyContribution,
    measuredLabContribution,
    overall,
  };
}

/**
 * Measured-lab baseline (path B):
 * rewards lab pass rate + lab optimism, weak on structure-only honesty.
 */
export function scoreMeasuredLab(input: PbpkInput): PbpkQuality {
  const lab = input.profile === "measured_lab";
  const boost = lab ? 1.08 : 0.92;
  const wL = biasWeight(input.pbpkBias, "lab_first");
  const load = topologyLoad(input.topologyHardness, input.structureCoverage);

  const structureScore = round2(
    clamp(
      input.labPassRate * 35 * boost +
        wL * 10 -
        input.topologyHardness * 22 -
        input.overclaimRisk * 12 -
        (input.pbpkBias === "topology_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const topologyScore = round2(
    clamp(
      input.labOptimism * 40 * boost +
        input.labPassRate * 25 -
        load * 15 -
        input.structureCoverage * 8,
      0,
      100,
    ),
  );
  const admeScore = round2(
    clamp(
      input.labOptimism * 38 * boost +
        input.labPassRate * 20 -
        input.admeClarity * (lab ? 5 : 0) -
        load * 18 -
        (lab ? 0 : 6),
      0,
      100,
    ),
  );
  const compileScore = round2(
    clamp(
      input.labPassRate * 42 * boost +
        input.labOptimism * 28 -
        input.structureCoverage * 10 +
        (lab ? 5 : 0),
      0,
      100,
    ),
  );
  const labScore = round2(
    clamp(
      input.labPassRate * 58 * boost * wL +
        input.labOptimism * 32 -
        input.topologyHardness * 10 +
        (lab ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.labOptimism * 45 +
        input.labPassRate * 35 -
        input.topologyHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const structureOnlyContribution = round2(
    clamp(
      structureScore * 0.2 +
        topologyScore * 0.2 +
        admeScore * 0.2 +
        compileScore * 0.2 +
        labScore * 0.2,
      0,
      100,
    ),
  );
  const measuredLabContribution = round2(
    clamp(
      labScore * 0.55 +
        input.labOptimism * 30 +
        input.labPassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      measuredLabContribution * (lab ? 0.78 : 0.5) +
        structureOnlyContribution * (lab ? 0.22 : 0.5) -
        input.topologyHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "measured_lab",
    structureScore,
    topologyScore,
    admeScore,
    compileScore,
    labScore,
    confidence,
    structureOnlyContribution,
    measuredLabContribution,
    overall,
  };
}
