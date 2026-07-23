import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scorePromptCache,
  type CacheInput,
  type CacheResult,
} from "./domain/promptCache.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: CacheResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: CacheInput;
  expect: {
    status: string;
    reason?: string;
    prefix_tokens?: number;
    naive_risk?: number;
    safer_risk?: number;
    delta_score?: number;
    ratio?: number;
    r_max?: number;
    cache_aware_tier?: string;
  };
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "fixtures",
);

function matchesExpect(
  live: CacheResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (
    expect.prefix_tokens !== undefined &&
    live.prefix_tokens !== expect.prefix_tokens
  ) {
    return false;
  }
  if (
    expect.naive_risk !== undefined &&
    live.naive.risk_score !== expect.naive_risk
  ) {
    return false;
  }
  if (
    expect.safer_risk !== undefined &&
    live.pla.risk_score !== expect.safer_risk
  ) {
    return false;
  }
  if (
    expect.delta_score !== undefined &&
    live.delta_score !== expect.delta_score
  ) {
    return false;
  }
  if (expect.ratio !== undefined && live.ratio !== expect.ratio) {
    return false;
  }
  if (expect.r_max !== undefined && live.r_max !== expect.r_max) {
    return false;
  }
  if (
    expect.cache_aware_tier !== undefined &&
    live.cache_aware.tier !== expect.cache_aware_tier
  ) {
    return false;
  }
  return true;
}

export function listGoldenCards(): {
  cards: GoldenCard[];
  total: number;
  all_pass: boolean;
} {
  const files = readdirSync(fixturesDir)
    .filter((f) => f.startsWith("std-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = [];
  for (const file of files) {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scorePromptCache(doc.input ?? {});
    cards.push({
      id: doc.id,
      title: doc.title ?? doc.id,
      file,
      expect_status: doc.expect.status,
      live,
      pass: matchesExpect(live, doc.expect),
    });
  }
  return {
    cards,
    total: cards.length,
    all_pass: cards.every((c) => c.pass),
  };
}
