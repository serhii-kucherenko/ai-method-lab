/**
 * Generate dual-impl golden fixtures for Developable Molecule Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreAffinityOnly,
  scorePocketDevelopability,
} from "../src/domain/molecule.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const families = ["kinase", "protease", "gpcr", "nuclear", "ion_channel"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `dms-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    pocketFit: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    pocketVolumeMatch: round2(0.22 + t * 0.66 + ((i % 5) - 2) * 0.015),
    hydrophobicityMatch: round2(0.18 + t * 0.68 + ((i % 3) - 1) * 0.02),
    hbondPotential: round2(0.2 + t * 0.64 + ((i % 4) - 1.5) * 0.02),
    qedScore: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.015),
    solubility: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    clearanceRisk: round2(0.08 + (1 - t) * 0.58 + ((i % 3) - 1) * 0.02),
    toxicityRisk: round2(0.1 + (1 - t) * 0.55 + ((i % 4) - 1.5) * 0.02),
    synthesizability: round2(0.22 + t * 0.64 + ((i % 6) - 2.5) * 0.015),
    lipophilicity: round2(0.24 + t * 0.58 + ((i % 3) - 1) * 0.02),
    family: families[i % 5],
    plan: i % 3 === 0 ? "pocket_developability" : "affinity_only",
  };
  const expectedPocketDevelopability = scorePocketDevelopability(input);
  const expectedAffinityOnly = scoreAffinityOnly(input);
  const row = {
    id,
    input,
    expectedPocketDevelopability,
    expectedAffinityOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { MoleculeInput, MoleculeQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MoleculeInput;
  expectedPocketDevelopability: MoleculeQuality;
  expectedAffinityOnly: MoleculeQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
