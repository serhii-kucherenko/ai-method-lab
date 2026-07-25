/**
 * Generate dual-impl golden fixtures for Idia Quant Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreInformedDiaQuant,
  scoreNaiveDiaBaseline,
} from "../src/domain/idia.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "informed_first",
  "balanced",
  "target_first",
  "baseline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `iq-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    targetCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    spectrumInformedness: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    proteinDetectability: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    quantPrecision: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    naiveWindowBreadth: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    abundanceHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    quantBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "naive_dia_baseline" : "informed_dia_quant",
  };
  const expectedInformed = scoreInformedDiaQuant({
    ...input,
    profile: "informed_dia_quant",
  });
  const expectedNaive = scoreNaiveDiaBaseline({
    ...input,
    profile: "naive_dia_baseline",
  });
  const row = {
    id,
    input,
    expectedInformed,
    expectedNaive,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("iq-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { QuantInput, QuantQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: QuantInput;
  expectedInformed: QuantQuality;
  expectedNaive: QuantQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
