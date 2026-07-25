import {
  type FusionInput,
  type FusionQuality,
  biasWeight,
  clamp,
  deformationLoad,
  round2,
} from "./types";

/**
 * Marker-free deformable fusion scorer (good path A):
 * rewards deformable quality, surface fidelity, margin clarity, stability.
 */
export function scoreMarkerFree(input: FusionInput): FusionQuality {
  const free = input.profile === "marker_free";
  const boost = free ? 1.12 : 0.96;
  const wD = biasWeight(input.fusionBias, "deformable_first");
  const wS = biasWeight(input.fusionBias, "surface_first");
  const wM = biasWeight(input.fusionBias, "marker_first");
  const avgBias = (wD + wS + wM) / 3;
  const load = deformationLoad(
    input.deformationHardness,
    input.deformableQuality,
  );

  const deformableScore = round2(
    clamp(
      (input.deformableQuality * 55 +
        input.surfaceFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (free ? 8 : 0) -
        input.overclaimRisk * (free ? 6 : 14) -
        (input.fusionBias === "marker_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const surfaceScore = round2(
    clamp(
      input.surfaceFidelity * 60 * boost +
        input.deformableQuality * 25 +
        (free ? 8 : 0) -
        input.markerOptimism * (free ? 4 : 16) -
        (input.fusionBias === "marker_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const marginScore = round2(
    clamp(
      input.marginClarity * 58 * boost * wS +
        input.deformableQuality * 28 +
        (free ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const stabilityScore = round2(
    clamp(
      input.fusionStability * 50 * boost * wD +
        input.surfaceFidelity * 25 +
        input.deformableQuality * 15 +
        (free ? 8 : 0) -
        (input.fusionBias === "marker_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const markerScore = round2(
    clamp(
      input.markerPassRate * 55 * boost +
        input.markerOptimism * 20 -
        input.deformationHardness * 18 -
        (free ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.deformableQuality * 40 +
        input.surfaceFidelity * 30 +
        input.marginClarity * 25 -
        input.markerOptimism * 15,
      0,
      100,
    ),
  );
  const markerFreeContribution = round2(
    clamp(
      deformableScore * 0.26 +
        surfaceScore * 0.24 +
        marginScore * 0.28 +
        stabilityScore * 0.22,
      0,
      100,
    ),
  );
  const markerBasedContribution = round2(
    clamp(
      markerScore * 0.7 +
        input.markerPassRate * 20 +
        input.markerOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      markerFreeContribution * (free ? 0.82 : 0.4) +
        markerBasedContribution * (free ? 0.18 : 0.6) +
        (free ? 4 : 0) -
        (input.fusionBias === "marker_first" && free ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "marker_free",
    deformableScore,
    surfaceScore,
    marginScore,
    stabilityScore,
    markerScore,
    confidence,
    markerFreeContribution,
    markerBasedContribution,
    overall,
  };
}

/**
 * Marker-based baseline (path B):
 * rewards marker pass rate + marker optimism, weak on deformable honesty.
 */
export function scoreMarkerBased(input: FusionInput): FusionQuality {
  const based = input.profile === "marker_based";
  const boost = based ? 1.08 : 0.92;
  const wM = biasWeight(input.fusionBias, "marker_first");
  const load = deformationLoad(
    input.deformationHardness,
    input.deformableQuality,
  );

  const deformableScore = round2(
    clamp(
      input.markerPassRate * 35 * boost +
        wM * 10 -
        input.deformationHardness * 22 -
        input.overclaimRisk * 12 -
        (input.fusionBias === "deformable_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const surfaceScore = round2(
    clamp(
      input.markerOptimism * 40 * boost +
        input.markerPassRate * 25 -
        load * 15 -
        input.deformableQuality * 8,
      0,
      100,
    ),
  );
  const marginScore = round2(
    clamp(
      input.markerOptimism * 38 * boost +
        input.markerPassRate * 20 -
        input.marginClarity * (based ? 5 : 0) -
        load * 18 -
        (based ? 0 : 6),
      0,
      100,
    ),
  );
  const stabilityScore = round2(
    clamp(
      input.markerPassRate * 42 * boost +
        input.markerOptimism * 28 -
        input.deformableQuality * 10 +
        (based ? 5 : 0),
      0,
      100,
    ),
  );
  const markerScore = round2(
    clamp(
      input.markerPassRate * 58 * boost * wM +
        input.markerOptimism * 32 -
        input.deformationHardness * 10 +
        (based ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.markerOptimism * 45 +
        input.markerPassRate * 35 -
        input.deformationHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const markerFreeContribution = round2(
    clamp(
      deformableScore * 0.2 +
        surfaceScore * 0.2 +
        marginScore * 0.2 +
        stabilityScore * 0.2 +
        markerScore * 0.2,
      0,
      100,
    ),
  );
  const markerBasedContribution = round2(
    clamp(
      markerScore * 0.55 +
        input.markerOptimism * 30 +
        input.markerPassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      markerBasedContribution * (based ? 0.78 : 0.5) +
        markerFreeContribution * (based ? 0.22 : 0.5) -
        input.deformationHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "marker_based",
    deformableScore,
    surfaceScore,
    marginScore,
    stabilityScore,
    markerScore,
    confidence,
    markerFreeContribution,
    markerBasedContribution,
    overall,
  };
}
