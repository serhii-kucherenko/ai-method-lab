/**
 * Generate dual-impl golden fixtures for Assay Guard Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreAssayAware,
  scoreNaiveProtocolRunner,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "assay_strict",
  "balanced",
  "monitor_first",
  "runner_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ag-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    deckCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    assayFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    assayFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    protocolIntegrity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    naivePassRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    skipOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    protocolHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    assayBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "naive_protocol_runner" : "assay_aware",
  };
  const expectedAssayAware = scoreAssayAware({
    ...input,
    profile: "assay_aware",
  });
  const expectedNaiveProtocolRunner = scoreNaiveProtocolRunner({
    ...input,
    profile: "naive_protocol_runner",
  });
  const row = {
    id,
    input,
    expectedAssayAware,
    expectedNaiveProtocolRunner,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ag-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AssayInput, AssayQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AssayInput;
  expectedAssayAware: AssayQuality;
  expectedNaiveProtocolRunner: AssayQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
