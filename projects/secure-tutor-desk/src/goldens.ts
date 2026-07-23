import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreTutorFit,
  type TutorFitInput,
  type TutorFitResult,
} from "./domain/tutorFit.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: TutorFitResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: TutorFitInput;
  expect: {
    status: string;
    reason?: string;
    orchestrate_steps?: number;
    naive_fit?: number;
    tutor_fit?: number;
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
  live: TutorFitResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (expect.orchestrate_steps !== undefined && live.orchestrate_steps !== expect.orchestrate_steps) {
    return false;
  }
  if (
    expect.naive_fit !== undefined &&
    live.naive.tutor_score !== expect.naive_fit
  ) {
    return false;
  }
  if (
    expect.tutor_fit !== undefined &&
    live.integrated.tutor_score !== expect.tutor_fit
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
    const live = scoreTutorFit(doc.input);
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
