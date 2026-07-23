import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreDiseaseFit,
  type DiseaseFitInput,
  type DiseaseFitResult,
} from "./domain/diseaseFit.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: DiseaseFitResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: DiseaseFitInput;
  expect: {
    status: string;
    reason?: string;
    fit_steps?: number;
    naive_fit?: number;
    disease_fit?: number;
    delta_fit?: number;
  };
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "fixtures",
);

function matchesExpect(
  live: DiseaseFitResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (expect.fit_steps !== undefined && live.fit_steps !== expect.fit_steps) {
    return false;
  }
  if (
    expect.naive_fit !== undefined &&
    live.naive.disease_fit_score !== expect.naive_fit
  ) {
    return false;
  }
  if (
    expect.disease_fit !== undefined &&
    live.disease_aware.disease_fit_score !== expect.disease_fit
  ) {
    return false;
  }
  if (
    expect.delta_fit !== undefined &&
    live.delta_fit !== expect.delta_fit
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
    .filter((f) => f.startsWith("ddd-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scoreDiseaseFit(doc.input);
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
