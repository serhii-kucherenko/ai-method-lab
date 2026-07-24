export type CohortModality =
  | "tabular"
  | "imaging"
  | "mixed"
  | "biomarker"
  | "cognitive";

export type PlanKind = "imputation_free" | "impute_then_predict";

export type ScoreMode = "imputation_free" | "impute_then_predict";

/**
 * Soft-simulation inputs for Alzheimer’s risk plans.
 * Method-lab model only — not clinical certification or live EHR diagnosis.
 */
export type PredictInput = {
  /** Age-normalized risk prior (0–1). */
  ageNorm: number;
  /** Cognitive decline signal (0–1, higher = more decline). */
  cognitiveDecline: number;
  /** Imaging atrophy / lesion signal (0–1). */
  imagingSignal: number;
  /** Biomarker signal (0–1). */
  biomarkerSignal: number;
  /** Fraction of features missing (0–1). */
  missingnessRate: number;
  /** How well missingness is observed / masked (0–1). */
  missingnessMaskQuality: number;
  /** Prior strength for calibration (0–1). */
  calibrationPrior: number;
  /** Observed feature completeness (0–1). */
  featureCompleteness: number;
  /** Longitudinal span available (0–1). */
  temporalSpan: number;
  /** Comorbidity / confounder load (0–1, higher = harder). */
  comorbidityLoad: number;
  modality: CohortModality;
  plan: PlanKind;
};

export type PredictQuality = {
  mode: ScoreMode;
  riskScore: number;
  uncertaintyQuality: number;
  missingnessHonesty: number;
  discrimination: number;
  calibration: number;
  overall: number;
};

export type UncertaintyReadiness = {
  missingnessHonest: boolean;
  calibrationReady: boolean;
  discriminationReady: boolean;
  uncertaintyReady: boolean;
  overallReady: boolean;
  imputationPenalty: number;
  calibrationGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: PredictQuality,
  input: PredictInput,
): UncertaintyReadiness {
  const imputationPenalty = round2(
    input.plan === "impute_then_predict"
      ? input.missingnessRate * 28 + (1 - input.missingnessMaskQuality) * 12
      : input.missingnessRate * 6,
  );
  const calibrationGap = round2(Math.max(0, 70 - quality.calibration));
  const missingnessHonest =
    quality.missingnessHonesty >= 52 + input.missingnessMaskQuality * 20;
  const calibrationReady =
    quality.calibration >= 50 + input.calibrationPrior * 18;
  const discriminationReady =
    quality.discrimination >= 48 + input.featureCompleteness * 20;
  const uncertaintyReady =
    quality.uncertaintyQuality >= 50 + (1 - input.missingnessRate) * 16;
  return {
    missingnessHonest,
    calibrationReady,
    discriminationReady,
    uncertaintyReady,
    overallReady:
      missingnessHonest &&
      calibrationReady &&
      discriminationReady &&
      uncertaintyReady,
    imputationPenalty,
    calibrationGap,
  };
}
