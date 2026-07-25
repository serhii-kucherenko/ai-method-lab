export type TriageProfile = "style_aware" | "idealized_patient";

export type ScoreMode = "style_aware" | "idealized_patient";

export type StyleBias =
  | "style_strict"
  | "balanced"
  | "urgency_first"
  | "idealized_first";

export type UrgencyLevel = "self_care" | "primary_care" | "urgent" | "emergency";

/**
 * Soft-simulation inputs for style-aware triage vs idealized-patient baseline.
 * Method-lab scoring only — not clinical advice or FDA-cleared decision support.
 */
export type PersonaTriageInput = {
  /** How well persona style axes match the utterance (0–1). */
  styleFit: number;
  /** Emotional/strategy tag coherence for the persona (0–1). */
  personaCoherence: number;
  /** Urgency label alignment with gold case (0–1). */
  urgencyAlignment: number;
  /** Communication diversity coverage across style axes (0–1). */
  diversityCoverage: number;
  /** Lexical clarity / idealized articulation proxy (0–1) — baseline B fuel. */
  articulationScore: number;
  /** Cooperative / compliant patient theater (0–1) — inflates B, discounted by A. */
  cooperationScore: number;
  /** Ambiguity / hedging pressure in the utterance (0–1, higher = harder). */
  ambiguityPressure: number;
  /** Emotional intensity pressure (0–1). */
  affectPressure: number;
  styleBias: StyleBias;
  profile: TriageProfile;
};

export type PersonaTriageQuality = {
  mode: ScoreMode;
  styleDiagnosis: number;
  personaDiagnosis: number;
  urgencyReasonScore: number;
  diversityIntegrity: number;
  idealizedScore: number;
  confidence: number;
  styleAwareContribution: number;
  idealizedContribution: number;
  overall: number;
};

export type PackReadiness = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackReadiness {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: StyleBias,
  lane: Exclude<StyleBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function ambiguityLoad(
  ambiguityPressure: number,
  diversityCoverage: number,
): number {
  return clamp(ambiguityPressure * (1.2 - diversityCoverage * 0.45), 0, 1.5);
}
