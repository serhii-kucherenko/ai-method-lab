/**
 * Generate dual-impl golden fixtures for Meta Synthesis Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreAdhoc, scoreAgentic } from "../src/domain/synthesis.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `mss-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    questionClarity: round2(0.2 + t * 0.7 + ((i % 5) - 2) * 0.015),
    searchBreadth: round2(0.18 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    screenDiscipline: round2(0.15 + t * 0.72 + ((i % 3) - 1) * 0.02),
    extractionCompleteness: round2(0.2 + t * 0.68 + ((i % 6) - 2.5) * 0.015),
    studyCount: Math.max(2, Math.min(100, 4 + (i % 28))),
    effectPrecision: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.015),
    heterogeneityAware: round2(0.12 + t * 0.75 + ((i % 5) - 2) * 0.02),
    poolingQuality: round2(0.2 + t * 0.68 + ((i % 3) - 1) * 0.02),
    inclusionStrictness: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.015),
    duplicateControl: round2(0.16 + t * 0.68 + ((i % 7) - 3) * 0.015),
    biasAssessment: round2(0.14 + t * 0.7 + ((i % 5) - 2) * 0.015),
    profile: i % 3 === 0 ? "rigorous" : "balanced",
  };
  const expectedAgentic = scoreAgentic(input);
  const expectedAdhoc = scoreAdhoc(input);
  const row = {
    id,
    input,
    expectedAgentic,
    expectedAdhoc,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { SynthesisInput, SynthesisQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SynthesisInput;
  expectedAgentic: SynthesisQuality;
  expectedAdhoc: SynthesisQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
