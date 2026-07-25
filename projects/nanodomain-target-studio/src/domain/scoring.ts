import {
  type NanodomainInput,
  type NanodomainQuality,
  biasWeight,
  clamp,
  round2,
  spilloverDrag,
} from "./types";

/**
 * Localized nanodomain target scorer (path A):
 * rewards cAMP/PKA localization and PDE pry while preserving systolic
 * performance — without claiming IND/NDA, live dosing, or clinical diagnosis.
 */
export function scoreLocalizedNanodomain(
  input: NanodomainInput,
): NanodomainQuality {
  const only = input.profile === "localized_nanodomain_target";
  const boost = only ? 1.12 : 0.96;
  const wN = biasWeight(input.targetBias, "nanodomain_first");
  const wD = biasWeight(input.targetBias, "diastolic_first");
  const wS = biasWeight(input.targetBias, "systemic_first");
  const avgBias = (wN + wD + (2 - wS)) / 3;
  const drag = spilloverDrag(
    input.systemicSpillover,
    input.phosphorylationCoverage,
  );

  const localizationScore = round2(
    clamp(
      (input.nanodomainLocalization * 55 +
        input.pdePryStrength * 25 +
        input.assaySignal * 15 -
        drag * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.targetBias === "systemic_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const diastolicScore = round2(
    clamp(
      input.diastolicGain * 55 * boost * wD +
        input.nanodomainLocalization * 25 +
        (only ? 8 : 0) -
        (input.targetBias === "systemic_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const systolicScore = round2(
    clamp(
      (input.systolicPreserve * 50 +
        input.pdePryStrength * 20 +
        (1 - input.systemicSpillover) * 20) *
        boost *
        wN +
        (only ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const spilloverPenalty = round2(
    clamp(
      input.systemicSpillover * 55 * boost +
        input.phosphorylationCoverage * 20 -
        input.nanodomainLocalization * 15 +
        drag * 10,
      0,
      100,
    ),
  );
  const phosphorylationScore = round2(
    clamp(
      input.phosphorylationCoverage * 45 * boost +
        (1 - input.nanodomainLocalization) * 20 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.nanodomainLocalization * 30 +
        input.pdePryStrength * 25 +
        input.assaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const nanodomainContribution = round2(
    clamp(
      localizationScore * 0.3 +
        diastolicScore * 0.28 +
        systolicScore * 0.24 +
        (100 - spilloverPenalty) * 0.18,
      0,
      100,
    ),
  );
  const systemicContribution = round2(
    clamp(
      phosphorylationScore * 0.65 +
        diastolicScore * 0.2 +
        spilloverPenalty * 0.15 -
        input.nanodomainLocalization * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      nanodomainContribution * (only ? 0.82 : 0.4) +
        systemicContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.targetBias === "systemic_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "localized_nanodomain_target",
    localizationScore,
    diastolicScore,
    systolicScore,
    spilloverPenalty,
    phosphorylationScore,
    confidence,
    nanodomainContribution,
    systemicContribution,
    overall,
  };
}

/**
 * Systemic phosphorylation baseline scorer (path B):
 * rewards broad phosphorylation coverage and underweights nanodomain localization.
 */
export function scoreSystemicPhosphorylation(
  input: NanodomainInput,
): NanodomainQuality {
  const baseline = input.profile === "systemic_phosphorylation_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wS = biasWeight(input.targetBias, "systemic_first");
  const drag = spilloverDrag(
    input.systemicSpillover,
    input.phosphorylationCoverage,
  );

  const localizationScore = round2(
    clamp(
      input.phosphorylationCoverage * 35 * boost +
        wS * 10 -
        input.nanodomainLocalization * 18 -
        input.overclaimRisk * 12 -
        (input.targetBias === "nanodomain_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const diastolicScore = round2(
    clamp(
      input.diastolicGain * 42 * boost * wS +
        input.phosphorylationCoverage * 28 +
        (baseline ? 8 : 0) -
        drag * 8,
      0,
      100,
    ),
  );
  const systolicScore = round2(
    clamp(
      input.systolicPreserve * 38 * boost +
        (1 - input.pdePryStrength) * 15 -
        input.systemicSpillover * 20 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const spilloverPenalty = round2(
    clamp(
      input.systemicSpillover * 40 * boost +
        input.phosphorylationCoverage * 30 -
        input.nanodomainLocalization * (baseline ? 5 : 12) -
        drag * 6,
      0,
      100,
    ),
  );
  const phosphorylationScore = round2(
    clamp(
      input.phosphorylationCoverage * 60 * boost * wS +
        input.assaySignal * 20 +
        (baseline ? 8 : 0) -
        input.nanodomainLocalization * 10,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.phosphorylationCoverage * 45 +
        input.assaySignal * 30 -
        input.overclaimRisk * 15 -
        drag * 10,
      0,
      100,
    ),
  );
  const nanodomainContribution = round2(
    clamp(
      localizationScore * 0.2 +
        diastolicScore * 0.2 +
        systolicScore * 0.2 +
        (100 - spilloverPenalty) * 0.2 +
        phosphorylationScore * 0.2,
      0,
      100,
    ),
  );
  const systemicContribution = round2(
    clamp(
      phosphorylationScore * 0.55 +
        diastolicScore * 0.3 +
        localizationScore * 0.15 -
        drag * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      systemicContribution * (baseline ? 0.78 : 0.5) +
        nanodomainContribution * (baseline ? 0.22 : 0.5) -
        input.nanodomainLocalization * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "systemic_phosphorylation_baseline",
    localizationScore,
    diastolicScore,
    systolicScore,
    spilloverPenalty,
    phosphorylationScore,
    confidence,
    nanodomainContribution,
    systemicContribution,
    overall,
  };
}
