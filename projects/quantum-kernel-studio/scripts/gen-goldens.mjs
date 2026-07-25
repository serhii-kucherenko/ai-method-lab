/**
 * Generate dual-impl golden fixtures for Quantum Kernel Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreClassicalKernel,
  scoreQuantumMultiKernel,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "quantum_strict",
  "balanced",
  "fingerprint_first",
  "classical_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `qks-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    fingerprintCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    kernelFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    targetFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    multiKernelAgreement: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    classicalAccuracy: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    classicalOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    bindingHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    kernelBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "classical_kernel" : "quantum_multi_kernel",
  };
  const expectedQuantumMultiKernel = scoreQuantumMultiKernel({
    ...input,
    profile: "quantum_multi_kernel",
  });
  const expectedClassicalKernel = scoreClassicalKernel({
    ...input,
    profile: "classical_kernel",
  });
  const row = {
    id,
    input,
    expectedQuantumMultiKernel,
    expectedClassicalKernel,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("qks-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { QuantumKernelInput, QuantumKernelQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: QuantumKernelInput;
  expectedQuantumMultiKernel: QuantumKernelQuality;
  expectedClassicalKernel: QuantumKernelQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
