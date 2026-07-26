/**
 * Generate dual-impl golden fixtures for Dhodh Screen Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreStructureBasedDhodh,
  scoreNaiveLibraryBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "structure_first",
  "balanced",
  "assay_first",
  "library_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ds-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  // Low parasite selectivity early → clear disagreement; docking rises later
  const input = {
    dockingFit: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    libraryHitRate: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    pharmacophoreMatch: round2(0.75 - t * 0.55 + ((i % 3) - 1) * 0.02),
    parasiteSelectivity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    screenFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assayReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    scoringBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "naive_library_baseline" : "structure_based_dhodh",
  };
  const expectedStructure = scoreStructureBasedDhodh({
    ...input,
    profile: "structure_based_dhodh",
  });
  const expectedLibrary = scoreNaiveLibraryBaseline({
    ...input,
    profile: "naive_library_baseline",
  });
  const row = {
    id,
    input,
    expectedStructure,
    expectedLibrary,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ds-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { DhodhInput, DhodhQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: DhodhInput;
  expectedStructure: DhodhQuality;
  expectedLibrary: DhodhQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
