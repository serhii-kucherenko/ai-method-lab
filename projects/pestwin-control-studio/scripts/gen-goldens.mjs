/**
 * Generate dual-impl golden fixtures for Pestwin Control Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreModularMultiagentPestControl,
  scoreSingleSpeciesBaseline,
} from "../src/domain/pest.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "agent_first",
  "balanced",
  "coverage_first",
  "species_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `pc-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    agentCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    moduleCoordination: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    suppressionProxy: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    vectorPressureProxy: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    singleSpeciesBreadth: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    controlHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    controlBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "single_species_baseline" : "modular_multiagent_pest_control",
  };
  const expectedMultiagent = scoreModularMultiagentPestControl({
    ...input,
    profile: "modular_multiagent_pest_control",
  });
  const expectedSpecies = scoreSingleSpeciesBaseline({
    ...input,
    profile: "single_species_baseline",
  });
  const row = {
    id,
    input,
    expectedMultiagent,
    expectedSpecies,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("pc-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { PestInput, PestQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PestInput;
  expectedMultiagent: PestQuality;
  expectedSpecies: PestQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
