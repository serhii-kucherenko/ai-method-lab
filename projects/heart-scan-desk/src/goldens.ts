import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreSynthesis,
  type SynthesisInput,
  type SynthesisResult,
} from "./domain/synthesis";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: SynthesisResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: SynthesisInput;
  expect: {
    status: string;
    reason?: string;
    corpus?: string;
    naive_risk?: number;
    safer_risk?: number;
    delta_score?: number;
    min_n?: number;
    k_eligible?: number;
    i2?: number;
  };
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "fixtures",
);

function matchesExpect(
  live: SynthesisResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (expect.corpus !== undefined && live.corpus !== expect.corpus) {
    return false;
  }
  if (
    expect.naive_risk !== undefined &&
    live.naive.pathway_score !== expect.naive_risk
  ) {
    return false;
  }
  if (
    expect.safer_risk !== undefined &&
    live.pla.pathway_score !== expect.safer_risk
  ) {
    return false;
  }
  if (
    expect.delta_score !== undefined &&
    live.delta_score !== expect.delta_score
  ) {
    return false;
  }
  if (expect.min_n !== undefined && live.min_n !== expect.min_n) {
    return false;
  }
  if (
    expect.k_eligible !== undefined &&
    live.k_eligible !== expect.k_eligible
  ) {
    return false;
  }
  if (expect.i2 !== undefined && live.i2 !== expect.i2) {
    return false;
  }
  return true;
}

export function listGoldenCards(): {
  total: number;
  passed: number;
  all_pass: boolean;
  cards: GoldenCard[];
} {
  const files = readdirSync(fixturesDir)
    .filter((f) => f.startsWith("std-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = [];
  for (const file of files) {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scoreSynthesis(doc.input ?? {});
    const pass = matchesExpect(live, doc.expect);
    cards.push({
      id: doc.id,
      title: doc.title ?? doc.id,
      file,
      expect_status: doc.expect.status,
      live,
      pass,
    });
  }
  const passed = cards.filter((c) => c.pass).length;
  return {
    total: cards.length,
    passed,
    all_pass: cards.length > 0 && passed === cards.length,
    cards,
  };
}
