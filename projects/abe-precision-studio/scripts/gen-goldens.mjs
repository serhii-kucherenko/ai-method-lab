/**
 * Generate dual-impl golden fixtures for Abe Precision Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreDomainInsertionAbe,
  scoreBaselineAbe,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "insertion_first",
  "balanced",
  "assay_first",
  "baseline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ap-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    windowNarrowing: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    baselineWindowBreadth: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    assayFidelity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    insertionCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    editorFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assayReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    scoringBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "baseline_abe" : "domain_insertion_abe",
  };
  const expectedInsertion = scoreDomainInsertionAbe({
    ...input,
    profile: "domain_insertion_abe",
  });
  const expectedBaseline = scoreBaselineAbe({
    ...input,
    profile: "baseline_abe",
  });
  const row = {
    id,
    input,
    expectedInsertion,
    expectedBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ap-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AbePrecisionInput, AbePrecisionQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AbePrecisionInput;
  expectedInsertion: AbePrecisionQuality;
  expectedBaseline: AbePrecisionQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
