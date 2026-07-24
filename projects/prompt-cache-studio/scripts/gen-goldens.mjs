/**
 * Generate dual-impl golden fixtures for Prompt Cache Studio.
 * Run: npx tsx scripts/gen-goldens.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreCacheAware, scoreNaiveBust } from "../src/domain/cache.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "test/fixtures");
mkdirSync(fixturesDir, { recursive: true });

const goldens = [];

for (let i = 1; i <= 30; i++) {
  const id = `pcs-${String(i).padStart(3, "0")}`;
  const t = (i - 1) / 29;
  const input = {
    prefixShare: round2(0.22 + t * 0.68 + ((i % 5) - 2) * 0.015),
    queryVolatility: round2(0.12 + (1 - t) * 0.65 + ((i % 4) - 1.5) * 0.02),
    compressionTarget: round2(0.18 + t * 0.7 + ((i % 3) - 1) * 0.02),
    prefixStability: round2(0.2 + t * 0.7 + ((i % 6) - 2.5) * 0.015),
    cacheTtlFit: round2(0.16 + t * 0.68 + ((i % 4) - 1.5) * 0.02),
    hitRatePrior: round2(0.14 + t * 0.7 + ((i % 5) - 2) * 0.02),
    tokenVolume: round2(0.2 + t * 0.65 + ((i % 3) - 1) * 0.02),
    tierDiscount: round2(0.18 + t * 0.7 + ((i % 4) - 1.5) * 0.015),
    rewriteAggression: round2(0.1 + (1 - t) * 0.6 + ((i % 7) - 3) * 0.015),
    suffixShare: round2(0.15 + (1 - t) * 0.55 + ((i % 4) - 1.5) * 0.02),
    providerCacheSupport: round2(0.25 + t * 0.65 + ((i % 5) - 2) * 0.015),
    promptCount: Math.max(1, Math.min(100, 4 + (i % 24))),
    profile: i % 3 === 0 ? "aggressive" : "balanced",
  };
  const expectedCacheAware = scoreCacheAware(input);
  const expectedNaiveBust = scoreNaiveBust(input);
  const row = {
    id,
    input,
    expectedCacheAware,
    expectedNaiveBust,
  };
  goldens.push(row);
  writeFileSync(join(fixturesDir, `${id}.json`), JSON.stringify(row, null, 2));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

const goldensTs = `import type { CacheInput, CacheQuality } from "./domain/types";

export type Golden = {
  id: string;
  input: CacheInput;
  expectedCacheAware: CacheQuality;
  expectedNaiveBust: CacheQuality;
};

export const GOLDENS: Golden[] = ${JSON.stringify(goldens, null, 2)};
`;

writeFileSync(join(root, "src/goldens.ts"), goldensTs);
console.log(`Wrote ${goldens.length} goldens`);
