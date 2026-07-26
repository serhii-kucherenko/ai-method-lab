import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  createPack,
  featureInventory,
  listPacks,
  resetStore,
  runCompare,
} from "../src/store.ts";

describe("coload store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds a demo pack", () => {
    const { items, total } = listPacks();
    assert.ok(total >= 1);
    assert.ok(items.some((p) => p.id === "pack-demo"));
  });

  it("creates packs and runs dual compare", () => {
    const pack = createPack({
      label: "Test pack",
      version: "0.1",
      formulationFocus: "ordered vs simultaneous",
    });
    assert.ok(pack.id);
    const compare = runCompare({
      name: "seed compare",
      packId: "pack-demo",
      carrierId: "carrier-demo",
      loadId: "load-demo",
      assayRunId: "assay-demo",
      loadBias: "chemo_first",
    });
    assert.ok(compare);
    assert.ok(
      compare.winner === "ordered_coload_sequence" ||
        compare.winner === "simultaneous_load_baseline" ||
        compare.winner === "tie",
    );
  });

  it("lists at least 25 features", () => {
    assert.ok(featureInventory().length >= 25);
  });
});
