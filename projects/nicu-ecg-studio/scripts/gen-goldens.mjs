/**
 * Generate dual-impl golden fixtures for Nicu Ecg Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreAlignmentFreePpgEcg,
  scoreAlignmentDependentPpgEcgBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "ppg_first",
  "balanced",
  "ecg_first",
  "alignment_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ne-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    ppgCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    inpaintFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    ecgRecovery: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    alignmentConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    alignmentOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    segmentHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    inpaintBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "alignment_dependent_ppg_ecg_baseline"
        : "alignment_free_ppg_ecg",
  };
  const expectedAlignmentFree = scoreAlignmentFreePpgEcg({
    ...input,
    profile: "alignment_free_ppg_ecg",
  });
  const expectedAlignmentDependent = scoreAlignmentDependentPpgEcgBaseline({
    ...input,
    profile: "alignment_dependent_ppg_ecg_baseline",
  });
  const row = {
    id,
    input,
    expectedAlignmentFree,
    expectedAlignmentDependent,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ne-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { NicuEcgInput, NicuEcgQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: NicuEcgInput;
  expectedAlignmentFree: NicuEcgQuality;
  expectedAlignmentDependent: NicuEcgQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (ne-001…ne-030)`);
