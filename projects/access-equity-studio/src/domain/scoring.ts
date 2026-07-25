import {
  type AccessEquityInput,
  type AccessEquityQuality,
  biasWeight,
  clamp,
  accessLoad,
  round2,
} from "./types";

/**
 * Equity-access task-sharing scorer (path A):
 * rewards access reach, equity gap closure, task-sharing fidelity,
 * and pack readiness without accuracy-only theater.
 */
export function scoreEquityAccessTaskSharing(
  input: AccessEquityInput,
): AccessEquityQuality {
  const only = input.profile === "equity_access_task_sharing";
  const boost = only ? 1.12 : 0.96;
  const wA = biasWeight(input.equityBias, "access_first");
  const wT = biasWeight(input.equityBias, "task_sharing_first");
  const wAcc = biasWeight(input.equityBias, "accuracy_first");
  const avgBias = (wA + wT + (2 - wAcc)) / 3;
  const load = accessLoad(input.screenNoise, input.accessReach);

  const accessScore = round2(
    clamp(
      (input.accessReach * 55 +
        input.equityGapClosure * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.equityBias === "accuracy_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const equityScore = round2(
    clamp(
      input.equityGapClosure * 60 * boost +
        input.accessReach * 25 +
        (only ? 8 : 0) -
        input.accuracyTunnel * (only ? 4 : 16) -
        (input.equityBias === "accuracy_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const sharingScore = round2(
    clamp(
      input.taskSharingFidelity * 58 * boost * wA +
        input.accessReach * 14 +
        input.equityGapClosure * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.packReadiness * 50 * boost * wT +
        input.equityGapClosure * 25 +
        input.accessReach * 15 +
        (only ? 8 : 0) -
        (input.equityBias === "accuracy_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const accuracyScore = round2(
    clamp(
      input.accuracyAdherence * 55 * boost +
        input.accuracyTunnel * 20 -
        input.screenNoise * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.accessReach * 30 +
        input.equityGapClosure * 30 +
        input.packReadiness * 25 -
        input.accuracyTunnel * 15,
      0,
      100,
    ),
  );
  const equityAccessContribution = round2(
    clamp(
      accessScore * 0.24 +
        equityScore * 0.26 +
        sharingScore * 0.28 +
        readinessScore * 0.22,
      0,
      100,
    ),
  );
  const accuracyOnlyContribution = round2(
    clamp(
      accuracyScore * 0.7 +
        input.accuracyAdherence * 20 +
        input.accuracyTunnel * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      equityAccessContribution * (only ? 0.82 : 0.4) +
        accuracyOnlyContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.equityBias === "accuracy_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "equity_access_task_sharing",
    accessScore,
    equityScore,
    sharingScore,
    readinessScore,
    accuracyScore,
    confidence,
    equityAccessContribution,
    accuracyOnlyContribution,
    overall,
  };
}

/**
 * Accuracy-only classifier baseline (path B):
 * rewards classification accuracy and ignores access / equity honesty.
 */
export function scoreAccuracyOnlyClassifier(
  input: AccessEquityInput,
): AccessEquityQuality {
  const baseline = input.profile === "accuracy_only_classifier";
  const boost = baseline ? 1.08 : 0.92;
  const wAcc = biasWeight(input.equityBias, "accuracy_first");
  const load = accessLoad(input.screenNoise, input.accessReach);

  const accessScore = round2(
    clamp(
      input.accuracyAdherence * 35 * boost +
        wAcc * 10 -
        input.screenNoise * 22 -
        input.overclaimRisk * 12 -
        (input.equityBias === "access_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const equityScore = round2(
    clamp(
      input.accuracyTunnel * 40 * boost +
        input.accuracyAdherence * 25 -
        load * 15 -
        input.equityGapClosure * 8,
      0,
      100,
    ),
  );
  const sharingScore = round2(
    clamp(
      input.accuracyTunnel * 38 * boost +
        input.accuracyAdherence * 20 -
        input.packReadiness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.accuracyAdherence * 42 * boost +
        input.accuracyTunnel * 28 -
        input.accessReach * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const accuracyScore = round2(
    clamp(
      input.accuracyAdherence * 58 * boost * wAcc +
        input.accuracyTunnel * 32 -
        input.screenNoise * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.accuracyTunnel * 45 +
        input.accuracyAdherence * 35 -
        input.screenNoise * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const equityAccessContribution = round2(
    clamp(
      accessScore * 0.2 +
        equityScore * 0.2 +
        sharingScore * 0.2 +
        readinessScore * 0.2 +
        accuracyScore * 0.2,
      0,
      100,
    ),
  );
  const accuracyOnlyContribution = round2(
    clamp(
      accuracyScore * 0.55 +
        input.accuracyTunnel * 30 +
        input.accuracyAdherence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      accuracyOnlyContribution * (baseline ? 0.78 : 0.5) +
        equityAccessContribution * (baseline ? 0.22 : 0.5) -
        input.screenNoise * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "accuracy_only_classifier",
    accessScore,
    equityScore,
    sharingScore,
    readinessScore,
    accuracyScore,
    confidence,
    equityAccessContribution,
    accuracyOnlyContribution,
    overall,
  };
}
