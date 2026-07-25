import {
  type FluorideInput,
  type FluorideQuality,
  biasWeight,
  clamp,
  harshnessLoad,
  round2,
} from "./types";

/**
 * Fast isotopic [18F]fluoride exchange scorer (path A):
 * rewards exchange rate, precursor purity, leaving-group ease,
 * and amine availability without claiming GMP / cyclotron / clinical dosing.
 */
export function scoreFastIsotopicExchange(input: FluorideInput): FluorideQuality {
  const only = input.profile === "fast_isotopic_exchange";
  const boost = only ? 1.12 : 0.96;
  const wE = biasWeight(input.labelBias, "exchange_first");
  const wS = biasWeight(input.labelBias, "speed_first");
  const wP = biasWeight(input.labelBias, "prosthetic_first");
  const avgBias = (wE + wS + (2 - wP)) / 3;
  const load = harshnessLoad(input.solventHarshness, input.activationBarrier);

  const exchangeScore = round2(
    clamp(
      (input.exchangeRate * 55 +
        input.leavingGroupEase * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.labelBias === "prosthetic_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const purityScore = round2(
    clamp(
      input.precursorPurity * 60 * boost +
        input.exchangeRate * 25 +
        (only ? 8 : 0) -
        input.prostheticStepBurden * (only ? 4 : 16) -
        (input.labelBias === "prosthetic_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const leavingScore = round2(
    clamp(
      input.leavingGroupEase * 58 * boost * wE +
        input.exchangeRate * 14 +
        input.amineAvailability * 14 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const amineScore = round2(
    clamp(
      input.amineAvailability * 50 * boost * wS +
        input.exchangeRate * 25 +
        input.precursorPurity * 15 +
        (only ? 8 : 0) -
        (input.labelBias === "prosthetic_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const prostheticScore = round2(
    clamp(
      input.prostheticStepBurden * 55 * boost +
        input.activationBarrier * 20 -
        input.solventHarshness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.exchangeRate * 30 +
        input.precursorPurity * 30 +
        input.leavingGroupEase * 25 -
        input.prostheticStepBurden * 15,
      0,
      100,
    ),
  );
  const exchangeContribution = round2(
    clamp(
      exchangeScore * 0.24 +
        purityScore * 0.26 +
        leavingScore * 0.28 +
        amineScore * 0.22,
      0,
      100,
    ),
  );
  const prostheticContribution = round2(
    clamp(
      prostheticScore * 0.7 +
        input.prostheticStepBurden * 20 +
        input.activationBarrier * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      exchangeContribution * (only ? 0.82 : 0.4) +
        prostheticContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.labelBias === "prosthetic_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "fast_isotopic_exchange",
    exchangeScore,
    purityScore,
    leavingScore,
    amineScore,
    prostheticScore,
    confidence,
    exchangeContribution,
    prostheticContribution,
    overall,
  };
}

/**
 * Multistep prosthetic-group baseline (path B):
 * rewards classic prosthetic step coverage and ignores exchange honesty.
 */
export function scoreMultistepProstheticBaseline(
  input: FluorideInput,
): FluorideQuality {
  const baseline = input.profile === "multistep_prosthetic_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wP = biasWeight(input.labelBias, "prosthetic_first");
  const load = harshnessLoad(input.solventHarshness, input.activationBarrier);

  const exchangeScore = round2(
    clamp(
      input.prostheticStepBurden * 35 * boost +
        wP * 10 -
        input.solventHarshness * 22 -
        input.overclaimRisk * 12 -
        (input.labelBias === "exchange_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const purityScore = round2(
    clamp(
      input.activationBarrier * 40 * boost +
        input.prostheticStepBurden * 25 -
        load * 15 -
        input.exchangeRate * 8,
      0,
      100,
    ),
  );
  const leavingScore = round2(
    clamp(
      input.activationBarrier * 38 * boost +
        input.prostheticStepBurden * 20 -
        input.leavingGroupEase * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const amineScore = round2(
    clamp(
      input.prostheticStepBurden * 42 * boost +
        input.activationBarrier * 28 -
        input.exchangeRate * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const prostheticScore = round2(
    clamp(
      input.prostheticStepBurden * 58 * boost * wP +
        input.activationBarrier * 32 -
        input.solventHarshness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.activationBarrier * 45 +
        input.prostheticStepBurden * 35 -
        input.solventHarshness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const exchangeContribution = round2(
    clamp(
      exchangeScore * 0.2 +
        purityScore * 0.2 +
        leavingScore * 0.2 +
        amineScore * 0.2 +
        prostheticScore * 0.2,
      0,
      100,
    ),
  );
  const prostheticContribution = round2(
    clamp(
      prostheticScore * 0.55 +
        input.activationBarrier * 30 +
        input.prostheticStepBurden * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      prostheticContribution * (baseline ? 0.78 : 0.5) +
        exchangeContribution * (baseline ? 0.22 : 0.5) -
        input.solventHarshness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "multistep_prosthetic_baseline",
    exchangeScore,
    purityScore,
    leavingScore,
    amineScore,
    prostheticScore,
    confidence,
    exchangeContribution,
    prostheticContribution,
    overall,
  };
}
