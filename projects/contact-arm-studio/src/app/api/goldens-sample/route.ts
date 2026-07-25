import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

const GOLDEN_STUB = {
  id: "cas-stub",
  input: {
    contactCoverage: 0.42,
    tactileSalience: 0.68,
    planFit: 0.74,
    sensingAgreement: 0.65,
    visionOnlyAccuracy: 0.82,
    visionOptimism: 0.7,
    contactPressure: 0.55,
    leakageRisk: 0.28,
    contactBias: "balanced" as const,
    profile: "contact_centric" as const,
  },
  expectedContactCentric: {
    mode: "contact_centric" as const,
    contactDiagnosis: 0,
    tactileDiagnosis: 0,
    planReasonScore: 0,
    sensingIntegrity: 0,
    visionOnlyScore: 0,
    confidence: 0,
    contactContribution: 0,
    visionContribution: 0,
    overall: 0,
  },
  expectedVisionOnly: {
    mode: "vision_only" as const,
    contactDiagnosis: 0,
    tactileDiagnosis: 0,
    planReasonScore: 0,
    sensingIntegrity: 0,
    visionOnlyScore: 0,
    confidence: 0,
    contactContribution: 0,
    visionContribution: 0,
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
