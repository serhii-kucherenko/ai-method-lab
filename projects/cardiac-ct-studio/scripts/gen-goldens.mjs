/**
 * Generate dual-impl golden fixtures for Cardiac CT Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreAutoOnly, scoreHitlFoundation } from "../src/domain/score.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const kinds = ["ccta", "cac", "morphology", "functional", "mixed"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ccs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    contrastQuality: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    motionArtifact: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    expertAnnotationCoverage: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.015),
    structureCoverage: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    foundationPrior: round2(0.22 + t * 0.64 + ((i % 3) - 1) * 0.02),
    phenotypeRichness: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    sliceQuality: round2(0.18 + t * 0.7 + ((i % 5) - 2) * 0.015),
    calciumSignal: round2(0.22 + t * 0.64 + ((i % 6) - 2.5) * 0.015),
    chamberGeometry: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    vesselClarity: round2(0.18 + t * 0.68 + ((i % 3) - 1) * 0.02),
    studyKind: kinds[i % 5],
    plan: i % 3 === 0 ? "hitl_foundation" : "auto_only",
  };
  const expectedHitlFoundation = scoreHitlFoundation(input);
  const expectedAutoOnly = scoreAutoOnly(input);
  const row = {
    id,
    input,
    expectedHitlFoundation,
    expectedAutoOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { CardiacInput, CardiacQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CardiacInput;
  expectedHitlFoundation: CardiacQuality;
  expectedAutoOnly: CardiacQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
