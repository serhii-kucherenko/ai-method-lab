import {
  type PersonaTriageInput,
  type PersonaTriageQuality,
  ambiguityLoad,
  biasWeight,
  clamp,
  round2,
} from "./types";

/**
 * Style-aware triage (good path A):
 * rewards style-axis fit, persona coherence, urgency under communication diversity.
 */
export function scoreStyleAware(input: PersonaTriageInput): PersonaTriageQuality {
  const aware = input.profile === "style_aware";
  const boost = aware ? 1.12 : 0.96;
  const wS = biasWeight(input.styleBias, "style_strict");
  const wU = biasWeight(input.styleBias, "urgency_first");
  const wI = biasWeight(input.styleBias, "idealized_first");
  const avgBias = (wS + wU + wI) / 3;
  const load = ambiguityLoad(input.ambiguityPressure, input.diversityCoverage);

  const styleDiagnosis = round2(
    clamp(
      (input.styleFit * 55 +
        input.diversityCoverage * 25 -
        load * 10) *
        boost *
        avgBias +
        (aware ? 8 : 0) -
        input.affectPressure * (aware ? 6 : 14) -
        (input.styleBias === "idealized_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const personaDiagnosis = round2(
    clamp(
      input.personaCoherence * 60 * boost +
        input.diversityCoverage * 25 +
        (aware ? 8 : 0) -
        input.cooperationScore * (aware ? 4 : 16) -
        (input.styleBias === "idealized_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const urgencyReasonScore = round2(
    clamp(
      input.urgencyAlignment * 58 * boost * wU +
        input.styleFit * 28 +
        (aware ? 10 : 0) -
        load * 12 -
        input.affectPressure * 10,
      0,
      100,
    ),
  );
  const diversityIntegrity = round2(
    clamp(
      input.diversityCoverage * 50 * boost * wS +
        input.personaCoherence * 25 +
        input.styleFit * 15 +
        (aware ? 8 : 0) -
        (input.styleBias === "idealized_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const idealizedScore = round2(
    clamp(
      input.articulationScore * 55 * boost +
        input.cooperationScore * 20 -
        input.ambiguityPressure * 18 -
        (aware ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.styleFit * 40 +
        input.diversityCoverage * 30 +
        input.personaCoherence * 25 -
        input.cooperationScore * 15,
      0,
      100,
    ),
  );
  const styleAwareContribution = round2(
    clamp(
      styleDiagnosis * 0.26 +
        personaDiagnosis * 0.24 +
        urgencyReasonScore * 0.28 +
        diversityIntegrity * 0.22,
      0,
      100,
    ),
  );
  const idealizedContribution = round2(
    clamp(
      idealizedScore * 0.7 +
        input.articulationScore * 20 +
        input.cooperationScore * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      styleAwareContribution * (aware ? 0.82 : 0.4) +
        idealizedContribution * (aware ? 0.18 : 0.6) +
        (aware ? 4 : 0) -
        (input.styleBias === "idealized_first" && aware ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "style_aware",
    styleDiagnosis,
    personaDiagnosis,
    urgencyReasonScore,
    diversityIntegrity,
    idealizedScore,
    confidence,
    styleAwareContribution,
    idealizedContribution,
    overall,
  };
}

/**
 * Idealized-patient baseline (path B):
 * rewards articulation + cooperation, weak on style diversity and persona axes.
 */
export function scoreIdealizedPatient(
  input: PersonaTriageInput,
): PersonaTriageQuality {
  const naive = input.profile === "idealized_patient";
  const boost = naive ? 1.08 : 0.92;
  const wI = biasWeight(input.styleBias, "idealized_first");
  const load = ambiguityLoad(input.ambiguityPressure, input.diversityCoverage);

  const styleDiagnosis = round2(
    clamp(
      input.articulationScore * 35 * boost +
        wI * 10 -
        input.ambiguityPressure * 22 -
        input.affectPressure * 12 -
        (input.styleBias === "style_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const personaDiagnosis = round2(
    clamp(
      input.cooperationScore * 40 * boost +
        input.articulationScore * 25 -
        load * 15 -
        input.diversityCoverage * 8,
      0,
      100,
    ),
  );
  const urgencyReasonScore = round2(
    clamp(
      input.cooperationScore * 38 * boost +
        input.articulationScore * 20 -
        input.personaCoherence * (naive ? 5 : 0) -
        load * 18 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const diversityIntegrity = round2(
    clamp(
      input.articulationScore * 42 * boost +
        input.cooperationScore * 28 -
        input.diversityCoverage * 10 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const idealizedScore = round2(
    clamp(
      input.articulationScore * 58 * boost * wI +
        input.cooperationScore * 32 -
        input.ambiguityPressure * 10 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.cooperationScore * 45 +
        input.articulationScore * 35 -
        input.ambiguityPressure * 20 -
        input.affectPressure * 10,
      0,
      100,
    ),
  );
  const styleAwareContribution = round2(
    clamp(
      styleDiagnosis * 0.2 +
        personaDiagnosis * 0.2 +
        urgencyReasonScore * 0.2 +
        diversityIntegrity * 0.2 +
        idealizedScore * 0.2,
      0,
      100,
    ),
  );
  const idealizedContribution = round2(
    clamp(
      idealizedScore * 0.55 +
        input.cooperationScore * 30 +
        input.articulationScore * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      idealizedContribution * (naive ? 0.78 : 0.5) +
        styleAwareContribution * (naive ? 0.22 : 0.5) -
        input.ambiguityPressure * 8 -
        input.affectPressure * 6,
      0,
      100,
    ),
  );

  return {
    mode: "idealized_patient",
    styleDiagnosis,
    personaDiagnosis,
    urgencyReasonScore,
    diversityIntegrity,
    idealizedScore,
    confidence,
    styleAwareContribution,
    idealizedContribution,
    overall,
  };
}
