/**
 * Second independent implementation of the dual score (verify path).
 * Must stay behaviorally identical to rhythm.ts.
 */
import {
  type RhythmInput,
  type RhythmQuality,
  clamp,
  round2,
} from "./types";

function anisotropyBlock(input: RhythmInput): number {
  return clamp(
    input.morphologyAnisotropy * 48 +
      input.angularCovariance * 34 +
      input.embeddingUniformity * 18,
    0,
    100,
  );
}

function logitBlock(input: RhythmInput): number {
  return clamp(
    input.adaptiveLogit * 52 +
      (1 - input.labelSparsity) * 22 +
      input.multiLabelDensity * 26,
    0,
    100,
  );
}

function bandBlock(input: RhythmInput): number {
  return clamp(
    input.bandProtectQrs * 58 +
      input.tailClassShare * 24 +
      input.morphologyAnisotropy * 18,
    0,
    100,
  );
}

function tailPressure(input: RhythmInput): number {
  return clamp(
    input.labelSparsity * 0.55 +
      (1 - input.tailClassShare) * 0.3 +
      input.headClassShare * 0.15,
    0,
    1,
  );
}

export function scoreAngularScl(input: RhythmInput): RhythmQuality {
  const full = input.profile === "full";
  const boost = full ? 1.08 : 0.96;
  const ang = anisotropyBlock(input);
  const logit = logitBlock(input);
  const band = bandBlock(input);
  const pressure = tailPressure(input);

  const angularContribution = round2(ang * (full ? 1.1 : 0.92));
  const logitContribution = round2(logit * (full ? 1.08 : 0.9));
  const bandContribution = round2(band * (full ? 1.06 : 0.88));

  const rareSensitivity = round2(
    clamp(
      (ang * 0.42 + logit * 0.28 + band * 0.3) * boost +
        input.angularCovariance * 8 +
        input.adaptiveLogit * 6 -
        pressure * 12,
      0,
      100,
    ),
  );

  const balancedAccuracy = round2(
    clamp(
      (ang * 0.35 + logit * 0.32 + band * 0.2 + input.embeddingUniformity * 13) *
        boost +
        input.tailClassShare * 10 -
        pressure * 8,
      0,
      100,
    ),
  );

  const headSpecificity = round2(
    clamp(
      72 +
        input.headClassShare * 18 +
        input.embeddingUniformity * 8 -
        input.adaptiveLogit * 4 +
        (full ? 4 : 0),
      0,
      100,
    ),
  );

  const macroMap = round2(
    clamp(
      (rareSensitivity * 0.45 +
        balancedAccuracy * 0.35 +
        headSpecificity * 0.2) *
        0.92 +
        input.multiLabelDensity * 6,
      0,
      100,
    ),
  );

  const tailLift = round2(
    clamp(
      rareSensitivity -
        (48 - input.tailClassShare * 20 + pressure * 18) +
        input.angularCovariance * 10 +
        input.bandProtectQrs * 8,
      0,
      100,
    ),
  );

  const confidence = round2(
    clamp(
      input.angularCovariance * 28 +
        input.adaptiveLogit * 24 +
        input.bandProtectQrs * 22 +
        input.embeddingUniformity * 18 +
        (full ? 8 : 2),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      balancedAccuracy * 0.34 +
        rareSensitivity * 0.32 +
        macroMap * 0.18 +
        tailLift * 0.16,
      0,
      100,
    ),
  );

  return {
    mode: "angular_scl",
    balancedAccuracy,
    rareSensitivity,
    headSpecificity,
    macroMap,
    tailLift,
    confidence,
    angularContribution,
    logitContribution,
    bandContribution,
    overall,
  };
}

export function scoreFlatCe(input: RhythmInput): RhythmQuality {
  const full = input.profile === "full";
  const pressure = tailPressure(input);
  const headDom =
    input.headClassShare * 55 + (1 - input.tailClassShare) * 20 + 12;

  const rareSensitivity = round2(
    clamp(
      38 +
        input.tailClassShare * 22 -
        pressure * 28 -
        input.labelSparsity * 14 +
        (full ? 3 : 0),
      0,
      100,
    ),
  );

  const balancedAccuracy = round2(
    clamp(
      headDom * 0.55 +
        rareSensitivity * 0.25 +
        input.embeddingUniformity * 12 -
        pressure * 10,
      0,
      100,
    ),
  );

  const headSpecificity = round2(
    clamp(
      78 + input.headClassShare * 16 + (full ? 2 : 0) - input.labelSparsity * 4,
      0,
      100,
    ),
  );

  const macroMap = round2(
    clamp(
      rareSensitivity * 0.5 + balancedAccuracy * 0.35 + headSpecificity * 0.15,
      0,
      100,
    ),
  );

  const tailLift = round2(
    clamp(rareSensitivity - 42 - pressure * 10 + input.tailClassShare * 8, 0, 100),
  );

  const confidence = round2(
    clamp(
      input.headClassShare * 40 +
        (1 - input.labelSparsity) * 20 +
        input.embeddingUniformity * 15 +
        (full ? 4 : 1),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      balancedAccuracy * 0.4 +
        rareSensitivity * 0.22 +
        macroMap * 0.2 +
        headSpecificity * 0.18,
      0,
      100,
    ),
  );

  return {
    mode: "flat_ce",
    balancedAccuracy,
    rareSensitivity,
    headSpecificity,
    macroMap,
    tailLift,
    confidence,
    angularContribution: 0,
    logitContribution: 0,
    bandContribution: round2(input.bandProtectQrs * 8),
    overall,
  };
}
