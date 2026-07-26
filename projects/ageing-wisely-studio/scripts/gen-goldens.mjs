/**
 * Generate dual-impl golden fixtures for Ageing Wisely Studio.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreTherapistSupported,
  scoreWaitlistSelfGuided,
} from "../src/domain/scoring.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "therapist_first",
  "balanced",
  "self_guided_first",
  "waitlist_first",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `aw-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    therapistSupportFidelity: round2(0.3 + t * 0.6 + ((i % 4) - 1.5) * 0.02),
    moduleCompletion: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    engagementAdherence: round2(0.25 + t * 0.55 + ((i % 3) - 1) * 0.02),
    symptomReliefSignal: round2(0.3 + t * 0.55 + ((i % 3) - 1) * 0.02),
    coDesignFit: round2(0.35 + t * 0.5 + ((i % 4) - 1.5) * 0.02),
    dropoutRisk: round2(0.45 - t * 0.15 + ((i % 3) - 1) * 0.02),
    sessionSignal: round2(0.35 + t * 0.55 + ((i % 4) - 1.5) * 0.02),
    overclaimRisk: round2(0.5 - t * 0.35 + ((i % 3) - 1) * 0.02),
    careBias: biases[i % biases.length],
    profile:
      i % 3 === 0
        ? "waitlist_self_guided_baseline"
        : "therapist_supported_icbt",
  };
  const expectedTherapist = scoreTherapistSupported({
    ...input,
    profile: "therapist_supported_icbt",
  });
  const expectedWaitlist = scoreWaitlistSelfGuided({
    ...input,
    profile: "waitlist_self_guided_baseline",
  });
  const row = {
    id,
    input,
    expectedTherapist,
    expectedWaitlist,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

for (const f of readdirSync(fixturesDir)) {
  if (!f.startsWith("aw-")) unlinkSync(join(fixturesDir, f));
}

const goldensTs = `import type { CareInput, CareQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CareInput;
  expectedTherapist: CareQuality;
  expectedWaitlist: CareQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;
writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log("wrote", goldens.length, "goldens");
