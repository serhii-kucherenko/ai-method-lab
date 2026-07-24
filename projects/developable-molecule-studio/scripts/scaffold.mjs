/**
 * One-shot scaffold for Developable Molecule Studio product files.
 * Run: node scripts/scaffold.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function w(rel, body) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, body);
}

w(
  "package.json",
  JSON.stringify(
    {
      name: "developable-molecule-studio",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "eslint",
        test: "tsx --test test/goldens.test.ts test/store.test.ts test/ui-critical.test.ts",
        "test:app-up": "tsx --test test/app-up.test.ts",
        "test:unit": "tsx --test test/goldens.test.ts test/store.test.ts",
        "gen:goldens": "tsx scripts/gen-goldens.mjs",
      },
      dependencies: {
        "class-variance-authority": "^0.7.1",
        clsx: "^2.1.1",
        "lucide-react": "^1.26.0",
        next: "16.2.11",
        "radix-ui": "^1.6.5",
        react: "19.2.4",
        "react-dom": "19.2.4",
        shadcn: "^4.14.1",
        "tailwind-merge": "^3.6.0",
        tsx: "^4.23.1",
        "tw-animate-css": "^1.4.0",
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        eslint: "^9",
        "eslint-config-next": "16.2.11",
        tailwindcss: "^4",
        typescript: "^5",
      },
    },
    null,
    2,
  ) + "\n",
);

w(
  "PRODUCT.md",
  `# Developable Molecule Studio

- **Slug:** \`developable-molecule-studio\`
- **Paper:** https://arxiv.org/abs/2607.12349v1
- **Claim:** Pocket-conditioned molecules with property-aware developability vs affinity-only baselines.
`,
);

w(
  "src/claim.ts",
  `export const DISPLAY_NAME = "Developable Molecule Studio";
export const PAPER_ID = "2607.12349";
export const PAPER_URL = "https://arxiv.org/abs/2607.12349v1";
export const AUTHORS_CODE_URL: string | null = null;
export const CLAIM =
  "Drug discovery teams generate pocket-conditioned molecules with property-aware developability optimization — not affinity-only generators that fail later developability checks.";
export const TAGLINE = "Bind the pocket. Pass developability.";
export const GUIDE_PATH = "/docs/guides/55-developable-molecule-studio-lessons.md";
export const DEV_TOKEN = "dms-dev-token";
`,
);

w(
  "src/domain/types.ts",
  `export type PocketFamily =
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
`,
);

w(
  "src/domain/molecule.ts",
  `import {
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

/**
 * Pocket-conditioned + property-aware developability plan quality (good path).
 */
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

/**
 * Affinity-only baseline — ignores developability until late failure.
 */
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
`,
);

// Dual-impl twin — identical logic
w(
  "src/domain/moleculeB.ts",
  `/**
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
`,
);

console.log("Core domain scaffolded");
