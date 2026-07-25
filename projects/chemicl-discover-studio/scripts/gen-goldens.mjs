/**
 * Generate dual-impl golden fixtures for Chemicl Discover Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMultimodalChemicl,
  scoreTextOnlyIclBaseline,
} from "../src/domain/chemicl.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "multimodal_first",
  "balanced",
  "exemplar_first",
  "text_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `cd-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    multimodalCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    modalityFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    exemplarAlignment: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    iclPrecision: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    textOnlyBreadth: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    chemistryHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    discoverBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "text_only_icl_baseline" : "multimodal_chemicl",
  };
  const expectedMultimodal = scoreMultimodalChemicl({
    ...input,
    profile: "multimodal_chemicl",
  });
  const expectedTextOnly = scoreTextOnlyIclBaseline({
    ...input,
    profile: "text_only_icl_baseline",
  });
  const row = {
    id,
    input,
    expectedMultimodal,
    expectedTextOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("cd-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { DiscoverInput, DiscoverQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DiscoverInput;
  expectedMultimodal: DiscoverQuality;
  expectedTextOnly: DiscoverQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
