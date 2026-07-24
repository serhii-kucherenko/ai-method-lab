import {
  type TutorInput,
  type TutorQuality,
  clamp,
  round2,
} from "./types";

function threatPressure(input: TutorInput): number {
  return clamp(
    input.vulnComplexity * 0.28 +
      input.studentRiskLevel * 0.24 +
      input.exploitHintRisk * 0.22 +
      (1 - input.threatCoverage) * 0.16 +
      (input.rubricItemCount / 20) * 0.1,
    0,
    1,
  );
}

function roleBlock(input: TutorInput): number {
  return clamp(
    input.explainerSpecialization * 32 +
      input.safetySpecialization * 36 +
      input.rubricSpecialization * 28 +
      input.tutorCoverage * 18,
    0,
    100,
  );
}

function orchestrationBlock(input: TutorInput): number {
  return clamp(
    input.orchestrationRounds * 9.2 +
      input.pedagogyDepth * 38 +
      input.tutorCoverage * 16 +
      (1 - threatPressure(input)) * 14,
    0,
    100,
  );
}

function safetyBlock(input: TutorInput): number {
  return clamp(
    input.safetyGateStrength * 42 +
      input.safetySpecialization * 28 +
      (1 - input.exploitHintRisk) * 22 +
      input.threatCoverage * 16,
    0,
    100,
  );
}

export function scoreOrchestrated(input: TutorInput): TutorQuality {
  const strict = input.profile === "strict";
  const boost = strict ? 1.05 : 1.0;
  const pressure = threatPressure(input);
  const roles = roleBlock(input);
  const orch = orchestrationBlock(input);
  const safety = safetyBlock(input);

  const pedagogyFit = round2(
    clamp(
      (roles * 0.3 + orch * 0.38 + input.pedagogyDepth * 40) * boost +
        (1 - input.studentRiskLevel) * 8 -
        pressure * 14,
      0,
      100,
    ),
  );

  const securityRubricPass = round2(
    clamp(
      safety * 0.42 * boost +
        input.rubricSpecialization * 28 +
        Math.min(20, input.rubricItemCount) * 1.6 +
        input.threatCoverage * 18 -
        pressure * 12,
      0,
      100,
    ),
  );

  const safetyGateScore = round2(
    clamp(
      safety * 0.55 * boost +
        input.safetyGateStrength * 28 +
        (1 - input.exploitHintRisk) * 18 -
        pressure * 10,
      0,
      100,
    ),
  );

  const tutorCoverageScore = round2(
    clamp(
      input.tutorCoverage * 50 +
        roles * 0.4 +
        (strict ? 5 : 8) -
        pressure * 6,
      0,
      100,
    ),
  );

  const orchestrationLift = round2(
    clamp(
      orch * 0.44 +
        input.orchestrationRounds * 5.8 +
        input.pedagogyDepth * 20 +
        roles * 0.16 -
        pressure * 8,
      0,
      100,
    ),
  );

  const lessonStability = round2(
    clamp(
      pedagogyFit * 0.38 +
        securityRubricPass * 0.32 +
        safetyGateScore * 0.3 -
        input.studentRiskLevel * 12 -
        input.exploitHintRisk * 10,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.safetyGateStrength * 26 +
        input.tutorCoverage * 20 +
        input.orchestrationRounds * 4 +
        roles * 0.18 +
        (strict ? 4 : 7),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      pedagogyFit * 0.24 +
        securityRubricPass * 0.24 +
        safetyGateScore * 0.22 +
        tutorCoverageScore * 0.12 +
        orchestrationLift * 0.1 +
        lessonStability * 0.08,
      0,
      100,
    ),
  );

  return {
    mode: "orchestrated",
    pedagogyFit,
    securityRubricPass,
    safetyGateScore,
    tutorCoverageScore,
    orchestrationLift,
    lessonStability,
    confidence,
    overall,
  };
}

export function scoreSingle(input: TutorInput): TutorQuality {
  const strict = input.profile === "strict";
  const pressure = threatPressure(input);

  const pedagogyFit = round2(
    clamp(
      46 +
        input.pedagogyDepth * 18 +
        input.explainerSpecialization * 12 -
        pressure * 26 -
        input.studentRiskLevel * 10 +
        (strict ? 2 : 0),
      0,
      100,
    ),
  );

  const securityRubricPass = round2(
    clamp(
      44 +
        (1 - pressure) * 14 +
        input.rubricSpecialization * 10 -
        (input.rubricItemCount / 20) * 12 -
        input.exploitHintRisk * 14 +
        (strict ? 2 : 0),
      0,
      100,
    ),
  );

  const safetyGateScore = round2(
    clamp(
      40 +
        input.safetyGateStrength * 16 +
        (1 - input.exploitHintRisk) * 12 -
        pressure * 18 -
        input.orchestrationRounds * 1.2,
      0,
      100,
    ),
  );

  const tutorCoverageScore = round2(
    clamp(
      34 +
        input.tutorCoverage * 16 +
        input.explainerSpecialization * 10 -
        pressure * 8,
      0,
      68,
    ),
  );

  const orchestrationLift = round2(
    clamp(12 - pressure * 14 + input.orchestrationRounds * 0.7, 0, 32),
  );

  const lessonStability = round2(
    clamp(
      pedagogyFit * 0.42 +
        securityRubricPass * 0.32 +
        (1 - input.studentRiskLevel) * 12 -
        pressure * 10,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      38 +
        input.explainerSpecialization * 12 +
        (1 - pressure) * 16 +
        (strict ? 2 : 0),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      pedagogyFit * 0.32 +
        securityRubricPass * 0.28 +
        lessonStability * 0.2 +
        safetyGateScore * 0.14 +
        tutorCoverageScore * 0.06,
      0,
      100,
    ),
  );

  return {
    mode: "single",
    pedagogyFit,
    securityRubricPass,
    safetyGateScore,
    tutorCoverageScore,
    orchestrationLift,
    lessonStability,
    confidence,
    overall,
  };
}
