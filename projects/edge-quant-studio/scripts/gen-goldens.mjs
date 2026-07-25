/**
 * Generate dual-impl golden fixtures for Edge Quant Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreChannelAware, scoreUniform } from "../src/domain/quant.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `eqs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    saliencySkew: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    activationEnergy: round2(0.2 + t * 0.68 + ((i % 5) - 2) * 0.015),
    avgBitBudget: round2(2.4 + t * 5.2 + ((i % 3) - 1) * 0.15),
    paletteSpan: round2(0.22 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    clusterRegularity: round2(0.18 + t * 0.7 + ((i % 3) - 1) * 0.02),
    layoutMerge: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    memoryHeadroom: round2(0.15 + t * 0.7 + ((i % 5) - 2) * 0.015),
    targetAffinity: round2(0.2 + t * 0.68 + ((i % 3) - 1) * 0.02),
    profile: i % 3 === 0 ? "uniform" : "channel",
  };
  const expectedChannelAware = scoreChannelAware({
    ...input,
    profile: "channel",
  });
  const expectedUniform = scoreUniform({ ...input, profile: "uniform" });
  const row = {
    id,
    input,
    expectedChannelAware,
    expectedUniform,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { QuantInput, QuantQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: QuantInput;
  expectedChannelAware: QuantQuality;
  expectedUniform: QuantQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
