/**
 * Generate dual-impl golden fixtures for Crystal Bind Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreMultimodal, scoreSingle } from "../src/domain/bind.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = ["structure", "diffraction", "dos", "language", "balanced"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `cbs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    structureFidelity: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    diffractionMatch: round2(0.2 + t * 0.68 + ((i % 5) - 2) * 0.015),
    dosAlignment: round2(0.17 + t * 0.7 + ((i % 3) - 1) * 0.02),
    languageClarity: round2(0.19 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    bindCoherence: round2(0.18 + t * 0.7 + ((i % 3) - 1) * 0.02),
    crossModalAgreement: round2(0.16 + t * 0.68 + ((i % 5) - 2) * 0.015),
    retrievalPrecision: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    noiseLevel: round2(0.35 - t * 0.28 + ((i % 3) - 1) * 0.01),
    modalityBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "single" : "multimodal",
  };
  const expectedMultimodal = scoreMultimodal({
    ...input,
    profile: "multimodal",
  });
  const expectedSingle = scoreSingle({ ...input, profile: "single" });
  const row = {
    id,
    input,
    expectedMultimodal,
    expectedSingle,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { BindInput, BindQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: BindInput;
  expectedMultimodal: BindQuality;
  expectedSingle: BindQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
