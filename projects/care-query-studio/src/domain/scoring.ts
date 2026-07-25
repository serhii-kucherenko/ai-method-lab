import {
  type CareQueryInput,
  type CareQueryQuality,
  biasWeight,
  clamp,
  queryLoad,
  round2,
} from "./types";

/**
 * Multilingual POC LLM answers scorer (good path A):
 * rewards language coverage, clinical fidelity, locale grounding,
 * and answer completeness for soft-sim bedside query packs.
 */
export function scoreMultilingualPocLlmAnswers(
  input: CareQueryInput,
): CareQueryQuality {
  const only = input.profile === "multilingual_poc_llm_answers";
  const boost = only ? 1.12 : 0.96;
  const wL = biasWeight(input.queryBias, "llm_first");
  const wLoc = biasWeight(input.queryBias, "locale_first");
  const wC = biasWeight(input.queryBias, "clinician_first");
  const avgBias = (wL + wLoc + wC) / 3;
  const load = queryLoad(input.queryHardness, input.localeGrounding);

  const languageScore = round2(
    clamp(
      (input.languageCoverage * 55 +
        input.localeGrounding * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.queryBias === "clinician_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.clinicalFidelity * 60 * boost +
        input.languageCoverage * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.queryBias === "clinician_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const localeScore = round2(
    clamp(
      input.localeGrounding * 58 * boost * wLoc +
        input.languageCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.answerCompleteness * 50 * boost * wL +
        input.clinicalFidelity * 25 +
        input.languageCoverage * 15 +
        (only ? 8 : 0) -
        (input.queryBias === "clinician_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const clinicianScore = round2(
    clamp(
      input.clinicianConfidence * 55 * boost +
        input.baselineOptimism * 20 -
        input.queryHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.languageCoverage * 40 +
        input.clinicalFidelity * 30 +
        input.answerCompleteness * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const llmContribution = round2(
    clamp(
      languageScore * 0.26 +
        fidelityScore * 0.24 +
        localeScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const clinicianContribution = round2(
    clamp(
      clinicianScore * 0.7 +
        input.clinicianConfidence * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      llmContribution * (only ? 0.82 : 0.4) +
        clinicianContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.queryBias === "clinician_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "multilingual_poc_llm_answers",
    languageScore,
    fidelityScore,
    localeScore,
    completenessScore,
    clinicianScore,
    confidence,
    llmContribution,
    clinicianContribution,
    overall,
  };
}

/**
 * Local clinician baseline (path B):
 * rewards clinician confidence + baseline optimism,
 * weak on multilingual POC LLM honesty.
 */
export function scoreLocalClinicianBaseline(
  input: CareQueryInput,
): CareQueryQuality {
  const baseline = input.profile === "local_clinician_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wC = biasWeight(input.queryBias, "clinician_first");
  const load = queryLoad(input.queryHardness, input.localeGrounding);

  const languageScore = round2(
    clamp(
      input.clinicianConfidence * 35 * boost +
        wC * 10 -
        input.queryHardness * 22 -
        input.overclaimRisk * 12 -
        (input.queryBias === "llm_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.clinicianConfidence * 25 -
        load * 15 -
        input.languageCoverage * 8,
      0,
      100,
    ),
  );
  const localeScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.clinicianConfidence * 20 -
        input.answerCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.clinicianConfidence * 42 * boost +
        input.baselineOptimism * 28 -
        input.languageCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const clinicianScore = round2(
    clamp(
      input.clinicianConfidence * 58 * boost * wC +
        input.baselineOptimism * 32 -
        input.queryHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.clinicianConfidence * 35 -
        input.queryHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const llmContribution = round2(
    clamp(
      languageScore * 0.2 +
        fidelityScore * 0.2 +
        localeScore * 0.2 +
        completenessScore * 0.2 +
        clinicianScore * 0.2,
      0,
      100,
    ),
  );
  const clinicianContribution = round2(
    clamp(
      clinicianScore * 0.55 +
        input.baselineOptimism * 30 +
        input.clinicianConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      clinicianContribution * (baseline ? 0.78 : 0.5) +
        llmContribution * (baseline ? 0.22 : 0.5) -
        input.queryHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "local_clinician_baseline",
    languageScore,
    fidelityScore,
    localeScore,
    completenessScore,
    clinicianScore,
    confidence,
    llmContribution,
    clinicianContribution,
    overall,
  };
}
