/**
 * Generate dual-impl golden fixtures for Reaction Loop Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreChemistInLoop,
  scoreOpenLoop,
} from "../src/domain/reaction.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "chemist_first",
  "balanced",
  "policy_first",
  "open_loop_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `rl-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    packCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    reagentFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    loopClarity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    runStability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    openLoopPassRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    skipOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    conditionHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    loopBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "open_loop_vlm" : "chemist_in_loop_vlm",
  };
  const expectedChemistInLoop = scoreChemistInLoop({
    ...input,
    profile: "chemist_in_loop_vlm",
  });
  const expectedOpenLoop = scoreOpenLoop({
    ...input,
    profile: "open_loop_vlm",
  });
  const row = {
    id,
    input,
    expectedChemistInLoop,
    expectedOpenLoop,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("rl-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ReactionInput, ReactionQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ReactionInput;
  expectedChemistInLoop: ReactionQuality;
  expectedOpenLoop: ReactionQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
