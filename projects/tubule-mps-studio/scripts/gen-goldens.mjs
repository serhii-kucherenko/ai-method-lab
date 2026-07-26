/**
 * Generate dual-impl golden fixtures for Tubule Mps Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreVoclosporinMps,
  scoreCyclosporineMps,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "mps_first",
  "balanced",
  "assay_first",
  "cyclosporine_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `tm-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  // High 2D masking early → clear disagreement; MPS preservation rises later
  const input = {
    mpsPreservation: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    cyclosporineHarm: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    culture2dMasking: round2(0.75 - t * 0.55 + ((i % 3) - 1) * 0.02),
    perfusionFidelity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    regimenFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assayReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    scoringBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "cyclosporine_mps" : "voclosporin_mps",
  };
  const expectedVoclosporin = scoreVoclosporinMps({
    ...input,
    profile: "voclosporin_mps",
  });
  const expectedCyclosporine = scoreCyclosporineMps({
    ...input,
    profile: "cyclosporine_mps",
  });
  const row = {
    id,
    input,
    expectedVoclosporin,
    expectedCyclosporine,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("tm-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { TubuleMpsInput, TubuleMpsQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TubuleMpsInput;
  expectedVoclosporin: TubuleMpsQuality;
  expectedCyclosporine: TubuleMpsQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
