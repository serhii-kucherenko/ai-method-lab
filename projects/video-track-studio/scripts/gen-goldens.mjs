/**
 * Generate dual-impl golden fixtures for Video Track Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreFluency, scoreTrackAware } from "../src/domain/track.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

function round2(n) {
  return Math.round(n * 100) / 100;
}

const biases = [
  "name_swap",
  "gender_swap",
  "open_ended",
  "frame_boost",
  "balanced",
];
const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `vts-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    nameSensitivity: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.02),
    identityBind: round2(0.2 + t * 0.68 + ((i % 5) - 2) * 0.015),
    temporalCoverage: round2(0.17 + t * 0.7 + ((i % 3) - 1) * 0.02),
    outfitOrderFidelity: round2(0.19 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    probeSpecificity: round2(0.18 + t * 0.7 + ((i % 3) - 1) * 0.02),
    fluencyPrior: round2(0.35 + t * 0.5 + ((i % 5) - 2) * 0.015),
    genderCueReliance: round2(0.35 - t * 0.28 + ((i % 3) - 1) * 0.01),
    noiseLevel: round2(0.32 - t * 0.24 + ((i % 4) - 1.5) * 0.01),
    probeBias: biases[i % biases.length],
    profile: i % 3 === 0 ? "fluency" : "track_aware",
  };
  const expectedTrackAware = scoreTrackAware({
    ...input,
    profile: "track_aware",
  });
  const expectedFluency = scoreFluency({ ...input, profile: "fluency" });
  const row = {
    id,
    input,
    expectedTrackAware,
    expectedFluency,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

const goldensTs = `import type { TrackInput, TrackQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: TrackInput;
  expectedTrackAware: TrackQuality;
  expectedFluency: TrackQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
