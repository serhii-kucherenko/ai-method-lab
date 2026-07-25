import {
  type BindInput,
  type BindQuality,
  biasWeight,
  clamp,
  round2,
} from "./types";

function laneBlock(
  value: number,
  weight: number,
  coherence: number,
  noise: number,
): number {
  return clamp(value * 55 * weight + coherence * 25 - noise * 18, 0, 100);
}

/**
 * Multimodal bind retrieve quality (good path):
 * blends structure, diffraction, DOS, language with bind coherence + cross-modal agreement.
 */
export function scoreMultimodal(input: BindInput): BindQuality {
  const multi = input.profile === "multimodal";
  const boost = multi ? 1.12 : 0.96;
  const wS = biasWeight(input.modalityBias, "structure");
  const wD = biasWeight(input.modalityBias, "diffraction");
  const wO = biasWeight(input.modalityBias, "dos");
  const wL = biasWeight(input.modalityBias, "language");

  const structureScore = round2(
    clamp(
      laneBlock(
        input.structureFidelity,
        wS,
        input.bindCoherence,
        input.noiseLevel,
      ) *
        boost +
        input.structureFidelity * 8 +
        (multi ? 6 : 0),
      0,
      100,
    ),
  );
  const diffractionScore = round2(
    clamp(
      laneBlock(
        input.diffractionMatch,
        wD,
        input.bindCoherence,
        input.noiseLevel,
      ) *
        boost +
        input.diffractionMatch * 7 +
        (multi ? 5 : 0),
      0,
      100,
    ),
  );
  const dosScore = round2(
    clamp(
      laneBlock(input.dosAlignment, wO, input.bindCoherence, input.noiseLevel) *
        boost +
        input.dosAlignment * 7 +
        (multi ? 5 : 0),
      0,
      100,
    ),
  );
  const languageScore = round2(
    clamp(
      laneBlock(
        input.languageClarity,
        wL,
        input.bindCoherence,
        input.noiseLevel,
      ) *
        boost +
        input.languageClarity * 6 +
        (multi ? 4 : 0),
      0,
      100,
    ),
  );

  const bindScore = round2(
    clamp(
      (input.bindCoherence * 48 +
        input.crossModalAgreement * 36 +
        input.retrievalPrecision * 16 -
        input.noiseLevel * 20) *
        boost +
        (multi ? 10 : 0),
      0,
      100,
    ),
  );
  const retrievalScore = round2(
    clamp(
      (input.retrievalPrecision * 50 +
        input.crossModalAgreement * 28 +
        input.bindCoherence * 18 -
        input.noiseLevel * 16) *
        boost +
        (multi ? 8 : 0),
      0,
      100,
    ),
  );

  const modalityContribution = round2(
    (structureScore + diffractionScore + dosScore + languageScore) / 4,
  );
  const crossModalContribution = round2(
    multi
      ? input.crossModalAgreement * 70 + input.bindCoherence * 30
      : input.crossModalAgreement * 20,
  );

  const ranked = [bindScore, retrievalScore, modalityContribution]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(
    clamp(
      ranked[0]! - ranked[1]! + (multi ? 12 : 3) + input.bindCoherence * 8,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      structureScore * 0.14 +
        diffractionScore * 0.14 +
        dosScore * 0.12 +
        languageScore * 0.1 +
        bindScore * 0.22 +
        retrievalScore * 0.18 +
        confidence * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "multimodal_bind",
    structureScore,
    diffractionScore,
    dosScore,
    languageScore,
    bindScore,
    retrievalScore,
    confidence,
    modalityContribution,
    crossModalContribution,
    overall,
  };
}

/**
 * Single-modality baseline: collapses to the strongest biased lane; ignores cross-modal bind.
 */
export function scoreSingle(input: BindInput): BindQuality {
  const lanes: Array<{ key: BindInput["modalityBias"]; v: number }> = [
    { key: "structure", v: input.structureFidelity },
    { key: "diffraction", v: input.diffractionMatch },
    { key: "dos", v: input.dosAlignment },
    { key: "language", v: input.languageClarity },
  ];
  const preferred =
    input.modalityBias === "balanced"
      ? lanes.slice().sort((a, b) => b.v - a.v)[0]!
      : lanes.find((l) => l.key === input.modalityBias) ?? lanes[0]!;

  const solo = preferred.v;
  const structureScore = round2(
    clamp(
      (preferred.key === "structure" ? solo : solo * 0.35) * 70 -
        input.noiseLevel * 22,
      0,
      82,
    ),
  );
  const diffractionScore = round2(
    clamp(
      (preferred.key === "diffraction" ? solo : solo * 0.35) * 70 -
        input.noiseLevel * 22,
      0,
      82,
    ),
  );
  const dosScore = round2(
    clamp(
      (preferred.key === "dos" ? solo : solo * 0.35) * 68 -
        input.noiseLevel * 20,
      0,
      80,
    ),
  );
  const languageScore = round2(
    clamp(
      (preferred.key === "language" ? solo : solo * 0.35) * 66 -
        input.noiseLevel * 20,
      0,
      78,
    ),
  );

  const bindScore = round2(
    clamp(solo * 42 + input.retrievalPrecision * 18 - input.noiseLevel * 16, 0, 70),
  );
  const retrievalScore = round2(
    clamp(
      solo * 48 + input.retrievalPrecision * 22 - input.noiseLevel * 14,
      0,
      72,
    ),
  );

  const modalityContribution = round2(solo * 70);
  const crossModalContribution = 0;

  const ranked = [bindScore, retrievalScore, modalityContribution]
    .slice()
    .sort((a, b) => b - a);
  const confidence = round2(clamp(ranked[0]! - ranked[1]! + 2, 0, 58));

  const overall = round2(
    clamp(
      structureScore * 0.12 +
        diffractionScore * 0.12 +
        dosScore * 0.1 +
        languageScore * 0.1 +
        bindScore * 0.18 +
        retrievalScore * 0.28 +
        confidence * 0.1,
      0,
      100,
    ),
  );

  return {
    mode: "single_modality",
    structureScore,
    diffractionScore,
    dosScore,
    languageScore,
    bindScore,
    retrievalScore,
    confidence,
    modalityContribution,
    crossModalContribution,
    overall,
  };
}
