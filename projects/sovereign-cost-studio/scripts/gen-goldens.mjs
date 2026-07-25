/**
 * Generate dual-impl golden fixtures for Sovereign Cost Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreNaiveCloudFootprintBaseline,
  scoreSovereignInfraWeeAccounting,
} from "../src/domain/cost.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "water_first",
  "balanced",
  "energy_first",
  "cloud_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `sc-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    waterIntensity: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    energyIntensity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    emissionsClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    scenarioStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    cloudFootprintRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    cloudOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    infraHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    costBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "naive_cloud_footprint_baseline"
        : "sovereign_infra_wee_accounting",
  };
  const expectedSovereignWee = scoreSovereignInfraWeeAccounting({
    ...input,
    profile: "sovereign_infra_wee_accounting",
  });
  const expectedNaiveCloud = scoreNaiveCloudFootprintBaseline({
    ...input,
    profile: "naive_cloud_footprint_baseline",
  });
  const row = {
    id,
    input,
    expectedSovereignWee,
    expectedNaiveCloud,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("sc-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { CostInput, CostQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CostInput;
  expectedSovereignWee: CostQuality;
  expectedNaiveCloud: CostQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
