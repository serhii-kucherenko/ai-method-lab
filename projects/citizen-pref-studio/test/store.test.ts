import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPack,
  createCountry,
  createOption,
  createSurvey,
  createPrefRun,
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
      optionId: "option-demo",
      countryId: "country-demo",
      surveyId: "survey-demo",
      prefRunId: "run-demo",
    });
    assert.ok(compare);
    assert.ok(compare!.safetyOversight.overall >= 0);
    assert.ok(compare!.innovationSelf.overall >= 0);
  });

  it("creates pack → option → country → survey → run → compare", () => {
    resetStore();
    const pack = createPack({
      label: "Test pack",
      version: "9.9",
      studyFocus: "citizen prefs",
    });
    const option = createOption({
      packId: pack.id,
      label: "Option A",
      kind: "public_oversight",
      oversightHint: "agency",
      attributeCount: 4,
      safetyFloor: 0.4,
    });
    assert.ok(option);
    const country = createCountry({
      packId: pack.id,
      label: "Country A",
      region: "europe",
      countryHint: "eu",
      strataCount: 3,
      prefMin: 0.4,
      prefMax: 0.85,
    });
    assert.ok(country);
    const survey = createSurvey({
      packId: pack.id,
      label: "Survey A",
      mode: "conjoint",
      instrumentHint: "conjoint",
      itemCount: 8,
      responseFloor: 0.3,
    });
    assert.ok(survey);
    const run = createPrefRun({
      packId: pack.id,
      optionId: option!.id,
      countryId: country!.id,
      surveyId: survey!.id,
      safetyPreference: 0.8,
      oversightSupport: 0.75,
      coordinationPreference: 0.7,
      packReadiness: 0.72,
    });
    assert.ok(run);
    const compare = runCompare({
      name: "chain",
      packId: pack.id,
      optionId: option!.id,
      countryId: country!.id,
      surveyId: survey!.id,
      prefRunId: run!.id,
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
