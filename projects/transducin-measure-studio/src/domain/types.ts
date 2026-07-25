export type MeasureProfile =
  | "snomed_coded_oct_recovery"
  | "raw_private_tag_baseline";

export type ScoreMode = MeasureProfile;

export type MeasureBias =
  | "snomed_first"
  | "balanced"
  | "export_first"
  | "private_tag_first";

export type ParserKind =
  | "optopol"
  | "zeiss"
  | "hybrid"
  | "snomed"
  | "mixed";

/**
 * Soft-simulation inputs for SNOMED-CT coded OCT measurement recovery
 * vs raw proprietary private-tag dumps. Method-lab scoring only — not
 * clinical deployment, not live PACS write-back, not diagnostic use,
 * not the authors' system.
 */
export type MeasureInput = {
  /** Measure-pack coverage of OCT quantitative fields (0–1). */
  measureCoverage: number;
  /** Optopol/Zeiss private-format parse fidelity (0–1). */
  parseFidelity: number;
  /** SNOMED-CT coding clarity for recovered measures (0–1). */
  snomedClarity: number;
  /** DICOM SR export stability across packs (0–1). */
  exportStability: number;
  /** Raw private-tag dump pass-rate proxy — path B fuel (0–1). */
  privateTagRate: number;
  /** Optimism that raw private tags “just work” (0–1). */
  privateTagOptimism: number;
  /** Undocumented / mismatched private-format hardness (0–1). */
  formatHardness: number;
  /** Risk of claiming clinical deployment / live PACS / diagnosis (0–1). */
  overclaimRisk: number;
  measureBias: MeasureBias;
  profile: MeasureProfile;
};

export type MeasureQuality = {
  mode: ScoreMode;
  measureCoverageScore: number;
  parseScore: number;
  snomedScore: number;
  exportIntegrity: number;
  privateTagBaselineScore: number;
  confidence: number;
  snomedCodedContribution: number;
  privateTagContribution: number;
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
  bias: MeasureBias,
  lane: Exclude<MeasureBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function formatLoad(
  formatHardness: number,
  measureCoverage: number,
): number {
  return clamp(formatHardness * (1.25 - measureCoverage * 0.5), 0, 1.5);
}
