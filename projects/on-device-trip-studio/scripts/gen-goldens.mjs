/**
 * Generate dual-impl golden fixtures for On-Device Trip Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreDesireFirst,
  scorePlaFeasibility,
} from "../src/domain/trip.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `odts-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    scheduleFeasibility: round2(0.2 + t * 0.7 + ((i % 5) - 2) * 0.015),
    resourceHeadroom: round2(0.18 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    transferReliability: round2(0.15 + t * 0.72 + ((i % 3) - 1) * 0.02),
    desireAlignment: round2(0.2 + t * 0.68 + ((i % 6) - 2.5) * 0.015),
    constraintStrictness: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.015),
    desireWeight: round2(0.12 + t * 0.75 + ((i % 5) - 2) * 0.02),
    stopCount: Math.max(3, Math.min(40, 4 + (i % 30))),
    weatherRisk: round2(0.05 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    offlineMapCoverage: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.015),
    mobilityAdaptability: round2(0.16 + t * 0.68 + ((i % 7) - 3) * 0.015),
    tripHours: Math.max(4, Math.min(168, 8 + (i % 80))),
    planner: i % 3 === 0 ? "on_device" : "cloud_style",
  };
  const expectedPlaFeasibility = scorePlaFeasibility(input);
  const expectedDesireFirst = scoreDesireFirst(input);
  const row = {
    id,
    input,
    expectedPlaFeasibility,
    expectedDesireFirst,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { TripInput, TripQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TripInput;
  expectedPlaFeasibility: TripQuality;
  expectedDesireFirst: TripQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
