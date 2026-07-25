import {
  type DeltInput,
  type DeltQuality,
  biasWeight,
  clamp,
  noiseLoad,
  round2,
} from "./types";

/**
 * Iterative DELT optimize scorer (path A):
 * rewards construct–screen cycle depth, enrichment, diversity retention,
 * and hit precision without claiming wet-lab IND/NDA validation.
 */
export function scoreIterativeDeltOptimize(input: DeltInput): DeltQuality {
  const only = input.profile === "iterative_delt_optimize";
  const boost = only ? 1.12 : 0.96;
  const wI = biasWeight(input.deltBias, "iterative");
  const wH = biasWeight(input.deltBias, "hit_first");
  const wC = biasWeight(input.deltBias, "coverage_first");
  const avgBias = (wI + wH + (2 - wC)) / 3;
  const load = noiseLoad(input.synthesisNoise, input.cycleDepth);

  const cycleScore = round2(
    clamp(
      (input.cycleDepth * 55 +
        input.enrichmentFold * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.deltBias === "coverage_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const enrichmentScore = round2(
    clamp(
      input.enrichmentFold * 60 * boost +
        input.cycleDepth * 25 +
        (only ? 8 : 0) -
        input.selectionBias * (only ? 4 : 16) -
        (input.deltBias === "coverage_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const diversityScore = round2(
    clamp(
      input.diversityRetention * 58 * boost * wI +
        input.cycleDepth * 14 +
        input.enrichmentFold * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const hitScore = round2(
    clamp(
      input.hitPrecision * 50 * boost * wH +
        input.enrichmentFold * 25 +
        input.cycleDepth * 15 +
        (only ? 8 : 0) -
        (input.deltBias === "coverage_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.libraryCoverage * 55 * boost +
        input.selectionBias * 20 -
        input.synthesisNoise * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cycleDepth * 30 +
        input.enrichmentFold * 30 +
        input.hitPrecision * 25 -
        input.selectionBias * 15,
      0,
      100,
    ),
  );
  const iterativeContribution = round2(
    clamp(
      cycleScore * 0.24 +
        enrichmentScore * 0.26 +
        diversityScore * 0.28 +
        hitScore * 0.22,
      0,
      100,
    ),
  );
  const singlePassContribution = round2(
    clamp(
      coverageScore * 0.7 +
        input.libraryCoverage * 20 +
        input.selectionBias * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      iterativeContribution * (only ? 0.82 : 0.4) +
        singlePassContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.deltBias === "coverage_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "iterative_delt_optimize",
    cycleScore,
    enrichmentScore,
    diversityScore,
    hitScore,
    coverageScore,
    confidence,
    iterativeContribution,
    singlePassContribution,
    overall,
  };
}

/**
 * Single-pass library screen baseline (path B):
 * rewards classic library coverage and ignores iterative cycle honesty.
 */
export function scoreSinglePassLibraryScreen(input: DeltInput): DeltQuality {
  const baseline = input.profile === "single_pass_library_screen";
  const boost = baseline ? 1.08 : 0.92;
  const wC = biasWeight(input.deltBias, "coverage_first");
  const load = noiseLoad(input.synthesisNoise, input.cycleDepth);

  const cycleScore = round2(
    clamp(
      input.libraryCoverage * 35 * boost +
        wC * 10 -
        input.synthesisNoise * 22 -
        input.overclaimRisk * 12 -
        (input.deltBias === "iterative" ? 8 : 0),
      0,
      100,
    ),
  );
  const enrichmentScore = round2(
    clamp(
      input.selectionBias * 40 * boost +
        input.libraryCoverage * 25 -
        load * 15 -
        input.enrichmentFold * 8,
      0,
      100,
    ),
  );
  const diversityScore = round2(
    clamp(
      input.selectionBias * 38 * boost +
        input.libraryCoverage * 20 -
        input.hitPrecision * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const hitScore = round2(
    clamp(
      input.libraryCoverage * 42 * boost +
        input.selectionBias * 28 -
        input.cycleDepth * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.libraryCoverage * 58 * boost * wC +
        input.selectionBias * 32 -
        input.synthesisNoise * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.selectionBias * 45 +
        input.libraryCoverage * 35 -
        input.synthesisNoise * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const iterativeContribution = round2(
    clamp(
      cycleScore * 0.2 +
        enrichmentScore * 0.2 +
        diversityScore * 0.2 +
        hitScore * 0.2 +
        coverageScore * 0.2,
      0,
      100,
    ),
  );
  const singlePassContribution = round2(
    clamp(
      coverageScore * 0.55 +
        input.selectionBias * 30 +
        input.libraryCoverage * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      singlePassContribution * (baseline ? 0.78 : 0.5) +
        iterativeContribution * (baseline ? 0.22 : 0.5) -
        input.synthesisNoise * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "single_pass_library_screen",
    cycleScore,
    enrichmentScore,
    diversityScore,
    hitScore,
    coverageScore,
    confidence,
    iterativeContribution,
    singlePassContribution,
    overall,
  };
}
