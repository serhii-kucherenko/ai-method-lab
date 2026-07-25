import {
  type AttestInput,
  type AttestQuality,
  biasWeight,
  clamp,
  round2,
} from "./types";

function laneBlock(
  value: number,
  weight: number,
  integrity: number,
  noise: number,
): number {
  return clamp(value * 55 * weight + integrity * 25 - noise * 18, 0, 100);
}

/**
 * Dual-impl B tool-attested (must match attest.ts).
 */
export function scoreAttested(input: AttestInput): AttestQuality {
  const attested = input.profile === "attested";
  const boost = attested ? 1.12 : 0.96;
  const wC = biasWeight(input.toolBias, "calc");
  const wS = biasWeight(input.toolBias, "search");
  const wO = biasWeight(input.toolBias, "code");
  const wR = biasWeight(input.toolBias, "retrieval");
  const avgBias = (wC + wS + wO + wR) / 4;

  const coverageScore = round2(
    clamp(
      laneBlock(
        input.toolCoverage,
        avgBias,
        input.proofChainIntegrity,
        input.noiseLevel,
      ) *
        boost +
        input.toolCoverage * 8 +
        (attested ? 6 : 0) -
        input.unsupportedClaims * 22,
      0,
      100,
    ),
  );
  const groundingScore = round2(
    clamp(
      laneBlock(
        input.evidenceGrounding,
        avgBias,
        input.proofChainIntegrity,
        input.noiseLevel,
      ) *
        boost +
        input.evidenceGrounding * 7 +
        (attested ? 5 : 0) -
        input.unsupportedClaims * 18,
      0,
      100,
    ),
  );
  const proofScore = round2(
    clamp(
      (input.proofChainIntegrity * 50 +
        input.toolCoverage * 28 +
        input.evidenceGrounding * 18 -
        input.noiseLevel * 16 -
        input.unsupportedClaims * 20) *
        boost +
        (attested ? 10 : 0),
      0,
      100,
    ),
  );
  const freshnessScore = round2(
    clamp(
      laneBlock(
        input.attestationFreshness,
        avgBias,
        input.proofChainIntegrity,
        input.noiseLevel,
      ) *
        boost +
        input.attestationFreshness * 6 +
        (attested ? 4 : 0),
      0,
      100,
    ),
  );
  const specificityScore = round2(
    clamp(
      input.claimSpecificity * 70 * boost +
        input.evidenceGrounding * 20 -
        input.noiseLevel * 12 +
        (attested ? 5 : 0),
      0,
      100,
    ),
  );
  const fluencyScore = round2(
    clamp(
      input.fluentConfidence * 40 +
        input.claimSpecificity * 15 -
        input.unsupportedClaims * 10,
      0,
      100,
    ),
  );

  const toolContribution = round2(
    (coverageScore + groundingScore + freshnessScore) / 3,
  );
  const proofContribution = round2(
    attested
      ? input.proofChainIntegrity * 70 + input.toolCoverage * 30
      : input.proofChainIntegrity * 20,
  );

  const confidence = round2(
    clamp(
      (toolContribution * 0.35 +
        proofScore * 0.35 +
        specificityScore * 0.2 +
        freshnessScore * 0.1) *
        (attested ? 1 : 0.85) -
        input.unsupportedClaims * 15,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      coverageScore * 0.22 +
        groundingScore * 0.22 +
        proofScore * 0.28 +
        freshnessScore * 0.12 +
        specificityScore * 0.1 +
        confidence * 0.06,
      0,
      100,
    ),
  );

  return {
    mode: "tool_attested",
    coverageScore,
    groundingScore,
    proofScore,
    freshnessScore,
    specificityScore,
    fluencyScore,
    confidence,
    toolContribution,
    proofContribution,
    overall,
  };
}

/**
 * Dual-impl B fluent-only (must match attest.ts).
 */
export function scoreFluent(input: AttestInput): AttestQuality {
  const fluent = input.profile === "fluent" || input.profile === "attested";
  const boost = fluent ? 1.05 : 0.9;

  const coverageScore = round2(
    clamp(input.toolCoverage * 12 + input.fluentConfidence * 8, 0, 100),
  );
  const groundingScore = round2(
    clamp(input.evidenceGrounding * 10 + input.fluentConfidence * 15, 0, 100),
  );
  const proofScore = round2(
    clamp(input.proofChainIntegrity * 8 + input.fluentConfidence * 12, 0, 100),
  );
  const freshnessScore = round2(
    clamp(input.attestationFreshness * 8 + input.fluentConfidence * 10, 0, 100),
  );
  const specificityScore = round2(
    clamp(
      input.claimSpecificity * 55 * boost + input.fluentConfidence * 25,
      0,
      100,
    ),
  );
  const fluencyScore = round2(
    clamp(
      (input.fluentConfidence * 62 +
        input.claimSpecificity * 22 -
        input.unsupportedClaims * 8 -
        input.noiseLevel * 10) *
        boost,
      0,
      100,
    ),
  );

  const toolContribution = round2((coverageScore + groundingScore) / 2);
  const proofContribution = round2(input.proofChainIntegrity * 15);

  const confidence = round2(
    clamp(
      fluencyScore * 0.55 +
        specificityScore * 0.3 +
        input.fluentConfidence * 15 -
        input.noiseLevel * 8,
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      fluencyScore * 0.45 +
        specificityScore * 0.25 +
        confidence * 0.2 +
        coverageScore * 0.05 +
        groundingScore * 0.05,
      0,
      100,
    ),
  );

  return {
    mode: "fluent_only",
    coverageScore,
    groundingScore,
    proofScore,
    freshnessScore,
    specificityScore,
    fluencyScore,
    confidence,
    toolContribution,
    proofContribution,
    overall,
  };
}
