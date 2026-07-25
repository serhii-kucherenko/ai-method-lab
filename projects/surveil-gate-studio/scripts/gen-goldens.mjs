/**
 * Generate dual-impl golden fixtures for Surveil Gate Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreTrustGphSixPillar,
  scoreExplainabilityOnlyBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "pillar_first",
  "balanced",
  "policy_first",
  "explain_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `sg-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    pillarCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    policyCompleteness: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    signalIntegrity: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packReadiness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    explainOnlyAdherence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    hallucinationHardness: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    trustErosionRisk: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    governanceBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "explainability_only_baseline"
        : "trust_gph_six_pillar",
  };
  const expectedTrust = scoreTrustGphSixPillar({
    ...input,
    profile: "trust_gph_six_pillar",
  });
  const expectedExplain = scoreExplainabilityOnlyBaseline({
    ...input,
    profile: "explainability_only_baseline",
  });
  const row = {
    id,
    input,
    expectedTrust,
    expectedExplain,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("sg-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { SurveilGateInput, SurveilGateQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: SurveilGateInput;
  expectedTrust: SurveilGateQuality;
  expectedExplain: SurveilGateQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (sg-001…sg-030)`);
