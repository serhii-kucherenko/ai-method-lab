import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scoreVirulenceFit,
  type VirulenceFitInput,
  type VirulenceFitResult,
} from "./domain/virulenceFit.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: VirulenceFitResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: VirulenceFitInput;
  expect: {
    status: string;
    reason?: string;
    fit_steps?: number;
    naive_fit?: number;
    virulence_fit?: number;
    delta_risk?: number;
  };
};

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "test",
  "fixtures",
);

function matchesExpect(
  live: VirulenceFitResult,
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
    live.naive.virulence_risk_score !== expect.naive_fit
  ) {
    return false;
  }
  if (
    expect.virulence_fit !== undefined &&
    live.integrated.virulence_risk_score !== expect.virulence_fit
  ) {
    return false;
  }
  if (
    expect.delta_risk !== undefined &&
    live.delta_risk !== expect.delta_risk
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
    .filter((f) => f.startsWith("vfd-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(
      readFileSync(join(fixturesDir, file), "utf8"),
    ) as FixtureDoc;
    const live = scoreVirulenceFit(doc.input);
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
