/**
 * Generate dual-impl golden fixtures for Aminoaryl Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scorePhotocatalyticAminoaryl,
  scoreCopperCatalyzedAminoaryl,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "photo_first",
  "balanced",
  "assay_first",
  "copper_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `aa-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  // High cyclopropane strain early → clear disagreement; photo yield rises later
  const input = {
    photoYield: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    copperYield: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    cyclopropaneStrain: round2(0.75 - t * 0.55 + ((i % 3) - 1) * 0.02),
    catalystFidelity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    evidenceStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    routeFollowThrough: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assayReadout: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    scoringBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "copper_catalyzed_aminoaryl"
        : "photocatalytic_aminoaryl",
  };
  const expectedPhoto = scorePhotocatalyticAminoaryl({
    ...input,
    profile: "photocatalytic_aminoaryl",
  });
  const expectedCopper = scoreCopperCatalyzedAminoaryl({
    ...input,
    profile: "copper_catalyzed_aminoaryl",
  });
  const row = {
    id,
    input,
    expectedPhoto,
    expectedCopper,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("aa-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AminoarylInput, AminoarylQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AminoarylInput;
  expectedPhoto: AminoarylQuality;
  expectedCopper: AminoarylQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
