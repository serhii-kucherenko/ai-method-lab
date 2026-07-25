/**
 * Generate dual-impl golden fixtures for Terrain Fire Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreNaiveOverlay,
  scorePhysicsAware,
} from "../src/domain/terrain.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "tight_control",
  "balanced",
  "elevation_first",
  "photo_drape",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `tfs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const seamBudgetM = round2(2 + t * 6 + ((i % 3) - 1) * 0.4);
  const input = {
    photoResolutionCm: round2(45 - t * 30 + ((i % 4) - 1.5) * 1.5),
    cloudCover: round2(0.45 - t * 0.35 + ((i % 3) - 1) * 0.02),
    overlapRatio: round2(0.4 + t * 0.45 + ((i % 5) - 2) * 0.015),
    elevationChangeM: round2(18 - t * 14 + ((i % 4) - 1.5) * 0.8),
    slopeSteepness: round2(0.55 - t * 0.4 + ((i % 3) - 1) * 0.02),
    fuelDrift: round2(0.5 - t * 0.35 + ((i % 4) - 1.5) * 0.02),
    controlPointDensity: round2(0.35 + t * 0.55 + ((i % 5) - 2) * 0.015),
    elevationPriorStrength: round2(0.3 + t * 0.6 + ((i % 3) - 1) * 0.02),
    seamBudgetM,
    alignmentBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "naive_overlay" : "physics_aware",
  };
  const expectedPhysicsAware = scorePhysicsAware({
    ...input,
    profile: "physics_aware",
  });
  const expectedNaiveOverlay = scoreNaiveOverlay({
    ...input,
    profile: "naive_overlay",
  });
  const row = {
    id,
    input,
    expectedPhysicsAware,
    expectedNaiveOverlay,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { TerrainInput, TerrainQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TerrainInput;
  expectedPhysicsAware: TerrainQuality;
  expectedNaiveOverlay: TerrainQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
