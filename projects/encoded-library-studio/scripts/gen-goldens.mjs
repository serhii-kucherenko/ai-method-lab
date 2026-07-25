/**
 * Generate dual-impl golden fixtures for Encoded Library Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreIterativeDeltOptimize,
  scoreSinglePassLibraryScreen,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "iterative",
  "balanced",
  "hit_first",
  "coverage_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `el-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    cycleDepth: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    enrichmentFold: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    diversityRetention: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    hitPrecision: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    libraryCoverage: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    synthesisNoise: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    selectionBias: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    deltBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "single_pass_library_screen"
        : "iterative_delt_optimize",
  };
  const expectedIterative = scoreIterativeDeltOptimize({
    ...input,
    profile: "iterative_delt_optimize",
  });
  const expectedSinglePass = scoreSinglePassLibraryScreen({
    ...input,
    profile: "single_pass_library_screen",
  });
  const row = {
    id,
    input,
    expectedIterative,
    expectedSinglePass,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("el-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { DeltInput, DeltQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DeltInput;
  expectedIterative: DeltQuality;
  expectedSinglePass: DeltQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (el-001…el-030)`);
