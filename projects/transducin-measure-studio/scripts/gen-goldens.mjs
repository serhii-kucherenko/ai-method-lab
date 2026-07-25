/**
 * Generate dual-impl golden fixtures for Transducin Measure Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreRawPrivateTagBaseline,
  scoreSnomedCodedOctRecovery,
} from "../src/domain/measure.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "snomed_first",
  "balanced",
  "export_first",
  "private_tag_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `tm-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    measureCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    parseFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    snomedClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    exportStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    privateTagRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    privateTagOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    formatHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    measureBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "raw_private_tag_baseline"
        : "snomed_coded_oct_recovery",
  };
  const expectedSnomedCoded = scoreSnomedCodedOctRecovery({
    ...input,
    profile: "snomed_coded_oct_recovery",
  });
  const expectedPrivateTagBaseline = scoreRawPrivateTagBaseline({
    ...input,
    profile: "raw_private_tag_baseline",
  });
  const row = {
    id,
    input,
    expectedSnomedCoded,
    expectedPrivateTagBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("tm-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { MeasureInput, MeasureQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MeasureInput;
  expectedSnomedCoded: MeasureQuality;
  expectedPrivateTagBaseline: MeasureQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
