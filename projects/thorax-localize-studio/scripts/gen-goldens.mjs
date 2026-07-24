/**
 * Generate dual-impl golden fixtures for Thorax Localize Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreClassifyLocalize,
  scoreClassifyOnly,
} from "../src/domain/score.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const kinds = ["pa", "lateral", "ap", "portable", "mixed"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `tls-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    imageQuality: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    viewClarity: round2(0.18 + t * 0.7 + ((i % 5) - 2) * 0.015),
    diseaseSignal: round2(0.22 + t * 0.64 + ((i % 3) - 1) * 0.02),
    localizationCoverage: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.015),
    mapPeakStrength: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    mapCoherence: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    findingRichness: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    lesionBoundaryClarity: round2(0.18 + t * 0.68 + ((i % 3) - 1) * 0.02),
    validationConfidence: round2(0.22 + t * 0.64 + ((i % 6) - 2.5) * 0.015),
    noiseLevel: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    examKind: kinds[i % 5],
    plan: i % 3 === 0 ? "classify_localize" : "classify_only",
  };
  const expectedClassifyLocalize = scoreClassifyLocalize(input);
  const expectedClassifyOnly = scoreClassifyOnly(input);
  const row = {
    id,
    input,
    expectedClassifyLocalize,
    expectedClassifyOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { ThoraxInput, ThoraxQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ThoraxInput;
  expectedClassifyLocalize: ThoraxQuality;
  expectedClassifyOnly: ThoraxQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
