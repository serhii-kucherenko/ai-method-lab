/**
 * Generate dual-impl golden fixtures for Rhythm Read Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreAngularScl, scoreFlatCe } from "../src/domain/rhythm.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `std-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    headClassShare: round2(0.45 + t * 0.4 + ((i % 5) - 2) * 0.015),
    tailClassShare: round2(0.06 + (1 - t) * 0.28 + ((i % 4) - 1.5) * 0.01),
    morphologyAnisotropy: round2(0.18 + t * 0.65 + ((i % 3) - 1) * 0.03),
    angularCovariance: round2(0.15 + t * 0.7 + ((i % 6) - 2.5) * 0.02),
    adaptiveLogit: round2(0.12 + t * 0.72 + ((i % 7) - 3) * 0.015),
    bandProtectQrs: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.025),
    embeddingUniformity: round2(0.16 + t * 0.66 + ((i % 5) - 2) * 0.02),
    labelSparsity: round2(0.2 + t * 0.65 + ((i % 3) - 1) * 0.03),
    multiLabelDensity: round2(0.1 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    profile: i % 2 === 0 ? "full" : "fast",
  };
  const expectedAngularScl = scoreAngularScl(input);
  const expectedFlatCe = scoreFlatCe(input);
  const row = {
    id,
    input,
    expectedAngularScl,
    expectedFlatCe,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { RhythmInput, RhythmQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: RhythmInput;
  expectedAngularScl: RhythmQuality;
  expectedFlatCe: RhythmQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
