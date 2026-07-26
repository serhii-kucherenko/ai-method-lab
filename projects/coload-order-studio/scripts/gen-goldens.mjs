/**
 * Generate dual-impl golden fixtures for Coload Order Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreOrderedCoload,
  scoreSimultaneousLoad,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "chemo_first",
  "balanced",
  "photo_first",
  "simultaneous_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `co-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    orderFidelity: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    chemoEncapsulation: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    photoEncapsulation: round2(0.25 + t * 0.55 + ((i % 3) - 1) * 0.02),
    poreFillUniformity: round2(0.35 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    photothermalResponse: round2(0.3 + t * 0.55 + ((i % 3) - 1) * 0.02),
    burstLeakRisk: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    loadBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "simultaneous_load_baseline"
        : "ordered_coload_sequence",
  };
  const expectedOrdered = scoreOrderedCoload({
    ...input,
    profile: "ordered_coload_sequence",
  });
  const expectedSimultaneous = scoreSimultaneousLoad({
    ...input,
    profile: "simultaneous_load_baseline",
  });
  const row = {
    id,
    input,
    expectedOrdered,
    expectedSimultaneous,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("co-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ColoadInput, ColoadQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ColoadInput;
  expectedOrdered: ColoadQuality;
  expectedSimultaneous: ColoadQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
