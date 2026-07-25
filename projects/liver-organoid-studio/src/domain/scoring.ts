import {
  type OrganoidInput,
  type OrganoidQuality,
  biasWeight,
  clamp,
  masldDrag,
  round2,
} from "./types";

/**
 * Multicellular HLO scorer (path A):
 * rewards lineage mix and organoid complexity for MASLD soft-sim
 * without claiming GMP manufacture / transplant / clinical diagnosis.
 */
export function scoreMulticellularHlo(input: OrganoidInput): OrganoidQuality {
  const only = input.profile === "multicellular_hlo_model";
  const boost = only ? 1.12 : 0.96;
  const wH = biasWeight(input.lineageBias, "hlo_first");
  const wL = biasWeight(input.lineageBias, "lipid_first");
  const wC = biasWeight(input.lineageBias, "hlc_first");
  const avgBias = (wH + wL + (2 - wC)) / 3;
  const drag = masldDrag(input.lipidAccumulation, input.inflammationCue);

  const multicellularScore = round2(
    clamp(
      (input.multicellularComplexity * 55 +
        input.stellatePresence * 20 +
        input.cholangiocyteMix * 15 -
        drag * 8) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.lineageBias === "hlc_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const hepatocyteScore = round2(
    clamp(
      input.hepatocyteLikeFidelity * 55 * boost +
        input.differentiationDay * 25 +
        (only ? 8 : 0) -
        (input.lineageBias === "hlc_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const lineageScore = round2(
    clamp(
      (input.stellatePresence * 35 +
        input.cholangiocyteMix * 30 +
        input.multicellularComplexity * 25) *
        boost *
        wH +
        (only ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const masldScore = round2(
    clamp(
      input.lipidAccumulation * 40 * boost * wL +
        input.inflammationCue * 25 +
        input.multicellularComplexity * 20 +
        (only ? 8 : 0) -
        drag * 10 -
        (input.lineageBias === "hlc_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.hepatocyteLikeFidelity * 50 * boost +
        (1 - input.multicellularComplexity) * 25 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.multicellularComplexity * 30 +
        input.hepatocyteLikeFidelity * 25 +
        input.differentiationDay * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const hloContribution = round2(
    clamp(
      multicellularScore * 0.3 +
        lineageScore * 0.28 +
        masldScore * 0.24 +
        hepatocyteScore * 0.18,
      0,
      100,
    ),
  );
  const hlcContribution = round2(
    clamp(
      baselineScore * 0.65 +
        hepatocyteScore * 0.25 +
        (1 - input.stellatePresence) * 10 -
        drag * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      hloContribution * (only ? 0.82 : 0.4) +
        hlcContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.lineageBias === "hlc_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "multicellular_hlo_model",
    multicellularScore,
    hepatocyteScore,
    lineageScore,
    masldScore,
    baselineScore,
    confidence,
    hloContribution,
    hlcContribution,
    overall,
  };
}

/**
 * Single-lineage HLC baseline scorer (path B):
 * rewards hepatocyte-like fidelity alone and underweights multicellular mix.
 */
export function scoreSingleLineageHlc(input: OrganoidInput): OrganoidQuality {
  const baseline = input.profile === "single_lineage_hlc_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wC = biasWeight(input.lineageBias, "hlc_first");
  const drag = masldDrag(input.lipidAccumulation, input.inflammationCue);

  const multicellularScore = round2(
    clamp(
      input.hepatocyteLikeFidelity * 35 * boost +
        wC * 10 -
        input.stellatePresence * 18 -
        input.overclaimRisk * 12 -
        (input.lineageBias === "hlo_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const hepatocyteScore = round2(
    clamp(
      input.hepatocyteLikeFidelity * 58 * boost * wC +
        input.differentiationDay * 22 +
        (baseline ? 8 : 0) -
        drag * 8,
      0,
      100,
    ),
  );
  const lineageScore = round2(
    clamp(
      input.hepatocyteLikeFidelity * 42 * boost +
        (1 - input.cholangiocyteMix) * 20 -
        input.stellatePresence * 15 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const masldScore = round2(
    clamp(
      input.lipidAccumulation * 38 * boost +
        input.hepatocyteLikeFidelity * 25 -
        input.multicellularComplexity * (baseline ? 5 : 12) -
        drag * 10,
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.hepatocyteLikeFidelity * 60 * boost * wC +
        input.differentiationDay * 20 +
        (baseline ? 8 : 0) -
        input.stellatePresence * 10,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.hepatocyteLikeFidelity * 45 +
        input.differentiationDay * 30 -
        input.overclaimRisk * 15 -
        drag * 10,
      0,
      100,
    ),
  );
  const hloContribution = round2(
    clamp(
      multicellularScore * 0.2 +
        lineageScore * 0.2 +
        masldScore * 0.2 +
        hepatocyteScore * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const hlcContribution = round2(
    clamp(
      baselineScore * 0.55 +
        hepatocyteScore * 0.3 +
        lineageScore * 0.15 -
        drag * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      hlcContribution * (baseline ? 0.78 : 0.5) +
        hloContribution * (baseline ? 0.22 : 0.5) -
        input.stellatePresence * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "single_lineage_hlc_baseline",
    multicellularScore,
    hepatocyteScore,
    lineageScore,
    masldScore,
    baselineScore,
    confidence,
    hloContribution,
    hlcContribution,
    overall,
  };
}
