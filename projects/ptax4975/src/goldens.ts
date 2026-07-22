import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { excise, type ExciseInput, type ExciseResult } from "./domain/excise.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: ExciseResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: ExciseInput;
  expect: {
    status: string;
    initial_tax?: number;
    additional_tax?: number;
    total?: number;
    reason?: string;
  };
};

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "test", "fixtures");

function nearlyEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

function matchesExpect(live: ExciseResult, expect: FixtureDoc["expect"]): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  return (
    nearlyEqual(live.initial_tax, Number(expect.initial_tax)) &&
    nearlyEqual(live.additional_tax, Number(expect.additional_tax)) &&
    nearlyEqual(live.total, Number(expect.total))
  );
}

export function listGoldenCards(): { cards: GoldenCard[]; total: number; all_pass: boolean } {
  const files = readdirSync(fixturesDir)
    .filter((f) => f.startsWith("ptax4975-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const live = excise(doc.input);
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
