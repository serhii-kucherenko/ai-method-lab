export type PocketFamily =
  | "kinase"
  | "protease"
  | "gpcr"
  | "nuclear"
  | "ion_channel";

export type PlanKind = "pocket_developability" | "affinity_only";

export type ScoreMode = "pocket_developability" | "affinity_only";

/**
 * Soft-simulation inputs for pocket-conditioned developable molecule plans.
 * Method-lab model only — not live wet-lab synthesis or docking.
 */
export type MoleculeInput = {
  /** Geometric / volume fit to the pocket (0–1). */
  pocketFit: number;
  /** Volume complementarity (0–1). */
  pocketVolumeMatch: number;
  /** Hydrophobic contact match (0–1). */
  hydrophobicityMatch: number;
  /** H-bond donor/acceptor potential (0–1). */
  hbondPotential: number;
  /** Quantitative estimate of drug-likeness (0–1). */
  qedScore: number;
  /** Aqueous solubility signal (0–1). */
  solubility: number;
  /** Metabolic clearance pressure (0–1, higher = worse). */
  clearanceRisk: number;
  /** Toxicity / liability pressure (0–1, higher = worse). */
  toxicityRisk: number;
  /** Synthetic accessibility (0–1). */
  synthesizability: number;
  /** Lipophilicity balance (0–1). */
  lipophilicity: number;
  family: PocketFamily;
  plan: PlanKind;
};

export type MoleculeQuality = {
  mode: ScoreMode;
  pocketScore: number;
  developabilityScore: number;
  affinityScore: number;
  propertyScore: number;
  clearanceAvoid: number;
  overall: number;
};

export type DevelopabilityReadiness = {
  pocketReady: boolean;
  qedReady: boolean;
  solubilityReady: boolean;
  clearanceReady: boolean;
  toxicityReady: boolean;
  synthReady: boolean;
  overallReady: boolean;
  affinityGap: number;
  developabilityGap: number;
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function readinessFromQuality(
  quality: MoleculeQuality,
  input: MoleculeInput,
): DevelopabilityReadiness {
  const affinityGap = round2(Math.max(0, 70 - quality.affinityScore));
  const developabilityGap = round2(
    Math.max(0, 68 - quality.developabilityScore),
  );
  const pocketReady =
    quality.pocketScore >= 56 + input.pocketFit * 18;
  const qedReady = quality.propertyScore >= 50 + input.qedScore * 22;
  const solubilityReady =
    quality.developabilityScore >= 48 + input.solubility * 20;
  const clearanceReady =
    quality.clearanceAvoid >= 52 + (1 - input.clearanceRisk) * 20;
  const toxicityReady =
    quality.clearanceAvoid >= 48 + (1 - input.toxicityRisk) * 18;
  const synthReady =
    quality.propertyScore >= 46 + input.synthesizability * 20;
  return {
    pocketReady,
    qedReady,
    solubilityReady,
    clearanceReady,
    toxicityReady,
    synthReady,
    overallReady:
      pocketReady &&
      qedReady &&
      solubilityReady &&
      clearanceReady &&
      toxicityReady &&
      synthReady,
    affinityGap,
    developabilityGap,
  };
}
