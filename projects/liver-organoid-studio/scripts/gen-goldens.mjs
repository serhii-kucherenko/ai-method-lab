/**
 * Generate dual-impl golden fixtures for Liver Organoid Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMulticellularHlo,
  scoreSingleLineageHlc,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "hlo_first",
  "balanced",
  "lipid_first",
  "hlc_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `lo-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    multicellularComplexity: round2(
      0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02,
    ),
    hepatocyteLikeFidelity: round2(
      0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02,
    ),
    stellatePresence: round2(0.25 + t * 0.55 + ((i % 3) - 1) * 0.02),
    cholangiocyteMix: round2(0.2 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    lipidAccumulation: round2(0.45 - t * 0.1 + ((i % 3) - 1) * 0.02),
    inflammationCue: round2(0.35 + t * 0.35 + ((i % 5) - 2) * 0.015),
    differentiationDay: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    lineageBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "single_lineage_hlc_baseline"
        : "multicellular_hlo_model",
  };
  const expectedHlo = scoreMulticellularHlo({
    ...input,
    profile: "multicellular_hlo_model",
  });
  const expectedHlc = scoreSingleLineageHlc({
    ...input,
    profile: "single_lineage_hlc_baseline",
  });
  const row = {
    id,
    input,
    expectedHlo,
    expectedHlc,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("lo-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { OrganoidInput, OrganoidQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: OrganoidInput;
  expectedHlo: OrganoidQuality;
  expectedHlc: OrganoidQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`generated ${goldens.length} goldens`);
