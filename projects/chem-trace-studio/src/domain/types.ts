export type ChemProfile = "typed_trace_validated" | "ungated_agent";

export type ScoreMode = ChemProfile;

export type TraceBias =
  | "trace_first"
  | "balanced"
  | "recovery_first"
  | "ungated_first";

export type ChemDomain =
  | "dft"
  | "md"
  | "qm"
  | "retrosynthesis"
  | "mixed";

/**
 * Soft-simulation inputs for typed trace-state validated agentic chemistry
 * workflows vs ungated agent baselines. Method-lab scoring only — not certified
 * compliance, not live HPC, not the authors' system.
 */
export type ChemInput = {
  /** Workflow pack coverage (0–1). */
  packCoverage: number;
  /** Trace-state rule fidelity (0–1). */
  ruleFidelity: number;
  /** Recovery config clarity (0–1). */
  recoveryClarity: number;
  /** Run stability across packs (0–1). */
  runStability: number;
  /** Ungated agent baseline pass-rate proxy — path B fuel (0–1). */
  ungatedPassRate: number;
  /** Optimism that ungated “just works” (0–1). */
  skipOptimism: number;
  /** ASP allow/deny transition hardness (0–1, higher = harder for A). */
  transitionHardness: number;
  /** Risk of claiming certified compliance / live HPC (0–1). */
  overclaimRisk: number;
  traceBias: TraceBias;
  profile: ChemProfile;
};

export type ChemQuality = {
  mode: ScoreMode;
  ruleCoverage: number;
  traceDiagnosis: number;
  recoveryOptScore: number;
  packIntegrity: number;
  ungatedScore: number;
  confidence: number;
  validatedContribution: number;
  ungatedContribution: number;
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
  bias: TraceBias,
  lane: Exclude<TraceBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function transitionLoad(
  transitionHardness: number,
  packCoverage: number,
): number {
  return clamp(transitionHardness * (1.25 - packCoverage * 0.5), 0, 1.5);
}
