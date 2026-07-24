/**
 * Dual-impl twin of predict.ts — must stay bitwise-equal on goldens.
 */
import {
  type PredictInput,
  type PredictQuality,
  clamp,
  round2,
} from "./types";

function modalityBoost(modality: PredictInput["modality"]): number {
  switch (modality) {
    case "tabular":
      return 1.0;
    case "imaging":
      return 1.04;
    case "mixed":
      return 1.06;
    case "biomarker":
      return 1.03;
    case "cognitive":
      return 0.98;
    default: {
      const _exhaustive: never = modality;
      return _exhaustive;
    }
  }
}

function clinicalSignal(input: PredictInput): number {
  return clamp(
    52 +
      input.cognitiveDecline * 22 +
      input.imagingSignal * 16 +
      input.biomarkerSignal * 14 +
      input.ageNorm * 10 -
      input.comorbidityLoad * 8,
    0,
    100,
  );
}

function completenessSignal(input: PredictInput): number {
  return clamp(
    input.featureCompleteness * 38 +
      input.temporalSpan * 22 +
      input.missingnessMaskQuality * 24 +
      (1 - input.missingnessRate) * 28 -
      input.comorbidityLoad * 12,
    0,
    100,
  );
}

export function scoreImputationFree(input: PredictInput): PredictQuality {
  const free = input.plan === "imputation_free";
  const boost = (free ? 1.12 : 0.94) * modalityBoost(input.modality);
  const clinical = clinicalSignal(input);
  const complete = completenessSignal(input);

  const riskScore = round2(
    clamp(
      (clinical * 0.55 +
        input.cognitiveDecline * 18 +
        input.imagingSignal * 12 +
        input.biomarkerSignal * 10) *
        boost,
      0,
      100,
    ),
  );

  const missingnessHonesty = round2(
    clamp(
      (input.missingnessMaskQuality * 42 +
        (1 - input.missingnessRate) * 18 +
        complete * 0.28 +
        (free ? 18 : 2)) *
        boost -
        (free ? 0 : input.missingnessRate * 22),
      0,
      100,
    ),
  );

  const uncertaintyQuality = round2(
    clamp(
      (input.calibrationPrior * 28 +
        missingnessHonesty * 0.35 +
        complete * 0.25 +
        (free ? 16 : 4) -
        input.missingnessRate * (free ? 8 : 26)) *
        boost,
      0,
      100,
    ),
  );

  const discrimination = round2(
    clamp(
      (clinical * 0.42 +
        input.featureCompleteness * 22 +
        input.temporalSpan * 14 +
        input.cognitiveDecline * 12) *
        boost,
      0,
      100,
    ),
  );

  const calibration = round2(
    clamp(
      (input.calibrationPrior * 36 +
        uncertaintyQuality * 0.32 +
        missingnessHonesty * 0.22 +
        (free ? 14 : 0) -
        input.missingnessRate * (free ? 6 : 30)) *
        boost,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      riskScore * 0.18 +
        uncertaintyQuality * 0.24 +
        missingnessHonesty * 0.22 +
        discrimination * 0.16 +
        calibration * 0.2,
      0,
      100,
    ),
  );

  return {
    mode: "imputation_free",
    riskScore,
    uncertaintyQuality,
    missingnessHonesty,
    discrimination,
    calibration,
    overall,
  };
}

export function scoreImputeThenPredict(input: PredictInput): PredictQuality {
  const fillBias = clamp(
    0.48 +
      input.featureCompleteness * 0.2 +
      (1 - input.missingnessMaskQuality) * 0.16 +
      input.missingnessRate * 0.22,
    0.32,
    0.96,
  );
  const clinical = clinicalSignal(input);
  const complete = completenessSignal(input);
  const filledCompleteness = clamp(
    input.featureCompleteness + input.missingnessRate * 0.75,
    0,
    1,
  );

  const riskScore = round2(
    clamp(
      (clinical * 0.5 +
        input.cognitiveDecline * 16 +
        filledCompleteness * 20) *
        fillBias,
      0,
      100,
    ),
  );

  const missingnessHonesty = round2(
    clamp(
      (input.missingnessMaskQuality * 12 +
        complete * 0.12 +
        (1 - input.missingnessRate) * 8) *
        fillBias -
        input.missingnessRate * 34,
      0,
      100,
    ),
  );

  const uncertaintyQuality = round2(
    clamp(
      (input.calibrationPrior * 14 + complete * 0.15) * fillBias -
        input.missingnessRate * 38 -
        10,
      0,
      100,
    ),
  );

  const discrimination = round2(
    clamp(
      (clinical * 0.48 + filledCompleteness * 24 + input.imagingSignal * 10) *
        fillBias,
      0,
      100,
    ),
  );

  const calibration = round2(
    clamp(
      (input.calibrationPrior * 18 + discrimination * 0.12) * fillBias -
        input.missingnessRate * 36 -
        (1 - input.missingnessMaskQuality) * 14,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      riskScore * 0.28 +
        uncertaintyQuality * 0.12 +
        missingnessHonesty * 0.1 +
        discrimination * 0.3 +
        calibration * 0.2,
      0,
      100,
    ),
  );

  return {
    mode: "impute_then_predict",
    riskScore,
    uncertaintyQuality,
    missingnessHonesty,
    discrimination,
    calibration,
    overall,
  };
}
