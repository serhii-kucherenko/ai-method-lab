import {
  type EndoInput,
  type EndoQuality,
  biasWeight,
  burdenLoad,
  clamp,
  round2,
} from "./types";

/**
 * One-hole split endoscopy scorer (path A):
 * rewards lower blood loss, shorter stay, and recovery when OSE pathway
 * is configured — without claiming live OR control, device clearance,
 * or clinical advice.
 */
export function scoreOneHoleSplit(input: EndoInput): EndoQuality {
  const ose = input.profile === "one_hole_split_endoscopy";
  const boost = ose ? 1.12 : 0.96;
  const wB = biasWeight(input.approachBias, "blood_loss_first");
  const wS = biasWeight(input.approachBias, "stay_first");
  const wO = biasWeight(input.approachBias, "open_first");
  const avgBias = (wB + wS + (2 - wO)) / 3;
  const load = burdenLoad(
    input.bloodLoss,
    input.hospitalStay,
    input.complicationRate,
  );

  const bloodLossScore = round2(
    clamp(
      ((1 - input.bloodLoss) * 50 +
        input.decompressionQuality * 25 +
        input.recoverySignal * 15 -
        load * 6) *
        boost *
        avgBias +
        (ose ? 8 : 0) -
        input.overclaimRisk * (ose ? 6 : 14) -
        (input.approachBias === "open_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const stayScore = round2(
    clamp(
      (1 - input.hospitalStay) * 50 * boost * wS +
        (1 - input.operativeTime) * 25 +
        input.recoverySignal * 15 +
        (ose ? 8 : 0) -
        (input.approachBias === "open_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const safetyScore = round2(
    clamp(
      ((1 - input.complicationRate) * 50 +
        input.decompressionQuality * 20 +
        input.assaySignal * 20) *
        boost *
        wB +
        (ose ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const recoveryScore = round2(
    clamp(
      input.recoverySignal * 45 * boost +
        input.assaySignal * 25 +
        (1 - input.bloodLoss) * 20 -
        (ose ? 0 : 6) -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const openPenalty = round2(
    clamp(
      (input.approachBias === "open_first" ? 40 : 18) * boost +
        load * 20 -
        (1 - input.bloodLoss) * 12 +
        input.hospitalStay * 15,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (1 - input.bloodLoss) * 28 +
        (1 - input.hospitalStay) * 22 +
        input.assaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const oseContribution = round2(
    clamp(
      bloodLossScore * 0.28 +
        stayScore * 0.32 +
        safetyScore * 0.22 +
        (100 - openPenalty) * 0.18,
      0,
      100,
    ),
  );
  const openContribution = round2(
    clamp(
      bloodLossScore * 0.45 +
        recoveryScore * 0.25 +
        safetyScore * 0.2 +
        openPenalty * 0.1 -
        (1 - input.hospitalStay) * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      oseContribution * (ose ? 0.82 : 0.4) +
        openContribution * (ose ? 0.18 : 0.6) +
        (ose ? 4 : 0) -
        (input.approachBias === "open_first" && ose ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "one_hole_split_endoscopy",
    bloodLossScore,
    stayScore,
    safetyScore,
    recoveryScore,
    openPenalty,
    confidence,
    oseContribution,
    openContribution,
    overall,
  };
}

/**
 * Open laminectomy baseline scorer (path B):
 * rewards open exposure familiarity and underweights MIS blood-loss / stay gains.
 */
export function scoreOpenLaminectomy(input: EndoInput): EndoQuality {
  const open = input.profile === "open_laminectomy";
  const boost = open ? 1.08 : 0.92;
  const wO = biasWeight(input.approachBias, "open_first");
  const wS = biasWeight(input.approachBias, "stay_first");
  const load = burdenLoad(
    input.bloodLoss,
    input.hospitalStay,
    input.complicationRate,
  );

  const bloodLossScore = round2(
    clamp(
      (1 - input.bloodLoss) * 35 * boost +
        input.decompressionQuality * 35 * boost +
        (wO + wS) * 5 -
        (1 - input.hospitalStay) * 12 -
        input.overclaimRisk * 10 -
        (input.approachBias === "blood_loss_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const stayScore = round2(
    clamp(
      input.decompressionQuality * 40 * boost * Math.max(wO, wS) +
        (1 - input.complicationRate) * 25 +
        (open ? 8 : 0) -
        load * 10,
      0,
      100,
    ),
  );
  const safetyScore = round2(
    clamp(
      (1 - input.complicationRate) * 40 * boost +
        input.assaySignal * 25 -
        (1 - input.bloodLoss) * 15 +
        (open ? 5 : 0),
      0,
      100,
    ),
  );
  const recoveryScore = round2(
    clamp(
      input.recoverySignal * 30 * boost * Math.max(wO, wS) +
        input.assaySignal * 25 +
        (open ? 8 : 0) -
        (1 - input.hospitalStay) * 12,
      0,
      100,
    ),
  );
  const openPenalty = round2(
    clamp(
      (1 - input.decompressionQuality) * 25 * boost +
        load * 15 -
        (1 - input.bloodLoss) * (open ? 5 : 12) -
        (1 - input.operativeTime) * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      ((1 - input.bloodLoss) + (1 - input.hospitalStay)) * 22 +
        input.assaySignal * 30 -
        input.overclaimRisk * 15 -
        load * 8,
      0,
      100,
    ),
  );
  const oseContribution = round2(
    clamp(
      bloodLossScore * 0.2 +
        stayScore * 0.2 +
        safetyScore * 0.2 +
        (100 - openPenalty) * 0.2 +
        recoveryScore * 0.2,
      0,
      100,
    ),
  );
  const openContribution = round2(
    clamp(
      bloodLossScore * 0.55 +
        stayScore * 0.25 +
        recoveryScore * 0.2 -
        load * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      openContribution * (open ? 0.78 : 0.5) +
        oseContribution * (open ? 0.22 : 0.5) -
        (1 - input.hospitalStay) * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "open_laminectomy",
    bloodLossScore,
    stayScore,
    safetyScore,
    recoveryScore,
    openPenalty,
    confidence,
    oseContribution,
    openContribution,
    overall,
  };
}
