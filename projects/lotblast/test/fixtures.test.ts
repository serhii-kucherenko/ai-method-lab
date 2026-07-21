import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  backwardTrace,
  forwardBlast,
  wouldOverconsume,
  type Graph,
  type TransformInput,
} from "../src/blast.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/ideas/fixtures",
);

function sameSet(a: string[], b: string[]): boolean {
  return [...a].sort().join("\0") === [...b].sort().join("\0");
}

type FixtureDoc = {
  fixture_id: string;
  graph: Graph;
  cases?: Array<{
    suspect: string;
    expect: Record<string, unknown>;
    write_attempts?: Array<{
      inputs: TransformInput[];
      expect: string;
    }>;
  }>;
  backward_cases?: Array<{ finished: string; expect_inputs: string[] }>;
};

for (const file of readdirSync(fixturesDir).filter((f) => f.endsWith(".json")).sort()) {
  test(`fixture ${file}`, () => {
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as FixtureDoc;
    for (const c of doc.cases ?? []) {
      for (const w of c.write_attempts ?? []) {
        if (w.expect === "reject_overconsume") {
          assert.equal(wouldOverconsume(doc.graph, w.inputs), true);
        }
      }
      const got = forwardBlast(doc.graph, c.suspect);
      const e = c.expect;
      if (Array.isArray(e.finished_tlcs)) {
        assert.ok(sameSet(got.finished_tlcs, e.finished_tlcs as string[]));
      }
      if (Array.isArray(e.shipment_ids)) {
        assert.ok(sameSet(got.shipment_ids, e.shipment_ids as string[]));
      }
      if (Array.isArray(e.notify_partners)) {
        assert.ok(sameSet(got.notify_partners, e.notify_partners as string[]));
      }
      if (typeof e.units_in_channel === "number") {
        assert.equal(got.units_in_channel, e.units_in_channel);
      }
      if (typeof e.finished_tlc_cardinality === "number") {
        assert.equal(got.finished_tlcs.length, e.finished_tlc_cardinality);
      }
      if (e.units_in_channel_by_tlc && typeof e.units_in_channel_by_tlc === "object") {
        for (const [t, n] of Object.entries(e.units_in_channel_by_tlc as Record<string, number>)) {
          assert.equal(got.channelBy[t], n);
        }
      }
      if (Array.isArray(e.visited_includes)) {
        for (const t of e.visited_includes as string[]) {
          assert.ok(got.visited.has(t));
        }
      }
    }
    for (const b of doc.backward_cases ?? []) {
      assert.ok(sameSet(backwardTrace(doc.graph, b.finished), b.expect_inputs));
    }
  });
}
