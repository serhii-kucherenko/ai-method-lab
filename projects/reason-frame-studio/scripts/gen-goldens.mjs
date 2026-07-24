/**
 * Generate dual-impl golden fixtures for Reason Frame Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreMultiAgent, scoreSingleAgent } from "../src/domain/score.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const domains = ["physics", "chemistry", "biology", "math", "materials"];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `rfs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    ruleCoverage: round2(0.2 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    debateDepth: round2(0.18 + t * 0.7 + ((i % 5) - 2) * 0.015),
    consensusStrength: round2(0.22 + t * 0.64 + ((i % 3) - 1) * 0.02),
    challengerPressure: round2(0.18 + t * 0.72 + ((i % 5) - 2) * 0.015),
    bayesianUpdate: round2(0.2 + t * 0.66 + ((i % 4) - 1.5) * 0.02),
    evidenceGrounding: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    fluencyBias: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    teamCoordination: round2(0.2 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    priorConfidence: round2(0.18 + t * 0.68 + ((i % 3) - 1) * 0.02),
    contradictionRate: round2(0.08 + (1 - t) * 0.55 + ((i % 3) - 1) * 0.02),
    domainKind: domains[i % 5],
    plan: i % 3 === 0 ? "multi_agent" : "single_agent",
  };
  const expectedMultiAgent = scoreMultiAgent(input);
  const expectedSingleAgent = scoreSingleAgent(input);
  const row = {
    id,
    input,
    expectedMultiAgent,
    expectedSingleAgent,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { ReasonInput, ReasonQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ReasonInput;
  expectedMultiAgent: ReasonQuality;
  expectedSingleAgent: ReasonQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
