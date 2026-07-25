/**
 * Generate dual-impl golden fixtures for Hold Match Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreExperienceAware,
  scoreFirstFeasible,
} from "../src/domain/hold.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const tiers = [
  "release_now",
  "hold_short",
  "hold_long",
  "guardrail_block",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `hms-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    passengerWaitRisk: round2(0.55 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    driverIdleCost: round2(0.52 - t * 0.38 + ((i % 5) - 2) * 0.015),
    cancelBeforeAccept: round2(0.5 - t * 0.36 + ((i % 3) - 1) * 0.02),
    cancelAfterAccept: round2(0.48 - t * 0.34 + ((i % 4) - 1.5) * 0.02),
    supplyDemandStress: round2(0.45 - t * 0.3 + ((i % 3) - 1) * 0.015),
    pickupEtaPressure: round2(0.5 - t * 0.32 + ((i % 5) - 2) * 0.01),
    fareStrength: round2(0.28 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    holdIntensity: round2(0.2 + t * 0.45 + ((i % 3) - 1) * 0.02),
    tierBias: tiers[i % tiers.length],
    profile: i % 3 === 0 ? "first_feasible" : "experience_aware",
  };
  const expectedExperienceAware = scoreExperienceAware({
    ...input,
    profile: "experience_aware",
  });
  const expectedFirstFeasible = scoreFirstFeasible({
    ...input,
    profile: "first_feasible",
  });
  const row = {
    id,
    input,
    expectedExperienceAware,
    expectedFirstFeasible,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { HoldInput, HoldQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: HoldInput;
  expectedExperienceAware: HoldQuality;
  expectedFirstFeasible: HoldQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
