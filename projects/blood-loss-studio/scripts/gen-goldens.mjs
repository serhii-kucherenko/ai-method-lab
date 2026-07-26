/**
 * Generate dual-impl golden fixtures for Blood Loss Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreHaemoglobinCalculated,
  scoreWeighedSwabMeasured,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "swab_first",
  "balanced",
  "assay_first",
  "hb_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `bl-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    swabMassFidelity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    hbDeltaCoverage: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    assayFidelity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    methodCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    birthFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assayReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    scoringBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "haemoglobin_calculated" : "weighed_swab_measured",
  };
  const expectedMeasured = scoreWeighedSwabMeasured({
    ...input,
    profile: "weighed_swab_measured",
  });
  const expectedCalculated = scoreHaemoglobinCalculated({
    ...input,
    profile: "haemoglobin_calculated",
  });
  const row = {
    id,
    input,
    expectedMeasured,
    expectedCalculated,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("bl-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { BloodLossInput, BloodLossQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: BloodLossInput;
  expectedMeasured: BloodLossQuality;
  expectedCalculated: BloodLossQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
