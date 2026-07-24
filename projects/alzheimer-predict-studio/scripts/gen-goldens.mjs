/**
 * Generate dual-impl golden fixtures for Alzheimer Predict Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreImputationFree,
  scoreImputeThenPredict,
} from "../src/domain/predict.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const modalities = ["tabular", "imaging", "mixed", "biomarker", "cognitive"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `aps-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    ageNorm: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    cognitiveDecline: round2(0.22 + t * 0.66 + ((i % 5) - 2) * 0.015),
    imagingSignal: round2(0.18 + t * 0.68 + ((i % 3) - 1) * 0.02),
    biomarkerSignal: round2(0.2 + t * 0.64 + ((i % 4) - 1.5) * 0.02),
    missingnessRate: round2(0.08 + (1 - t) * 0.58 + ((i % 3) - 1) * 0.02),
    missingnessMaskQuality: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    calibrationPrior: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.015),
    featureCompleteness: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    temporalSpan: round2(0.22 + t * 0.64 + ((i % 6) - 2.5) * 0.015),
    comorbidityLoad: round2(0.1 + (1 - t) * 0.55 + ((i % 4) - 1.5) * 0.02),
    modality: modalities[i % 5],
    plan: i % 3 === 0 ? "imputation_free" : "impute_then_predict",
  };
  const expectedImputationFree = scoreImputationFree(input);
  const expectedImputeThenPredict = scoreImputeThenPredict(input);
  const row = {
    id,
    input,
    expectedImputationFree,
    expectedImputeThenPredict,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { PredictInput, PredictQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PredictInput;
  expectedImputationFree: PredictQuality;
  expectedImputeThenPredict: PredictQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
