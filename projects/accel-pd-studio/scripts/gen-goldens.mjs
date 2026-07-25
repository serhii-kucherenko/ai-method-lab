/**
 * Generate dual-impl golden fixtures for Accel PD Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMultichannelPaTransformer,
  scoreHandcraftedPaBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "transformer_first",
  "balanced",
  "channel_first",
  "baseline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ap-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    channelCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    transformerFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    activityGrounding: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    representationCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    baselineConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    signalHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    paBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "handcrafted_pa_baseline"
        : "multichannel_pa_transformer",
  };
  const expectedTransformer = scoreMultichannelPaTransformer({
    ...input,
    profile: "multichannel_pa_transformer",
  });
  const expectedBaseline = scoreHandcraftedPaBaseline({
    ...input,
    profile: "handcrafted_pa_baseline",
  });
  const row = {
    id,
    input,
    expectedTransformer,
    expectedBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ap-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AccelPdInput, AccelPdQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AccelPdInput;
  expectedTransformer: AccelPdQuality;
  expectedBaseline: AccelPdQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
