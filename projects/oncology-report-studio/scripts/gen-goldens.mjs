/**
 * Generate dual-impl golden fixtures for Oncology Report Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMultiLlmCollaborative,
  scoreSingleLlmBaseline,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "collaborative_strict",
  "balanced",
  "multi_first",
  "single_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ors-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    collaboratorCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    findingFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    schemaFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    consensusAgreement: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    singleModelAccuracy: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    soloOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    rareFindingHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    reportBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "single_llm_baseline" : "multi_llm_collaborative",
  };
  const expectedMultiLlmCollaborative = scoreMultiLlmCollaborative({
    ...input,
    profile: "multi_llm_collaborative",
  });
  const expectedSingleLlmBaseline = scoreSingleLlmBaseline({
    ...input,
    profile: "single_llm_baseline",
  });
  const row = {
    id,
    input,
    expectedMultiLlmCollaborative,
    expectedSingleLlmBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ors-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ReportInput, ReportQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ReportInput;
  expectedMultiLlmCollaborative: ReportQuality;
  expectedSingleLlmBaseline: ReportQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
