import {
  type FailGateInput,
  type FailGateQuality,
  biasWeight,
  clamp,
  harmPressure,
  round2,
} from "./types";

/**
 * Fail-gate taxonomy diagnosis (good path A):
 * rewards severity fit, gate-type match, boundary reason coherence, taxonomy coverage.
 */
export function scoreFailGate(input: FailGateInput): FailGateQuality {
  const gate = input.profile === "fail_gate";
  const boost = gate ? 1.12 : 0.96;
  const wT = biasWeight(input.gateBias, "taxonomy_strict");
  const wB = biasWeight(input.gateBias, "boundary_first");
  const wA = biasWeight(input.gateBias, "accuracy_first");
  const avgBias = (wT + wB + wA) / 3;
  const pressure = harmPressure(input.harmProximity, input.evidenceStrength);

  const severityDiagnosis = round2(
    clamp(
      (input.severityFit * 55 +
        input.evidenceStrength * 25 -
        pressure * 10) *
        boost *
        avgBias +
        (gate ? 8 : 0) -
        input.scopeDrift * (gate ? 6 : 14) -
        (input.gateBias === "accuracy_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const gateTypeDiagnosis = round2(
    clamp(
      input.gateTypeFit * 60 * boost +
        input.taxonomyCoverage * 25 +
        (gate ? 8 : 0) -
        input.fluencyScore * (gate ? 4 : 16) -
        (input.gateBias === "accuracy_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const boundaryReasonScore = round2(
    clamp(
      input.boundaryCoherence * 58 * boost * wB +
        input.evidenceStrength * 28 +
        (gate ? 10 : 0) -
        pressure * 12 -
        input.scopeDrift * 10,
      0,
      100,
    ),
  );
  const taxonomyIntegrity = round2(
    clamp(
      input.taxonomyCoverage * 50 * boost * wT +
        input.gateTypeFit * 25 +
        input.severityFit * 15 +
        (gate ? 8 : 0) -
        (input.gateBias === "accuracy_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const correctnessScore = round2(
    clamp(
      input.answerMatch * 55 * boost +
        input.fluencyScore * 20 -
        input.harmProximity * 18 -
        (gate ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.evidenceStrength * 40 +
        input.taxonomyCoverage * 30 +
        input.boundaryCoherence * 25 -
        input.fluencyScore * 15,
      0,
      100,
    ),
  );
  const failGateContribution = round2(
    clamp(
      severityDiagnosis * 0.26 +
        gateTypeDiagnosis * 0.24 +
        boundaryReasonScore * 0.28 +
        taxonomyIntegrity * 0.22,
      0,
      100,
    ),
  );
  const correctnessContribution = round2(
    clamp(
      correctnessScore * 0.7 +
        input.answerMatch * 20 +
        input.fluencyScore * 10 -
        pressure * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      failGateContribution * (gate ? 0.82 : 0.4) +
        correctnessContribution * (gate ? 0.18 : 0.6) +
        (gate ? 4 : 0) -
        (input.gateBias === "accuracy_first" && gate ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "fail_gate",
    severityDiagnosis,
    gateTypeDiagnosis,
    boundaryReasonScore,
    taxonomyIntegrity,
    correctnessScore,
    confidence,
    failGateContribution,
    correctnessContribution,
    overall,
  };
}

/**
 * Correctness-only / naive accuracy baseline (path B):
 * rewards answer match + fluency, weak on taxonomy and boundary reasons.
 */
export function scoreCorrectnessOnly(input: FailGateInput): FailGateQuality {
  const naive = input.profile === "correctness_only";
  const boost = naive ? 1.08 : 0.92;
  const wA = biasWeight(input.gateBias, "accuracy_first");
  const pressure = harmPressure(input.harmProximity, input.evidenceStrength);

  const severityDiagnosis = round2(
    clamp(
      input.answerMatch * 35 * boost +
        wA * 10 -
        input.harmProximity * 22 -
        input.scopeDrift * 12 -
        (input.gateBias === "taxonomy_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const gateTypeDiagnosis = round2(
    clamp(
      input.fluencyScore * 40 * boost +
        input.answerMatch * 25 -
        pressure * 15 -
        input.taxonomyCoverage * 8,
      0,
      100,
    ),
  );
  const boundaryReasonScore = round2(
    clamp(
      input.fluencyScore * 38 * boost +
        input.answerMatch * 20 -
        input.boundaryCoherence * (naive ? 5 : 0) -
        pressure * 18 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const taxonomyIntegrity = round2(
    clamp(
      input.answerMatch * 42 * boost +
        input.fluencyScore * 28 -
        input.taxonomyCoverage * 10 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const correctnessScore = round2(
    clamp(
      input.answerMatch * 58 * boost * wA +
        input.fluencyScore * 32 -
        input.harmProximity * 10 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.fluencyScore * 45 +
        input.answerMatch * 35 -
        input.harmProximity * 20 -
        input.scopeDrift * 10,
      0,
      100,
    ),
  );
  const failGateContribution = round2(
    clamp(
      severityDiagnosis * 0.2 +
        gateTypeDiagnosis * 0.2 +
        boundaryReasonScore * 0.2 +
        taxonomyIntegrity * 0.2 +
        correctnessScore * 0.2,
      0,
      100,
    ),
  );
  const correctnessContribution = round2(
    clamp(
      correctnessScore * 0.55 +
        input.fluencyScore * 30 +
        input.answerMatch * 20 -
        pressure * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      correctnessContribution * (naive ? 0.78 : 0.5) +
        failGateContribution * (naive ? 0.22 : 0.5) -
        input.harmProximity * 8 -
        input.scopeDrift * 6,
      0,
      100,
    ),
  );

  return {
    mode: "correctness_only",
    severityDiagnosis,
    gateTypeDiagnosis,
    boundaryReasonScore,
    taxonomyIntegrity,
    correctnessScore,
    confidence,
    failGateContribution,
    correctnessContribution,
    overall,
  };
}
