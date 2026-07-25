/**
 * Generate dual-impl golden fixtures for Roi Exemplar Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreNaiveExemplarBaseline,
  scoreOptimizedIncontextExemplars,
} from "../src/domain/exemplar.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "localization_first",
  "balanced",
  "coverage_first",
  "naive_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `re-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    localizationPrecision: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    coverageBreadth: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    exemplarDiversity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    promptFit: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    naiveDumpRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    naiveOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    roiHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    exemplarBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "naive_exemplar_baseline"
        : "optimized_incontext_exemplars",
  };
  const expectedOptimized = scoreOptimizedIncontextExemplars({
    ...input,
    profile: "optimized_incontext_exemplars",
  });
  const expectedNaive = scoreNaiveExemplarBaseline({
    ...input,
    profile: "naive_exemplar_baseline",
  });
  const row = {
    id,
    input,
    expectedOptimized,
    expectedNaive,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("re-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ExemplarInput, ExemplarQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ExemplarInput;
  expectedOptimized: ExemplarQuality;
  expectedNaive: ExemplarQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
