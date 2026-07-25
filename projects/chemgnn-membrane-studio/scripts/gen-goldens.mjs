/**
 * Generate dual-impl golden fixtures for Chemgnn Membrane Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreChemgnnSurrogate,
  scoreClassicalPhysicsBaseline,
} from "../src/domain/membrane.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "graph_first",
  "balanced",
  "flux_first",
  "physics_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `cm-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    graphCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    poreGeometryFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    saltRejectionProxy: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    waterFluxProxy: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    classicalPhysicsBreadth: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    membraneHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    membraneBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "classical_physics_baseline" : "chemgnn_surrogate",
  };
  const expectedChemgnn = scoreChemgnnSurrogate({
    ...input,
    profile: "chemgnn_surrogate",
  });
  const expectedClassical = scoreClassicalPhysicsBaseline({
    ...input,
    profile: "classical_physics_baseline",
  });
  const row = {
    id,
    input,
    expectedChemgnn,
    expectedClassical,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("cm-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { MembraneInput, MembraneQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: MembraneInput;
  expectedChemgnn: MembraneQuality;
  expectedClassical: MembraneQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
