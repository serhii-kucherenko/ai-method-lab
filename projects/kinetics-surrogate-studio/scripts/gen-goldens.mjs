/**
 * Generate dual-impl golden fixtures for Kinetics Surrogate Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreEntropyConstrained,
  scoreFullRateBaseline,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "entropy_strict",
  "balanced",
  "surrogate_first",
  "full_rate_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ks-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    rateCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    entropyFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    mechanismFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    rateAgreement: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    fullRateAccuracy: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    unconstrainedOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    stiffnessHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    kineticsBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "full_rate_baseline" : "entropy_constrained",
  };
  const expectedEntropyConstrained = scoreEntropyConstrained({
    ...input,
    profile: "entropy_constrained",
  });
  const expectedFullRateBaseline = scoreFullRateBaseline({
    ...input,
    profile: "full_rate_baseline",
  });
  const row = {
    id,
    input,
    expectedEntropyConstrained,
    expectedFullRateBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ks-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { KineticsInput, KineticsQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: KineticsInput;
  expectedEntropyConstrained: KineticsQuality;
  expectedFullRateBaseline: KineticsQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
