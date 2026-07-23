import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scorePlanFit,
  type PlanFitInput,
  type PlanFitResult,
} from "./domain/planFit.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: PlanFitResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: PlanFitInput;
  expect: {
    status: string;
    reason?: string;
    plan_steps?: number;
    single_fit?: number;
    plan_fit?: number;
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
  live: PlanFitResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (expect.plan_steps !== undefined && live.plan_steps !== expect.plan_steps) {
    return false;
  }
  if (
    expect.single_fit !== undefined &&
    live.naive.plan_score !== expect.single_fit
  ) {
    return false;
  }
  if (
    expect.plan_fit !== undefined &&
    live.integrated.plan_score !== expect.plan_fit
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
    const live = scorePlanFit(doc.input);
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
