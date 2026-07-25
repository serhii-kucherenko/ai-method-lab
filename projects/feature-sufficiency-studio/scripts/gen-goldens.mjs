/**
 * Generate dual-impl golden fixtures for Feature Sufficiency Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreFullFeatureBaseline,
  scorePartialObservation,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "mask_strict",
  "balanced",
  "coverage_first",
  "full_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `fss-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    maskCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    featureSalience: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    cohortFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    labelAgreement: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    fullFeatureAccuracy: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    imputationOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    missingnessPressure: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    sufficiencyBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "full_feature" : "partial_observation",
  };
  const expectedPartialObservation = scorePartialObservation({
    ...input,
    profile: "partial_observation",
  });
  const expectedFullFeature = scoreFullFeatureBaseline({
    ...input,
    profile: "full_feature",
  });
  const row = {
    id,
    input,
    expectedPartialObservation,
    expectedFullFeature,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("fss-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { FeatureSufficiencyInput, FeatureSufficiencyQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FeatureSufficiencyInput;
  expectedPartialObservation: FeatureSufficiencyQuality;
  expectedFullFeature: FeatureSufficiencyQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
