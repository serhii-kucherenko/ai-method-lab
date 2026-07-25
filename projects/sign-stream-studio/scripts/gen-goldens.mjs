/**
 * Generate dual-impl golden fixtures for Sign Stream Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreOfflineBatch,
  scoreRealtimeStream,
} from "../src/domain/stream.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "early_flush",
  "balanced",
  "wait_boundary",
  "batch_only",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `sss-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const budgetMs = round2(600 + t * 600 + ((i % 3) - 1) * 40);
  const input = {
    glossClarity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    motionStability: round2(0.4 + t * 0.5 + ((i % 5) - 2) * 0.015),
    boundaryConfidence: round2(0.38 + t * 0.52 + ((i % 3) - 1) * 0.02),
    latencyMs: round2(400 + (1 - t) * 700 + ((i % 4) - 1.5) * 30),
    budgetMs,
    vocabularyCoverage: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    signerPace: round2(0.55 - t * 0.35 + ((i % 3) - 1) * 0.02),
    occlusionNoise: round2(0.45 - t * 0.35 + ((i % 4) - 1.5) * 0.02),
    streamJitter: round2(0.4 - t * 0.3 + ((i % 3) - 1) * 0.015),
    segmentBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "offline_batch" : "realtime_stream",
  };
  const expectedRealtime = scoreRealtimeStream({
    ...input,
    profile: "realtime_stream",
  });
  const expectedOfflineBatch = scoreOfflineBatch({
    ...input,
    profile: "offline_batch",
  });
  const row = {
    id,
    input,
    expectedRealtime,
    expectedOfflineBatch,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { StreamInput, StreamQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: StreamInput;
  expectedRealtime: StreamQuality;
  expectedOfflineBatch: StreamQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
