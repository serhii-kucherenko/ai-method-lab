import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

const GOLDEN_STUB = {
  id: "ks-stub",
  input: {
    rateCoverage: 0.42,
    entropyFidelity: 0.68,
    mechanismFit: 0.74,
    rateAgreement: 0.65,
    fullRateAccuracy: 0.82,
    unconstrainedOptimism: 0.7,
    stiffnessHardness: 0.55,
    leakageRisk: 0.28,
    kineticsBias: "balanced" as const,
    profile: "entropy_constrained" as const,
  },
  expectedEntropyConstrained: {
    mode: "entropy_constrained" as const,
    rateDiagnosis: 0,
    entropyDiagnosis: 0,
    mechanismReasonScore: 0,
    packIntegrity: 0,
    baselineScore: 0,
    confidence: 0,
    surrogateContribution: 0,
    baselineContribution: 0,
    overall: 0,
  },
  expectedFullRateBaseline: {
    mode: "full_rate_baseline" as const,
    rateDiagnosis: 0,
    entropyDiagnosis: 0,
    mechanismReasonScore: 0,
    packIntegrity: 0,
    baselineScore: 0,
    confidence: 0,
    surrogateContribution: 0,
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
