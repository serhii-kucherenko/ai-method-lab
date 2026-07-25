/**
 * Generate dual-impl golden fixtures for Mhc Design Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreClassicalGenerativeBaseline,
  scoreHybridQuantumClassicalDeNovo,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "hybrid_first",
  "balanced",
  "allele_first",
  "classical_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `md-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    peptideCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    alleleFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    hybridClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    classicalAdherence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    generativeOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    designHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    designBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "classical_generative_baseline"
        : "hybrid_quantum_classical_de_novo",
  };
  const expectedHybrid = scoreHybridQuantumClassicalDeNovo({
    ...input,
    profile: "hybrid_quantum_classical_de_novo",
  });
  const expectedClassical = scoreClassicalGenerativeBaseline({
    ...input,
    profile: "classical_generative_baseline",
  });
  const row = {
    id,
    input,
    expectedHybrid,
    expectedClassical,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("md-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { MhcDesignInput, MhcDesignQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MhcDesignInput;
  expectedHybrid: MhcDesignQuality;
  expectedClassical: MhcDesignQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (md-001…md-030)`);
