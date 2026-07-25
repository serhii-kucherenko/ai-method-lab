/**
 * Generate dual-impl golden fixtures for Skeleton Author Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreScaffoldedAuthoring,
  scoreNaiveLinear,
} from "../src/domain/scoreA.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "scaffold_strict",
  "balanced",
  "label_first",
  "linear_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `sa-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    skeletonCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    scaffoldFidelity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    labelFit: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    navIntegrity: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    linearPassRate: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    flattenOptimism: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    experienceHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    leakageRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    authorBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "naive_linear" : "scaffolded_authoring",
  };
  const expectedScaffoldedAuthoring = scoreScaffoldedAuthoring({
    ...input,
    profile: "scaffolded_authoring",
  });
  const expectedNaiveLinear = scoreNaiveLinear({
    ...input,
    profile: "naive_linear",
  });
  const row = {
    id,
    input,
    expectedScaffoldedAuthoring,
    expectedNaiveLinear,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("sa-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { AuthorInput, AuthorQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: AuthorInput;
  expectedScaffoldedAuthoring: AuthorQuality;
  expectedNaiveLinear: AuthorQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
