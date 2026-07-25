export type AttestProfile = "attested" | "fluent";

export type ScoreMode = "tool_attested" | "fluent_only";

export type ToolBias =
  | "calc"
  | "search"
  | "code"
  | "retrieval"
  | "balanced";

/**
 * Soft-simulation inputs for tool-attested proof quality vs fluent-only baseline.
 * Method-lab scoring only — not EG-VAR rebrand or production Lean 4 kernels.
 */
export type AttestInput = {
  /** Fraction of answer steps covered by tool attestations (0–1). */
  toolCoverage: number;
  /** How well citations ground in ledger evidence (0–1). */
  evidenceGrounding: number;
  /** Soft-sim kernel chain integrity (0–1). */
  proofChainIntegrity: number;
  /** Freshness / validity of tool attestations (0–1). */
  attestationFreshness: number;
  /** How specific the empirical claim is (0–1). */
  claimSpecificity: number;
  /** Fluent model self-confidence without tools (0–1). */
  fluentConfidence: number;
  /** Fraction of unsupported claims (0–1, higher = worse). */
  unsupportedClaims: number;
  /** Spec / attestation noise (0–1, higher = worse). */
  noiseLevel: number;
  toolBias: ToolBias;
  profile: AttestProfile;
};

export type AttestQuality = {
  mode: ScoreMode;
  coverageScore: number;
  groundingScore: number;
  proofScore: number;
  freshnessScore: number;
  specificityScore: number;
  fluencyScore: number;
  confidence: number;
  toolContribution: number;
  proofContribution: number;
  overall: number;
};

export type AttestReadiness = "hold" | "review" | "ship_soft_sim";

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(overall: number): AttestReadiness {
  if (overall >= 72) return "ship_soft_sim";
  if (overall >= 48) return "review";
  return "hold";
}

export function biasWeight(
  bias: ToolBias,
  lane: Exclude<ToolBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}
