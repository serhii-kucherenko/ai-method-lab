import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createCandidate,
  createCompare,
  createDiffusionRun,
  createOptimizePass,
  createPocket,
  createPropertyEntry,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports pocket → candidate → diffusion → optimize → properties → compare", () => {
    resetStore();
    const pocket = createPocket({
      name: "Test kinase pocket",
      family: "kinase",
      volumeA3: 400,
      hydrophobicity: 0.55,
    });
    const candidate = createCandidate({
      pocketId: pocket.id,
      name: "Lead scaffold",
      qedScore: 0.75,
      status: "draft",
    });
    createDiffusionRun({
      pocketId: pocket.id,
      name: "Cond diffusion",
      steps: 150,
      pocketConditioning: 0.8,
      status: "complete",
    });
    createOptimizePass({
      candidateId: candidate.id,
      name: "QED pass",
      propertyWeight: 0.7,
      status: "complete",
    });
    createPropertyEntry({
      candidateId: candidate.id,
      name: "Ledger",
      solubility: 0.7,
      clearanceRisk: 0.2,
    });
    const compare = createCompare({
      name: "Dev vs affinity",
      pocketId: pocket.id,
    });
    assert.ok(compare.pocketDevelopability.overall >= 0);
    assert.ok(compare.affinityOnly.overall >= 0);
    inviteMember("peer@developable-molecule.local", "chemist");
  });
});
