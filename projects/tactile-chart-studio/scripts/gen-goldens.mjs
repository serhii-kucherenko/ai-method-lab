/**
 * Generate dual-impl golden fixtures for Tactile Chart Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreTactile, scoreVisual } from "../src/domain/tactile.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `tcs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    chartClarity: round2(0.2 + t * 0.7 + ((i % 5) - 2) * 0.015),
    layerDepth: round2(0.18 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    grammarCoverage: round2(0.15 + t * 0.72 + ((i % 3) - 1) * 0.02),
    verifyDiscipline: round2(0.2 + t * 0.68 + ((i % 6) - 2.5) * 0.015),
    selectConfirmRate: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.015),
    askFidelity: round2(0.12 + t * 0.75 + ((i % 5) - 2) * 0.02),
    tactileResolution: round2(0.2 + t * 0.68 + ((i % 3) - 1) * 0.02),
    conversationTurns: Math.max(2, Math.min(40, 4 + (i % 28))),
    multimodalSync: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.015),
    feedbackSpeed: round2(0.16 + t * 0.68 + ((i % 7) - 3) * 0.015),
    a11yReview: round2(0.14 + t * 0.7 + ((i % 5) - 2) * 0.015),
    profile: i % 3 === 0 ? "accessible" : "baseline",
  };
  const expectedTactile = scoreTactile(input);
  const expectedVisual = scoreVisual(input);
  const row = {
    id,
    input,
    expectedTactile,
    expectedVisual,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { TactileInput, TactileQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TactileInput;
  expectedTactile: TactileQuality;
  expectedVisual: TactileQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
