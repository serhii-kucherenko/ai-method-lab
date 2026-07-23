import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreControlFit,
  type ControlFitInput,
  type ControlFitResult,
} from "./domain/controlFit.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: ControlFitResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: ControlFitInput;
  expect: {
    status: string;
    reason?: string;
    base_peak?: number;
    naive_risk?: number;
    safer_risk?: number;
    delta_score?: number;
  };
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "fixtures",
);

function matchesExpect(
  live: ControlFitResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (expect.base_peak !== undefined && live.base_peak !== expect.base_peak) {
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
    live.safer.risk_score !== expect.safer_risk
  ) {
    return false;
  }
  if (
    expect.delta_score !== undefined &&
    live.delta_score !== expect.delta_score
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
    const live = scoreControlFit(doc.input);
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
