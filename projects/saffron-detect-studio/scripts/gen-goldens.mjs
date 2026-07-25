/**
 * Generate dual-impl golden fixtures for Saffron Detect Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreCnnAdulterationDetection,
  scoreVisualInspectionBaseline,
} from "../src/domain/detect.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "cnn_first",
  "balanced",
  "stigma_first",
  "visual_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `sd-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    stigmaClarity: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    adulterantContrast: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    cnnConfidence: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    textureIntegrity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    visualConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    detectHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    detectBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "visual_inspection_baseline"
        : "cnn_adulteration_detection",
  };
  const expectedCnn = scoreCnnAdulterationDetection({
    ...input,
    profile: "cnn_adulteration_detection",
  });
  const expectedVisual = scoreVisualInspectionBaseline({
    ...input,
    profile: "visual_inspection_baseline",
  });
  const row = {
    id,
    input,
    expectedCnn,
    expectedVisual,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("sd-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { DetectInput, DetectQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DetectInput;
  expectedCnn: DetectQuality;
  expectedVisual: DetectQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (sd-001…sd-030)`);
