import {
  type ReasonInput,
  type ReasonQuality,
  clamp,
  round2,
} from "./types";

function domainBoost(kind: ReasonInput["domainKind"]): number {
  switch (kind) {
    case "physics":
      return 1.06;
    case "chemistry":
      return 1.04;
    case "biology":
      return 1.03;
    case "math":
      return 1.05;
    case "materials":
      return 1.04;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function ruleSignal(input: ReasonInput): number {
  return clamp(
    48 +
      input.ruleCoverage * 24 +
      input.evidenceGrounding * 16 +
      input.bayesianUpdate * 10 -
      input.contradictionRate * 18,
    0,
    100,
  );
}

function teamSignal(input: ReasonInput): number {
  return clamp(
    input.teamCoordination * 32 +
      input.challengerPressure * 24 +
      input.consensusStrength * 22 +
      input.debateDepth * 16 -
      input.fluencyBias * 14,
    0,
    100,
  );
}

/**
 * Dual-impl twin of score.ts — must stay bitwise-equal on goldens.
 */
export function scoreMultiAgent(input: ReasonInput): ReasonQuality {
  const multi = input.plan === "multi_agent";
  const boost = (multi ? 1.12 : 0.94) * domainBoost(input.domainKind);
  const rules = ruleSignal(input);
  const team = teamSignal(input);

  const ruleFidelity = round2(
    clamp(
      (rules * 0.44 +
        input.ruleCoverage * 28 +
        input.evidenceGrounding * 12 +
        (multi ? 14 : 2)) *
        boost,
      0,
      100,
    ),
  );

  const debateIntegrity = round2(
    clamp(
      (input.debateDepth * 40 +
        team * 0.24 +
        input.challengerPressure * (multi ? 16 : 4) +
        (multi ? 14 : 2) -
        (multi ? 0 : input.fluencyBias * 18)) *
        boost,
      0,
      100,
    ),
  );

  const gameScore = round2(
    clamp(
      (input.bayesianUpdate * 36 +
        input.teamCoordination * 22 +
        team * 0.2 +
        (multi ? 12 : 4) -
        input.contradictionRate * (multi ? 8 : 22)) *
        boost,
      0,
      100,
    ),
  );

  const hallucinationResistance = round2(
    clamp(
      (input.evidenceGrounding * 34 +
        (1 - input.fluencyBias) * 20 +
        ruleFidelity * 0.16 +
        debateIntegrity * 0.16 +
        (multi ? 12 : 0) -
        input.contradictionRate * (multi ? 6 : 24)) *
        boost,
      0,
      100,
    ),
  );

  const planCoherence = round2(
    clamp(
      (input.consensusStrength * 28 +
        gameScore * 0.22 +
        debateIntegrity * 0.22 +
        (multi ? 14 : 0) -
        input.fluencyBias * (multi ? 8 : 28)) *
        boost,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      ruleFidelity * 0.2 +
        debateIntegrity * 0.22 +
        gameScore * 0.22 +
        hallucinationResistance * 0.2 +
        planCoherence * 0.16,
      0,
      100,
    ),
  );

  return {
    mode: "multi_agent",
    ruleFidelity,
    debateIntegrity,
    gameScore,
    hallucinationResistance,
    planCoherence,
    overall,
  };
}

/**
 * Single-agent fluent baseline — no debate / game check (Score B).
 */
export function scoreSingleAgent(input: ReasonInput): ReasonQuality {
  const fluentBias = clamp(
    0.5 +
      input.fluencyBias * 0.28 +
      (1 - input.debateDepth) * 0.16 +
      (1 - input.challengerPressure) * 0.12,
    0.34,
    0.94,
  );
  const rules = ruleSignal(input);
  const pretendedRules = clamp(
    input.priorConfidence * 0.65 + (1 - input.ruleCoverage) * 0.35,
    0,
    1,
  );

  const ruleFidelity = round2(
    clamp(
      (rules * 0.26 + pretendedRules * 24 + input.priorConfidence * 16) *
        fluentBias -
        input.ruleCoverage * 16,
      0,
      100,
    ),
  );

  const debateIntegrity = round2(
    clamp(
      (input.priorConfidence * 36 +
        (1 - input.debateDepth) * 12 +
        input.fluencyBias * 10) *
        fluentBias -
        input.debateDepth * 18,
      0,
      100,
    ),
  );

  const gameScore = round2(
    clamp(
      (input.priorConfidence * 28 +
        input.fluencyBias * 18 +
        (1 - input.teamCoordination) * 10) *
        fluentBias -
        input.bayesianUpdate * 14,
      0,
      100,
    ),
  );

  const hallucinationResistance = round2(
    clamp(
      (input.priorConfidence * 24 +
        input.fluencyBias * 16 +
        (1 - input.evidenceGrounding) * 10) *
        fluentBias -
        input.ruleCoverage * 12 -
        input.contradictionRate * 10,
      0,
      100,
    ),
  );

  const planCoherence = round2(
    clamp(
      (input.fluencyBias * 26 + hallucinationResistance * 0.14) * fluentBias -
        input.ruleCoverage * 18 -
        input.challengerPressure * 14 -
        input.debateDepth * 12,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      ruleFidelity * 0.14 +
        debateIntegrity * 0.2 +
        gameScore * 0.22 +
        hallucinationResistance * 0.24 +
        planCoherence * 0.2,
      0,
      100,
    ),
  );

  return {
    mode: "single_agent",
    ruleFidelity,
    debateIntegrity,
    gameScore,
    hallucinationResistance,
    planCoherence,
    overall,
  };
}
