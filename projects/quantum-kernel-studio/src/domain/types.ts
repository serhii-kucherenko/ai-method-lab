export type KernelProfile = "quantum_multi_kernel" | "classical_kernel";

export type ScoreMode = "quantum_multi_kernel" | "classical_kernel";

export type KernelBias =
  | "quantum_strict"
  | "balanced"
  | "fingerprint_first"
  | "classical_first";

export type OutcomeLabel =
  | "negative"
  | "indeterminate"
  | "positive"
  | "critical";

/**
 * Soft-simulation inputs for quantum multiple-kernel QSAR vs classical kernel baseline.
 * Method-lab scoring only — not wet-lab, not live quantum hardware.
 */
export type QuantumKernelInput = {
  /** Fraction of descriptor / fingerprint space covered by the pack (0–1). */
  fingerprintCoverage: number;
  /** How informative the quantum kernel embedding is (0–1). */
  kernelFidelity: number;
  /** How well the kernel config matches the binding target (0–1). */
  targetFit: number;
  /** Agreement of multi-kernel outcomes with gold under quantum plan (0–1). */
  multiKernelAgreement: number;
  /** Classical kernel baseline accuracy proxy — baseline B fuel (0–1). */
  classicalAccuracy: number;
  /** Optimism that classical kernels recover missing multi-kernel signal (0–1). Inflates B. */
  classicalOptimism: number;
  /** Severity of hard binding landscape (0–1, higher = harder for A). */
  bindingHardness: number;
  /** Risk of leaking unavailable wet-lab / hardware claims into the score (0–1). */
  leakageRisk: number;
  kernelBias: KernelBias;
  profile: KernelProfile;
};

export type QuantumKernelQuality = {
  mode: ScoreMode;
  bindingDiagnosis: number;
  kernelDiagnosis: number;
  fingerprintReasonScore: number;
  targetIntegrity: number;
  classicalScore: number;
  confidence: number;
  quantumContribution: number;
  classicalContribution: number;
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
  bias: KernelBias,
  lane: Exclude<KernelBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function bindingLoad(
  bindingHardness: number,
  fingerprintCoverage: number,
): number {
  return clamp(bindingHardness * (1.25 - fingerprintCoverage * 0.5), 0, 1.5);
}
