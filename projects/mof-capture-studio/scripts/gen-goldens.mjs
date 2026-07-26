/**
 * Generate dual-impl golden fixtures for Mof Capture Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreAnionicMofCapture,
  scoreConventionalSorbent,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "mof_first",
  "balanced",
  "assay_first",
  "sorbent_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `mc-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    ionExchangeFidelity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    conventionalCapacity: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    assayFidelity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    sorbentCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    waterFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assayReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    scoringBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "conventional_sorbent" : "anionic_mof_capture",
  };
  const expectedMof = scoreAnionicMofCapture({
    ...input,
    profile: "anionic_mof_capture",
  });
  const expectedConventional = scoreConventionalSorbent({
    ...input,
    profile: "conventional_sorbent",
  });
  const row = {
    id,
    input,
    expectedMof,
    expectedConventional,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("mc-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { MofCaptureInput, MofCaptureQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MofCaptureInput;
  expectedMof: MofCaptureQuality;
  expectedConventional: MofCaptureQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
