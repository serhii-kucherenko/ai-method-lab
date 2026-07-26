import {
  type RetrofitInput,
  type RetrofitQuality,
  biasWeight,
  emissionLoad,
  clamp,
  round2,
} from "./types";

/**
 * Photocatalytic pavement retrofit scorer (path A):
 * rewards TiO2 loading, corridor exposure, and emission reductions
 * when a photocatalytic pathway is configured — without claiming
 * live road construction control, certified audits, or procurement.
 */
export function scorePhotocatalyticPavementRetrofit(
  input: RetrofitInput,
): RetrofitQuality {
  const photo = input.profile === "photocatalytic_pavement_retrofit";
  const boost = photo ? 1.12 : 0.96;
  const wP = biasWeight(input.treatmentBias, "photocatalytic_first");
  const wA = biasWeight(input.treatmentBias, "assay_first");
  const wPr = biasWeight(input.treatmentBias, "preservation_first");
  const avgBias = (wP + wA + (2 - wPr)) / 3;
  const load = emissionLoad(
    input.noxBaseline,
    input.co2Baseline,
    input.trafficDensity,
  );

  const emissionScore = round2(
    clamp(
      ((1 - input.noxBaseline) * 35 +
        (1 - input.co2Baseline) * 25 +
        input.tio2Loading * 30 +
        input.corridorExposure * 10 -
        load * 5) *
        boost *
        avgBias +
        (photo ? 8 : 0) -
        input.overclaimRisk * (photo ? 6 : 14) -
        (input.treatmentBias === "preservation_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const durabilityScore = round2(
    clamp(
      input.preservationQuality * 35 * boost +
        input.tio2Loading * 25 * wP +
        input.assaySignal * 20 +
        (photo ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.corridorExposure * 40 * boost * wP +
        input.tio2Loading * 30 +
        (1 - input.trafficDensity) * 15 +
        (photo ? 8 : 0) -
        (input.treatmentBias === "preservation_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const costEfficiency = round2(
    clamp(
      ((1 - load) * 40 + input.assaySignal * 25 + input.tio2Loading * 20) *
        boost *
        wA +
        (photo ? 8 : 0) -
        input.overclaimRisk * 8,
      0,
      100,
    ),
  );
  const preservationPenalty = round2(
    clamp(
      (input.treatmentBias === "preservation_first" ? 40 : 18) * boost +
        load * 18 -
        input.tio2Loading * 12 +
        (1 - input.corridorExposure) * 12,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.tio2Loading * 26 +
        input.corridorExposure * 22 +
        input.assaySignal * 25 -
        input.overclaimRisk * 20,
      0,
      100,
    ),
  );
  const retrofitContribution = round2(
    clamp(
      emissionScore * 0.32 +
        coverageScore * 0.28 +
        costEfficiency * 0.22 +
        (100 - preservationPenalty) * 0.18,
      0,
      100,
    ),
  );
  const preservationContribution = round2(
    clamp(
      emissionScore * 0.35 +
        durabilityScore * 0.35 +
        costEfficiency * 0.2 +
        preservationPenalty * 0.1 -
        input.tio2Loading * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      retrofitContribution * (photo ? 0.82 : 0.4) +
        preservationContribution * (photo ? 0.18 : 0.6) +
        (photo ? 4 : 0) -
        (input.treatmentBias === "preservation_first" && photo ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "photocatalytic_pavement_retrofit",
    emissionScore,
    durabilityScore,
    coverageScore,
    costEfficiency,
    preservationPenalty,
    confidence,
    retrofitContribution,
    preservationContribution,
    overall,
  };
}

/**
 * Conventional preservation baseline scorer (path B):
 * rewards familiar preservation quality and underweights photocatalytic gains.
 */
export function scoreConventionalPreservation(
  input: RetrofitInput,
): RetrofitQuality {
  const conv = input.profile === "conventional_preservation";
  const boost = conv ? 1.08 : 0.92;
  const wPr = biasWeight(input.treatmentBias, "preservation_first");
  const wA = biasWeight(input.treatmentBias, "assay_first");
  const load = emissionLoad(
    input.noxBaseline,
    input.co2Baseline,
    input.trafficDensity,
  );

  const emissionScore = round2(
    clamp(
      (1 - input.noxBaseline) * 28 * boost +
        input.preservationQuality * 35 * boost +
        (wPr + wA) * 5 -
        input.tio2Loading * 10 -
        input.overclaimRisk * 10 -
        (input.treatmentBias === "photocatalytic_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const durabilityScore = round2(
    clamp(
      input.preservationQuality * 45 * boost * Math.max(wPr, wA) +
        (1 - load) * 20 +
        (conv ? 8 : 0) -
        input.tio2Loading * 8,
      0,
      100,
    ),
  );
  const coverageScore = round2(
    clamp(
      input.preservationQuality * 40 * boost +
        input.assaySignal * 25 -
        input.tio2Loading * 12 +
        (conv ? 5 : 0),
      0,
      100,
    ),
  );
  const costEfficiency = round2(
    clamp(
      input.preservationQuality * 35 * boost * Math.max(wPr, wA) +
        input.assaySignal * 25 +
        (conv ? 8 : 0) -
        load * 10,
      0,
      100,
    ),
  );
  const preservationPenalty = round2(
    clamp(
      (1 - input.preservationQuality) * 25 * boost +
        load * 12 -
        input.tio2Loading * (conv ? 4 : 10) -
        input.corridorExposure * 6,
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      (input.preservationQuality + input.assaySignal) * 28 +
        input.assaySignal * 18 -
        input.overclaimRisk * 15 -
        load * 8,
      0,
      100,
    ),
  );
  const retrofitContribution = round2(
    clamp(
      emissionScore * 0.2 +
        durabilityScore * 0.2 +
        coverageScore * 0.2 +
        (100 - preservationPenalty) * 0.2 +
        costEfficiency * 0.2,
      0,
      100,
    ),
  );
  const preservationContribution = round2(
    clamp(
      emissionScore * 0.45 +
        durabilityScore * 0.35 +
        costEfficiency * 0.2 -
        load * 6,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      preservationContribution * (conv ? 0.78 : 0.5) +
        retrofitContribution * (conv ? 0.22 : 0.5) -
        input.tio2Loading * 5 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "conventional_preservation",
    emissionScore,
    durabilityScore,
    coverageScore,
    costEfficiency,
    preservationPenalty,
    confidence,
    retrofitContribution,
    preservationContribution,
    overall,
  };
}
