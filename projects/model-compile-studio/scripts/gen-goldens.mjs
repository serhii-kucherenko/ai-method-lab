/**
 * Generate dual-impl golden fixtures for Model Compile Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMultiPass,
  scoreSinglePass,
} from "../src/domain/compile.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `std-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    graphComplexity: round2(0.15 + t * 0.7 + ((i % 5) - 2) * 0.02),
    operatorFusionPotential: round2(0.18 + t * 0.65 + ((i % 4) - 1.5) * 0.025),
    memoryLayoutFit: round2(0.2 + t * 0.62 + ((i % 3) - 1) * 0.03),
    quantizationHeadroom: round2(0.12 + t * 0.7 + ((i % 7) - 3) * 0.015),
    targetAffinity: round2(0.1 + t * 0.75 + ((i % 6) - 2.5) * 0.02),
    irDepth: round2(0.16 + t * 0.68 + ((i % 5) - 2) * 0.02),
    kernelCoverage: round2(0.14 + t * 0.7 + ((i % 4) - 1.5) * 0.03),
    passBudget: Math.max(1, Math.min(12, Math.round(2 + t * 9 + (i % 3)))),
    profile: i % 2 === 0 ? "full" : "fast",
  };
  const expectedMultiPass = scoreMultiPass(input);
  const expectedSinglePass = scoreSinglePass(input);
  const row = {
    id,
    input,
    expectedMultiPass,
    expectedSinglePass,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { CompileInput, CompileQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CompileInput;
  expectedMultiPass: CompileQuality;
  expectedSinglePass: CompileQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
