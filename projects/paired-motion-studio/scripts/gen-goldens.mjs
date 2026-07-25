/**
 * Generate dual-impl golden fixtures for Paired Motion Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreDistributedEgoExoFusion,
  scoreEgoOnlyBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "fusion_first",
  "balanced",
  "exo_first",
  "ego_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `pm-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    egoCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    exoCoverage: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    fusionClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    egoOnlyAdherence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    occlusionHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    driftRisk: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    motionBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "ego_only_baseline" : "distributed_ego_exo_fusion",
  };
  const expectedFusion = scoreDistributedEgoExoFusion({
    ...input,
    profile: "distributed_ego_exo_fusion",
  });
  const expectedEgoOnly = scoreEgoOnlyBaseline({
    ...input,
    profile: "ego_only_baseline",
  });
  const row = {
    id,
    input,
    expectedFusion,
    expectedEgoOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("pm-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { PairedMotionInput, PairedMotionQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PairedMotionInput;
  expectedFusion: PairedMotionQuality;
  expectedEgoOnly: PairedMotionQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (pm-001…pm-030)`);
