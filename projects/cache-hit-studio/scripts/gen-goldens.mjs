/**
 * Generate dual-impl golden fixtures for Cache Hit Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreStructuredHitFinding,
  scoreNaiveDockingBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "structure_first",
  "balanced",
  "pocket_first",
  "docking_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ch-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    pocketCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    hitFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    ligandGrounding: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packCompleteness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    dockingConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    dockingOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    pocketHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    hitBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "naive_docking_baseline"
        : "structured_hit_finding",
  };
  const expectedStructured = scoreStructuredHitFinding({
    ...input,
    profile: "structured_hit_finding",
  });
  const expectedDocking = scoreNaiveDockingBaseline({
    ...input,
    profile: "naive_docking_baseline",
  });
  const row = {
    id,
    input,
    expectedStructured,
    expectedDocking,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ch-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { CacheHitInput, CacheHitQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CacheHitInput;
  expectedStructured: CacheHitQuality;
  expectedDocking: CacheHitQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
