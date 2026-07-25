/**
 * Generate dual-impl golden fixtures for Care Query Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMultilingualPocLlmAnswers,
  scoreLocalClinicianBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "llm_first",
  "balanced",
  "locale_first",
  "clinician_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `cq-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    languageCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    clinicalFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    localeGrounding: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    answerCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    clinicianConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    queryHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    queryBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "local_clinician_baseline"
        : "multilingual_poc_llm_answers",
  };
  const expectedLlm = scoreMultilingualPocLlmAnswers({
    ...input,
    profile: "multilingual_poc_llm_answers",
  });
  const expectedClinician = scoreLocalClinicianBaseline({
    ...input,
    profile: "local_clinician_baseline",
  });
  const row = {
    id,
    input,
    expectedLlm,
    expectedClinician,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("cq-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { CareQueryInput, CareQueryQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CareQueryInput;
  expectedLlm: CareQueryQuality;
  expectedClinician: CareQueryQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (cq-001…cq-030)`);
