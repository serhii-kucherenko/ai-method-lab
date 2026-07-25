import {
  type TrackMapInput,
  type TrackMapQuality,
  biasWeight,
  clamp,
  deformLoad,
  round2,
} from "./types";

/**
 * Online deformable SLAM scorer (good path A):
 * rewards deform coverage, SLAM fidelity, pose grounding,
 * and pack completeness for soft-sim track packs.
 */
export function scoreOnlineDeformableSlam(
  input: TrackMapInput,
): TrackMapQuality {
  const only = input.profile === "online_deformable_slam";
  const boost = only ? 1.12 : 0.96;
  const wD = biasWeight(input.trackBias, "deform_first");
  const wP = biasWeight(input.trackBias, "pose_first");
  const wK = biasWeight(input.trackBias, "kinematics_first");
  const avgBias = (wD + wP + wK) / 3;
  const load = deformLoad(input.deformHardness, input.poseGrounding);

  const deformScore = round2(
    clamp(
      (input.deformCoverage * 55 +
        input.poseGrounding * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.trackBias === "kinematics_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.slamFidelity * 60 * boost +
        input.deformCoverage * 25 +
        (only ? 8 : 0) -
        input.kinematicsOptimism * (only ? 4 : 16) -
        (input.trackBias === "kinematics_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const poseScore = round2(
    clamp(
      input.poseGrounding * 58 * boost * wP +
        input.deformCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.packCompleteness * 50 * boost * wD +
        input.slamFidelity * 25 +
        input.deformCoverage * 15 +
        (only ? 8 : 0) -
        (input.trackBias === "kinematics_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const kinematicsScore = round2(
    clamp(
      input.kinematicsConfidence * 55 * boost +
        input.kinematicsOptimism * 20 -
        input.deformHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.deformCoverage * 40 +
        input.slamFidelity * 30 +
        input.packCompleteness * 25 -
        input.kinematicsOptimism * 15,
      0,
      100,
    ),
  );
  const slamContribution = round2(
    clamp(
      deformScore * 0.26 +
        fidelityScore * 0.24 +
        poseScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const kinematicsContribution = round2(
    clamp(
      kinematicsScore * 0.7 +
        input.kinematicsConfidence * 20 +
        input.kinematicsOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      slamContribution * (only ? 0.82 : 0.4) +
        kinematicsContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.trackBias === "kinematics_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "online_deformable_slam",
    deformScore,
    fidelityScore,
    poseScore,
    completenessScore,
    kinematicsScore,
    confidence,
    slamContribution,
    kinematicsContribution,
    overall,
  };
}

/**
 * Offline kinematics-prior baseline (path B):
 * rewards kinematics confidence + optimism,
 * weak on online deformable SLAM honesty.
 */
export function scoreOfflineKinematicsPriorBaseline(
  input: TrackMapInput,
): TrackMapQuality {
  const baseline = input.profile === "offline_kinematics_prior_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wK = biasWeight(input.trackBias, "kinematics_first");
  const load = deformLoad(input.deformHardness, input.poseGrounding);

  const deformScore = round2(
    clamp(
      input.kinematicsConfidence * 35 * boost +
        wK * 10 -
        input.deformHardness * 22 -
        input.overclaimRisk * 12 -
        (input.trackBias === "deform_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.kinematicsOptimism * 40 * boost +
        input.kinematicsConfidence * 25 -
        load * 15 -
        input.deformCoverage * 8,
      0,
      100,
    ),
  );
  const poseScore = round2(
    clamp(
      input.kinematicsOptimism * 38 * boost +
        input.kinematicsConfidence * 20 -
        input.packCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.kinematicsConfidence * 42 * boost +
        input.kinematicsOptimism * 28 -
        input.deformCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const kinematicsScore = round2(
    clamp(
      input.kinematicsConfidence * 58 * boost * wK +
        input.kinematicsOptimism * 32 -
        input.deformHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.kinematicsOptimism * 45 +
        input.kinematicsConfidence * 35 -
        input.deformHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const slamContribution = round2(
    clamp(
      deformScore * 0.2 +
        fidelityScore * 0.2 +
        poseScore * 0.2 +
        completenessScore * 0.2 +
        kinematicsScore * 0.2,
      0,
      100,
    ),
  );
  const kinematicsContribution = round2(
    clamp(
      kinematicsScore * 0.55 +
        input.kinematicsOptimism * 30 +
        input.kinematicsConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      kinematicsContribution * (baseline ? 0.78 : 0.5) +
        slamContribution * (baseline ? 0.22 : 0.5) -
        input.deformHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "offline_kinematics_prior_baseline",
    deformScore,
    fidelityScore,
    poseScore,
    completenessScore,
    kinematicsScore,
    confidence,
    slamContribution,
    kinematicsContribution,
    overall,
  };
}
