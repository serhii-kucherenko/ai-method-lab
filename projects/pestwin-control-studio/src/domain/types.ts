export type PestProfile =
  | "modular_multiagent_pest_control"
  | "single_species_baseline";

export type ScoreMode = PestProfile;

export type ControlBias =
  | "agent_first"
  | "balanced"
  | "coverage_first"
  | "species_first";

export type ModuleKind =
  | "scout_agent"
  | "spray_agent"
  | "trap_agent"
  | "predator_agent"
  | "hybrid_swarm"
  | "custom";

/**
 * Soft-simulation inputs for PesTwin-style modular multi-agent
 * pest/vector control vs single-species baselines.
 * Method-lab scoring only — not field-validated eradication,
 * not live spray-fleet write-back, not the authors' system.
 */
export type PestInput = {
  /** How well modular agents cover the control space (0–1). */
  agentCoverage: number;
  /** Coordination fidelity across agent modules (0–1). */
  moduleCoordination: number;
  /** Soft-sim pest/vector suppression proxy (0–1). */
  suppressionProxy: number;
  /** Soft-sim vector pressure handling proxy (0–1). */
  vectorPressureProxy: number;
  /** Single-species screen breadth — path B fuel (0–1). */
  singleSpeciesBreadth: number;
  /** Optimism that single-species “just works” (0–1). */
  baselineOptimism: number;
  /** Hardness of the pest/vector control task (0–1). */
  controlHardness: number;
  /** Risk of claiming field eradication / spray-fleet write-back (0–1). */
  overclaimRisk: number;
  controlBias: ControlBias;
  profile: PestProfile;
};

export type PestQuality = {
  mode: ScoreMode;
  agentScore: number;
  coordinationScore: number;
  suppressionScore: number;
  coverageIntegrity: number;
  baselineScore: number;
  confidence: number;
  multiagentContribution: number;
  speciesContribution: number;
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
  bias: ControlBias,
  lane: Exclude<ControlBias, "balanced">,
): number {
  if (bias === "balanced") return 1;
  return bias === lane ? 1.35 : 0.55;
}

export function controlLoad(
  controlHardness: number,
  vectorPressureProxy: number,
): number {
  return clamp(controlHardness * (1.25 - vectorPressureProxy * 0.5), 0, 1.5);
}
