/**
 * Generate dual-impl golden fixtures for Nanodomain Target Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreLocalizedNanodomain,
  scoreSystemicPhosphorylation,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "nanodomain_first",
  "balanced",
  "diastolic_first",
  "systemic_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `nt-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    nanodomainLocalization: round2(
      0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02,
    ),
    pdePryStrength: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    diastolicGain: round2(0.25 + t * 0.55 + ((i % 3) - 1) * 0.02),
    systolicPreserve: round2(0.35 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    systemicSpillover: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    phosphorylationCoverage: round2(
      0.4 + t * 0.35 + ((i % 5) - 2) * 0.015,
    ),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    targetBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "systemic_phosphorylation_baseline"
        : "localized_nanodomain_target",
  };
  const expectedLocalized = scoreLocalizedNanodomain({
    ...input,
    profile: "localized_nanodomain_target",
  });
  const expectedSystemic = scoreSystemicPhosphorylation({
    ...input,
    profile: "systemic_phosphorylation_baseline",
  });
  const row = {
    id,
    input,
    expectedLocalized,
    expectedSystemic,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("nt-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { NanodomainInput, NanodomainQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: NanodomainInput;
  expectedLocalized: NanodomainQuality;
  expectedSystemic: NanodomainQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`wrote ${goldens.length} goldens`);
