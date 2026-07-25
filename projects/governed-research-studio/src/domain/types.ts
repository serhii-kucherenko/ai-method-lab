export type ResearchProfile = "governed" | "ungated";

export type ScoreMode = ResearchProfile;

export type ResearchBias =
  | "gate_first"
  | "balanced"
  | "workflow_first"
  | "agent_first";

export type StudyDomain =
  | "gwas"
  | "proteomics"
  | "clinical_cohort"
  | "multiomics"
  | "epidemiology"
  | "hypertension";

/**
 * Soft-simulation inputs for governed end-to-end research vs ungated agent
 * baselines. Method-lab scoring only — not IRB cleared, not live PHI, not the
 * authors' governed research system.
 */
export type ResearchInput = {
  /** How completely governance gates cover the study protocol (0–1). */
  gateCoverage: number;
  /** Workflow stage integrity / checkpoint fidelity (0–1). */
  workflowIntegrity: number;
  /** Evidence provenance / auditability of intermediate artifacts (0–1). */
  evidenceProvenance: number;
  /** Privacy / PHI leakage control strength (0–1). */
  privacyControl: number;
  /** Ungated agent pass-rate proxy — baseline B fuel (0–1). */
  ungatedPassRate: number;
  /** Optimism that an ungated agent “just finishes the paper” (0–1). */
  agentOptimism: number;
  /** Study hardness / multi-stage complexity (0–1, higher = harder for A). */
  studyHardness: number;
  /** Risk of claiming IRB clearance / live PHI write-back (0–1). */
  leakageRisk: number;
  researchBias: ResearchBias;
  profile: ResearchProfile;
};

export type ResearchQuality = {
  mode: ScoreMode;
  gateScore: number;
  workflowScore: number;
  evidenceScore: number;
  privacyScore: number;
  ungatedScore: number;
  confidence: number;
  governedContribution: number;
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
  bias: ResearchBias,
  lane: Exclude<ResearchBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function studyLoad(
  studyHardness: number,
  gateCoverage: number,
): number {
  return clamp(studyHardness * (1.25 - gateCoverage * 0.5), 0, 1.5);
}
