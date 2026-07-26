/**
 * Generate dual-impl golden fixtures for Dengue Suit Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreCmip6Thermal,
  scoreStaticHistorical,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "ssp585_first",
  "balanced",
  "ssp126_first",
  "historical_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ds-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    thermalSuitIndex: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    populationAtRisk: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    climateShiftSignal: round2(0.25 + t * 0.55 + ((i % 3) - 1) * 0.02),
    vectorNicheFidelity: round2(0.3 + t * 0.55 + ((i % 3) - 1) * 0.02),
    spatialCoverage: round2(0.35 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    historicalStickiness: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    climateBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "static_historical_baseline"
        : "cmip6_thermal_suitability",
  };
  const expectedCmip6 = scoreCmip6Thermal({
    ...input,
    profile: "cmip6_thermal_suitability",
  });
  const expectedHistorical = scoreStaticHistorical({
    ...input,
    profile: "static_historical_baseline",
  });
  const row = {
    id,
    input,
    expectedCmip6,
    expectedHistorical,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ds-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { SuitInput, SuitQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SuitInput;
  expectedCmip6: SuitQuality;
  expectedHistorical: SuitQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
