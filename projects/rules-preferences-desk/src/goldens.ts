import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scorePackFit,
  type PackFitInput,
  type PackFitResult,
} from "./domain/packFit.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: PackFitResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: PackFitInput;
  expect: {
    status: string;
    reason?: string;
    capacity?: number;
    naive_risk?: number;
    safer_risk?: number;
    delta_score?: number;
    naive_utility?: number;
    constrained_utility?: number;
    naive_violations?: number;
  };
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "fixtures",
);

function matchesExpect(
  live: PackFitResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (expect.capacity !== undefined && live.capacity !== expect.capacity) {
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
    live.constrained.risk_score !== expect.safer_risk
  ) {
    return false;
  }
  if (
    expect.delta_score !== undefined &&
    live.delta_score !== expect.delta_score
  ) {
    return false;
  }
  if (
    expect.naive_utility !== undefined &&
    live.naive.utility !== expect.naive_utility
  ) {
    return false;
  }
  if (
    expect.constrained_utility !== undefined &&
    live.constrained.utility !== expect.constrained_utility
  ) {
    return false;
  }
  if (
    expect.naive_violations !== undefined &&
    live.naive.violations !== expect.naive_violations
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
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scorePackFit(doc.input);
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
