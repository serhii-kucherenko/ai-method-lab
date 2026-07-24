/**
 * Dual-impl twin of molecule.ts — must stay bitwise-equal on goldens.
 */
import {
  type MoleculeInput,
  type MoleculeQuality,
  clamp,
  round2,
} from "./types";

function familyBoost(family: MoleculeInput["family"]): number {
  switch (family) {
    case "kinase":
      return 1.04;
    case "protease":
      return 1.02;
    case "gpcr":
      return 0.98;
    case "nuclear":
      return 1.0;
    case "ion_channel":
      return 1.06;
    default: {
      const _exhaustive: never = family;
      return _exhaustive;
    }
  }
}

function pocketSignal(input: MoleculeInput): number {
  return clamp(
    58 +
      input.pocketFit * 24 +
      input.pocketVolumeMatch * 14 +
      input.hydrophobicityMatch * 10 +
      input.hbondPotential * 8 -
      input.clearanceRisk * 6,
    0,
    100,
  );
}

function propertySignal(input: MoleculeInput): number {
  return clamp(
    input.qedScore * 36 +
      input.solubility * 22 +
      input.synthesizability * 18 +
      input.lipophilicity * 12 -
      input.toxicityRisk * 20 -
      input.clearanceRisk * 14,
    0,
    100,
  );
}

/** Pocket + developability (dual-impl B). */
export function scorePocketDevelopability(input: MoleculeInput): MoleculeQuality {
  const developable = input.plan === "pocket_developability";
  const boost = (developable ? 1.1 : 0.94) * familyBoost(input.family);
  const pocket = pocketSignal(input);
  const props = propertySignal(input);

  const pocketScore = round2(
    clamp(
      (pocket * 0.55 +
        input.pocketFit * 22 +
        input.hbondPotential * 12) *
        boost,
      0,
      100,
    ),
  );

  const developabilityScore = round2(
    clamp(
      (props * 0.65 +
        input.qedScore * 18 +
        input.solubility * 14 +
        (developable ? 14 : 2)) *
        boost -
        input.clearanceRisk * 10,
      0,
      100,
    ),
  );

  const affinityScore = round2(
    clamp(
      (pocket * 0.48 +
        input.pocketFit * 20 +
        input.hydrophobicityMatch * 16) *
        boost,
      0,
      100,
    ),
  );

  const propertyScore = round2(
    clamp(
      (input.qedScore * 40 +
        input.solubility * 22 +
        input.synthesizability * 18 +
        input.lipophilicity * 12) *
        boost -
        input.toxicityRisk * 14,
      0,
      100,
    ),
  );

  const clearanceAvoid = round2(
    clamp(
      100 -
        (input.clearanceRisk * 42 +
          input.toxicityRisk * 28 +
          (developable ? 0 : 16) +
          Math.max(0, input.lipophilicity - input.solubility) * 18),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      pocketScore * 0.22 +
        developabilityScore * 0.24 +
        affinityScore * 0.16 +
        propertyScore * 0.18 +
        clearanceAvoid * 0.2,
      0,
      100,
    ),
  );

  return {
    mode: "pocket_developability",
    pocketScore,
    developabilityScore,
    affinityScore,
    propertyScore,
    clearanceAvoid,
    overall,
  };
}

/** Affinity-only baseline (dual-impl B). */
export function scoreAffinityOnly(input: MoleculeInput): MoleculeQuality {
  const affinityBias = clamp(
    0.42 +
      input.pocketFit * 0.28 +
      input.hydrophobicityMatch * 0.14 +
      (1 - input.qedScore) * 0.12 +
      input.clearanceRisk * 0.1,
    0.28,
    0.94,
  );
  const pocket = pocketSignal(input);
  const props = propertySignal(input);

  const pocketScore = round2(
    clamp((pocket * 0.42 + input.pocketFit * 16) * affinityBias, 0, 100),
  );

  const developabilityScore = round2(
    clamp(
      (props * 0.22 + input.qedScore * 8) * affinityBias -
        (input.plan === "affinity_only" ? 0 : 4) -
        input.clearanceRisk * 18,
      0,
      100,
    ),
  );

  const affinityScore = round2(
    clamp(
      (pocket * 0.55 + input.pocketFit * 24 + input.hbondPotential * 10) *
        affinityBias,
      0,
      100,
    ),
  );

  const propertyScore = round2(
    clamp(
      (input.qedScore * 16 + input.solubility * 8) * affinityBias -
        input.toxicityRisk * 22,
      0,
      100,
    ),
  );

  const clearanceAvoid = round2(
    clamp(
      100 -
        (input.clearanceRisk * 58 +
          input.toxicityRisk * 32 +
          (1 - input.solubility) * 16 +
          12),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      pocketScore * 0.14 +
        developabilityScore * 0.08 +
        affinityScore * 0.42 +
        propertyScore * 0.1 +
        clearanceAvoid * 0.26,
      0,
      100,
    ),
  );

  return {
    mode: "affinity_only",
    pocketScore,
    developabilityScore,
    affinityScore,
    propertyScore,
    clearanceAvoid,
    overall,
  };
}
