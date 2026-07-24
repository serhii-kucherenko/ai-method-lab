/**
 * Generate dual-impl golden fixtures for Quad Skill Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreMultiSkill, scoreSingleGait } from "../src/domain/loco.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const skills = ["trot", "pace", "bound", "crawl", "climb"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `qss-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    terrainRoughness: round2(0.18 + (1 - t) * 0.62 + ((i % 4) - 1.5) * 0.02),
    perceptionQuality: round2(0.22 + t * 0.68 + ((i % 5) - 2) * 0.015),
    skillCoverage: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    transitionSmoothness: round2(0.18 + t * 0.72 + ((i % 3) - 1) * 0.02),
    gaitStability: round2(0.24 + t * 0.66 + ((i % 5) - 2) * 0.015),
    energyEfficiency: round2(0.2 + t * 0.64 + ((i % 4) - 1.5) * 0.02),
    slipRisk: round2(0.08 + (1 - t) * 0.58 + ((i % 3) - 1) * 0.02),
    slopeGrade: round2(0.12 + (1 - t) * 0.55 + ((i % 4) - 1.5) * 0.02),
    trajectoryDensity: round2(0.2 + t * 0.66 + ((i % 6) - 2.5) * 0.015),
    skill: skills[i % 5],
    plan: i % 3 === 0 ? "multi_skill" : "single_gait",
  };
  const expectedMultiSkill = scoreMultiSkill(input);
  const expectedSingleGait = scoreSingleGait(input);
  const row = {
    id,
    input,
    expectedMultiSkill,
    expectedSingleGait,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { LocoInput, LocoQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: LocoInput;
  expectedMultiSkill: LocoQuality;
  expectedSingleGait: LocoQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
