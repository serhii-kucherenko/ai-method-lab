import {
  type CacheHitInput,
  type CacheHitQuality,
  biasWeight,
  clamp,
  pocketLoad,
  round2,
} from "./types";

/**
 * Structured hit-finding scorer (good path A):
 * rewards pocket coverage, hit fidelity, ligand grounding,
 * and pack completeness for soft-sim hit packs.
 */
export function scoreStructuredHitFinding(
  input: CacheHitInput,
): CacheHitQuality {
  const only = input.profile === "structured_hit_finding";
  const boost = only ? 1.12 : 0.96;
  const wS = biasWeight(input.hitBias, "structure_first");
  const wP = biasWeight(input.hitBias, "pocket_first");
  const wD = biasWeight(input.hitBias, "docking_first");
  const avgBias = (wS + wP + wD) / 3;
  const load = pocketLoad(input.pocketHardness, input.ligandGrounding);

  const pocketScore = round2(
    clamp(
      (input.pocketCoverage * 55 +
        input.ligandGrounding * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.hitBias === "docking_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.hitFidelity * 60 * boost +
        input.pocketCoverage * 25 +
        (only ? 8 : 0) -
        input.dockingOptimism * (only ? 4 : 16) -
        (input.hitBias === "docking_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const ligandScore = round2(
    clamp(
      input.ligandGrounding * 58 * boost * wP +
        input.pocketCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.packCompleteness * 50 * boost * wS +
        input.hitFidelity * 25 +
        input.pocketCoverage * 15 +
        (only ? 8 : 0) -
        (input.hitBias === "docking_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const dockingScore = round2(
    clamp(
      input.dockingConfidence * 55 * boost +
        input.dockingOptimism * 20 -
        input.pocketHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.pocketCoverage * 40 +
        input.hitFidelity * 30 +
        input.packCompleteness * 25 -
        input.dockingOptimism * 15,
      0,
      100,
    ),
  );
  const structureContribution = round2(
    clamp(
      pocketScore * 0.26 +
        fidelityScore * 0.24 +
        ligandScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const dockingContribution = round2(
    clamp(
      dockingScore * 0.7 +
        input.dockingConfidence * 20 +
        input.dockingOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      structureContribution * (only ? 0.82 : 0.4) +
        dockingContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.hitBias === "docking_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "structured_hit_finding",
    pocketScore,
    fidelityScore,
    ligandScore,
    completenessScore,
    dockingScore,
    confidence,
    structureContribution,
    dockingContribution,
    overall,
  };
}

/**
 * Naive docking baseline (path B):
 * rewards docking confidence + optimism,
 * weak on structured hit-finding honesty.
 */
export function scoreNaiveDockingBaseline(
  input: CacheHitInput,
): CacheHitQuality {
  const baseline = input.profile === "naive_docking_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wD = biasWeight(input.hitBias, "docking_first");
  const load = pocketLoad(input.pocketHardness, input.ligandGrounding);

  const pocketScore = round2(
    clamp(
      input.dockingConfidence * 35 * boost +
        wD * 10 -
        input.pocketHardness * 22 -
        input.overclaimRisk * 12 -
        (input.hitBias === "structure_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.dockingOptimism * 40 * boost +
        input.dockingConfidence * 25 -
        load * 15 -
        input.pocketCoverage * 8,
      0,
      100,
    ),
  );
  const ligandScore = round2(
    clamp(
      input.dockingOptimism * 38 * boost +
        input.dockingConfidence * 20 -
        input.packCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.dockingConfidence * 42 * boost +
        input.dockingOptimism * 28 -
        input.pocketCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const dockingScore = round2(
    clamp(
      input.dockingConfidence * 58 * boost * wD +
        input.dockingOptimism * 32 -
        input.pocketHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.dockingOptimism * 45 +
        input.dockingConfidence * 35 -
        input.pocketHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const structureContribution = round2(
    clamp(
      pocketScore * 0.2 +
        fidelityScore * 0.2 +
        ligandScore * 0.2 +
        completenessScore * 0.2 +
        dockingScore * 0.2,
      0,
      100,
    ),
  );
  const dockingContribution = round2(
    clamp(
      dockingScore * 0.55 +
        input.dockingOptimism * 30 +
        input.dockingConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      dockingContribution * (baseline ? 0.78 : 0.5) +
        structureContribution * (baseline ? 0.22 : 0.5) -
        input.pocketHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_docking_baseline",
    pocketScore,
    fidelityScore,
    ligandScore,
    completenessScore,
    dockingScore,
    confidence,
    structureContribution,
    dockingContribution,
    overall,
  };
}
