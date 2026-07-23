import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreItinerary,
  type ItineraryInput,
  type ItineraryResult,
} from "./domain/itineraryPlan.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: ItineraryResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: ItineraryInput;
  expect: {
    status: string;
    reason?: string;
    day_budget?: number;
    naive_risk?: number;
    safer_risk?: number;
    delta_score?: number;
    naive_preference?: number;
    pla_preference?: number;
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
  live: ItineraryResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (expect.day_budget !== undefined && live.day_budget !== expect.day_budget) {
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
  if (
    expect.naive_preference !== undefined &&
    live.naive.preference !== expect.naive_preference
  ) {
    return false;
  }
  if (
    expect.pla_preference !== undefined &&
    live.pla.preference !== expect.pla_preference
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
  const cards: GoldenCard[] = [];
  for (const file of files) {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scoreItinerary(doc.input ?? {});
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
