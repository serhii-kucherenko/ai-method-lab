/**
 * Generate dual-impl golden fixtures for Pavement Retrofit Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreConventionalPreservation,
  scorePhotocatalyticPavementRetrofit,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "photocatalytic_first",
  "balanced",
  "assay_first",
  "preservation_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `pr-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    tio2Loading: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    trafficDensity: round2(0.55 - t * 0.4 + ((i % 3) - 1) * 0.02),
    noxBaseline: round2(0.5 - t * 0.35 + ((i % 4) - 1.5) * 0.02),
    co2Baseline: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    preservationQuality: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    corridorExposure: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    treatmentBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "conventional_preservation"
        : "photocatalytic_pavement_retrofit",
  };
  const expectedPhotocatalytic = scorePhotocatalyticPavementRetrofit({
    ...input,
    profile: "photocatalytic_pavement_retrofit",
  });
  const expectedConventional = scoreConventionalPreservation({
    ...input,
    profile: "conventional_preservation",
  });
  const row = {
    id,
    input,
    expectedPhotocatalytic,
    expectedConventional,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("pr-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { RetrofitInput, RetrofitQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: RetrofitInput;
  expectedPhotocatalytic: RetrofitQuality;
  expectedConventional: RetrofitQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
