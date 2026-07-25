/**
 * Generate dual-impl golden fixtures for Folio Clip Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMultimodalWearableStress,
  scoreSingleSensorBaseline,
} from "../src/domain/clip.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "multimodal_first",
  "balanced",
  "sensor_first",
  "baseline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `fc-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    clipCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    multimodalFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    sensorClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    runStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    singleSensorRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    channelOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    stressHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    stressBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "single_sensor_baseline"
        : "multimodal_wearable_stress",
  };
  const expectedMultimodal = scoreMultimodalWearableStress({
    ...input,
    profile: "multimodal_wearable_stress",
  });
  const expectedBaseline = scoreSingleSensorBaseline({
    ...input,
    profile: "single_sensor_baseline",
  });
  const row = {
    id,
    input,
    expectedMultimodal,
    expectedBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("fc-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ClipInput, ClipQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ClipInput;
  expectedMultimodal: ClipQuality;
  expectedBaseline: ClipQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
