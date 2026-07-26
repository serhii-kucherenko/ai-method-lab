import {
  type MofCaptureInput,
  type MofCaptureQuality,
  biasWeight,
  captureBurden,
  clamp,
  round2,
} from "./types";

/**
 * Anionic MOF capture scorer (path A):
 * rewards ion-exchange fidelity, sorbent completeness, and assay readout
 * when the anionic MOF profile is configured — without claiming
 * live plant control, certified water audits, or municipal procurement.
 */
export function scoreAnionicMofCapture(
  input: MofCaptureInput,
): MofCaptureQuality {
  const mof = input.profile === "anionic_mof_capture";
  const boost = mof ? 1.12 : 0.96;
  const wM = biasWeight(input.scoringBias, "mof_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const wS = biasWeight(input.scoringBias, "sorbent_first");
  const avgBias = (wM + wA + (2 - wS)) / 3;
  const burden = captureBurden(
    input.conventionalCapacity,
    input.sorbentCompleteness,
    input.overclaimRisk,
  );

  const mofCaptureScore = round2(
    clamp(
      (input.ionExchangeFidelity * 35 +
        input.evidenceStrength * 25 +
        input.assayReadout * 30 +
        input.waterFollowThrough * 10 -
        burden * 5) *
        boost *
        avgBias +
        (mof ? 8 : 0) -
        input.overclaimRisk * (mof ? 6 : 14) -
        (input.scoringBias === "sorbent_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const conventionalScore = round2(
    clamp(
      input.conventionalCapacity * 35 * (mof ? 0.7 : 1.1) +
        input.assayFidelity * 25 * wS +
        (1 - input.ionExchangeFidelity) * 20 +
        (mof ? 4 : 8) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const sorbentCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost * wA +
        input.ionExchangeFidelity * 30 +
        input.waterFollowThrough * 15 +
        (mof ? 8 : 0) -
        (input.scoringBias === "sorbent_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const waterEfficiency = round2(
    clamp(
      ((1 - burden) * 40 +
        input.waterFollowThrough * 25 +
        input.assayFidelity * 20) *
        boost *
        wA +
        (mof ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const conventionalOnlyPenalty = round2(
    clamp(
      (input.scoringBias === "sorbent_first" ? 40 : 18) * boost +
        burden * 18 -
        input.ionExchangeFidelity * 12 +
        (1 - input.waterFollowThrough) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.ionExchangeFidelity * 26 +
        input.evidenceStrength * 22 +
        input.assayReadout * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const mofContribution = round2(
    clamp(
      mofCaptureScore * 0.32 +
        sorbentCoverage * 0.28 +
        waterEfficiency * 0.22 +
        (100 - conventionalOnlyPenalty) * 0.18,
      0,
      100,
    ),
  );
  const conventionalContribution = round2(
    clamp(
      mofCaptureScore * 0.35 +
        conventionalScore * 0.35 +
        waterEfficiency * 0.2 +
        conventionalOnlyPenalty * 0.1 -
        input.ionExchangeFidelity * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      mofContribution * (mof ? 0.82 : 0.4) +
        conventionalContribution * (mof ? 0.18 : 0.6) +
        (mof ? 4 : 0) -
        (input.scoringBias === "sorbent_first" && mof ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "anionic_mof_capture",
    mofCaptureScore,
    conventionalScore,
    sorbentCoverage,
    waterEfficiency,
    conventionalOnlyPenalty,
    confidence,
    mofContribution,
    conventionalContribution,
    overall,
  };
}

/**
 * Conventional sorbent scorer (path B):
 * rewards conventional capacity familiarity and underweights MOF ion-exchange gains.
 */
export function scoreConventionalSorbent(
  input: MofCaptureInput,
): MofCaptureQuality {
  const conventional = input.profile === "conventional_sorbent";
  const boost = conventional ? 1.08 : 0.92;
  const wS = biasWeight(input.scoringBias, "sorbent_first");
  const wA = biasWeight(input.scoringBias, "assay_first");
  const burden = captureBurden(
    input.conventionalCapacity,
    input.sorbentCompleteness,
    input.overclaimRisk,
  );

  const mofCaptureScore = round2(
    clamp(
      (1 - input.conventionalCapacity) * 28 * boost +
        (1 - input.ionExchangeFidelity) * 15 * boost +
        (wS + wA) * 5 -
        input.ionExchangeFidelity * 10 -
        input.overclaimRisk * 10 -
        (input.scoringBias === "mof_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const conventionalScore = round2(
    clamp(
      input.conventionalCapacity * 45 * boost * Math.max(wS, wA) +
        (1 - burden) * 20 +
        (conventional ? 8 : 0) -
        input.ionExchangeFidelity * 8,
      0,
      100,
    ),
  );
  const sorbentCoverage = round2(
    clamp(
      input.assayReadout * 40 * boost +
        (1 - input.ionExchangeFidelity) * 25 -
        input.ionExchangeFidelity * 12 +
        (conventional ? 5 : 0),
      0,
      100,
    ),
  );
  const waterEfficiency = round2(
    clamp(
      input.conventionalCapacity * 35 * boost * Math.max(wS, wA) +
        input.assayReadout * 25 +
        (conventional ? 8 : 0) -
        burden * 10,
      0,
      100,
    ),
  );
  const conventionalOnlyPenalty = round2(
    clamp(
      (1 - input.sorbentCompleteness) * 25 * boost +
        burden * 12 -
        input.ionExchangeFidelity * (conventional ? 4 : 10) -
        input.waterFollowThrough * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.conventionalCapacity + input.assayReadout) * 28 +
        input.assayReadout * 18 -
        input.overclaimRisk * 15 -
        burden * 8,
      0,
      100,
    ),
  );
  const mofContribution = round2(
    clamp(
      mofCaptureScore * 0.2 +
        conventionalScore * 0.2 +
        sorbentCoverage * 0.2 +
        (100 - conventionalOnlyPenalty) * 0.2 +
        waterEfficiency * 0.2,
      0,
      100,
    ),
  );
  const conventionalContribution = round2(
    clamp(
      mofCaptureScore * 0.45 +
        conventionalScore * 0.35 +
        waterEfficiency * 0.2 -
        burden * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      conventionalContribution * (conventional ? 0.78 : 0.5) +
        mofContribution * (conventional ? 0.22 : 0.5) -
        input.ionExchangeFidelity * 5 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "conventional_sorbent",
    mofCaptureScore,
    conventionalScore,
    sorbentCoverage,
    waterEfficiency,
    conventionalOnlyPenalty,
    confidence,
    mofContribution,
    conventionalContribution,
    overall,
  };
}
