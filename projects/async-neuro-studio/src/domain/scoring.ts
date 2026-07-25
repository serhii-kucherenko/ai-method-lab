import {
  type AsyncNeuroInput,
  type AsyncNeuroQuality,
  biasWeight,
  clamp,
  examLoad,
  round2,
} from "./types";

/**
 * Standardized async video exam scorer (path A):
 * rewards protocol fidelity, site consistency, video completeness,
 * and pack readiness without ad-hoc exam theater.
 */
export function scoreStandardizedAsyncVideoExam(
  input: AsyncNeuroInput,
): AsyncNeuroQuality {
  const only = input.profile === "standardized_async_video_exam";
  const boost = only ? 1.12 : 0.96;
  const wP = biasWeight(input.examBias, "protocol_first");
  const wS = biasWeight(input.examBias, "site_first");
  const wA = biasWeight(input.examBias, "ad_hoc_first");
  const avgBias = (wP + wS + (2 - wA)) / 3;
  const load = examLoad(input.captureNoise, input.videoCompleteness);

  const protocolScore = round2(
    clamp(
      (input.protocolFidelity * 55 +
        input.videoCompleteness * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.examBias === "ad_hoc_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const siteScore = round2(
    clamp(
      input.siteConsistency * 60 * boost +
        input.protocolFidelity * 25 +
        (only ? 8 : 0) -
        input.examinerDrift * (only ? 4 : 16) -
        (input.examBias === "ad_hoc_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const videoScore = round2(
    clamp(
      input.videoCompleteness * 58 * boost * wP +
        input.protocolFidelity * 14 +
        input.siteConsistency * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.packReadiness * 50 * boost * wS +
        input.siteConsistency * 25 +
        input.protocolFidelity * 15 +
        (only ? 8 : 0) -
        (input.examBias === "ad_hoc_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const adHocScore = round2(
    clamp(
      input.adHocAdherence * 55 * boost +
        input.examinerDrift * 20 -
        input.captureNoise * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.protocolFidelity * 30 +
        input.siteConsistency * 30 +
        input.packReadiness * 25 -
        input.examinerDrift * 15,
      0,
      100,
    ),
  );
  const standardizedContribution = round2(
    clamp(
      protocolScore * 0.24 +
        siteScore * 0.26 +
        videoScore * 0.28 +
        readinessScore * 0.22,
      0,
      100,
    ),
  );
  const adHocContribution = round2(
    clamp(
      adHocScore * 0.7 +
        input.adHocAdherence * 20 +
        input.examinerDrift * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      standardizedContribution * (only ? 0.82 : 0.4) +
        adHocContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.examBias === "ad_hoc_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "standardized_async_video_exam",
    protocolScore,
    siteScore,
    videoScore,
    readinessScore,
    adHocScore,
    confidence,
    standardizedContribution,
    adHocContribution,
    overall,
  };
}

/**
 * Ad-hoc exam baseline (path B):
 * rewards local examiner improvisation and ignores standardized async honesty.
 */
export function scoreAdHocExamBaseline(
  input: AsyncNeuroInput,
): AsyncNeuroQuality {
  const baseline = input.profile === "ad_hoc_exam_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wA = biasWeight(input.examBias, "ad_hoc_first");
  const load = examLoad(input.captureNoise, input.videoCompleteness);

  const protocolScore = round2(
    clamp(
      input.adHocAdherence * 35 * boost +
        wA * 10 -
        input.captureNoise * 22 -
        input.overclaimRisk * 12 -
        (input.examBias === "protocol_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const siteScore = round2(
    clamp(
      input.examinerDrift * 40 * boost +
        input.adHocAdherence * 25 -
        load * 15 -
        input.siteConsistency * 8,
      0,
      100,
    ),
  );
  const videoScore = round2(
    clamp(
      input.examinerDrift * 38 * boost +
        input.adHocAdherence * 20 -
        input.packReadiness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.adHocAdherence * 42 * boost +
        input.examinerDrift * 28 -
        input.protocolFidelity * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const adHocScore = round2(
    clamp(
      input.adHocAdherence * 58 * boost * wA +
        input.examinerDrift * 32 -
        input.captureNoise * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.examinerDrift * 45 +
        input.adHocAdherence * 35 -
        input.captureNoise * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const standardizedContribution = round2(
    clamp(
      protocolScore * 0.2 +
        siteScore * 0.2 +
        videoScore * 0.2 +
        readinessScore * 0.2 +
        adHocScore * 0.2,
      0,
      100,
    ),
  );
  const adHocContribution = round2(
    clamp(
      adHocScore * 0.55 +
        input.examinerDrift * 30 +
        input.adHocAdherence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      adHocContribution * (baseline ? 0.78 : 0.5) +
        standardizedContribution * (baseline ? 0.22 : 0.5) -
        input.captureNoise * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "ad_hoc_exam_baseline",
    protocolScore,
    siteScore,
    videoScore,
    readinessScore,
    adHocScore,
    confidence,
    standardizedContribution,
    adHocContribution,
    overall,
  };
}
