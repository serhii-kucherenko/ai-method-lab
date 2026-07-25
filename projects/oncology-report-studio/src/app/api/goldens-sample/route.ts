import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

const GOLDEN_STUB = {
  id: "ors-stub",
  input: {
    collaboratorCoverage: 0.42,
    findingFidelity: 0.68,
    schemaFit: 0.74,
    consensusAgreement: 0.65,
    singleModelAccuracy: 0.82,
    soloOptimism: 0.7,
    rareFindingHardness: 0.55,
    leakageRisk: 0.28,
    reportBias: "balanced" as const,
    profile: "multi_llm_collaborative" as const,
  },
  expectedMultiLlmCollaborative: {
    mode: "multi_llm_collaborative" as const,
    findingDiagnosis: 0,
    collaboratorDiagnosis: 0,
    schemaReasonScore: 0,
    packIntegrity: 0,
    baselineScore: 0,
    confidence: 0,
    collaboratorContribution: 0,
    baselineContribution: 0,
    overall: 0,
  },
  expectedSingleLlmBaseline: {
    mode: "single_llm_baseline" as const,
    findingDiagnosis: 0,
    collaboratorDiagnosis: 0,
    schemaReasonScore: 0,
    packIntegrity: 0,
    baselineScore: 0,
    confidence: 0,
    collaboratorContribution: 0,
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
