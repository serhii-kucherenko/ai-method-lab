export type OrganoidProfile =
  | "multicellular_hlo_model"
  | "single_lineage_hlc_baseline";

export type ScoreMode = OrganoidProfile;

export type LineageBias =
  | "hlo_first"
  | "balanced"
  | "hlc_first"
  | "lipid_first";

export type ModelKind =
  | "multicellular_hlo"
  | "hepatocyte_like_hlc"
  | "mixed_lineage"
  | "stellate_enriched"
  | "custom";

export type LineageKind =
  | "hepatocyte_dominant"
  | "cholangiocyte_mix"
  | "stellate_include"
  | "endothelial_cue"
  | "custom";

export type AssayKind =
  | "masld_lipid"
  | "inflammation_cue"
  | "differentiation_day"
  | "multicellular_integrity"
  | "custom";

/**
 * Soft-simulation inputs for multicellular HLO vs single-lineage HLC.
 * Method-lab scoring only — not wet-lab validated organoid GMP manufacture,
 * not live patient transplant, not clinical MASLD diagnosis.
 */
export type OrganoidInput = {
  /** Soft-sim multicellular complexity of the HLO (0–1). */
  multicellularComplexity: number;
  /** Soft-sim hepatocyte-like fidelity (0–1). */
  hepatocyteLikeFidelity: number;
  /** Soft-sim stellate / non-parenchymal presence (0–1). */
  stellatePresence: number;
  /** Soft-sim cholangiocyte mix (0–1). */
  cholangiocyteMix: number;
  /** Soft-sim lipid accumulation MASLD phenotype (0–1). */
  lipidAccumulation: number;
  /** Soft-sim inflammation cue (0–1). */
  inflammationCue: number;
  /** Soft-sim differentiation maturity (10-day protocol proxy, 0–1). */
  differentiationDay: number;
  /** Risk of claiming GMP / transplant / clinical diagnosis (0–1). */
  overclaimRisk: number;
  lineageBias: LineageBias;
  profile: OrganoidProfile;
};

export type OrganoidQuality = {
  mode: ScoreMode;
  multicellularScore: number;
  hepatocyteScore: number;
  lineageScore: number;
  masldScore: number;
  baselineScore: number;
  confidence: number;
  hloContribution: number;
  hlcContribution: number;
  overall: number;
};

export type PackLockState = "hold_pack" | "review" | "lock_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): PackLockState {
  if (overall >= 72) return "lock_soft_sim";
  if (overall >= 48) return "review";
  return "hold_pack";
}

export function biasWeight(
  bias: LineageBias,
  lane: Exclude<LineageBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function masldDrag(
  lipidAccumulation: number,
  inflammationCue: number,
): number {
  return clamp(lipidAccumulation * 0.55 + inflammationCue * 0.45, 0, 1.5);
}
