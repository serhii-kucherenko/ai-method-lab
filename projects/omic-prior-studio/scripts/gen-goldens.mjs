/**
 * Generate dual-impl golden fixtures for Omic Prior Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scorePriorsInformedTransformer,
  scorePriorsFreeOmicsBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "priors_first",
  "balanced",
  "trait_first",
  "baseline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `op-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    priorCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    transformerFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    traitGrounding: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    baselineConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    traitHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    priorBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "priors_free_omics_baseline"
        : "priors_informed_transformer",
  };
  const expectedPriorsInformed = scorePriorsInformedTransformer({
    ...input,
    profile: "priors_informed_transformer",
  });
  const expectedPriorsFree = scorePriorsFreeOmicsBaseline({
    ...input,
    profile: "priors_free_omics_baseline",
  });
  const row = {
    id,
    input,
    expectedPriorsInformed,
    expectedPriorsFree,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("op-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { OmicPriorInput, OmicPriorQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: OmicPriorInput;
  expectedPriorsInformed: OmicPriorQuality;
  expectedPriorsFree: OmicPriorQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (op-001…op-030)`);
