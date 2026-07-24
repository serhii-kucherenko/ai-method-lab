/**
 * Generate dual-impl golden fixtures for Neuro Guard Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreNeuroAgentic, scoreReactive } from "../src/domain/neuro.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ngs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    sensorCoverage: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.02),
    physicsFidelity: round2(0.15 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    planHorizon: round2(0.12 + t * 0.72 + ((i % 6) - 2.5) * 0.015),
    threatSeverity: round2(0.14 + t * 0.7 + ((i % 3) - 1) * 0.025),
    anomalyConfidence: round2(0.16 + t * 0.7 + ((i % 5) - 2) * 0.02),
    latencyBudget: round2(0.14 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    actuatorRisk: round2(0.08 + (1 - t) * 0.65 + ((i % 7) - 3) * 0.015),
    contextFreshness: round2(0.2 + t * 0.65 + ((i % 3) - 1) * 0.02),
    thresholdNoise: round2(0.2 + (1 - t) * 0.55 + ((i % 4) - 1.5) * 0.02),
    isolationDepth: round2(0.22 + t * 0.65 + ((i % 5) - 2) * 0.015),
    cascadeRisk: round2(0.15 + (1 - t) * 0.7 + ((i % 4) - 1.5) * 0.02),
    sensorCount: Math.max(1, Math.min(48, 3 + (i % 20))),
    profile: i % 3 === 0 ? "aggressive" : "balanced",
  };
  const expectedNeuroAgentic = scoreNeuroAgentic(input);
  const expectedReactive = scoreReactive(input);
  const row = {
    id,
    input,
    expectedNeuroAgentic,
    expectedReactive,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { GuardInput, GuardQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: GuardInput;
  expectedNeuroAgentic: GuardQuality;
  expectedReactive: GuardQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
