/**
 * Generate dual-impl golden fixtures for Citizen Pref Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreSafetyFirstPublicOversight,
  scoreInnovationFirstSelfRegulation,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "safety_first",
  "balanced",
  "oversight_first",
  "innovation_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `cp-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    safetyPreference: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    oversightSupport: round2(0.25 + t * 0.65 + ((i % 3) - 1) * 0.02),
    coordinationPreference: round2(0.3 + t * 0.6 + ((i % 5) - 2) * 0.015),
    packReadiness: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    innovationAdherence: round2(0.4 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    surveyNoise: round2(0.6 - t * 0.4 + ((i % 4) - 1.5) * 0.02),
    innovationTunnel: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    prefBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "innovation_first_self_regulation"
        : "safety_first_public_oversight",
  };
  const expectedSafetyOversight = scoreSafetyFirstPublicOversight({
    ...input,
    profile: "safety_first_public_oversight",
  });
  const expectedInnovationSelf = scoreInnovationFirstSelfRegulation({
    ...input,
    profile: "innovation_first_self_regulation",
  });
  const row = {
    id,
    input,
    expectedSafetyOversight,
    expectedInnovationSelf,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("cp-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { CitizenPrefInput, CitizenPrefQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CitizenPrefInput;
  expectedSafetyOversight: CitizenPrefQuality;
  expectedInnovationSelf: CitizenPrefQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens (cp-001…cp-030)`);
