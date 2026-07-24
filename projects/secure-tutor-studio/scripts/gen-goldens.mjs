/**
 * Generate dual-impl golden fixtures for Secure Tutor Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreOrchestrated, scoreSingle } from "../src/domain/tutor.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `std-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    vulnComplexity: round2(0.14 + t * 0.76 + ((i % 5) - 2) * 0.02),
    rubricItemCount: Math.max(1, Math.min(20, Math.round(2 + t * 16 + (i % 3)))),
    tutorCoverage: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    orchestrationRounds: Math.max(1, Math.min(8, 1 + (i % 8))),
    pedagogyDepth: round2(0.12 + t * 0.72 + ((i % 3) - 1) * 0.03),
    threatCoverage: round2(0.18 + t * 0.68 + ((i % 6) - 2.5) * 0.02),
    safetyGateStrength: round2(0.14 + t * 0.7 + ((i % 5) - 2) * 0.02),
    studentRiskLevel: round2(0.1 + t * 0.7 + ((i % 7) - 3) * 0.015),
    exploitHintRisk: round2(0.08 + t * 0.72 + ((i % 4) - 1.5) * 0.02),
    explainerSpecialization: round2(0.2 + t * 0.65 + ((i % 4) - 1.5) * 0.02),
    safetySpecialization: round2(0.18 + t * 0.68 + ((i % 3) - 1) * 0.025),
    rubricSpecialization: round2(0.16 + t * 0.7 + ((i % 5) - 2) * 0.02),
    profile: i % 2 === 0 ? "guided" : "strict",
  };
  const expectedOrchestrated = scoreOrchestrated(input);
  const expectedSingle = scoreSingle(input);
  const row = {
    id,
    input,
    expectedOrchestrated,
    expectedSingle,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { TutorInput, TutorQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TutorInput;
  expectedOrchestrated: TutorQuality;
  expectedSingle: TutorQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
