/**
 * Generate dual-impl golden fixtures for Sepsis Therapy Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreCtHmmTherapyEffectiveness,
  scoreStaticGuidelineBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "hmm_first",
  "balanced",
  "regimen_first",
  "guideline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `st-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    onsetCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    regimenFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    hmmStateClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    guidelineAdherence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    cultureLagOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    sepsisHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    therapyBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "static_guideline_baseline"
        : "ct_hmm_therapy_effectiveness",
  };
  const expectedCtHmm = scoreCtHmmTherapyEffectiveness({
    ...input,
    profile: "ct_hmm_therapy_effectiveness",
  });
  const expectedGuideline = scoreStaticGuidelineBaseline({
    ...input,
    profile: "static_guideline_baseline",
  });
  const row = {
    id,
    input,
    expectedCtHmm,
    expectedGuideline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("st-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { SepsisTherapyInput, SepsisTherapyQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SepsisTherapyInput;
  expectedCtHmm: SepsisTherapyQuality;
  expectedGuideline: SepsisTherapyQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (st-001…st-030)`);
