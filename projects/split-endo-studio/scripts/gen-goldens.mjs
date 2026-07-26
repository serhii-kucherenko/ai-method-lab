/**
 * Generate dual-impl golden fixtures for Split Endo Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreOneHoleSplit,
  scoreOpenLaminectomy,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "blood_loss_first",
  "balanced",
  "stay_first",
  "open_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `se-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    bloodLoss: round2(0.55 - t * 0.4 + ((i % 3) - 1) * 0.02),
    operativeTime: round2(0.5 - t * 0.35 + ((i % 4) - 1.5) * 0.02),
    hospitalStay: round2(0.55 - t * 0.4 + ((i % 3) - 1) * 0.02),
    complicationRate: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    decompressionQuality: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    recoverySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    approachBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "open_laminectomy" : "one_hole_split_endoscopy",
  };
  const expectedOse = scoreOneHoleSplit({
    ...input,
    profile: "one_hole_split_endoscopy",
  });
  const expectedOpenLam = scoreOpenLaminectomy({
    ...input,
    profile: "open_laminectomy",
  });
  const row = {
    id,
    input,
    expectedOse,
    expectedOpenLam,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("se-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { EndoInput, EndoQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: EndoInput;
  expectedOse: EndoQuality;
  expectedOpenLam: EndoQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
