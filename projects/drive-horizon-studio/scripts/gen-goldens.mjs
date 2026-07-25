/**
 * Generate dual-impl golden fixtures for Drive Horizon Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreFlat, scoreHierarchical } from "../src/domain/horizon.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "structure_first",
  "balanced",
  "detail_first",
  "rollout_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `dhs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    structureFit: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    detailFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    temporalConsistency: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    sceneCoverage: round2(0.3 + t * 0.6 + ((i % 3) - 1) * 0.02),
    rolloutSmoothness: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    fluencyScore: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    surprisePressure: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    horizonDrift: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    horizonBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "flat" : "hierarchical",
  };
  const expectedHierarchical = scoreHierarchical({
    ...input,
    profile: "hierarchical",
  });
  const expectedFlat = scoreFlat({
    ...input,
    profile: "flat",
  });
  const row = {
    id,
    input,
    expectedHierarchical,
    expectedFlat,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { HorizonInput, HorizonQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: HorizonInput;
  expectedHierarchical: HorizonQuality;
  expectedFlat: HorizonQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
