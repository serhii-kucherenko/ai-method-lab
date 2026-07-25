/**
 * Generate dual-impl golden fixtures for Molecule Sample Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreSampleEfficient,
  scoreNaiveGenerativeBaseline,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "efficiency_strict",
  "balanced",
  "optimizer_first",
  "baseline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `mol-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    campaignCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    targetFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    targetFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    sampleEfficiency: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    naiveYield: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    blindOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    designHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    molBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "naive_generative_baseline" : "sample_efficient",
  };
  const expectedSampleEfficient = scoreSampleEfficient({
    ...input,
    profile: "sample_efficient",
  });
  const expectedNaiveGenerativeBaseline = scoreNaiveGenerativeBaseline({
    ...input,
    profile: "naive_generative_baseline",
  });
  const row = {
    id,
    input,
    expectedSampleEfficient,
    expectedNaiveGenerativeBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("mol-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { MolInput, MolQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MolInput;
  expectedSampleEfficient: MolQuality;
  expectedNaiveGenerativeBaseline: MolQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
