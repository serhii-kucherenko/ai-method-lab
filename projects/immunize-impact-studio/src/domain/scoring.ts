import {
  type ImpactInput,
  type ImpactQuality,
  biasWeight,
  clamp,
  mortalityLoad,
  round2,
} from "./types";

/**
 * Immunization-linked mortality scorer (path A):
 * rewards DTP3/measles coverage when linked to under-five mortality relief,
 * panel years, and equity — without claiming live logistics, clinical
 * prescribing, or national policy authority.
 */
export function scoreImmunizationLinked(input: ImpactInput): ImpactQuality {
  const linked = input.profile === "immunization_linked_mortality";
  const boost = linked ? 1.12 : 0.96;
  const wM = biasWeight(input.impactBias, "mortality_first");
  const wC = biasWeight(input.impactBias, "coverage_first");
  const wD = biasWeight(input.impactBias, "dashboard_first");
  const avgBias = (wM + wC + (2 - wD)) / 3;
  const load = mortalityLoad(input.underFiveMortality, input.equityGap);

  const coverageScore = round2(
    clamp(
      (input.dtp3Coverage * 50 +
        input.measlesCoverage * 30 +
        input.antigenBreadth * 15 -
        load * 6) *
        boost *
        avgBias +
        (linked ? 8 : 0) -
        input.overclaimRisk * (linked ? 6 : 14) -
        (input.impactBias === "dashboard_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const mortalityLinkScore = round2(
    clamp(
      (1 - input.underFiveMortality) * 50 * boost * wM +
        input.dtp3Coverage * 30 +
        input.panelYears * 15 +
        (linked ? 8 : 0) -
        (input.impactBias === "dashboard_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const equityScore = round2(
    clamp(
      ((1 - input.equityGap) * 50 +
        input.antigenBreadth * 20 +
        input.panelYears * 20) *
        boost *
        wC +
        (linked ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const panelScore = round2(
    clamp(
      input.panelYears * 45 * boost +
        input.assaySignal * 25 +
        input.dtp3Coverage * 20 -
        (linked ? 0 : 6) -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const dashboardPenalty = round2(
    clamp(
      (input.impactBias === "dashboard_first" ? 40 : 18) * boost +
        load * 20 -
        input.dtp3Coverage * 12 +
        input.equityGap * 15,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.dtp3Coverage * 28 +
        input.measlesCoverage * 22 +
        input.assaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const mortalityContribution = round2(
    clamp(
      coverageScore * 0.28 +
        mortalityLinkScore * 0.32 +
        equityScore * 0.22 +
        (100 - dashboardPenalty) * 0.18,
      0,
      100,
    ),
  );
  const coverageContribution = round2(
    clamp(
      coverageScore * 0.45 +
        panelScore * 0.25 +
        equityScore * 0.2 +
        dashboardPenalty * 0.1 -
        (1 - input.underFiveMortality) * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      mortalityContribution * (linked ? 0.82 : 0.4) +
        coverageContribution * (linked ? 0.18 : 0.6) +
        (linked ? 4 : 0) -
        (input.impactBias === "dashboard_first" && linked ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "immunization_linked_mortality",
    coverageScore,
    mortalityLinkScore,
    equityScore,
    panelScore,
    dashboardPenalty,
    confidence,
    mortalityContribution,
    coverageContribution,
    overall,
  };
}

/**
 * Coverage-only dashboard scorer (path B):
 * rewards raw coverage / dashboard stickiness and underweights mortality link.
 */
export function scoreCoverageOnly(input: ImpactInput): ImpactQuality {
  const dash = input.profile === "coverage_only_dashboard";
  const boost = dash ? 1.08 : 0.92;
  const wD = biasWeight(input.impactBias, "dashboard_first");
  const wC = biasWeight(input.impactBias, "coverage_first");
  const load = mortalityLoad(input.underFiveMortality, input.equityGap);

  const coverageScore = round2(
    clamp(
      input.dtp3Coverage * 55 * boost +
        input.measlesCoverage * 25 * boost +
        (wD + wC) * 5 -
        (1 - input.underFiveMortality) * 12 -
        input.overclaimRisk * 10 -
        (input.impactBias === "mortality_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const mortalityLinkScore = round2(
    clamp(
      input.dtp3Coverage * 35 * boost * Math.max(wD, wC) +
        input.antigenBreadth * 20 +
        (dash ? 8 : 0) -
        load * 10,
      0,
      100,
    ),
  );
  const equityScore = round2(
    clamp(
      input.antigenBreadth * 40 * boost +
        input.assaySignal * 25 -
        (1 - input.equityGap) * 15 +
        (dash ? 5 : 0),
      0,
      100,
    ),
  );
  const panelScore = round2(
    clamp(
      input.panelYears * 30 * boost * Math.max(wD, wC) +
        input.assaySignal * 25 +
        (dash ? 8 : 0) -
        (1 - input.underFiveMortality) * 12,
      0,
      100,
    ),
  );
  const dashboardPenalty = round2(
    clamp(
      (1 - input.antigenBreadth) * 25 * boost +
        load * 15 -
        input.dtp3Coverage * (dash ? 5 : 12) -
        input.measlesCoverage * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.dtp3Coverage + input.measlesCoverage) * 22 +
        input.assaySignal * 30 -
        input.overclaimRisk * 15 -
        load * 8,
      0,
      100,
    ),
  );
  const mortalityContribution = round2(
    clamp(
      coverageScore * 0.2 +
        mortalityLinkScore * 0.2 +
        equityScore * 0.2 +
        (100 - dashboardPenalty) * 0.2 +
        panelScore * 0.2,
      0,
      100,
    ),
  );
  const coverageContribution = round2(
    clamp(
      coverageScore * 0.55 +
        mortalityLinkScore * 0.25 +
        panelScore * 0.2 -
        load * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      coverageContribution * (dash ? 0.78 : 0.5) +
        mortalityContribution * (dash ? 0.22 : 0.5) -
        (1 - input.underFiveMortality) * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "coverage_only_dashboard",
    coverageScore,
    mortalityLinkScore,
    equityScore,
    panelScore,
    dashboardPenalty,
    confidence,
    mortalityContribution,
    coverageContribution,
    overall,
  };
}
