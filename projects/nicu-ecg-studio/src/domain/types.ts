export type NicuEcgProfile =
  | "alignment_free_ppg_ecg"
  | "alignment_dependent_ppg_ecg_baseline";

export type ScoreMode = NicuEcgProfile;

export type InpaintBias =
  | "ppg_first"
  | "balanced"
  | "ecg_first"
  | "alignment_first";

export type PpgKind =
  | "dual_stream"
  | "pulse_ox"
  | "neonatal_ppg"
  | "custom";

/**
 * Soft-simulation inputs for alignment-free PPG-guided ECG
 * segment inpainting vs alignment-dependent PPG-to-ECG baselines.
 * Method-lab scoring only — not clinical diagnostic use,
 * not live device write-back, not FDA clearance,
 * not the authors' system.
 */
export type NicuEcgInput = {
  /** Soft-sim PPG channel coverage across the segment (0–1). */
  ppgCoverage: number;
  /** Soft-sim dual-stream inpaint fidelity (0–1). */
  inpaintFidelity: number;
  /** Soft-sim ECG segment recovery quality (0–1). */
  ecgRecovery: number;
  /** Soft-sim ecg pack completeness (0–1). */
  packCompleteness: number;
  /** Alignment-dependent baseline confidence — path B fuel (0–1). */
  alignmentConfidence: number;
  /** Optimism that forced PPG–ECG alignment “just works” (0–1). */
  alignmentOptimism: number;
  /** Hardness of the neonatal segment gap case (0–1). */
  segmentHardness: number;
  /** Risk of claiming diagnostic / device write-back / FDA (0–1). */
  overclaimRisk: number;
  inpaintBias: InpaintBias;
  profile: NicuEcgProfile;
};

export type NicuEcgQuality = {
  mode: ScoreMode;
  ppgScore: number;
  fidelityScore: number;
  ecgScore: number;
  completenessScore: number;
  alignmentScore: number;
  confidence: number;
  alignmentFreeContribution: number;
  alignmentDependentContribution: number;
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
  bias: InpaintBias,
  lane: Exclude<InpaintBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function segmentLoad(
  segmentHardness: number,
  ecgRecovery: number,
): number {
  return clamp(segmentHardness * (1.25 - ecgRecovery * 0.5), 0, 1.5);
}
