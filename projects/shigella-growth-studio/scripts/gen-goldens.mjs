/**
 * Generate dual-impl golden fixtures for Shigella Growth Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreAntibioticTreatedShigella,
  scoreUntreatedDiarrheaGrowth,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "antibiotic_first",
  "balanced",
  "growth_first",
  "untreated_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `sg-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    antibioticCoverage: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    shigellaConfirmation: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    episodeSeverity: round2(0.5 - t * 0.35 + ((i % 4) - 1.5) * 0.02),
    untreatedDuration: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    growthVulnerability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    cohortFollowUp: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    growthAssaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    treatmentBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "untreated_diarrhea_growth"
        : "antibiotic_treated_shigella",
  };
  const expectedAntibiotic = scoreAntibioticTreatedShigella({
    ...input,
    profile: "antibiotic_treated_shigella",
  });
  const expectedUntreated = scoreUntreatedDiarrheaGrowth({
    ...input,
    profile: "untreated_diarrhea_growth",
  });
  const row = {
    id,
    input,
    expectedAntibiotic,
    expectedUntreated,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("sg-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { GrowthInput, GrowthQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: GrowthInput;
  expectedAntibiotic: GrowthQuality;
  expectedUntreated: GrowthQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
