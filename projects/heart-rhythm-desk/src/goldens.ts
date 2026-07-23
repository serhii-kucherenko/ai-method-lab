import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreRhythmFit,
  type RhythmFitInput,
  type RhythmFitResult,
} from "./domain/rhythmFit";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: RhythmFitResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: RhythmFitInput;
  expect: {
    status: string;
    reason?: string;
    fit_steps?: number;
    naive_fit?: number;
    rhythm_fit?: number;
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
  live: RhythmFitResult,
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
    live.naive.rhythm_score !== expect.naive_fit
  ) {
    return false;
  }
  if (
    expect.rhythm_fit !== undefined &&
    live.integrated.rhythm_score !== expect.rhythm_fit
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
    .filter((f) => f.startsWith("hrd-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scoreRhythmFit(doc.input);
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
