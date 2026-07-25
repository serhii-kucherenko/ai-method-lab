import {
  type TerrainInput,
  type TerrainQuality,
  biasWeight,
  clamp,
  resolutionQuality,
  round2,
  seamPressure,
} from "./types";

function photoBlock(
  resolutionQ: number,
  weight: number,
  overlap: number,
  cloud: number,
): number {
  return clamp(resolutionQ * 55 * weight + overlap * 25 - cloud * 18, 0, 100);
}

/**
 * Physics-aware terrain refresh quality (good path A):
 * rewards elevation priors, control density, slope coherence, seam budgets.
 */
export function scorePhysicsAware(input: TerrainInput): TerrainQuality {
  const physics = input.profile === "physics_aware";
  const boost = physics ? 1.12 : 0.96;
  const wT = biasWeight(input.alignmentBias, "tight_control");
  const wE = biasWeight(input.alignmentBias, "elevation_first");
  const wP = biasWeight(input.alignmentBias, "photo_drape");
  const avgBias = (wT + wE + wP) / 3;
  const pressure = seamPressure(input.elevationChangeM, input.seamBudgetM);
  const resQ = resolutionQuality(input.photoResolutionCm);

  const elevationFidelity = round2(
    clamp(
      (input.elevationPriorStrength * 50 +
        input.controlPointDensity * 30 -
        pressure * 12) *
        boost *
        avgBias +
        (physics ? 8 : 0) -
        input.slopeSteepness * (physics ? 6 : 14),
      0,
      100,
    ),
  );
  const slopeCoherence = round2(
    clamp(
      (1 - input.slopeSteepness) * 55 * boost +
        input.elevationPriorStrength * 25 +
        (physics ? 10 : 0) -
        input.fuelDrift * 12 -
        (input.alignmentBias === "photo_drape" ? 14 : 0),
      0,
      100,
    ),
  );
  const seamContinuity = round2(
    clamp(
      (1 - Math.min(1, pressure)) * 70 * boost +
        input.controlPointDensity * 18 +
        (physics ? 8 : 0) -
        (input.alignmentBias === "photo_drape" ? 16 : 0),
      0,
      100,
    ),
  );
  const fuelLayerFidelity = round2(
    clamp(
      photoBlock(resQ, avgBias, input.overlapRatio, input.cloudCover) *
        boost *
        0.55 +
        (1 - input.fuelDrift) * 35 +
        (physics ? 6 : 0) -
        input.cloudCover * 10,
      0,
      100,
    ),
  );
  const photogrammetryScore = round2(
    clamp(
      photoBlock(resQ, avgBias, input.overlapRatio, input.cloudCover) * boost +
        (physics ? 5 : 0) -
        input.cloudCover * 8,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.controlPointDensity * 40 +
        input.overlapRatio * 30 +
        resQ * 25 -
        input.cloudCover * 20,
      0,
      100,
    ),
  );
  const physicsContribution = round2(
    clamp(
      elevationFidelity * 0.28 +
        slopeCoherence * 0.24 +
        seamContinuity * 0.22 +
        fuelLayerFidelity * 0.14 +
        photogrammetryScore * 0.12,
      0,
      100,
    ),
  );
  const overlayContribution = round2(
    clamp(
      photogrammetryScore * 0.55 +
        fuelLayerFidelity * 0.25 +
        (1 - input.slopeSteepness) * 20 -
        pressure * 15,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      physicsContribution * (physics ? 0.78 : 0.45) +
        overlayContribution * (physics ? 0.22 : 0.55) +
        (physics ? 4 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "physics_aware",
    elevationFidelity,
    slopeCoherence,
    seamContinuity,
    fuelLayerFidelity,
    photogrammetryScore,
    confidence,
    physicsContribution,
    overlayContribution,
    overall,
  };
}

/**
 * Naive photo-on-DEM overlay baseline (path B):
 * drapes imagery without elevation/slope physics — weak on steep change.
 */
export function scoreNaiveOverlay(input: TerrainInput): TerrainQuality {
  const naive = input.profile === "naive_overlay";
  const boost = naive ? 1.08 : 0.92;
  const wP = biasWeight(input.alignmentBias, "photo_drape");
  const pressure = seamPressure(input.elevationChangeM, input.seamBudgetM);
  const resQ = resolutionQuality(input.photoResolutionCm);

  const elevationFidelity = round2(
    clamp(
      resQ * 40 * boost +
        wP * 12 -
        input.elevationChangeM * 1.8 -
        input.slopeSteepness * 28 -
        (input.alignmentBias === "elevation_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const slopeCoherence = round2(
    clamp(
      (1 - input.slopeSteepness) * 35 * boost +
        resQ * 20 -
        pressure * 18 -
        input.fuelDrift * 10,
      0,
      100,
    ),
  );
  const seamContinuity = round2(
    clamp(
      (1 - Math.min(1, pressure)) * 40 * boost +
        input.overlapRatio * 20 -
        input.elevationChangeM * 1.2 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const fuelLayerFidelity = round2(
    clamp(
      resQ * 45 * boost +
        (1 - input.fuelDrift) * 30 -
        input.cloudCover * 22 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const photogrammetryScore = round2(
    clamp(
      resQ * 50 * boost +
        input.overlapRatio * 30 -
        input.cloudCover * 25 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      resQ * 35 +
        input.overlapRatio * 25 -
        input.cloudCover * 25 -
        input.slopeSteepness * 15,
      0,
      100,
    ),
  );
  const physicsContribution = round2(
    clamp(
      elevationFidelity * 0.2 +
        slopeCoherence * 0.2 +
        seamContinuity * 0.2 +
        fuelLayerFidelity * 0.2 +
        photogrammetryScore * 0.2,
      0,
      100,
    ),
  );
  const overlayContribution = round2(
    clamp(
      photogrammetryScore * 0.5 +
        fuelLayerFidelity * 0.3 +
        resQ * 20 -
        pressure * 10,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      overlayContribution * (naive ? 0.72 : 0.5) +
        physicsContribution * (naive ? 0.28 : 0.5) -
        input.slopeSteepness * 8 -
        pressure * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_overlay",
    elevationFidelity,
    slopeCoherence,
    seamContinuity,
    fuelLayerFidelity,
    photogrammetryScore,
    confidence,
    physicsContribution,
    overlayContribution,
    overall,
  };
}
