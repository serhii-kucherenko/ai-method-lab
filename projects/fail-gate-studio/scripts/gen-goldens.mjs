/**
 * Generate dual-impl golden fixtures for Fail Gate Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreCorrectnessOnly,
  scoreFailGate,
} from "../src/domain/failGate.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "taxonomy_strict",
  "balanced",
  "boundary_first",
  "accuracy_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `fgs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    severityFit: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    gateTypeFit: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    boundaryCoherence: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    taxonomyCoverage: round2(0.3 + t * 0.6 + ((i % 3) - 1) * 0.02),
    answerMatch: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    fluencyScore: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    harmProximity: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    scopeDrift: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    gateBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "correctness_only" : "fail_gate",
  };
  const expectedFailGate = scoreFailGate({ ...input, profile: "fail_gate" });
  const expectedCorrectnessOnly = scoreCorrectnessOnly({
    ...input,
    profile: "correctness_only",
  });
  const row = {
    id,
    input,
    expectedFailGate,
    expectedCorrectnessOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { FailGateInput, FailGateQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FailGateInput;
  expectedFailGate: FailGateQuality;
  expectedCorrectnessOnly: FailGateQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
