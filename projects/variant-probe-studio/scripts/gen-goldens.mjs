/**
 * Generate dual-impl golden fixtures for Variant Probe Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreInterpretableFmProbe,
  scoreOpaquePathogenicity,
} from "../src/domain/probe.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "probe_first",
  "balanced",
  "mechanism_first",
  "opaque_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `vp-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    panelCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    probeFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    mechanismClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    runStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    opaqueBaselineRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    skipOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    mechanismHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    probeBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "opaque_pathogenicity_baseline"
        : "interpretable_fm_probe",
  };
  const expectedProbe = scoreInterpretableFmProbe({
    ...input,
    profile: "interpretable_fm_probe",
  });
  const expectedOpaque = scoreOpaquePathogenicity({
    ...input,
    profile: "opaque_pathogenicity_baseline",
  });
  const row = {
    id,
    input,
    expectedProbe,
    expectedOpaque,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("vp-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ProbeInput, ProbeQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ProbeInput;
  expectedProbe: ProbeQuality;
  expectedOpaque: ProbeQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
