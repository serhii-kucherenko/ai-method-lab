import {
  type ThoraxInput,
  type ThoraxQuality,
  clamp,
  round2,
} from "./types";

function examBoost(kind: ThoraxInput["examKind"]): number {
  switch (kind) {
    case "pa":
      return 1.06;
    case "lateral":
      return 1.03;
    case "ap":
      return 1.02;
    case "portable":
      return 0.98;
    case "mixed":
      return 1.04;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function imagingSignal(input: ThoraxInput): number {
  return clamp(
    50 +
      input.imageQuality * 18 +
      input.viewClarity * 14 +
      input.lesionBoundaryClarity * 12 +
      input.diseaseSignal * 10 -
      input.noiseLevel * 22,
    0,
    100,
  );
}

function localizeSignal(input: ThoraxInput): number {
  return clamp(
    input.localizationCoverage * 36 +
      input.mapPeakStrength * 28 +
      input.mapCoherence * 18 +
      input.findingRichness * 16 -
      input.noiseLevel * 12,
    0,
    100,
  );
}

/**
 * Classify + localize plan quality (good path).
 * Disease labels paired with PCAM-style lesion maps.
 */
export function scoreClassifyLocalize(input: ThoraxInput): ThoraxQuality {
  const localize = input.plan === "classify_localize";
  const boost = (localize ? 1.12 : 0.94) * examBoost(input.examKind);
  const imaging = imagingSignal(input);
  const loc = localizeSignal(input);

  const classificationQuality = round2(
    clamp(
      (imaging * 0.46 +
        input.diseaseSignal * 24 +
        input.findingRichness * 14 +
        input.viewClarity * 10) *
        boost,
      0,
      100,
    ),
  );

  const localizationIntegrity = round2(
    clamp(
      (input.localizationCoverage * 44 +
        loc * 0.28 +
        (1 - input.noiseLevel) * 16 +
        (localize ? 18 : 2)) *
        boost -
        (localize ? 0 : (1 - input.localizationCoverage) * 28),
      0,
      100,
    ),
  );

  const mapConfidence = round2(
    clamp(
      (input.mapPeakStrength * 30 +
        input.mapCoherence * 24 +
        localizationIntegrity * 0.28 +
        input.lesionBoundaryClarity * 12 +
        (localize ? 14 : 2) -
        input.noiseLevel * (localize ? 6 : 24)) *
        boost,
      0,
      100,
    ),
  );

  const findingCompleteness = round2(
    clamp(
      (input.findingRichness * 38 +
        imaging * 0.28 +
        input.diseaseSignal * 14 +
        input.validationConfidence * 10) *
        boost,
      0,
      100,
    ),
  );

  const planCoherence = round2(
    clamp(
      (input.mapCoherence * 28 +
        mapConfidence * 0.3 +
        localizationIntegrity * 0.24 +
        (localize ? 14 : 0) -
        input.noiseLevel * (localize ? 8 : 28)) *
        boost,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      classificationQuality * 0.2 +
        localizationIntegrity * 0.24 +
        mapConfidence * 0.22 +
        findingCompleteness * 0.16 +
        planCoherence * 0.18,
      0,
      100,
    ),
  );

  return {
    mode: "classify_localize",
    classificationQuality,
    localizationIntegrity,
    mapConfidence,
    findingCompleteness,
    planCoherence,
    overall,
  };
}

/**
 * Classify-only baseline — disease labels without lesion location.
 */
export function scoreClassifyOnly(input: ThoraxInput): ThoraxQuality {
  const classBias = clamp(
    0.46 +
      input.diseaseSignal * 0.18 +
      (1 - input.localizationCoverage) * 0.2 +
      input.findingRichness * 0.14,
    0.32,
    0.94,
  );
  const imaging = imagingSignal(input);
  const loc = localizeSignal(input);
  const pretendedFindings = clamp(
    input.findingRichness + (1 - input.localizationCoverage) * 0.45,
    0,
    1,
  );

  const classificationQuality = round2(
    clamp(
      (imaging * 0.44 + pretendedFindings * 22 + input.viewClarity * 12) *
        classBias,
      0,
      100,
    ),
  );

  const localizationIntegrity = round2(
    clamp(
      (input.localizationCoverage * 10 +
        loc * 0.1 +
        (1 - input.noiseLevel) * 6) *
        classBias -
        (1 - input.localizationCoverage) * 36,
      0,
      100,
    ),
  );

  const mapConfidence = round2(
    clamp(
      (input.mapPeakStrength * 14 + input.mapCoherence * 12) * classBias -
        (1 - input.localizationCoverage) * 30 -
        8,
      0,
      100,
    ),
  );

  const findingCompleteness = round2(
    clamp(
      (imaging * 0.4 + pretendedFindings * 26 + input.diseaseSignal * 10) *
        classBias,
      0,
      100,
    ),
  );

  const planCoherence = round2(
    clamp(
      (input.diseaseSignal * 16 + findingCompleteness * 0.12) * classBias -
        (1 - input.localizationCoverage) * 32 -
        input.noiseLevel * 16,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      classificationQuality * 0.3 +
        localizationIntegrity * 0.1 +
        mapConfidence * 0.12 +
        findingCompleteness * 0.28 +
        planCoherence * 0.2,
      0,
      100,
    ),
  );

  return {
    mode: "classify_only",
    classificationQuality,
    localizationIntegrity,
    mapConfidence,
    findingCompleteness,
    planCoherence,
    overall,
  };
}
