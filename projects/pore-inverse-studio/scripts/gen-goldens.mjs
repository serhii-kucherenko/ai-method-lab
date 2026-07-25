/**
 * Generate dual-impl golden fixtures for Pore Inverse Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreUnifiedInverse,
  scoreNaiveGenerative,
} from "../src/domain/pore.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "pore_first",
  "balanced",
  "target_first",
  "generative_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `pore-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    inverseCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    poreFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    targetClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    designerStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    generativePassRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    generativeOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    poreHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    poreBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "naive_generative" : "unified_inverse",
  };
  const expectedUnifiedInverse = scoreUnifiedInverse({
    ...input,
    profile: "unified_inverse",
  });
  const expectedNaiveGenerative = scoreNaiveGenerative({
    ...input,
    profile: "naive_generative",
  });
  const row = {
    id,
    input,
    expectedUnifiedInverse,
    expectedNaiveGenerative,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("pore-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { PoreInput, PoreQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: PoreInput;
  expectedUnifiedInverse: PoreQuality;
  expectedNaiveGenerative: PoreQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
