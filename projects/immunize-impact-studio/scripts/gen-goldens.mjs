/**
 * Generate dual-impl golden fixtures for Immunize Impact Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreImmunizationLinked,
  scoreCoverageOnly,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "mortality_first",
  "balanced",
  "coverage_first",
  "dashboard_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `ii-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    dtp3Coverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    measlesCoverage: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    underFiveMortality: round2(0.55 - t * 0.4 + ((i % 3) - 1) * 0.02),
    panelYears: round2(0.35 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    equityGap: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    antigenBreadth: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    assaySignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    impactBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "coverage_only_dashboard"
        : "immunization_linked_mortality",
  };
  const expectedLinked = scoreImmunizationLinked({
    ...input,
    profile: "immunization_linked_mortality",
  });
  const expectedCoverageOnly = scoreCoverageOnly({
    ...input,
    profile: "coverage_only_dashboard",
  });
  const row = {
    id,
    input,
    expectedLinked,
    expectedCoverageOnly,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("ii-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { ImpactInput, ImpactQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: ImpactInput;
  expectedLinked: ImpactQuality;
  expectedCoverageOnly: ImpactQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
