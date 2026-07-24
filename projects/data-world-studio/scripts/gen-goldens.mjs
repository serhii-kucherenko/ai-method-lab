/**
 * Generate dual-impl golden fixtures for Data World Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreTrialError, scoreWorldModel } from "../src/domain/world.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `dws-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    stateCoverage: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.02),
    costAwareness: round2(0.15 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    planHorizon: round2(0.12 + t * 0.72 + ((i % 6) - 2.5) * 0.015),
    simFidelity: round2(0.14 + t * 0.7 + ((i % 3) - 1) * 0.025),
    dataQuality: round2(0.16 + t * 0.7 + ((i % 5) - 2) * 0.02),
    featureRichness: round2(0.14 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    agentSkill: round2(0.2 + t * 0.65 + ((i % 3) - 1) * 0.02),
    explorationNoise: round2(0.08 + (1 - t) * 0.65 + ((i % 7) - 3) * 0.015),
    retryBudget: round2(0.2 + (1 - t) * 0.55 + ((i % 4) - 1.5) * 0.02),
    computeBudget: round2(0.22 + t * 0.65 + ((i % 5) - 2) * 0.015),
    opComplexity: round2(0.15 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    stepCount: Math.max(2, Math.min(40, 4 + (i % 18))),
    profile: i % 3 === 0 ? "aggressive" : "balanced",
  };
  const expectedWorldModel = scoreWorldModel(input);
  const expectedTrialError = scoreTrialError(input);
  const row = {
    id,
    input,
    expectedWorldModel,
    expectedTrialError,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { WorldInput, WorldQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: WorldInput;
  expectedWorldModel: WorldQuality;
  expectedTrialError: WorldQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
