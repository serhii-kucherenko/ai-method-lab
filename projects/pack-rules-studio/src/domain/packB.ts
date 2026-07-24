import {
  type PackInput,
  type PackQuality,
  clamp,
  round2,
} from "./types";

function ruleSignal(input: PackInput): number {
  return clamp(
    input.safetyRuleCoverage * 32 +
      input.ruleStrictness * 22 +
      input.dependencySatisfaction * 20 +
      input.batteryPolicyCompliance * 16 +
      (1 - input.liquidVolumeRisk) * 10,
    0,
    100,
  );
}

function prefSignal(input: PackInput): number {
  return clamp(
    input.preferenceFit * 36 +
      input.preferenceWeight * 22 +
      input.weatherAdaptability * 18 +
      Math.min(30, input.tripDays) * 0.6 +
      Math.min(60, input.itemCount) * 0.2,
    0,
    100,
  );
}

/**
 * Dual-impl twin of scoreRulesPrefs — must stay bitwise-equal on goldens.
 */
export function scoreRulesPrefs(input: PackInput): PackQuality {
  const compliant = input.profile === "compliant";
  const boost = compliant ? 1.05 : 1.0;
  const rules = ruleSignal(input);
  const prefs = prefSignal(input);

  const ruleCompliance = round2(
    clamp(
      (rules * 0.55 +
        input.safetyRuleCoverage * 24 +
        input.ruleStrictness * 14) *
        boost -
        input.liquidVolumeRisk * 8,
      0,
      100,
    ),
  );

  const preferenceFit = round2(
    clamp(
      (prefs * 0.5 +
        input.preferenceFit * 28 +
        input.weatherAdaptability * 14) *
        boost -
        (1 - input.ruleStrictness) * 4,
      0,
      100,
    ),
  );

  const luggageFeasibility = round2(
    clamp(
      (input.luggageLimitHeadroom * 48 +
        (1 - Math.min(1, input.itemCount / 80)) * 22 +
        input.dependencySatisfaction * 18 +
        Math.min(30, input.tripDays) * 0.4) *
        boost,
      0,
      100,
    ),
  );

  const dependencyHealth = round2(
    clamp(
      (input.dependencySatisfaction * 0.55 * 100 +
        input.safetyRuleCoverage * 20 +
        input.preferenceFit * 12) *
        boost,
      0,
      100,
    ),
  );

  const safetyMargin = round2(
    clamp(
      (input.batteryPolicyCompliance * 34 +
        (1 - input.liquidVolumeRisk) * 28 +
        input.safetyRuleCoverage * 22 +
        input.ruleStrictness * 12) *
        boost,
      0,
      100,
    ),
  );

  const auditTrail = round2(
    clamp(
      input.ruleStrictness * 22 +
        input.safetyRuleCoverage * 20 +
        input.dependencySatisfaction * 16 +
        input.preferenceFit * 14 +
        Math.min(30, input.tripDays) * 0.5 +
        (compliant ? 6 : 3),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      ruleCompliance * 0.22 +
        preferenceFit * 0.18 +
        luggageFeasibility * 0.16 +
        dependencyHealth * 0.14 +
        safetyMargin * 0.2 +
        auditTrail * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "rules_prefs",
    ruleCompliance,
    preferenceFit,
    luggageFeasibility,
    dependencyHealth,
    safetyMargin,
    auditTrail,
    overall,
  };
}

/**
 * Dual-impl twin of scorePrefsOnly — must stay bitwise-equal on goldens.
 */
export function scorePrefsOnly(input: PackInput): PackQuality {
  const compliant = input.profile === "compliant";
  const skipPenalty = clamp(
    0.42 +
      (1 - input.ruleStrictness) * 0.22 +
      input.liquidVolumeRisk * 0.2 +
      (1 - input.luggageLimitHeadroom) * 0.16,
    0.35,
    0.95,
  );
  const prefs = prefSignal(input);

  const preferenceFit = round2(
    clamp(
      prefs * 0.72 +
        input.preferenceWeight * 18 +
        input.weatherAdaptability * 10 -
        (compliant ? 2 : 0),
      0,
      100,
    ),
  );

  const ruleCompliance = round2(
    clamp(
      (input.safetyRuleCoverage * 18 +
        input.ruleStrictness * 10 +
        input.batteryPolicyCompliance * 8) *
        skipPenalty,
      0,
      100,
    ),
  );

  const luggageFeasibility = round2(
    clamp(
      (input.luggageLimitHeadroom * 28 +
        (1 - Math.min(1, input.itemCount / 80)) * 12) *
        skipPenalty +
        input.preferenceWeight * 8,
      0,
      100,
    ),
  );

  const dependencyHealth = round2(
    clamp(
      input.dependencySatisfaction * 35 * skipPenalty +
        input.preferenceFit * 15,
      0,
      100,
    ),
  );

  const safetyMargin = round2(
    clamp(
      (input.batteryPolicyCompliance * 16 +
        (1 - input.liquidVolumeRisk) * 12 +
        input.safetyRuleCoverage * 10) *
        skipPenalty,
      0,
      100,
    ),
  );

  const auditTrail = round2(
    clamp(
      input.preferenceFit * 18 +
        input.preferenceWeight * 14 +
        Math.min(30, input.tripDays) * 0.35 -
        8,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      preferenceFit * 0.34 +
        ruleCompliance * 0.12 +
        luggageFeasibility * 0.14 +
        dependencyHealth * 0.12 +
        safetyMargin * 0.16 +
        auditTrail * 0.12,
      0,
      100,
    ),
  );

  return {
    mode: "prefs_only",
    ruleCompliance,
    preferenceFit,
    luggageFeasibility,
    dependencyHealth,
    safetyMargin,
    auditTrail,
    overall,
  };
}
