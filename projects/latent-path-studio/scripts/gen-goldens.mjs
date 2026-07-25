/**
 * Generate dual-impl golden fixtures for Latent Path Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreMultiDomainLatentTrajectory,
  scoreSingleDomainBaseline,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "joint_first",
  "balanced",
  "predictor_first",
  "single_domain_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `lp-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    multiDomainCoverage: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    jointClassClarity: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    trajectorySeparation: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packReadiness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    singleDomainAdherence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    predictorNoise: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    domainIsolation: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    pathBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "single_domain_baseline"
        : "multi_domain_latent_trajectory",
  };
  const expectedMultiDomain = scoreMultiDomainLatentTrajectory({
    ...input,
    profile: "multi_domain_latent_trajectory",
  });
  const expectedSingleDomain = scoreSingleDomainBaseline({
    ...input,
    profile: "single_domain_baseline",
  });
  const row = {
    id,
    input,
    expectedMultiDomain,
    expectedSingleDomain,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("lp-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { LatentPathInput, LatentPathQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: LatentPathInput;
  expectedMultiDomain: LatentPathQuality;
  expectedSingleDomain: LatentPathQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (lp-001…lp-030)`);
