import {
  type ReportInput,
  type ReportQuality,
  biasWeight,
  rareFindingLoad,
  clamp,
  round2,
} from "./types";

/**
 * Multi-LLM collaborative draft scorer (good path A):
 * rewards collaborator coverage, finding fidelity, and schema fit under rare-finding load.
 */
export function scoreMultiLlmCollaborative(
  input: ReportInput,
): ReportQuality {
  const collaborative = input.profile === "multi_llm_collaborative";
  const boost = collaborative ? 1.12 : 0.96;
  const wC = biasWeight(input.reportBias, "collaborative_strict");
  const wM = biasWeight(input.reportBias, "multi_first");
  const wS = biasWeight(input.reportBias, "single_first");
  const avgBias = (wC + wM + wS) / 3;
  const load = rareFindingLoad(
    input.rareFindingHardness,
    input.collaboratorCoverage,
  );

  const findingDiagnosis = round2(
    clamp(
      (input.collaboratorCoverage * 55 +
        input.findingFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (collaborative ? 8 : 0) -
        input.leakageRisk * (collaborative ? 6 : 14) -
        (input.reportBias === "single_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const collaboratorDiagnosis = round2(
    clamp(
      input.findingFidelity * 60 * boost +
        input.collaboratorCoverage * 25 +
        (collaborative ? 8 : 0) -
        input.soloOptimism * (collaborative ? 4 : 16) -
        (input.reportBias === "single_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const schemaReasonScore = round2(
    clamp(
      input.consensusAgreement * 58 * boost * wM +
        input.collaboratorCoverage * 28 +
        (collaborative ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.schemaFit * 50 * boost * wC +
        input.findingFidelity * 25 +
        input.collaboratorCoverage * 15 +
        (collaborative ? 8 : 0) -
        (input.reportBias === "single_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.singleModelAccuracy * 55 * boost +
        input.soloOptimism * 20 -
        input.rareFindingHardness * 18 -
        (collaborative ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.collaboratorCoverage * 40 +
        input.findingFidelity * 30 +
        input.schemaFit * 25 -
        input.soloOptimism * 15,
      0,
      100,
    ),
  );
  const collaboratorContribution = round2(
    clamp(
      findingDiagnosis * 0.26 +
        collaboratorDiagnosis * 0.24 +
        schemaReasonScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.singleModelAccuracy * 20 +
        input.soloOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      collaboratorContribution * (collaborative ? 0.82 : 0.4) +
        baselineContribution * (collaborative ? 0.18 : 0.6) +
        (collaborative ? 4 : 0) -
        (input.reportBias === "single_first" && collaborative ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "multi_llm_collaborative",
    findingDiagnosis,
    collaboratorDiagnosis,
    schemaReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    collaboratorContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Single-LLM / solo baseline (path B):
 * rewards single-model accuracy + solo optimism, weak on collaborative honesty.
 */
export function scoreSingleLlmBaseline(input: ReportInput): ReportQuality {
  const baseline = input.profile === "single_llm_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wS = biasWeight(input.reportBias, "single_first");
  const load = rareFindingLoad(
    input.rareFindingHardness,
    input.collaboratorCoverage,
  );

  const findingDiagnosis = round2(
    clamp(
      input.singleModelAccuracy * 35 * boost +
        wS * 10 -
        input.rareFindingHardness * 22 -
        input.leakageRisk * 12 -
        (input.reportBias === "collaborative_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const collaboratorDiagnosis = round2(
    clamp(
      input.soloOptimism * 40 * boost +
        input.singleModelAccuracy * 25 -
        load * 15 -
        input.collaboratorCoverage * 8,
      0,
      100,
    ),
  );
  const schemaReasonScore = round2(
    clamp(
      input.soloOptimism * 38 * boost +
        input.singleModelAccuracy * 20 -
        input.schemaFit * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.singleModelAccuracy * 42 * boost +
        input.soloOptimism * 28 -
        input.collaboratorCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.singleModelAccuracy * 58 * boost * wS +
        input.soloOptimism * 32 -
        input.rareFindingHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.soloOptimism * 45 +
        input.singleModelAccuracy * 35 -
        input.rareFindingHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const collaboratorContribution = round2(
    clamp(
      findingDiagnosis * 0.2 +
        collaboratorDiagnosis * 0.2 +
        schemaReasonScore * 0.2 +
        packIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.soloOptimism * 30 +
        input.singleModelAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        collaboratorContribution * (baseline ? 0.22 : 0.5) -
        input.rareFindingHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "single_llm_baseline",
    findingDiagnosis,
    collaboratorDiagnosis,
    schemaReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    collaboratorContribution,
    baselineContribution,
    overall,
  };
}
