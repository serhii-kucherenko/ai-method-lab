import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPack,
  createSite,
  createProtocol,
  createVideo,
  createExam,
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
      videoId: "video-demo",
      siteId: "site-demo",
      protocolId: "protocol-demo",
      examId: "exam-demo",
    });
    assert.ok(compare);
    assert.ok(compare!.standardized.overall >= 0);
    assert.ok(compare!.adHoc.overall >= 0);
  });

  it("creates pack → site → protocol → video → exam → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test pack",
      version: "9.9",
      studyFocus: "async neuro",
    });
    const site = createSite({
      packId: pack.id,
      label: "Site A",
      kind: "academic",
      regionHint: "west",
      examinerCount: 3,
      consistencyMin: 0.4,
      consistencyMax: 0.85,
    });
    assert.ok(site);
    const protocol = createProtocol({
      packId: pack.id,
      label: "Motor async",
      kind: "motor",
      fidelityHint: "motor",
      stepCount: 5,
      severityFloor: 0.3,
    });
    assert.ok(protocol);
    const video = createVideo({
      packId: pack.id,
      label: "Capture 1",
      captureNotes: "home video",
      lockCondition: "review",
      captureChannel: "soft_sim_async_video",
    });
    const exam = createExam({
      videoId: video.id,
      siteId: site!.id,
      protocolId: protocol!.id,
      protocolFidelity: 0.8,
      siteConsistency: 0.75,
      videoCompleteness: 0.7,
      packReadiness: 0.72,
    });
    assert.ok(exam);
    const compare = runCompare({
      name: "chain",
      videoId: video.id,
      siteId: site!.id,
      protocolId: protocol!.id,
      examId: exam!.id,
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
