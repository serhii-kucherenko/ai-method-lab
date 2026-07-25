/**
 * Generate dual-impl golden fixtures for Fluoride Label Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreFastIsotopicExchange,
  scoreMultistepProstheticBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "exchange_first",
  "balanced",
  "speed_first",
  "prosthetic_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `fl-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    exchangeRate: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    precursorPurity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    leavingGroupEase: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    amineAvailability: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    prostheticStepBurden: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    solventHarshness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    activationBarrier: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    labelBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "multistep_prosthetic_baseline"
        : "fast_isotopic_exchange",
  };
  const expectedExchange = scoreFastIsotopicExchange({
    ...input,
    profile: "fast_isotopic_exchange",
  });
  const expectedProsthetic = scoreMultistepProstheticBaseline({
    ...input,
    profile: "multistep_prosthetic_baseline",
  });
  const row = {
    id,
    input,
    expectedExchange,
    expectedProsthetic,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("fl-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { FluorideInput, FluorideQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: FluorideInput;
  expectedExchange: FluorideQuality;
  expectedProsthetic: FluorideQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`generated ${goldens.length} goldens`);
