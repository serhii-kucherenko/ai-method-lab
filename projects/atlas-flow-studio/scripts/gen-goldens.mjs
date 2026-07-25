/**
 * Generate dual-impl golden fixtures for Atlas Flow Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreFragmentedMultiToolBaseline,
  scoreIntegratedAtlasWorkflow,
} from "../src/domain/atlas.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "atlas_first",
  "balanced",
  "region_first",
  "fragment_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `af-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    registrationFidelity: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    regionCoverage: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    atlasAlignment: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    quantStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    fragmentToolConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    workflowHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    registrationBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "fragmented_multi_tool_baseline"
        : "integrated_atlas_workflow",
  };
  const expectedIntegrated = scoreIntegratedAtlasWorkflow({
    ...input,
    profile: "integrated_atlas_workflow",
  });
  const expectedFragmented = scoreFragmentedMultiToolBaseline({
    ...input,
    profile: "fragmented_multi_tool_baseline",
  });
  const row = {
    id,
    input,
    expectedIntegrated,
    expectedFragmented,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("af-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AtlasInput, AtlasQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AtlasInput;
  expectedIntegrated: AtlasQuality;
  expectedFragmented: AtlasQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (af-001…af-030)`);
