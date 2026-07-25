/**
 * Generate dual-impl golden fixtures for R2map Translate Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreGanR2mapTranslation,
  scoreConventionalR2Baseline,
} from "../src/domain/r2map.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "gan_first",
  "balanced",
  "map_first",
  "conventional_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `r2-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    t1wFidelity: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    t2wFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    ganStability: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    mapCoherence: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    conventionalMatchRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    conventionalOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    translationHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    translateBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "conventional_r2_baseline"
        : "gan_r2map_translation",
  };
  const expectedGan = scoreGanR2mapTranslation({
    ...input,
    profile: "gan_r2map_translation",
  });
  const expectedConventional = scoreConventionalR2Baseline({
    ...input,
    profile: "conventional_r2_baseline",
  });
  const row = {
    id,
    input,
    expectedGan,
    expectedConventional,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("r2-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { R2Input, R2Quality } from "./domain/types";

export type Golden = {
  id: string;
  input: R2Input;
  expectedGan: R2Quality;
  expectedConventional: R2Quality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
