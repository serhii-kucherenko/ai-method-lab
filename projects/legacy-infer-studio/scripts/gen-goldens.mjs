/**
 * Generate dual-impl golden fixtures for Legacy Infer Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreStageValidated,
  scoreNaiveOffload,
} from "../src/domain/infer.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const stages = ["vision_encode", "token_merge", "prefill", "decode"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `lis-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    vramGb: round2(4.2 + t * 2.4 + ((i % 4) - 1.5) * 0.08),
    residentGb: round2(3.2 + (1 - t) * 2.8 + ((i % 5) - 2) * 0.06),
    stageAgreement: round2(0.22 + t * 0.7 + ((i % 5) - 2) * 0.015),
    kernelEfficiency: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    hostSpill: round2(0.08 + (1 - t) * 0.62 + ((i % 3) - 1) * 0.02),
    prefillThroughput: round2(0.18 + t * 0.7 + ((i % 6) - 2.5) * 0.015),
    decodeThroughput: round2(0.16 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    visionPortFit: round2(0.2 + t * 0.66 + ((i % 5) - 2) * 0.015),
    contextK: round2(1.2 + t * 9.5 + ((i % 3) - 1) * 0.3),
    stage: stages[i % 4],
    plan: i % 3 === 0 ? "stage_validated" : "naive_offload",
  };
  const expectedStageValidated = scoreStageValidated(input);
  const expectedNaiveOffload = scoreNaiveOffload(input);
  const row = {
    id,
    input,
    expectedStageValidated,
    expectedNaiveOffload,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { InferInput, InferQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: InferInput;
  expectedStageValidated: InferQuality;
  expectedNaiveOffload: InferQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
