import {
  type PheInput,
  type PheQuality,
  biasWeight,
  clamp,
  escalationLoad,
  round2,
} from "./types";

/**
 * AI-assisted PHE escalation scorer (good path A):
 * rewards signal clarity, case velocity, geo spread,
 * and lab-confirm proxies for soft-sim.
 */
export function scoreAiAssistedPheEscalation(input: PheInput): PheQuality {
  const only = input.profile === "ai_assisted_phe_escalation";
  const boost = only ? 1.12 : 0.96;
  const wS = biasWeight(input.escalationBias, "signal_first");
  const wC = biasWeight(input.escalationBias, "case_first");
  const wT = biasWeight(input.escalationBias, "triage_first");
  const avgBias = (wS + wC + wT) / 3;
  const load = escalationLoad(input.escalationHardness, input.geoSpreadProxy);

  const signalScore = round2(
    clamp(
      (input.signalClarity * 55 +
        input.caseVelocity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.escalationBias === "triage_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const velocityScore = round2(
    clamp(
      input.caseVelocity * 60 * boost +
        input.signalClarity * 25 +
        (only ? 8 : 0) -
        input.baselineOptimism * (only ? 4 : 16) -
        (input.escalationBias === "triage_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const spreadScore = round2(
    clamp(
      input.geoSpreadProxy * 58 * boost * wC +
        input.signalClarity * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const confirmIntegrity = round2(
    clamp(
      input.labConfirmProxy * 50 * boost * wS +
        input.caseVelocity * 25 +
        input.signalClarity * 15 +
        (only ? 8 : 0) -
        (input.escalationBias === "triage_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const triageScore = round2(
    clamp(
      input.manualTriageBreadth * 55 * boost +
        input.baselineOptimism * 20 -
        input.escalationHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.signalClarity * 40 +
        input.caseVelocity * 30 +
        input.labConfirmProxy * 25 -
        input.baselineOptimism * 15,
      0,
      100,
    ),
  );
  const aiContribution = round2(
    clamp(
      signalScore * 0.26 +
        velocityScore * 0.24 +
        spreadScore * 0.28 +
        confirmIntegrity * 0.22,
      0,
      100,
    ),
  );
  const triageContribution = round2(
    clamp(
      triageScore * 0.7 +
        input.manualTriageBreadth * 20 +
        input.baselineOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      aiContribution * (only ? 0.82 : 0.4) +
        triageContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.escalationBias === "triage_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "ai_assisted_phe_escalation",
    signalScore,
    velocityScore,
    spreadScore,
    confirmIntegrity,
    triageScore,
    confidence,
    aiContribution,
    triageContribution,
    overall,
  };
}

/**
 * Manual triage baseline (path B):
 * rewards wide manual triage screens + baseline optimism,
 * weak on AI-assisted escalation honesty.
 */
export function scoreManualTriageBaseline(input: PheInput): PheQuality {
  const baseline = input.profile === "manual_triage_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wT = biasWeight(input.escalationBias, "triage_first");
  const load = escalationLoad(input.escalationHardness, input.geoSpreadProxy);

  const signalScore = round2(
    clamp(
      input.manualTriageBreadth * 35 * boost +
        wT * 10 -
        input.escalationHardness * 22 -
        input.overclaimRisk * 12 -
        (input.escalationBias === "signal_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const velocityScore = round2(
    clamp(
      input.baselineOptimism * 40 * boost +
        input.manualTriageBreadth * 25 -
        load * 15 -
        input.signalClarity * 8,
      0,
      100,
    ),
  );
  const spreadScore = round2(
    clamp(
      input.baselineOptimism * 38 * boost +
        input.manualTriageBreadth * 20 -
        input.labConfirmProxy * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const confirmIntegrity = round2(
    clamp(
      input.manualTriageBreadth * 42 * boost +
        input.baselineOptimism * 28 -
        input.signalClarity * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const triageScore = round2(
    clamp(
      input.manualTriageBreadth * 58 * boost * wT +
        input.baselineOptimism * 32 -
        input.escalationHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.baselineOptimism * 45 +
        input.manualTriageBreadth * 35 -
        input.escalationHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const aiContribution = round2(
    clamp(
      signalScore * 0.2 +
        velocityScore * 0.2 +
        spreadScore * 0.2 +
        confirmIntegrity * 0.2 +
        triageScore * 0.2,
      0,
      100,
    ),
  );
  const triageContribution = round2(
    clamp(
      triageScore * 0.55 +
        input.baselineOptimism * 30 +
        input.manualTriageBreadth * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      triageContribution * (baseline ? 0.78 : 0.5) +
        aiContribution * (baseline ? 0.22 : 0.5) -
        input.escalationHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "manual_triage_baseline",
    signalScore,
    velocityScore,
    spreadScore,
    confirmIntegrity,
    triageScore,
    confidence,
    aiContribution,
    triageContribution,
    overall,
  };
}
