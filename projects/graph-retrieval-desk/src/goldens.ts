import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreCoverage,
  type CoverageInput,
  type CoverageResult,
} from "./domain/coverage.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: CoverageResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: CoverageInput;
  expect: {
    status: string;
    reason?: string;
    hop_steps?: number;
    naive_coverage?: number;
    paper_coverage?: number;
    delta_coverage?: number;
  };
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "fixtures",
);

function matchesExpect(
  live: CoverageResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (expect.hop_steps !== undefined && live.hop_steps !== expect.hop_steps) {
    return false;
  }
  if (
    expect.naive_coverage !== undefined &&
    live.naive.coverage_score !== expect.naive_coverage
  ) {
    return false;
  }
  if (
    expect.paper_coverage !== undefined &&
    live.paper_inspired.coverage_score !== expect.paper_coverage
  ) {
    return false;
  }
  if (
    expect.delta_coverage !== undefined &&
    live.delta_coverage !== expect.delta_coverage
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
    .filter((f) => f.startsWith("grd-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scoreCoverage(doc.input);
    return {
      id: doc.id,
      title: doc.title ?? doc.id,
      file,
      expect_status: doc.expect.status,
      live,
      pass: matchesExpect(live, doc.expect),
    };
  });
  return {
    cards,
    total: cards.length,
    all_pass: cards.every((c) => c.pass),
  };
}
