/**
 * Generate dual-impl golden fixtures for Agent Safety Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreStructural, scoreThreshold } from "../src/domain/safety.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ass-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    cfgDelta: round2(0.12 + t * 0.74 + ((i % 5) - 2) * 0.02),
    dfgDelta: round2(0.14 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    privilegeBroadening: round2(0.1 + t * 0.72 + ((i % 6) - 2.5) * 0.015),
    loggingDegradation: round2(0.08 + t * 0.68 + ((i % 3) - 1) * 0.025),
    denyGuardRemoval: round2(0.12 + t * 0.7 + ((i % 5) - 2) * 0.02),
    newSensitiveSinks: round2(0.1 + t * 0.72 + ((i % 4) - 1.5) * 0.02),
    taskJustification: round2(0.15 + (1 - t) * 0.7 + ((i % 3) - 1) * 0.02),
    monitorCoverage: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    suspicionThreshold: Math.max(1, Math.min(10, 3 + (i % 8))),
    codeDiffNoise: round2(0.1 + t * 0.7 + ((i % 7) - 3) * 0.015),
    hardeningRegression: round2(0.1 + t * 0.68 + ((i % 5) - 2) * 0.02),
    checkKindCount: Math.max(1, Math.min(12, 2 + (i % 10))),
    deployMode: i % 2 === 0 ? "sync" : "async",
    profile: i % 3 === 0 ? "strict" : "balanced",
  };
  const expectedStructural = scoreStructural(input);
  const expectedThreshold = scoreThreshold(input);
  const row = {
    id,
    input,
    expectedStructural,
    expectedThreshold,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { SafetyInput, SafetyQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SafetyInput;
  expectedStructural: SafetyQuality;
  expectedThreshold: SafetyQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
