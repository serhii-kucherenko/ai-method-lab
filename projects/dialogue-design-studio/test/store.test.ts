import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPack,
  createFeed,
  createBadge,
  createTopic,
  createDialogueRun,
  runCompare,
  resetStore,
  featureInventory,
  checkBearer,
  getOrg,
} from "../src/store.ts";

describe("store", () => {
  it("seeds and runs dual compare", () => {
    resetStore();
    const compare = runCompare({
      name: "seed compare",
      packId: "pack-demo",
      badgeId: "badge-demo",
      feedId: "feed-demo",
      topicId: "topic-demo",
      dialogueRunId: "run-demo",
    });
    assert.ok(compare);
    assert.ok(compare!.productiveOpen.overall >= 0);
    assert.ok(compare!.engagementMax.overall >= 0);
  });

  it("creates pack → badge → feed → topic → run → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test pack",
      version: "9.9",
      studyFocus: "dialogue feeds",
    });
    const badge = createBadge({
      packId: pack.id,
      label: "Badge A",
      kind: "open_minded",
      badgeHint: "open_minded",
      signalCount: 4,
      clarityFloor: 0.4,
    });
    assert.ok(badge);
    const feed = createFeed({
      packId: pack.id,
      label: "Feed A",
      lane: "open_minded_rank",
      rankingHint: "civic",
      slotCount: 3,
      openMin: 0.4,
      openMax: 0.85,
    });
    assert.ok(feed);
    const topic = createTopic({
      packId: pack.id,
      label: "Topic A",
      mode: "cross_cutting",
      threadHint: "deliberative",
      postCount: 8,
      balanceFloor: 0.3,
    });
    assert.ok(topic);
    const run = createDialogueRun({
      packId: pack.id,
      badgeId: badge!.id,
      feedId: feed!.id,
      topicId: topic!.id,
      openMindedness: 0.8,
      badgeClarity: 0.75,
      topicBalance: 0.7,
      packReadiness: 0.72,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "chain",
      packId: pack.id,
      badgeId: badge!.id,
      feedId: feed!.id,
      topicId: topic!.id,
      dialogueRunId: run!.id,
    });
    assert.ok(compare);
  });

  it("ships ≥25 features and bearer auth", () => {
    resetStore();
    assert.ok(featureInventory().length >= 25);
    assert.equal(checkBearer(`Bearer ${getOrg().bearerToken}`), true);
    assert.equal(checkBearer("Bearer wrong"), false);
  });
});
