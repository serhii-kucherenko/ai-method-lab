/**
 * Generate dual-impl golden fixtures for Aracot Agent Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreArabicCotDistilled,
  scoreNondistilledBaseline,
} from "../src/domain/aracot.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "cot_first",
  "balanced",
  "distill_first",
  "baseline_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `aa-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    cotStepQuality: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    arabicFluency: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    distillFidelity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    agentGrounding: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    multilingualCoverage: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    reasoningHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    agentBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "nondistilled_multilingual_baseline"
        : "arabic_cot_distilled_agent",
  };
  const expectedDistilled = scoreArabicCotDistilled({
    ...input,
    profile: "arabic_cot_distilled_agent",
  });
  const expectedBaseline = scoreNondistilledBaseline({
    ...input,
    profile: "nondistilled_multilingual_baseline",
  });
  const row = {
    id,
    input,
    expectedDistilled,
    expectedBaseline,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("aa-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AgentInput, AgentQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AgentInput;
  expectedDistilled: AgentQuality;
  expectedBaseline: AgentQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
