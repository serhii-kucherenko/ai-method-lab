import {
  type CitizenPrefInput,
  type CitizenPrefQuality,
  biasWeight,
  clamp,
  surveyLoad,
  round2,
} from "./types";

/**
 * Safety-first public-oversight scorer (path A):
 * rewards citizen safety preference, public oversight support,
 * international coordination, and pack readiness without innovation theater.
 */
export function scoreSafetyFirstPublicOversight(
  input: CitizenPrefInput,
): CitizenPrefQuality {
  const only = input.profile === "safety_first_public_oversight";
  const boost = only ? 1.12 : 0.96;
  const wS = biasWeight(input.prefBias, "safety_first");
  const wO = biasWeight(input.prefBias, "oversight_first");
  const wInn = biasWeight(input.prefBias, "innovation_first");
  const avgBias = (wS + wO + (2 - wInn)) / 3;
  const load = surveyLoad(input.surveyNoise, input.safetyPreference);

  const safetyScore = round2(
    clamp(
      (input.safetyPreference * 55 +
        input.oversightSupport * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.prefBias === "innovation_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const oversightScore = round2(
    clamp(
      input.oversightSupport * 60 * boost +
        input.safetyPreference * 25 +
        (only ? 8 : 0) -
        input.innovationTunnel * (only ? 4 : 16) -
        (input.prefBias === "innovation_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const coordinationScore = round2(
    clamp(
      input.coordinationPreference * 58 * boost * wS +
        input.safetyPreference * 14 +
        input.oversightSupport * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.packReadiness * 50 * boost * wO +
        input.oversightSupport * 25 +
        input.safetyPreference * 15 +
        (only ? 8 : 0) -
        (input.prefBias === "innovation_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const innovationScore = round2(
    clamp(
      input.innovationAdherence * 55 * boost +
        input.innovationTunnel * 20 -
        input.surveyNoise * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.safetyPreference * 30 +
        input.oversightSupport * 30 +
        input.packReadiness * 25 -
        input.innovationTunnel * 15,
      0,
      100,
    ),
  );
  const safetyOversightContribution = round2(
    clamp(
      safetyScore * 0.24 +
        oversightScore * 0.26 +
        coordinationScore * 0.28 +
        readinessScore * 0.22,
      0,
      100,
    ),
  );
  const innovationSelfContribution = round2(
    clamp(
      innovationScore * 0.7 +
        input.innovationAdherence * 20 +
        input.innovationTunnel * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      safetyOversightContribution * (only ? 0.82 : 0.4) +
        innovationSelfContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.prefBias === "innovation_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "safety_first_public_oversight",
    safetyScore,
    oversightScore,
    coordinationScore,
    readinessScore,
    innovationScore,
    confidence,
    safetyOversightContribution,
    innovationSelfContribution,
    overall,
  };
}

/**
 * Innovation-first self-regulation baseline (path B):
 * rewards innovation speed / self-regulation and ignores public-pref honesty.
 */
export function scoreInnovationFirstSelfRegulation(
  input: CitizenPrefInput,
): CitizenPrefQuality {
  const baseline = input.profile === "innovation_first_self_regulation";
  const boost = baseline ? 1.08 : 0.92;
  const wInn = biasWeight(input.prefBias, "innovation_first");
  const load = surveyLoad(input.surveyNoise, input.safetyPreference);

  const safetyScore = round2(
    clamp(
      input.innovationAdherence * 35 * boost +
        wInn * 10 -
        input.surveyNoise * 22 -
        input.overclaimRisk * 12 -
        (input.prefBias === "safety_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const oversightScore = round2(
    clamp(
      input.innovationTunnel * 40 * boost +
        input.innovationAdherence * 25 -
        load * 15 -
        input.oversightSupport * 8,
      0,
      100,
    ),
  );
  const coordinationScore = round2(
    clamp(
      input.innovationTunnel * 38 * boost +
        input.innovationAdherence * 20 -
        input.packReadiness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const readinessScore = round2(
    clamp(
      input.innovationAdherence * 42 * boost +
        input.innovationTunnel * 28 -
        input.safetyPreference * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const innovationScore = round2(
    clamp(
      input.innovationAdherence * 58 * boost * wInn +
        input.innovationTunnel * 32 -
        input.surveyNoise * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.innovationTunnel * 45 +
        input.innovationAdherence * 35 -
        input.surveyNoise * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const safetyOversightContribution = round2(
    clamp(
      safetyScore * 0.2 +
        oversightScore * 0.2 +
        coordinationScore * 0.2 +
        readinessScore * 0.2 +
        innovationScore * 0.2,
      0,
      100,
    ),
  );
  const innovationSelfContribution = round2(
    clamp(
      innovationScore * 0.55 +
        input.innovationTunnel * 30 +
        input.innovationAdherence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      innovationSelfContribution * (baseline ? 0.78 : 0.5) +
        safetyOversightContribution * (baseline ? 0.22 : 0.5) -
        input.surveyNoise * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "innovation_first_self_regulation",
    safetyScore,
    oversightScore,
    coordinationScore,
    readinessScore,
    innovationScore,
    confidence,
    safetyOversightContribution,
    innovationSelfContribution,
    overall,
  };
}
