/**
 * Generate dual-impl golden fixtures for Consult Bench Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreMultimodal, scoreTextOnly } from "../src/domain/score.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const departments = [
  "dermatology",
  "radiology",
  "ophthalmology",
  "orthopedics",
  "general",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `cbs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    imageRelevance: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    visualGrounding: round2(0.18 + t * 0.7 + ((i % 5) - 2) * 0.015),
    clinicalCoherence: round2(0.22 + t * 0.64 + ((i % 3) - 1) * 0.02),
    turnClarity: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    safetyDiscipline: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    textFluency: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    departmentFit: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    historyCoverage: round2(0.18 + t * 0.68 + ((i % 3) - 1) * 0.02),
    urgencyRecognition: round2(0.2 + t * 0.66 + ((i % 5) - 2) * 0.015),
    hallucinationRisk: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    department: departments[i % 5],
    plan: i % 3 === 0 ? "multimodal" : "text_only",
  };
  const expectedMultimodal = scoreMultimodal(input);
  const expectedTextOnly = scoreTextOnly(input);
  const row = {
    id,
    input,
    expectedMultimodal,
    expectedTextOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { ConsultInput, ConsultQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ConsultInput;
  expectedMultimodal: ConsultQuality;
  expectedTextOnly: ConsultQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
