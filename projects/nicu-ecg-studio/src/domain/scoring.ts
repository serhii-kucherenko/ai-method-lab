import {
  type NicuEcgInput,
  type NicuEcgQuality,
  biasWeight,
  clamp,
  round2,
  segmentLoad,
} from "./types";

/**
 * Alignment-free PPG-guided ECG scorer (good path A):
 * rewards PPG coverage, dual-stream inpaint fidelity, ECG recovery,
 * and pack completeness without forcing fake alignment.
 */
export function scoreAlignmentFreePpgEcg(
  input: NicuEcgInput,
): NicuEcgQuality {
  const only = input.profile === "alignment_free_ppg_ecg";
  const boost = only ? 1.12 : 0.96;
  const wP = biasWeight(input.inpaintBias, "ppg_first");
  const wE = biasWeight(input.inpaintBias, "ecg_first");
  const wA = biasWeight(input.inpaintBias, "alignment_first");
  const avgBias = (wP + wE + wA) / 3;
  const load = segmentLoad(input.segmentHardness, input.ecgRecovery);

  const ppgScore = round2(
    clamp(
      (input.ppgCoverage * 55 +
        input.ecgRecovery * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.inpaintBias === "alignment_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.inpaintFidelity * 60 * boost +
        input.ppgCoverage * 25 +
        (only ? 8 : 0) -
        input.alignmentOptimism * (only ? 4 : 16) -
        (input.inpaintBias === "alignment_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const ecgScore = round2(
    clamp(
      input.ecgRecovery * 58 * boost * wE +
        input.ppgCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.packCompleteness * 50 * boost * wP +
        input.inpaintFidelity * 25 +
        input.ppgCoverage * 15 +
        (only ? 8 : 0) -
        (input.inpaintBias === "alignment_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const alignmentScore = round2(
    clamp(
      input.alignmentConfidence * 55 * boost +
        input.alignmentOptimism * 20 -
        input.segmentHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.ppgCoverage * 40 +
        input.inpaintFidelity * 30 +
        input.packCompleteness * 25 -
        input.alignmentOptimism * 15,
      0,
      100,
    ),
  );
  const alignmentFreeContribution = round2(
    clamp(
      ppgScore * 0.26 +
        fidelityScore * 0.24 +
        ecgScore * 0.28 +
        completenessScore * 0.22,
      0,
      100,
    ),
  );
  const alignmentDependentContribution = round2(
    clamp(
      alignmentScore * 0.7 +
        input.alignmentConfidence * 20 +
        input.alignmentOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      alignmentFreeContribution * (only ? 0.82 : 0.4) +
        alignmentDependentContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.inpaintBias === "alignment_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "alignment_free_ppg_ecg",
    ppgScore,
    fidelityScore,
    ecgScore,
    completenessScore,
    alignmentScore,
    confidence,
    alignmentFreeContribution,
    alignmentDependentContribution,
    overall,
  };
}

/**
 * Alignment-dependent PPG-to-ECG baseline (path B):
 * rewards forced alignment confidence + optimism,
 * weak on alignment-free dual-stream honesty.
 */
export function scoreAlignmentDependentPpgEcgBaseline(
  input: NicuEcgInput,
): NicuEcgQuality {
  const baseline = input.profile === "alignment_dependent_ppg_ecg_baseline";
  const boost = baseline ? 1.08 : 0.92;
  const wA = biasWeight(input.inpaintBias, "alignment_first");
  const load = segmentLoad(input.segmentHardness, input.ecgRecovery);

  const ppgScore = round2(
    clamp(
      input.alignmentConfidence * 35 * boost +
        wA * 10 -
        input.segmentHardness * 22 -
        input.overclaimRisk * 12 -
        (input.inpaintBias === "ppg_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const fidelityScore = round2(
    clamp(
      input.alignmentOptimism * 40 * boost +
        input.alignmentConfidence * 25 -
        load * 15 -
        input.ppgCoverage * 8,
      0,
      100,
    ),
  );
  const ecgScore = round2(
    clamp(
      input.alignmentOptimism * 38 * boost +
        input.alignmentConfidence * 20 -
        input.packCompleteness * (baseline ? 5 : 0) -
        load * 18 -
        (baseline ? 0 : 6),
      0,
      100,
    ),
  );
  const completenessScore = round2(
    clamp(
      input.alignmentConfidence * 42 * boost +
        input.alignmentOptimism * 28 -
        input.ppgCoverage * 10 +
        (baseline ? 5 : 0),
      0,
      100,
    ),
  );
  const alignmentScore = round2(
    clamp(
      input.alignmentConfidence * 58 * boost * wA +
        input.alignmentOptimism * 32 -
        input.segmentHardness * 10 +
        (baseline ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.alignmentOptimism * 45 +
        input.alignmentConfidence * 35 -
        input.segmentHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const alignmentFreeContribution = round2(
    clamp(
      ppgScore * 0.2 +
        fidelityScore * 0.2 +
        ecgScore * 0.2 +
        completenessScore * 0.2 +
        alignmentScore * 0.2,
      0,
      100,
    ),
  );
  const alignmentDependentContribution = round2(
    clamp(
      alignmentScore * 0.55 +
        input.alignmentOptimism * 30 +
        input.alignmentConfidence * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      alignmentDependentContribution * (baseline ? 0.78 : 0.5) +
        alignmentFreeContribution * (baseline ? 0.22 : 0.5) -
        input.segmentHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "alignment_dependent_ppg_ecg_baseline",
    ppgScore,
    fidelityScore,
    ecgScore,
    completenessScore,
    alignmentScore,
    confidence,
    alignmentFreeContribution,
    alignmentDependentContribution,
    overall,
  };
}
