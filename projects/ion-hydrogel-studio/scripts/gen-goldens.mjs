/**
 * Generate dual-impl golden fixtures for Ion Hydrogel Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreDynamicChargeRegulation,
  scoreFixedChargeBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "regulation_first",
  "balanced",
  "mobility_first",
  "fixed_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ih-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    chargeRegulation: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    fixedChargeDensity: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    ionMobility: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    bindingStrength: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    saltLoad: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    gelPermeability: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    swellingRatio: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    chargeBias: biases[i % biases.length],
    profile:
      i % 3 === 0 ? "fixed_charge_baseline" : "dynamic_charge_regulation",
  };
  const expectedRegulation = scoreDynamicChargeRegulation({
    ...input,
    profile: "dynamic_charge_regulation",
  });
  const expectedFixed = scoreFixedChargeBaseline({
    ...input,
    profile: "fixed_charge_baseline",
  });
  const row = {
    id,
    input,
    expectedRegulation,
    expectedFixed,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ih-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { HydrogelInput, HydrogelQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: HydrogelInput;
  expectedRegulation: HydrogelQuality;
  expectedFixed: HydrogelQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`generated ${goldens.length} goldens`);
