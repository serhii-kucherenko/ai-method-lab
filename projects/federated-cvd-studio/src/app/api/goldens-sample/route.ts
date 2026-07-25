import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

const GOLDEN_STUB = {
  id: "fcvd-stub",
  input: {
    siteParticipation: 0.42,
    featureFidelity: 0.68,
    schemaFit: 0.74,
    federationAgreement: 0.65,
    centralizedAccuracy: 0.82,
    centralOptimism: 0.7,
    heterogeneityHardness: 0.55,
    leakageRisk: 0.28,
    cvdBias: "balanced" as const,
    profile: "federated_cvd_risk" as const,
  },
  expectedFederatedCvdRisk: {
    mode: "federated_cvd_risk" as const,
    riskDiagnosis: 0,
    federationDiagnosis: 0,
    schemaReasonScore: 0,
    packIntegrity: 0,
    baselineScore: 0,
    confidence: 0,
    federationContribution: 0,
    baselineContribution: 0,
    overall: 0,
  },
  expectedCentralizedBaseline: {
    mode: "centralized_baseline" as const,
    riskDiagnosis: 0,
    federationDiagnosis: 0,
    schemaReasonScore: 0,
    packIntegrity: 0,
    baselineScore: 0,
    confidence: 0,
    federationContribution: 0,
    baselineContribution: 0,
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
