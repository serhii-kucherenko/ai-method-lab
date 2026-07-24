import {
  type OpticalInput,
  type OpticalQuality,
  clamp,
  round2,
} from "./types";

function bandBoost(kind: OpticalInput["bandKind"]): number {
  switch (kind) {
    case "visible":
      return 1.06;
    case "nir":
      return 1.04;
    case "uv":
      return 1.02;
    case "broadband":
      return 1.05;
    case "narrowband":
      return 1.03;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function briefSignal(input: OpticalInput): number {
  return clamp(
    50 +
      input.briefClarity * 22 +
      input.spectrumFit * 14 +
      input.materialDiversity * 10 -
      input.noiseLevel * 18,
    0,
    100,
  );
}

function stackSignal(input: OpticalInput): number {
  return clamp(
    input.stackCoherence * 34 +
      input.thicknessContinuity * 28 +
      input.fabricationFeasibility * 18 +
      input.angleTolerance * 14 -
      input.absorptionLoss * 16,
    0,
    100,
  );
}

/**
 * Dual-impl twin of score.ts — must stay bitwise-equal on goldens.
 */
export function scoreOpenVocab(input: OpticalInput): OpticalQuality {
  const open = input.plan === "open_vocab";
  const boost = (open ? 1.12 : 0.94) * bandBoost(input.bandKind);
  const brief = briefSignal(input);
  const stack = stackSignal(input);

  const briefFidelity = round2(
    clamp(
      (brief * 0.46 +
        input.briefClarity * 28 +
        input.spectrumFit * 12 +
        (open ? 14 : 2)) *
        boost,
      0,
      100,
    ),
  );

  const materialSequenceQuality = round2(
    clamp(
      (input.materialDiversity * 42 +
        stack * 0.22 +
        (1 - input.catalogCoverage) * (open ? 16 : 4) +
        (open ? 16 : 2) -
        (open ? 0 : input.materialDiversity * 12)) *
        boost,
      0,
      100,
    ),
  );

  const thicknessPlanQuality = round2(
    clamp(
      (input.thicknessContinuity * 40 +
        input.fabricationFeasibility * 22 +
        stack * 0.2 +
        (open ? 12 : 4) -
        input.absorptionLoss * (open ? 8 : 20)) *
        boost,
      0,
      100,
    ),
  );

  const spectrumMatch = round2(
    clamp(
      (input.spectrumFit * 36 +
        input.angleTolerance * 18 +
        briefFidelity * 0.18 +
        thicknessPlanQuality * 0.16 +
        (open ? 10 : 2) -
        input.noiseLevel * (open ? 6 : 22)) *
        boost,
      0,
      100,
    ),
  );

  const planCoherence = round2(
    clamp(
      (input.stackCoherence * 30 +
        materialSequenceQuality * 0.22 +
        thicknessPlanQuality * 0.22 +
        (open ? 14 : 0) -
        input.noiseLevel * (open ? 8 : 26)) *
        boost,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      briefFidelity * 0.2 +
        materialSequenceQuality * 0.22 +
        thicknessPlanQuality * 0.22 +
        spectrumMatch * 0.2 +
        planCoherence * 0.16,
      0,
      100,
    ),
  );

  return {
    mode: "open_vocab",
    briefFidelity,
    materialSequenceQuality,
    thicknessPlanQuality,
    spectrumMatch,
    planCoherence,
    overall,
  };
}

/**
 * Catalog-only baseline — fixed materials, no free-form brief path.
 */
export function scoreCatalogOnly(input: OpticalInput): OpticalQuality {
  const catalogBias = clamp(
    0.48 +
      input.catalogCoverage * 0.28 +
      (1 - input.briefClarity) * 0.16 +
      (1 - input.materialDiversity) * 0.12,
    0.34,
    0.94,
  );
  const brief = briefSignal(input);
  const stack = stackSignal(input);
  const pretendedBrief = clamp(
    input.catalogCoverage * 0.7 + (1 - input.briefClarity) * 0.35,
    0,
    1,
  );

  const briefFidelity = round2(
    clamp(
      (brief * 0.28 + pretendedBrief * 24 + input.catalogCoverage * 18) *
        catalogBias -
        input.briefClarity * 18,
      0,
      100,
    ),
  );

  const materialSequenceQuality = round2(
    clamp(
      (input.catalogCoverage * 38 +
        stack * 0.12 +
        (1 - input.materialDiversity) * 10) *
        catalogBias -
        input.materialDiversity * 16,
      0,
      100,
    ),
  );

  const thicknessPlanQuality = round2(
    clamp(
      (input.thicknessContinuity * 28 +
        input.fabricationFeasibility * 16 +
        input.catalogCoverage * 12) *
        catalogBias -
        (1 - input.catalogCoverage) * 10,
      0,
      100,
    ),
  );

  const spectrumMatch = round2(
    clamp(
      (input.spectrumFit * 26 +
        input.angleTolerance * 12 +
        input.catalogCoverage * 14) *
        catalogBias -
        input.briefClarity * 10 -
        input.noiseLevel * 14,
      0,
      100,
    ),
  );

  const planCoherence = round2(
    clamp(
      (input.catalogCoverage * 22 + spectrumMatch * 0.14) * catalogBias -
        input.briefClarity * 20 -
        input.materialDiversity * 14 -
        input.noiseLevel * 12,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      briefFidelity * 0.14 +
        materialSequenceQuality * 0.22 +
        thicknessPlanQuality * 0.24 +
        spectrumMatch * 0.22 +
        planCoherence * 0.18,
      0,
      100,
    ),
  );

  return {
    mode: "catalog_only",
    briefFidelity,
    materialSequenceQuality,
    thicknessPlanQuality,
    spectrumMatch,
    planCoherence,
    overall,
  };
}
