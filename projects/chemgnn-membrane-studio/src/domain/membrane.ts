import {
  type MembraneInput,
  type MembraneQuality,
  biasWeight,
  clamp,
  membraneLoad,
  round2,
} from "./types";

/**
 * ChemGNN graph surrogate scorer (good path A):
 * rewards CNT graph coverage, pore geometry fidelity,
 * salt rejection and water flux proxies for membrane soft-sim.
 */
export function scoreChemgnnSurrogate(input: MembraneInput): MembraneQuality {
  const only = input.profile === "chemgnn_surrogate";
  const boost = only ? 1.12 : 0.96;
  const wG = biasWeight(input.membraneBias, "graph_first");
  const wF = biasWeight(input.membraneBias, "flux_first");
  const wP = biasWeight(input.membraneBias, "physics_first");
  const avgBias = (wG + wF + wP) / 3;
  const load = membraneLoad(input.membraneHardness, input.waterFluxProxy);

  const graphScore = round2(
    clamp(
      (input.graphCoverage * 55 +
        input.poreGeometryFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.membraneBias === "physics_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const poreScore = round2(
    clamp(
      input.poreGeometryFidelity * 60 * boost +
        input.graphCoverage * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.membraneBias === "physics_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const rejectionScore = round2(
    clamp(
      input.saltRejectionProxy * 58 * boost * wF +
        input.graphCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const fluxIntegrity = round2(
    clamp(
      input.waterFluxProxy * 50 * boost * wG +
        input.poreGeometryFidelity * 25 +
        input.graphCoverage * 15 +
        (only ? 8 : 0) -
        (input.membraneBias === "physics_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.classicalPhysicsBreadth * 55 * boost +
        input.baselineOptimism * 20 -
        input.membraneHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.graphCoverage * 40 +
        input.poreGeometryFidelity * 30 +
        input.waterFluxProxy * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const surrogateContribution = round2(
    clamp(
      graphScore * 0.26 +
        poreScore * 0.24 +
        rejectionScore * 0.28 +
        fluxIntegrity * 0.22,
      0,
      100,
    ),
  );
  const physicsContribution = round2(
    clamp(
      baselineScore * 0.7 +
        input.classicalPhysicsBreadth * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      surrogateContribution * (only ? 0.82 : 0.4) +
        physicsContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.membraneBias === "physics_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "chemgnn_surrogate",
    graphScore,
    poreScore,
    rejectionScore,
    fluxIntegrity,
    baselineScore,
    confidence,
    surrogateContribution,
    physicsContribution,
    overall,
  };
}

/**
 * Classical physics baseline (path B):
 * rewards wide classical screens + baseline optimism,
 * weak on ChemGNN graph honesty.
 */
export function scoreClassicalPhysicsBaseline(
  input: MembraneInput,
): MembraneQuality {
  const baseline = input.profile === "classical_physics_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wP = biasWeight(input.membraneBias, "physics_first");
  const load = membraneLoad(input.membraneHardness, input.waterFluxProxy);

  const graphScore = round2(
    clamp(
      input.classicalPhysicsBreadth * 35 * boost +
        wP * 10 -
        input.membraneHardness * 22 -
        input.overclaimRisk * 12 -
        (input.membraneBias === "graph_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const poreScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.classicalPhysicsBreadth * 25 -
        load * 15 -
        input.graphCoverage * 8,
      0,
      100,
    ),
  );
  const rejectionScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.classicalPhysicsBreadth * 20 -
        input.waterFluxProxy * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const fluxIntegrity = round2(
    clamp(
      input.classicalPhysicsBreadth * 42 * boost +
        input.baselineOptimism * 28 -
        input.graphCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const baselineScore = round2(
    clamp(
      input.classicalPhysicsBreadth * 58 * boost * wP +
        input.baselineOptimism * 32 -
        input.membraneHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.classicalPhysicsBreadth * 35 -
        input.membraneHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const surrogateContribution = round2(
    clamp(
      graphScore * 0.2 +
        poreScore * 0.2 +
        rejectionScore * 0.2 +
        fluxIntegrity * 0.2 +
        baselineScore * 0.2,
      0,
      100,
    ),
  );
  const physicsContribution = round2(
    clamp(
      baselineScore * 0.55 +
        input.baselineOptimism * 30 +
        input.classicalPhysicsBreadth * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      physicsContribution * (baseline ? 0.78 : 0.5) +
        surrogateContribution * (baseline ? 0.22 : 0.5) -
        input.membraneHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "classical_physics_baseline",
    graphScore,
    poreScore,
    rejectionScore,
    fluxIntegrity,
    baselineScore,
    confidence,
    surrogateContribution,
    physicsContribution,
    overall,
  };
}
