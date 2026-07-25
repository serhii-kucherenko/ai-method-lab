/**
 * Generate dual-impl golden fixtures for Share Colearn Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreAiOnlyLabelingBaseline,
  scoreHumanAiColearningLabeling,
} from "../src/domain/colearn.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "clinician_first",
  "balanced",
  "activity_first",
  "ai_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `sc-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    clinicianAgreement: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    activitySignal: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    ehrCompleteness: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    labelStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    aiOnlyConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    labelingHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    labelingBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "ai_only_labeling_baseline"
        : "human_ai_colearning_labeling",
  };
  const expectedHumanAi = scoreHumanAiColearningLabeling({
    ...input,
    profile: "human_ai_colearning_labeling",
  });
  const expectedAiOnly = scoreAiOnlyLabelingBaseline({
    ...input,
    profile: "ai_only_labeling_baseline",
  });
  const row = {
    id,
    input,
    expectedHumanAi,
    expectedAiOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("sc-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ColearnInput, ColearnQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ColearnInput;
  expectedHumanAi: ColearnQuality;
  expectedAiOnly: ColearnQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (sc-001…sc-030)`);
