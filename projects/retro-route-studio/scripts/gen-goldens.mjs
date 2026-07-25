/**
 * Generate dual-impl golden fixtures for Retro Route Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreNaiveLocal,
  scoreStructuredMemory,
} from "../src/domain/route.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "memory_first",
  "balanced",
  "intermediate_first",
  "greedy_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `rrs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    memoryCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    triedPathRecall: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    intermediateCoverage: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    branchAvoidance: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    routeCoherence: round2(0.3 + t * 0.6 + ((i % 3) - 1) * 0.02),
    localGreedyFit: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    singleStepFluency: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    deadEndPressure: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    routeDrift: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    memoryBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "naive_local" : "structured_memory",
  };
  const expectedStructured = scoreStructuredMemory({
    ...input,
    profile: "structured_memory",
  });
  const expectedNaive = scoreNaiveLocal({
    ...input,
    profile: "naive_local",
  });
  const row = {
    id,
    input,
    expectedStructured,
    expectedNaive,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { RouteInput, RouteQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: RouteInput;
  expectedStructured: RouteQuality;
  expectedNaive: RouteQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
