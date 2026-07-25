export type DepartmentKind =
  | "dermatology"
  | "radiology"
  | "ophthalmology"
  | "orthopedics"
  | "general";

export type PlanKind = "multimodal" | "text_only";

export type ScoreMode = "multimodal" | "text_only";

/**
 * Soft-simulation inputs for multimodal medical consult next-response scoring.
 * Method-lab model only — not clinical certification or a live hospital chat.
 */
export type ConsultInput = {
  /** How much the correct next reply depends on the attached image (0–1). */
  imageRelevance: number;
  /** How well the reply grounds findings in the image (0–1). */
  visualGrounding: number;
  /** Clinical logic / plan coherence (0–1). */
  clinicalCoherence: number;
  /** Clarity of the next patient-facing response (0–1). */
  turnClarity: number;
  /** Safety / escalation discipline (0–1). */
  safetyDiscipline: number;
  /** Reliance on fluent text alone (0–1; helps text-only, can hurt multimodal). */
  textFluency: number;
  /** Fit to department consult norms (0–1). */
  departmentFit: number;
  /** Coverage of prior consult history (0–1). */
  historyCoverage: number;
  /** Recognition of urgency cues (0–1). */
  urgencyRecognition: number;
  /** Invented findings without image support (0–1, higher = worse). */
  hallucinationRisk: number;
  department: DepartmentKind;
  plan: PlanKind;
};

export type ConsultQuality = {
  mode: ScoreMode;
  visualFidelity: number;
  clinicalPlan: number;
  safetyScore: number;
  departmentAlignment: number;
  responseClarity: number;
  overall: number;
};

export type ConsultReadiness = {
  imageReady: boolean;
  clinicalReady: boolean;
  safetyReady: boolean;
  departmentReady: boolean;
  overallReady: boolean;
  textOnlyPenalty: number;
  multimodalGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: ConsultQuality,
  input: ConsultInput,
): ConsultReadiness {
  const textOnlyPenalty = round2(
    input.plan === "text_only"
      ? input.imageRelevance * 28 + input.hallucinationRisk * 18
      : input.imageRelevance * 6,
  );
  const multimodalGap = round2(Math.max(0, 70 - quality.visualFidelity));
  const imageReady =
    quality.visualFidelity >= 46 + input.imageRelevance * 22;
  const clinicalReady =
    quality.clinicalPlan >= 48 + input.clinicalCoherence * 20;
  const safetyReady =
    quality.safetyScore >= 50 + input.safetyDiscipline * 18;
  const departmentReady =
    quality.departmentAlignment >= 46 + input.departmentFit * 20;
  return {
    imageReady,
    clinicalReady,
    safetyReady,
    departmentReady,
    overallReady: imageReady && clinicalReady && safetyReady && departmentReady,
    textOnlyPenalty,
    multimodalGap,
  };
}
