/**
 * Generate dual-impl golden fixtures for Chem Trace Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreTypedTraceValidated,
  scoreUngatedAgent,
} from "../src/domain/chem.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "trace_first",
  "balanced",
  "recovery_first",
  "ungated_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ct-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    packCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    ruleFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    recoveryClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    runStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    ungatedPassRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    skipOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    transitionHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    traceBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "ungated_agent" : "typed_trace_validated",
  };
  const expectedTypedTraceValidated = scoreTypedTraceValidated({
    ...input,
    profile: "typed_trace_validated",
  });
  const expectedUngatedAgent = scoreUngatedAgent({
    ...input,
    profile: "ungated_agent",
  });
  const row = {
    id,
    input,
    expectedTypedTraceValidated,
    expectedUngatedAgent,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ct-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ChemInput, ChemQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ChemInput;
  expectedTypedTraceValidated: ChemQuality;
  expectedUngatedAgent: ChemQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
