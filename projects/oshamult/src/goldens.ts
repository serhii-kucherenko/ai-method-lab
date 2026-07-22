import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { penalty, type PenaltyInput, type PenaltyResult } from "./domain/penalty.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: PenaltyResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: PenaltyInput;
  expect: { status: string; penalty?: number; reason?: string };
};

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "test", "fixtures");

function nearlyEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

function matchesExpect(live: PenaltyResult, expect: FixtureDoc["expect"]): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  return nearlyEqual(live.penalty, Number(expect.penalty));
}

export function listGoldenCards(): { cards: GoldenCard[]; total: number; all_pass: boolean } {
  const files = readdirSync(fixturesDir)
    .filter((f) => f.startsWith("oshamult-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const live = penalty(doc.input);
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
