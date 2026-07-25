import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

const GOLDEN_STUB = {
  id: "sls-stub",
  input: {
    lexiconCoverage: 0.42,
    expansionFidelity: 0.68,
    scriptFit: 0.74,
    subwordAgreement: 0.65,
    baselineAccuracy: 0.82,
    multilingualOptimism: 0.7,
    morphologyHardness: 0.55,
    leakageRisk: 0.28,
    lexiconBias: "balanced" as const,
    profile: "expanded_geez_lexicon" as const,
  },
  expectedExpandedGeezLexicon: {
    mode: "expanded_geez_lexicon" as const,
    coverageDiagnosis: 0,
    expansionDiagnosis: 0,
    scriptReasonScore: 0,
    packIntegrity: 0,
    baselineScore: 0,
    confidence: 0,
    lexiconContribution: 0,
    baselineContribution: 0,
    overall: 0,
  },
  expectedBaselineMultilingual: {
    mode: "baseline_multilingual" as const,
    coverageDiagnosis: 0,
    expansionDiagnosis: 0,
    scriptReasonScore: 0,
    packIntegrity: 0,
    baselineScore: 0,
    confidence: 0,
    lexiconContribution: 0,
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
