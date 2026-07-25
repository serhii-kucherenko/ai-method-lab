import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

const GOLDEN_STUB = {
  id: "fss-stub",
  input: {
    maskCoverage: 0.42,
    featureSalience: 0.68,
    cohortFit: 0.74,
    labelAgreement: 0.65,
    fullFeatureAccuracy: 0.82,
    imputationOptimism: 0.7,
    missingnessPressure: 0.55,
    leakageRisk: 0.28,
    sufficiencyBias: "balanced" as const,
    profile: "partial_observation" as const,
  },
  expectedPartialObservation: {
    mode: "partial_observation" as const,
    coverageDiagnosis: 0,
    salienceDiagnosis: 0,
    sufficiencyReasonScore: 0,
    cohortIntegrity: 0,
    fullFeatureScore: 0,
    confidence: 0,
    partialContribution: 0,
    fullContribution: 0,
    overall: 0,
  },
  expectedFullFeature: {
    mode: "full_feature" as const,
    coverageDiagnosis: 0,
    salienceDiagnosis: 0,
    sufficiencyReasonScore: 0,
    cohortIntegrity: 0,
    fullFeatureScore: 0,
    confidence: 0,
    partialContribution: 0,
    fullContribution: 0,
    overall: 0,
  },
};

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  try {
    const first = GOLDENS[0];
    if (first) return json({ golden: first });
  } catch {
    // GOLDENS may be unavailable at runtime
  }
  return json({ golden: GOLDEN_STUB });
}
