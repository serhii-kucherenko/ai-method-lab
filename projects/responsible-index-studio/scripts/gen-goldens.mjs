/**
 * Generate dual-impl golden fixtures for Responsible Index Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreNaiveCommitmentChecklist,
  scoreStructuredCountryIndex,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "dimension_first",
  "balanced",
  "indicator_first",
  "checklist_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ri-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    structuredDepth: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    checklistCoverage: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    indicatorFidelity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    dimensionCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    countryFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    indicatorReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    scoringBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "naive_commitment_checklist" : "structured_country_index",
  };
  const expectedStructured = scoreStructuredCountryIndex({
    ...input,
    profile: "structured_country_index",
  });
  const expectedChecklist = scoreNaiveCommitmentChecklist({
    ...input,
    profile: "naive_commitment_checklist",
  });
  const row = {
    id,
    input,
    expectedStructured,
    expectedChecklist,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ri-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { IndexInput, IndexQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: IndexInput;
  expectedStructured: IndexQuality;
  expectedChecklist: IndexQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
