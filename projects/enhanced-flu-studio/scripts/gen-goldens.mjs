/**
 * Generate dual-impl golden fixtures for Enhanced Flu Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreExpandedEiv,
  scoreCurrentPolicy,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "eiv_first",
  "balanced",
  "coverage_first",
  "baseline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ef-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    coverage65Plus: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    eivUptakeShare: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    winterBurdenIndex: round2(0.55 - t * 0.4 + ((i % 3) - 1) * 0.02),
    hospitalPressure: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    policyStickiness: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    nordicParity: round2(0.35 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    programBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "current_policy_baseline" : "expanded_eiv_program",
  };
  const expectedExpanded = scoreExpandedEiv({
    ...input,
    profile: "expanded_eiv_program",
  });
  const expectedBaseline = scoreCurrentPolicy({
    ...input,
    profile: "current_policy_baseline",
  });
  const row = {
    id,
    input,
    expectedExpanded,
    expectedBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ef-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { FluInput, FluQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FluInput;
  expectedExpanded: FluQuality;
  expectedBaseline: FluQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
