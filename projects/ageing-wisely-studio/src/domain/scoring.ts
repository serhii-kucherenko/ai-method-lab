import {
  type CareInput,
  type CareQuality,
  biasWeight,
  clamp,
  round2,
  supportLoad,
} from "./types";

/**
 * Therapist-supported iCBT scorer (path A):
 * rewards therapist support fidelity, co-design fit, and module completion —
 * without claiming clinical diagnosis, live therapist replacement, or
 * regulated digital therapeutic clearance.
 */
export function scoreTherapistSupported(input: CareInput): CareQuality {
  const only = input.profile === "therapist_supported_icbt";
  const boost = only ? 1.12 : 0.96;
  const wT = biasWeight(input.careBias, "therapist_first");
  const wS = biasWeight(input.careBias, "self_guided_first");
  const wW = biasWeight(input.careBias, "waitlist_first");
  const avgBias = (wT + (2 - wS) + (2 - wW)) / 3;
  const load = supportLoad(
    input.therapistSupportFidelity,
    input.engagementAdherence,
  );

  const supportScore = round2(
    clamp(
      (input.therapistSupportFidelity * 55 +
        input.coDesignFit * 25 +
        input.sessionSignal * 15 -
        load * 6) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.careBias === "waitlist_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const completionScore = round2(
    clamp(
      input.moduleCompletion * 55 * boost * wT +
        input.therapistSupportFidelity * 25 +
        (only ? 8 : 0) -
        (input.careBias === "self_guided_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const engagementScore = round2(
    clamp(
      (input.engagementAdherence * 50 +
        input.coDesignFit * 20 +
        (1 - input.dropoutRisk) * 20) *
        boost *
        wT +
        (only ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const reliefScore = round2(
    clamp(
      input.symptomReliefSignal * 45 * boost +
        input.moduleCompletion * 20 +
        input.engagementAdherence * 20 -
        (only ? 0 : 6) -
        input.dropoutRisk * 12,
      0,
      100,
    ),
  );
  const dropoutPenalty = round2(
    clamp(
      input.dropoutRisk * 55 * boost +
        load * 15 -
        input.therapistSupportFidelity * 15 +
        (1 - input.coDesignFit) * 10,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.therapistSupportFidelity * 30 +
        input.coDesignFit * 25 +
        input.sessionSignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const therapistContribution = round2(
    clamp(
      supportScore * 0.3 +
        completionScore * 0.28 +
        engagementScore * 0.24 +
        (100 - dropoutPenalty) * 0.18,
      0,
      100,
    ),
  );
  const waitlistContribution = round2(
    clamp(
      reliefScore * 0.35 +
        completionScore * 0.25 +
        engagementScore * 0.25 +
        dropoutPenalty * 0.15 -
        input.therapistSupportFidelity * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      therapistContribution * (only ? 0.82 : 0.4) +
        waitlistContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.careBias === "waitlist_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "therapist_supported_icbt",
    supportScore,
    completionScore,
    engagementScore,
    reliefScore,
    dropoutPenalty,
    confidence,
    therapistContribution,
    waitlistContribution,
    overall,
  };
}

/**
 * Waitlist / self-guided baseline scorer (path B):
 * rewards passive or self-guided paths and underweights therapist support.
 */
export function scoreWaitlistSelfGuided(input: CareInput): CareQuality {
  const baseline = input.profile === "waitlist_self_guided_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wS = biasWeight(input.careBias, "self_guided_first");
  const wW = biasWeight(input.careBias, "waitlist_first");
  const load = supportLoad(
    input.therapistSupportFidelity,
    input.engagementAdherence,
  );

  const supportScore = round2(
    clamp(
      input.moduleCompletion * 20 * boost +
        input.engagementAdherence * 20 * boost +
        (wS + wW) * 5 -
        input.therapistSupportFidelity * 18 -
        input.overclaimRisk * 12 -
        (input.careBias === "therapist_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const completionScore = round2(
    clamp(
      input.moduleCompletion * 42 * boost * Math.max(wS, wW) +
        (1 - input.therapistSupportFidelity) * 18 +
        (baseline ? 8 : 0) -
        load * 8,
      0,
      100,
    ),
  );
  const engagementScore = round2(
    clamp(
      input.engagementAdherence * 38 * boost +
        input.symptomReliefSignal * 25 -
        input.dropoutRisk * 20 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const reliefScore = round2(
    clamp(
      input.symptomReliefSignal * 50 * boost * Math.max(wS, wW) +
        input.sessionSignal * 20 +
        (baseline ? 8 : 0) -
        input.therapistSupportFidelity * 10,
      0,
      100,
    ),
  );
  const dropoutPenalty = round2(
    clamp(
      input.dropoutRisk * 40 * boost +
        load * 25 -
        input.therapistSupportFidelity * (baseline ? 5 : 12) -
        input.coDesignFit * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.moduleCompletion + input.engagementAdherence) * 22 +
        input.sessionSignal * 30 -
        input.overclaimRisk * 15 -
        load * 10,
      0,
      100,
    ),
  );
  const therapistContribution = round2(
    clamp(
      supportScore * 0.2 +
        completionScore * 0.2 +
        engagementScore * 0.2 +
        (100 - dropoutPenalty) * 0.2 +
        reliefScore * 0.2,
      0,
      100,
    ),
  );
  const waitlistContribution = round2(
    clamp(
      reliefScore * 0.55 +
        completionScore * 0.25 +
        engagementScore * 0.2 -
        load * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      waitlistContribution * (baseline ? 0.78 : 0.5) +
        therapistContribution * (baseline ? 0.22 : 0.5) -
        input.therapistSupportFidelity * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "waitlist_self_guided_baseline",
    supportScore,
    completionScore,
    engagementScore,
    reliefScore,
    dropoutPenalty,
    confidence,
    therapistContribution,
    waitlistContribution,
    overall,
  };
}
