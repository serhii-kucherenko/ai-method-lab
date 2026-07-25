/**
 * Generate dual-impl golden fixtures for World Cog Drive Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreWorldCognitive,
  scoreSingleLevel,
} from "../src/domain/worldCog.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "world_first",
  "balanced",
  "action_first",
  "reactive_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `wcd-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    worldForecastFit: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    cognitiveDepth: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    actionAlignment: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    trajectoryIntegrity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    singleLevelPassRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    reactiveOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    routeHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    driveBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "single_level" : "world_cognitive",
  };
  const expectedWorldCognitive = scoreWorldCognitive({
    ...input,
    profile: "world_cognitive",
  });
  const expectedSingleLevel = scoreSingleLevel({
    ...input,
    profile: "single_level",
  });
  const row = {
    id,
    input,
    expectedWorldCognitive,
    expectedSingleLevel,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("wcd-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { DriveInput, DriveQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DriveInput;
  expectedWorldCognitive: DriveQuality;
  expectedSingleLevel: DriveQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
