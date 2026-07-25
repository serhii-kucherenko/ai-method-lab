export type PbpkProfile = "structure_only" | "measured_lab";

export type ScoreMode = PbpkProfile;

export type PbpkBias =
  | "topology_first"
  | "balanced"
  | "adme_first"
  | "lab_first";

export type CompoundDomain =
  | "small_molecule"
  | "peptide"
  | "adc"
  | "prodrug"
  | "cns"
  | "mixed";

/**
 * Soft-simulation inputs for topology-compiled structure-only PBPK vs
 * measured-lab-data baselines. Method-lab scoring only — not regulatory
 * filing, not live LIMS, not the authors' Sisyphus system.
 */
export type PbpkInput = {
  /** Structure-only coverage from SMILES / descriptors (0–1). */
  structureCoverage: number;
  /** Topology graph compile fidelity (0–1). */
  topologyFidelity: number;
  /** ADME model clarity under soft-sim (0–1). */
  admeClarity: number;
  /** Topology-compile stability across organs (0–1). */
  compileStability: number;
  /** Measured-lab baseline pass-rate proxy — path B fuel (0–1). */
  labPassRate: number;
  /** Optimism that measured lab data “just works” (0–1). */
  labOptimism: number;
  /** Topology hardness (0–1, higher = harder for A). */
  topologyHardness: number;
  /** Risk of claiming regulatory filing / live LIMS (0–1). */
  overclaimRisk: number;
  pbpkBias: PbpkBias;
  profile: PbpkProfile;
};

export type PbpkQuality = {
  mode: ScoreMode;
  structureScore: number;
  topologyScore: number;
  admeScore: number;
  compileScore: number;
  labScore: number;
  confidence: number;
  structureOnlyContribution: number;
  measuredLabContribution: number;
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
  bias: PbpkBias,
  lane: Exclude<PbpkBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function topologyLoad(
  topologyHardness: number,
  structureCoverage: number,
): number {
  return clamp(topologyHardness * (1.25 - structureCoverage * 0.5), 0, 1.5);
}
