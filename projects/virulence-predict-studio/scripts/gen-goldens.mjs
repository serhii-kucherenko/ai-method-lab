/**
 * Generate dual-impl golden fixtures for Virulence Predict Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreFeatureIntegrated,
  scoreSequenceOnly,
} from "../src/domain/virulence.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `std-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    seqLength: Math.round(80 + t * 720 + (i % 5) * 17),
    aaCompositionEntropy: round2(0.25 + t * 0.55 + ((i % 3) - 1) * 0.03),
    hydrophobicFraction: round2(0.18 + t * 0.45 + ((i % 4) - 1.5) * 0.02),
    pssmConservation: round2(0.15 + t * 0.7 + ((i % 7) - 3) * 0.01),
    msaDepth: round2(5 + t * 80 + (i % 6) * 2),
    structureCoverage: round2(0.2 + t * 0.7 + ((i % 5) - 2) * 0.02),
    contactMapDensity: round2(0.15 + t * 0.65 + ((i % 4) - 1.5) * 0.025),
    signalPeptideScore: round2(0.05 + t * 0.75 + ((i % 3) - 1) * 0.04),
    profile: i % 2 === 0 ? "full" : "fast",
  };
  const expectedFeatureIntegrated = scoreFeatureIntegrated(input);
  const expectedSequenceOnly = scoreSequenceOnly(input);
  const row = {
    id,
    input,
    expectedFeatureIntegrated,
    expectedSequenceOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { PredictInput, PredictQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PredictInput;
  expectedFeatureIntegrated: PredictQuality;
  expectedSequenceOnly: PredictQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
