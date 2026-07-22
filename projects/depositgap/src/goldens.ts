import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { trueUp, type ForecastInput, type ForecastResult } from "./domain/forecast.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: ForecastResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: ForecastInput;
  expect: { status: string; duty_delta?: number; days?: number; interest?: number; true_up?: number };
};

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "test", "fixtures");

function nearlyEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

function matchesExpect(live: ForecastResult, expect: FixtureDoc["expect"]): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") return true;
  if (expect.status !== "ok") return false;
  return (
    nearlyEqual(live.duty_delta, Number(expect.duty_delta)) &&
    live.days === Number(expect.days) &&
    nearlyEqual(live.interest, Number(expect.interest)) &&
    nearlyEqual(live.true_up, Number(expect.true_up))
  );
}

export function listGoldenCards(): { cards: GoldenCard[]; total: number; all_pass: boolean } {
  const files = readdirSync(fixturesDir)
    .filter((f) => f.startsWith("depositgap-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const live = trueUp(doc.input);
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
