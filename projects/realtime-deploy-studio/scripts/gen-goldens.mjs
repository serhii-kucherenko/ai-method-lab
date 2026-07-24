/**
 * Generate dual-impl golden fixtures for Realtime Deploy Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreHarnessed, scoreNaive } from "../src/domain/deploy.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `std-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    pipelineStages: Math.max(2, Math.min(12, Math.round(3 + t * 8 + (i % 3)))),
    gpuBudget: Math.max(1, Math.min(8, Math.round(1 + t * 6 + (i % 2)))),
    modalityCount: Math.max(1, Math.min(4, 1 + (i % 4))),
    latencyWeight: round2(0.2 + t * 0.7 + ((i % 5) - 2) * 0.02),
    throughputWeight: round2(0.15 + (1 - t) * 0.65 + ((i % 4) - 1.5) * 0.02),
    streamingOverlap: round2(0.12 + t * 0.72 + ((i % 3) - 1) * 0.03),
    stateScopeComplexity: round2(0.18 + t * 0.68 + ((i % 6) - 2.5) * 0.02),
    placementFlexibility: round2(0.15 + t * 0.7 + ((i % 7) - 3) * 0.015),
    irValidationDepth: round2(0.1 + t * 0.75 + ((i % 4) - 1.5) * 0.025),
    measurementGateStrictness: round2(0.14 + t * 0.7 + ((i % 5) - 2) * 0.02),
    candidatePassCount: Math.max(1, Math.min(8, 1 + (i % 8))),
    profile: i % 2 === 0 ? "full" : "fast",
  };
  const expectedHarnessed = scoreHarnessed(input);
  const expectedNaive = scoreNaive(input);
  const row = {
    id,
    input,
    expectedHarnessed,
    expectedNaive,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { DeployInput, DeployQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DeployInput;
  expectedHarnessed: DeployQuality;
  expectedNaive: DeployQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
