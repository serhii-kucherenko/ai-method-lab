import {
  type ScriptLexiconInput,
  type ScriptLexiconQuality,
  biasWeight,
  morphologyLoad,
  clamp,
  round2,
} from "./types";

/**
 * Expanded Ge'ez-script lexicon scorer (good path A):
 * rewards lexicon coverage, expansion fidelity, and script fit under morphology hardness.
 */
export function scoreExpandedGeezLexicon(
  input: ScriptLexiconInput,
): ScriptLexiconQuality {
  const expanded = input.profile === "expanded_geez_lexicon";
  const boost = expanded ? 1.12 : 0.96;
  const wS = biasWeight(input.lexiconBias, "script_strict");
  const wL = biasWeight(input.lexiconBias, "lexicon_first");
  const wB = biasWeight(input.lexiconBias, "baseline_first");
  const avgBias = (wS + wL + wB) / 3;
  const load = morphologyLoad(input.morphologyHardness, input.lexiconCoverage);

  const coverageDiagnosis = round2(
    clamp(
      (input.lexiconCoverage * 55 + input.expansionFidelity * 25 - load * 10) *
        boost *
        avgBias +
        (expanded ? 8 : 0) -
        input.leakageRisk * (expanded ? 6 : 14) -
        (input.lexiconBias === "baseline_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const expansionDiagnosis = round2(
    clamp(
      input.expansionFidelity * 60 * boost +
        input.lexiconCoverage * 25 +
        (expanded ? 8 : 0) -
        input.multilingualOptimism * (expanded ? 4 : 16) -
        (input.lexiconBias === "baseline_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const scriptReasonScore = round2(
    clamp(
      input.subwordAgreement * 58 * boost * wL +
        input.lexiconCoverage * 28 +
        (expanded ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.scriptFit * 50 * boost * wS +
        input.expansionFidelity * 25 +
        input.lexiconCoverage * 15 +
        (expanded ? 8 : 0) -
        (input.lexiconBias === "baseline_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineAccuracy * 55 * boost +
        input.multilingualOptimism * 20 -
        input.morphologyHardness * 18 -
        (expanded ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.lexiconCoverage * 40 +
        input.expansionFidelity * 30 +
        input.scriptFit * 25 -
        input.multilingualOptimism * 15,
      0,
      100,
    ),
  );
  const lexiconContribution = round2(
    clamp(
      coverageDiagnosis * 0.26 +
        expansionDiagnosis * 0.24 +
        scriptReasonScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.baselineAccuracy * 20 +
        input.multilingualOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      lexiconContribution * (expanded ? 0.82 : 0.4) +
        baselineContribution * (expanded ? 0.18 : 0.6) +
        (expanded ? 4 : 0) -
        (input.lexiconBias === "baseline_first" && expanded ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "expanded_geez_lexicon",
    coverageDiagnosis,
    expansionDiagnosis,
    scriptReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    lexiconContribution,
    baselineContribution,
    overall,
  };
}

/**
 * Baseline multilingual tokenizer (path B):
 * rewards baseline accuracy + multilingual optimism, weak on Ge'ez expansion honesty.
 */
export function scoreBaselineMultilingual(
  input: ScriptLexiconInput,
): ScriptLexiconQuality {
  const baseline = input.profile === "baseline_multilingual";
  const boost = baseline ? 1.08 : 0.92;
  const wB = biasWeight(input.lexiconBias, "baseline_first");
  const load = morphologyLoad(input.morphologyHardness, input.lexiconCoverage);

  const coverageDiagnosis = round2(
    clamp(
      input.baselineAccuracy * 35 * boost +
        wB * 10 -
        input.morphologyHardness * 22 -
        input.leakageRisk * 12 -
        (input.lexiconBias === "script_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const expansionDiagnosis = round2(
    clamp(
      input.multilingualOptimism * 40 * boost +
        input.baselineAccuracy * 25 -
        load * 15 -
        input.lexiconCoverage * 8,
      0,
      100,
    ),
  );
  const scriptReasonScore = round2(
    clamp(
      input.multilingualOptimism * 38 * boost +
        input.baselineAccuracy * 20 -
        input.scriptFit * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.baselineAccuracy * 42 * boost +
        input.multilingualOptimism * 28 -
        input.lexiconCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.baselineAccuracy * 58 * boost * wB +
        input.multilingualOptimism * 32 -
        input.morphologyHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.multilingualOptimism * 45 +
        input.baselineAccuracy * 35 -
        input.morphologyHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const lexiconContribution = round2(
    clamp(
      coverageDiagnosis * 0.2 +
        expansionDiagnosis * 0.2 +
        scriptReasonScore * 0.2 +
        packIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const baselineContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.multilingualOptimism * 30 +
        input.baselineAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      baselineContribution * (baseline ? 0.78 : 0.5) +
        lexiconContribution * (baseline ? 0.22 : 0.5) -
        input.morphologyHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "baseline_multilingual",
    coverageDiagnosis,
    expansionDiagnosis,
    scriptReasonScore,
    packIntegrity,
    baselineScore,
    confidence,
    lexiconContribution,
    baselineContribution,
    overall,
  };
}
