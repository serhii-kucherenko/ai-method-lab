import {
  type ColoadInput,
  type ColoadQuality,
  biasWeight,
  clamp,
  poreCompetition,
  round2,
} from "./types";

/**
 * Ordered co-load sequence scorer (path A):
 * rewards preserving chemo-then-photo (or staged) order for encapsulation
 * synergy — without claiming GMP manufacture, live dosing, or clinical clearance.
 */
export function scoreOrderedCoload(input: ColoadInput): ColoadQuality {
  const only = input.profile === "ordered_coload_sequence";
  const boost = only ? 1.12 : 0.96;
  const wC = biasWeight(input.loadBias, "chemo_first");
  const wP = biasWeight(input.loadBias, "photo_first");
  const wS = biasWeight(input.loadBias, "simultaneous_first");
  const avgBias = (wC + wP + (2 - wS)) / 3;
  const compete = poreCompetition(
    input.chemoEncapsulation,
    input.photoEncapsulation,
  );

  const orderScore = round2(
    clamp(
      (input.orderFidelity * 55 +
        input.poreFillUniformity * 25 +
        input.assaySignal * 15 -
        compete * 8) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.loadBias === "simultaneous_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const chemoScore = round2(
    clamp(
      input.chemoEncapsulation * 55 * boost * wC +
        input.orderFidelity * 25 +
        (only ? 8 : 0) -
        (input.loadBias === "simultaneous_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const photoScore = round2(
    clamp(
      (input.photoEncapsulation * 50 +
        input.photothermalResponse * 20 +
        (1 - input.burstLeakRisk) * 20) *
        boost *
        wP +
        (only ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const leakPenalty = round2(
    clamp(
      input.burstLeakRisk * 55 * boost +
        compete * 20 -
        input.orderFidelity * 15 +
        (1 - input.poreFillUniformity) * 10,
      0,
      100,
    ),
  );
  const synergyScore = round2(
    clamp(
      input.photothermalResponse * 45 * boost +
        input.chemoEncapsulation * 20 +
        input.photoEncapsulation * 20 -
        (only ? 0 : 6) -
        input.burstLeakRisk * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.orderFidelity * 30 +
        input.poreFillUniformity * 25 +
        input.assaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const orderedContribution = round2(
    clamp(
      orderScore * 0.3 +
        chemoScore * 0.28 +
        photoScore * 0.24 +
        (100 - leakPenalty) * 0.18,
      0,
      100,
    ),
  );
  const simultaneousContribution = round2(
    clamp(
      synergyScore * 0.35 +
        chemoScore * 0.25 +
        photoScore * 0.25 +
        leakPenalty * 0.15 -
        input.orderFidelity * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      orderedContribution * (only ? 0.82 : 0.4) +
        simultaneousContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.loadBias === "simultaneous_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "ordered_coload_sequence",
    orderScore,
    chemoScore,
    photoScore,
    leakPenalty,
    synergyScore,
    confidence,
    orderedContribution,
    simultaneousContribution,
    overall,
  };
}

/**
 * Simultaneous-load baseline scorer (path B):
 * rewards co-loading both agents at once and underweights order fidelity.
 */
export function scoreSimultaneousLoad(input: ColoadInput): ColoadQuality {
  const baseline = input.profile === "simultaneous_load_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wS = biasWeight(input.loadBias, "simultaneous_first");
  const compete = poreCompetition(
    input.chemoEncapsulation,
    input.photoEncapsulation,
  );

  const orderScore = round2(
    clamp(
      input.chemoEncapsulation * 20 * boost +
        input.photoEncapsulation * 20 * boost +
        wS * 10 -
        input.orderFidelity * 18 -
        input.overclaimRisk * 12 -
        (input.loadBias === "chemo_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const chemoScore = round2(
    clamp(
      input.chemoEncapsulation * 42 * boost * wS +
        (1 - input.orderFidelity) * 18 +
        (baseline ? 8 : 0) -
        compete * 8,
      0,
      100,
    ),
  );
  const photoScore = round2(
    clamp(
      input.photoEncapsulation * 38 * boost +
        input.photothermalResponse * 25 -
        input.burstLeakRisk * 20 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const leakPenalty = round2(
    clamp(
      input.burstLeakRisk * 40 * boost +
        compete * 30 -
        input.orderFidelity * (baseline ? 5 : 12) -
        input.poreFillUniformity * 6,
      0,
      100,
    ),
  );
  const synergyScore = round2(
    clamp(
      input.photothermalResponse * 50 * boost * wS +
        input.assaySignal * 20 +
        (baseline ? 8 : 0) -
        input.orderFidelity * 10,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.chemoEncapsulation + input.photoEncapsulation) * 22 +
        input.assaySignal * 30 -
        input.overclaimRisk * 15 -
        compete * 10,
      0,
      100,
    ),
  );
  const orderedContribution = round2(
    clamp(
      orderScore * 0.2 +
        chemoScore * 0.2 +
        photoScore * 0.2 +
        (100 - leakPenalty) * 0.2 +
        synergyScore * 0.2,
      0,
      100,
    ),
  );
  const simultaneousContribution = round2(
    clamp(
      synergyScore * 0.55 +
        chemoScore * 0.25 +
        photoScore * 0.2 -
        compete * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      simultaneousContribution * (baseline ? 0.78 : 0.5) +
        orderedContribution * (baseline ? 0.22 : 0.5) -
        input.orderFidelity * 6 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "simultaneous_load_baseline",
    orderScore,
    chemoScore,
    photoScore,
    leakPenalty,
    synergyScore,
    confidence,
    orderedContribution,
    simultaneousContribution,
    overall,
  };
}
