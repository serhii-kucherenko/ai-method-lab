/**
 * Generate dual-impl golden fixtures for MSK Care Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreEvidenceGrounded,
  scoreUngroundedLlm,
} from "../src/domain/care.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const stages = ["admission", "acute", "rehab", "discharge"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `mskcs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    streamCoverage: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.015),
    knowledgeGrounding: round2(0.16 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    pathwayProgress: round2(0.14 + t * 0.72 + ((i % 3) - 1) * 0.02),
    decisionTraceability: round2(0.18 + t * 0.68 + ((i % 6) - 2.5) * 0.015),
    patientStability: round2(0.2 + t * 0.65 + ((i % 4) - 1.5) * 0.015),
    rehabReadiness: round2(0.12 + t * 0.7 + ((i % 5) - 2) * 0.02),
    evidenceFreshness: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.015),
    comorbidityLoad: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    episodeDays: Math.max(1, Math.min(120, 3 + (i % 60))),
    careStage: stages[i % 4],
    planner: i % 3 === 0 ? "grounded" : "ungrounded_llm",
  };
  const expectedEvidenceGrounded = scoreEvidenceGrounded(input);
  const expectedUngroundedLlm = scoreUngroundedLlm(input);
  const row = {
    id,
    input,
    expectedEvidenceGrounded,
    expectedUngroundedLlm,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { CareInput, CareQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CareInput;
  expectedEvidenceGrounded: CareQuality;
  expectedUngroundedLlm: CareQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
