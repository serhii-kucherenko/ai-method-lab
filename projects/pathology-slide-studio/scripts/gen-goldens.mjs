/**
 * Generate dual-impl golden fixtures for Pathology Slide Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMultiSignal,
  scoreVisionOnly,
} from "../src/domain/pathology.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `std-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    patchMorphology: round2(0.18 + t * 0.7 + ((i % 5) - 2) * 0.02),
    textureEntropy: round2(0.2 + t * 0.55 + ((i % 4) - 1.5) * 0.025),
    stainQuality: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.03),
    languageAlign: round2(0.12 + t * 0.72 + ((i % 7) - 3) * 0.015),
    conceptMatch: round2(0.1 + t * 0.7 + ((i % 6) - 2.5) * 0.02),
    slideContext: round2(0.15 + t * 0.68 + ((i % 5) - 2) * 0.02),
    tissueHeterogeneity: round2(0.18 + t * 0.6 + ((i % 4) - 1.5) * 0.03),
    milAggregator: round2(8 + t * 80 + (i % 6) * 2.5),
    profile: i % 2 === 0 ? "full" : "fast",
  };
  const expectedMultiSignal = scoreMultiSignal(input);
  const expectedVisionOnly = scoreVisionOnly(input);
  const row = {
    id,
    input,
    expectedMultiSignal,
    expectedVisionOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { EmbedInput, EmbedQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: EmbedInput;
  expectedMultiSignal: EmbedQuality;
  expectedVisionOnly: EmbedQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
