/**
 * Generate dual-impl golden fixtures for Cardiac Pocus Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreCardiacPocusCopd,
  scoreLungUltrasoundBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "cardiac_first",
  "balanced",
  "pattern_first",
  "lung_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `cp-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    cardiacPatternSignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    lungBaselineSignal: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    probeQuality: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    viewCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    copdAssociation: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    examFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assayReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    imagingBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "lung_ultrasound_baseline" : "cardiac_pocus_copd",
  };
  const expectedCardiac = scoreCardiacPocusCopd({
    ...input,
    profile: "cardiac_pocus_copd",
  });
  const expectedLung = scoreLungUltrasoundBaseline({
    ...input,
    profile: "lung_ultrasound_baseline",
  });
  const row = {
    id,
    input,
    expectedCardiac,
    expectedLung,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("cp-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { PocusInput, PocusQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PocusInput;
  expectedCardiac: PocusQuality;
  expectedLung: PocusQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
