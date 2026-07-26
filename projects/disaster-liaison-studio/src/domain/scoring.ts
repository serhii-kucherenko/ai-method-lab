import {
  type LiaisonInput,
  type LiaisonQuality,
  biasWeight,
  surgeLoad,
  clamp,
  round2,
} from "./types";

/**
 * Pediatric-perinatal disaster liaison scorer (path A):
 * rewards specialist coverage, lower handoff latency, and perinatal
 * risk handling when a liaison pathway is configured — without claiming
 * live dispatch, clinical triage authority, or government command.
 */
export function scorePediatricPerinatalLiaison(
  input: LiaisonInput,
): LiaisonQuality {
  const liaison = input.profile === "pediatric_perinatal_liaison";
  const boost = liaison ? 1.12 : 0.96;
  const wP = biasWeight(input.liaisonBias, "pediatric_first");
  const wH = biasWeight(input.liaisonBias, "handoff_first");
  const wQ = biasWeight(input.liaisonBias, "hq_first");
  const avgBias = (wP + wH + (2 - wQ)) / 3;
  const load = surgeLoad(
    input.pediatricLoad,
    input.perinatalRisk,
    input.surgePressure,
  );

  const specialtyScore = round2(
    clamp(
      ((1 - input.perinatalRisk) * 45 +
        input.liaisonCoverage * 30 +
        input.assaySignal * 15 -
        load * 6) *
        boost *
        avgBias +
        (liaison ? 8 : 0) -
        input.overclaimRisk * (liaison ? 6 : 14) -
        (input.liaisonBias === "hq_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.liaisonCoverage * 50 * boost * wP +
        (1 - input.handoffLatency) * 25 +
        (1 - input.surgePressure) * 15 +
        (liaison ? 8 : 0) -
        (input.liaisonBias === "hq_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const handoffScore = round2(
    clamp(
      ((1 - input.handoffLatency) * 50 +
        input.liaisonCoverage * 20 +
        input.assaySignal * 20) *
        boost *
        wH +
        (liaison ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const surgeScore = round2(
    clamp(
      (1 - input.surgePressure) * 45 * boost +
        (1 - input.pediatricLoad) * 25 +
        input.hqCoordination * 20 -
        (liaison ? 0 : 6) -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const hqPenalty = round2(
    clamp(
      (input.liaisonBias === "hq_first" ? 40 : 18) * boost +
        load * 20 -
        input.liaisonCoverage * 12 +
        input.handoffLatency * 15,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.liaisonCoverage * 28 +
        (1 - input.handoffLatency) * 22 +
        input.assaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const liaisonContribution = round2(
    clamp(
      specialtyScore * 0.28 +
        coverageScore * 0.32 +
        handoffScore * 0.22 +
        (100 - hqPenalty) * 0.18,
      0,
      100,
    ),
  );
  const hqContribution = round2(
    clamp(
      specialtyScore * 0.45 +
        surgeScore * 0.25 +
        handoffScore * 0.2 +
        hqPenalty * 0.1 -
        (1 - input.handoffLatency) * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      liaisonContribution * (liaison ? 0.82 : 0.4) +
        hqContribution * (liaison ? 0.18 : 0.6) +
        (liaison ? 4 : 0) -
        (input.liaisonBias === "hq_first" && liaison ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "pediatric_perinatal_liaison",
    specialtyScore,
    coverageScore,
    handoffScore,
    surgeScore,
    hqPenalty,
    confidence,
    liaisonContribution,
    hqContribution,
    overall,
  };
}

/**
 * Generic disaster HQ baseline scorer (path B):
 * rewards headquarters familiarity and underweights specialist liaison gains.
 */
export function scoreGenericDisasterHq(input: LiaisonInput): LiaisonQuality {
  const hq = input.profile === "generic_disaster_hq";
  const boost = hq ? 1.08 : 0.92;
  const wQ = biasWeight(input.liaisonBias, "hq_first");
  const wH = biasWeight(input.liaisonBias, "handoff_first");
  const load = surgeLoad(
    input.pediatricLoad,
    input.perinatalRisk,
    input.surgePressure,
  );

  const specialtyScore = round2(
    clamp(
      (1 - input.perinatalRisk) * 35 * boost +
        input.hqCoordination * 35 * boost +
        (wQ + wH) * 5 -
        (1 - input.handoffLatency) * 12 -
        input.overclaimRisk * 10 -
        (input.liaisonBias === "pediatric_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.hqCoordination * 40 * boost * Math.max(wQ, wH) +
        (1 - input.surgePressure) * 25 +
        (hq ? 8 : 0) -
        load * 10,
      0,
      100,
    ),
  );
  const handoffScore = round2(
    clamp(
      (1 - input.handoffLatency) * 40 * boost +
        input.assaySignal * 25 -
        input.liaisonCoverage * 15 +
        (hq ? 5 : 0),
      0,
      100,
    ),
  );
  const surgeScore = round2(
    clamp(
      (1 - input.surgePressure) * 30 * boost * Math.max(wQ, wH) +
        input.assaySignal * 25 +
        (hq ? 8 : 0) -
        (1 - input.handoffLatency) * 12,
      0,
      100,
    ),
  );
  const hqPenalty = round2(
    clamp(
      (1 - input.hqCoordination) * 25 * boost +
        load * 15 -
        input.liaisonCoverage * (hq ? 5 : 12) -
        (1 - input.handoffLatency) * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.liaisonCoverage + (1 - input.handoffLatency)) * 22 +
        input.assaySignal * 30 -
        input.overclaimRisk * 15 -
        load * 8,
      0,
      100,
    ),
  );
  const liaisonContribution = round2(
    clamp(
      specialtyScore * 0.2 +
        coverageScore * 0.2 +
        handoffScore * 0.2 +
        (100 - hqPenalty) * 0.2 +
        surgeScore * 0.2,
      0,
      100,
    ),
  );
  const hqContribution = round2(
    clamp(
      specialtyScore * 0.55 +
        coverageScore * 0.25 +
        surgeScore * 0.2 -
        load * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      hqContribution * (hq ? 0.78 : 0.5) +
        liaisonContribution * (hq ? 0.22 : 0.5) -
        (1 - input.handoffLatency) * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "generic_disaster_hq",
    specialtyScore,
    coverageScore,
    handoffScore,
    surgeScore,
    hqPenalty,
    confidence,
    liaisonContribution,
    hqContribution,
    overall,
  };
}
