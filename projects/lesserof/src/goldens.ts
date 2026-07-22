import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recover, type RecoverInput, type RecoverResult } from "./domain/recover.js";

export type GoldenCard = {
  id: string;
  title: string;
  file: string;
  expect_status: string;
  live: RecoverResult;
  pass: boolean;
};

type FixtureDoc = {
  id: string;
  title?: string;
  input: RecoverInput;
  expect: { status: string; refund?: number; reason?: string; line_refunds?: number[] };
};

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "test", "fixtures");

function nearlyEqual(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

function matchesExpect(live: RecoverResult, expect: FixtureDoc["expect"]): boolean {
  if (live.status !== expect.status) return false;
  if (live.status === "reject") {
    return !expect.reason || live.reason === expect.reason;
  }
  if (expect.status !== "ok" || live.status !== "ok") return false;
  if (!nearlyEqual(live.refund, Number(expect.refund))) return false;
  if (expect.line_refunds) {
    if (!live.line_refunds || live.line_refunds.length !== expect.line_refunds.length) {
      return false;
    }
    return live.line_refunds.every((v, i) => nearlyEqual(v, expect.line_refunds![i]!));
  }
  return true;
}

export function listGoldenCards(): { cards: GoldenCard[]; total: number; all_pass: boolean } {
  const files = readdirSync(fixturesDir)
    .filter((f) => f.startsWith("lesserof-") && f.endsWith(".json"))
    .sort();
  const cards: GoldenCard[] = files.map((file) => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    const live = recover(doc.input);
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
