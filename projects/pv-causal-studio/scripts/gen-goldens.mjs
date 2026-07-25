/**
 * Generate dual-impl golden fixtures for Pv Causal Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreTargetTrialCausalSignal,
  scoreSpontaneousReportingBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "trial_first",
  "balanced",
  "exposure_first",
  "tip_line_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `pc-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    cohortCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    exposureFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    confounderControl: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    spontaneousVolume: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    tipLineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    trialHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    signalBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "spontaneous_reporting_baseline"
        : "target_trial_causal_signal",
  };
  const expectedTargetTrial = scoreTargetTrialCausalSignal({
    ...input,
    profile: "target_trial_causal_signal",
  });
  const expectedSpontaneous = scoreSpontaneousReportingBaseline({
    ...input,
    profile: "spontaneous_reporting_baseline",
  });
  const row = {
    id,
    input,
    expectedTargetTrial,
    expectedSpontaneous,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("pc-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { PvCausalInput, PvCausalQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PvCausalInput;
  expectedTargetTrial: PvCausalQuality;
  expectedSpontaneous: PvCausalQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (pc-001…pc-030)`);
