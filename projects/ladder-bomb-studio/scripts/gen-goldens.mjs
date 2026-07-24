/**
 * Generate dual-impl golden fixtures for Ladder Bomb Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreDroppedFb, scoreFbAware } from "../src/domain/ladder.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `lbs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    fbBodyRetention: round2(0.2 + t * 0.72 + ((i % 5) - 2) * 0.02),
    nestedFbDepth: round2(0.12 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    timerCounterComplexity: round2(0.1 + t * 0.72 + ((i % 6) - 2.5) * 0.015),
    interlockBypassRisk: round2(0.08 + t * 0.7 + ((i % 3) - 1) * 0.025),
    actuatorReach: round2(0.12 + t * 0.7 + ((i % 5) - 2) * 0.02),
    operatorOverrideGap: round2(0.1 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    hiddenTimerHint: round2(0.15 + t * 0.7 + ((i % 3) - 1) * 0.02),
    scanCycleBoundTightness: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    symbolicPathCoverage: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.015),
    triggerRecoverability: round2(0.16 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    ladderNoise: round2(0.08 + (1 - t) * 0.65 + ((i % 7) - 3) * 0.015),
    fbInstanceCount: Math.max(1, Math.min(24, 2 + (i % 12))),
    profile: i % 3 === 0 ? "strict" : "balanced",
  };
  const expectedFbAware = scoreFbAware(input);
  const expectedDroppedFb = scoreDroppedFb(input);
  const row = {
    id,
    input,
    expectedFbAware,
    expectedDroppedFb,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { LadderInput, LadderQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: LadderInput;
  expectedFbAware: LadderQuality;
  expectedDroppedFb: LadderQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
