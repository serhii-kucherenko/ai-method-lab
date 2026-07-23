import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreModularity,
  type ModularityInput,
  type ModularityResult,
} from "./domain/modularity.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: ModularityResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: ModularityInput;
  expect: {
    status: string;
    reason?: string;
    pass_layers?: number;
    naive_modularity?: number;
    layered_modularity?: number;
    delta_modularity?: number;
  };
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "fixtures",
);

function matchesExpect(
  live: ModularityResult,
  expect: FixtureDoc["expect"],
): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (
    expect.pass_layers !== undefined &&
    live.pass_layers !== expect.pass_layers
  ) {
    return false;
  }
  if (
    expect.naive_modularity !== undefined &&
    live.naive.modularity_score !== expect.naive_modularity
  ) {
    return false;
  }
  if (
    expect.layered_modularity !== undefined &&
    live.paper_inspired.modularity_score !== expect.layered_modularity
  ) {
    return false;
  }
  if (
    expect.delta_modularity !== undefined &&
    live.delta_modularity !== expect.delta_modularity
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
    .filter((f) => f.startsWith("mcd-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scoreModularity(doc.input);
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
