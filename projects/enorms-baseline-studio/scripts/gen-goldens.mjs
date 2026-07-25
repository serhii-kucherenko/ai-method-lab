/**
 * Generate dual-impl golden fixtures for Enorms Baseline Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scorePatientSpecificEnorms,
  scorePopulationNormBaseline,
} from "../src/domain/enorms.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "patient_first",
  "balanced",
  "coverage_first",
  "population_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `eb-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    patientNormFit: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    channelCoverage: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    enormsStability: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    detectionSensitivity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    populationMatchRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    populationOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    seizureHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    enormsBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "population_norm_baseline"
        : "patient_specific_enorms",
  };
  const expectedPatient = scorePatientSpecificEnorms({
    ...input,
    profile: "patient_specific_enorms",
  });
  const expectedPopulation = scorePopulationNormBaseline({
    ...input,
    profile: "population_norm_baseline",
  });
  const row = {
    id,
    input,
    expectedPatient,
    expectedPopulation,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("eb-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { EnormsInput, EnormsQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: EnormsInput;
  expectedPatient: EnormsQuality;
  expectedPopulation: EnormsQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
