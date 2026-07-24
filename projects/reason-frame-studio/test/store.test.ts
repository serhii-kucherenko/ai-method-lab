import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createAgent,
  createCompare,
  createDebate,
  createFlag,
  createRulePack,
  createScore,
  inviteMember,
  listFeatures,
  resetStore,
} from "../src/store.ts";

describe("store", () => {
  it("lists at least 20 features", () => {
    resetStore();
    assert.ok(listFeatures().length >= 20);
  });

  it("supports rules → debates → scores → flags → agents → compare", () => {
    resetStore();
    const pack = createRulePack({
      name: "Chem stoichiometry pack",
      domainKind: "chemistry",
      coverage: 0.85,
      ruleCount: 18,
    });
    const debate = createDebate({
      rulePackId: pack.id,
      name: "Balance check debate",
      depth: 0.8,
      challengerPressure: 0.75,
      consensusStrength: 0.7,
      status: "completed",
    });
    createScore({
      rulePackId: pack.id,
      debateId: debate.id,
      name: "Team game score",
      bayesianUpdate: 0.78,
      teamCoordination: 0.8,
      evidenceGrounding: 0.82,
      status: "computed",
    });
    createFlag({
      rulePackId: pack.id,
      debateId: debate.id,
      name: "Invented compound",
      severity: "high",
      fluencyBias: 0.6,
      contradictionRate: 0.45,
    });
    createAgent({
      name: "Extra challenger",
      role: "challenger",
      temperature: 0.8,
    });
    const compare = createCompare({
      name: "Multi vs single",
      rulePackId: pack.id,
    });
    assert.ok(compare.multiAgent.overall >= 0);
    assert.ok(compare.singleAgent.overall >= 0);
    inviteMember("peer@reason-frame.local", "reader");
  });
});
