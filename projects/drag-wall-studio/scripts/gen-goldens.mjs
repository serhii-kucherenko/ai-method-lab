/**
 * Generate dual-impl golden fixtures for Drag Wall Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreEsClosedLoop,
  scoreOpenLoopGradient,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "es_strict",
  "balanced",
  "sensor_first",
  "open_loop_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `dws-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    wallCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    sensorFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    channelFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    closedLoopAgreement: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    openLoopAccuracy: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    openLoopOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    dragPressure: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    controlBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "open_loop_gradient" : "es_closed_loop",
  };
  const expectedEsClosedLoop = scoreEsClosedLoop({
    ...input,
    profile: "es_closed_loop",
  });
  const expectedOpenLoopGradient = scoreOpenLoopGradient({
    ...input,
    profile: "open_loop_gradient",
  });
  const row = {
    id,
    input,
    expectedEsClosedLoop,
    expectedOpenLoopGradient,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("dws-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { DragWallInput, DragWallQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DragWallInput;
  expectedEsClosedLoop: DragWallQuality;
  expectedOpenLoopGradient: DragWallQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
