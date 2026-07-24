/**
 * Generate dual-impl golden fixtures for Optical Stack Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreCatalogOnly, scoreOpenVocab } from "../src/domain/score.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const bands = ["visible", "nir", "uv", "broadband", "narrowband"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `oss-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    briefClarity: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    materialDiversity: round2(0.18 + t * 0.7 + ((i % 5) - 2) * 0.015),
    thicknessContinuity: round2(0.22 + t * 0.64 + ((i % 3) - 1) * 0.02),
    stackCoherence: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.015),
    spectrumFit: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    angleTolerance: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    absorptionLoss: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    fabricationFeasibility: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    catalogCoverage: round2(0.18 + t * 0.68 + ((i % 3) - 1) * 0.02),
    noiseLevel: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    bandKind: bands[i % 5],
    plan: i % 3 === 0 ? "open_vocab" : "catalog_only",
  };
  const expectedOpenVocab = scoreOpenVocab(input);
  const expectedCatalogOnly = scoreCatalogOnly(input);
  const row = {
    id,
    input,
    expectedOpenVocab,
    expectedCatalogOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { OpticalInput, OpticalQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: OpticalInput;
  expectedOpenVocab: OpticalQuality;
  expectedCatalogOnly: OpticalQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
