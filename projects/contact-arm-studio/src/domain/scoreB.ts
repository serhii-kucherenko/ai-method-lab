import {
  type ContactArmInput,
  type ContactArmQuality,
  biasWeight,
  clamp,
  contactLoad,
  round2,
} from "./types";

/**
 * Contact-centric tactile+vision scorer (good path A):
 * rewards contact coverage, tactile salience, and plan fit under contact pressure.
 */
export function scoreContactCentric(
  input: ContactArmInput,
): ContactArmQuality {
  const contact = input.profile === "contact_centric";
  const boost = contact ? 1.12 : 0.96;
  const wC = biasWeight(input.contactBias, "contact_strict");
  const wT = biasWeight(input.contactBias, "tactile_first");
  const wV = biasWeight(input.contactBias, "vision_first");
  const avgBias = (wC + wT + wV) / 3;
  const load = contactLoad(input.contactPressure, input.contactCoverage);

  const contactDiagnosis = round2(
    clamp(
      (input.contactCoverage * 55 +
        input.tactileSalience * 25 -
        load * 10) *
        boost *
        avgBias +
        (contact ? 8 : 0) -
        input.leakageRisk * (contact ? 6 : 14) -
        (input.contactBias === "vision_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const tactileDiagnosis = round2(
    clamp(
      input.tactileSalience * 60 * boost +
        input.contactCoverage * 25 +
        (contact ? 8 : 0) -
        input.visionOptimism * (contact ? 4 : 16) -
        (input.contactBias === "vision_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const planReasonScore = round2(
    clamp(
      input.sensingAgreement * 58 * boost * wT +
        input.contactCoverage * 28 +
        (contact ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const sensingIntegrity = round2(
    clamp(
      input.planFit * 50 * boost * wC +
        input.tactileSalience * 25 +
        input.contactCoverage * 15 +
        (contact ? 8 : 0) -
        (input.contactBias === "vision_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const visionOnlyScore = round2(
    clamp(
      input.visionOnlyAccuracy * 55 * boost +
        input.visionOptimism * 20 -
        input.contactPressure * 18 -
        (contact ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.contactCoverage * 40 +
        input.tactileSalience * 30 +
        input.planFit * 25 -
        input.visionOptimism * 15,
      0,
      100,
    ),
  );
  const contactContribution = round2(
    clamp(
      contactDiagnosis * 0.26 +
        tactileDiagnosis * 0.24 +
        planReasonScore * 0.28 +
        sensingIntegrity * 0.22,
      0,
      100,
    ),
  );
  const visionContribution = round2(
    clamp(
      visionOnlyScore * 0.7 +
        input.visionOnlyAccuracy * 20 +
        input.visionOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      contactContribution * (contact ? 0.82 : 0.4) +
        visionContribution * (contact ? 0.18 : 0.6) +
        (contact ? 4 : 0) -
        (input.contactBias === "vision_first" && contact ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "contact_centric",
    contactDiagnosis,
    tactileDiagnosis,
    planReasonScore,
    sensingIntegrity,
    visionOnlyScore,
    confidence,
    contactContribution,
    visionContribution,
    overall,
  };
}

/**
 * Vision-only baseline (path B):
 * rewards camera accuracy + vision optimism, weak on contact honesty.
 */
export function scoreVisionOnlyBaseline(
  input: ContactArmInput,
): ContactArmQuality {
  const naive = input.profile === "vision_only";
  const boost = naive ? 1.08 : 0.92;
  const wV = biasWeight(input.contactBias, "vision_first");
  const load = contactLoad(input.contactPressure, input.contactCoverage);

  const contactDiagnosis = round2(
    clamp(
      input.visionOnlyAccuracy * 35 * boost +
        wV * 10 -
        input.contactPressure * 22 -
        input.leakageRisk * 12 -
        (input.contactBias === "contact_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const tactileDiagnosis = round2(
    clamp(
      input.visionOptimism * 40 * boost +
        input.visionOnlyAccuracy * 25 -
        load * 15 -
        input.contactCoverage * 8,
      0,
      100,
    ),
  );
  const planReasonScore = round2(
    clamp(
      input.visionOptimism * 38 * boost +
        input.visionOnlyAccuracy * 20 -
        input.planFit * (naive ? 5 : 0) -
        load * 18 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const sensingIntegrity = round2(
    clamp(
      input.visionOnlyAccuracy * 42 * boost +
        input.visionOptimism * 28 -
        input.contactCoverage * 10 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const visionOnlyScore = round2(
    clamp(
      input.visionOnlyAccuracy * 58 * boost * wV +
        input.visionOptimism * 32 -
        input.contactPressure * 10 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.visionOptimism * 45 +
        input.visionOnlyAccuracy * 35 -
        input.contactPressure * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const contactContribution = round2(
    clamp(
      contactDiagnosis * 0.2 +
        tactileDiagnosis * 0.2 +
        planReasonScore * 0.2 +
        sensingIntegrity * 0.2 +
        visionOnlyScore * 0.2,
      0,
      100,
    ),
  );
  const visionContribution = round2(
    clamp(
      visionOnlyScore * 0.55 +
        input.visionOptimism * 30 +
        input.visionOnlyAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      visionContribution * (naive ? 0.78 : 0.5) +
        contactContribution * (naive ? 0.22 : 0.5) -
        input.contactPressure * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "vision_only",
    contactDiagnosis,
    tactileDiagnosis,
    planReasonScore,
    sensingIntegrity,
    visionOnlyScore,
    confidence,
    contactContribution,
    visionContribution,
    overall,
  };
}
