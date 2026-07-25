/**
 * Generate dual-impl golden fixtures for Therapy Prompt Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreStructuredTherapySafetyGates,
  scorePromptOnlySafetyBaseline,
} from "../src/domain/safety.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "gates_first",
  "balanced",
  "refusal_first",
  "prompt_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `tp-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    gateCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    refusalStrength: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    crisisEscalation: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    boundaryClarity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    promptOnlyConfidence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    baselineOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    scenarioHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    therapyBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "prompt_only_safety_baseline"
        : "structured_therapy_safety_gates",
  };
  const expectedGates = scoreStructuredTherapySafetyGates({
    ...input,
    profile: "structured_therapy_safety_gates",
  });
  const expectedPrompt = scorePromptOnlySafetyBaseline({
    ...input,
    profile: "prompt_only_safety_baseline",
  });
  const row = {
    id,
    input,
    expectedGates,
    expectedPrompt,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("tp-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { TherapyInput, TherapyQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TherapyInput;
  expectedGates: TherapyQuality;
  expectedPrompt: TherapyQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (tp-001…tp-030)`);
