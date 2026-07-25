import {
  type ProbeInput,
  type ProbeQuality,
  biasWeight,
  clamp,
  mechanismLoad,
  round2,
} from "./types";

/**
 * Interpretable genomic FM probe scorer (good path A):
 * rewards panel coverage, probe fidelity, mechanism clarity, run stability.
 */
export function scoreInterpretableFmProbe(input: ProbeInput): ProbeQuality {
  const only = input.profile === "interpretable_fm_probe";
  const boost = only ? 1.12 : 0.96;
  const wP = biasWeight(input.probeBias, "probe_first");
  const wM = biasWeight(input.probeBias, "mechanism_first");
  const wO = biasWeight(input.probeBias, "opaque_first");
  const avgBias = (wP + wM + wO) / 3;
  const load = mechanismLoad(input.mechanismHardness, input.panelCoverage);

  const probeCoverage = round2(
    clamp(
      (input.panelCoverage * 55 +
        input.probeFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.probeBias === "opaque_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const probeScore = round2(
    clamp(
      input.probeFidelity * 60 * boost +
        input.panelCoverage * 25 +
        (only ? 8 : 0) -
        input.skipOptimism * (only ? 4 : 16) -
        (input.probeBias === "opaque_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const mechanismOptScore = round2(
    clamp(
      input.mechanismClarity * 58 * boost * wM +
        input.panelCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.runStability * 50 * boost * wP +
        input.probeFidelity * 25 +
        input.panelCoverage * 15 +
        (only ? 8 : 0) -
        (input.probeBias === "opaque_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const opaqueBaselineScore = round2(
    clamp(
      input.opaqueBaselineRate * 55 * boost +
        input.skipOptimism * 20 -
        input.mechanismHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.panelCoverage * 40 +
        input.probeFidelity * 30 +
        input.mechanismClarity * 25 -
        input.skipOptimism * 15,
      0,
      100,
    ),
  );
  const probeContribution = round2(
    clamp(
      probeCoverage * 0.26 +
        probeScore * 0.24 +
        mechanismOptScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const opaqueContribution = round2(
    clamp(
      opaqueBaselineScore * 0.7 +
        input.opaqueBaselineRate * 20 +
        input.skipOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      probeContribution * (only ? 0.82 : 0.4) +
        opaqueContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.probeBias === "opaque_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "interpretable_fm_probe",
    probeCoverage,
    probeScore,
    mechanismOptScore,
    packIntegrity,
    opaqueBaselineScore,
    confidence,
    probeContribution,
    opaqueContribution,
    overall,
  };
}

/**
 * Opaque pathogenicity baseline (path B):
 * rewards opaque pass rate + skip optimism, weak on probe honesty.
 */
export function scoreOpaquePathogenicity(input: ProbeInput): ProbeQuality {
  const opaque = input.profile === "opaque_pathogenicity_baseline";
  const boost = opaque ? 1.08 : 0.92;
  const wO = biasWeight(input.probeBias, "opaque_first");
  const load = mechanismLoad(input.mechanismHardness, input.panelCoverage);

  const probeCoverage = round2(
    clamp(
      input.opaqueBaselineRate * 35 * boost +
        wO * 10 -
        input.mechanismHardness * 22 -
        input.overclaimRisk * 12 -
        (input.probeBias === "probe_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const probeScore = round2(
    clamp(
      input.skipOptimism * 40 * boost +
        input.opaqueBaselineRate * 25 -
        load * 15 -
        input.panelCoverage * 8,
      0,
      100,
    ),
  );
  const mechanismOptScore = round2(
    clamp(
      input.skipOptimism * 38 * boost +
        input.opaqueBaselineRate * 20 -
        input.mechanismClarity * (opaque ? 5 : 0) -
        load * 18 -
        (opaque ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.opaqueBaselineRate * 42 * boost +
        input.skipOptimism * 28 -
        input.panelCoverage * 10 +
        (opaque ? 5 : 0),
      0,
      100,
    ),
  );
  const opaqueBaselineScore = round2(
    clamp(
      input.opaqueBaselineRate * 58 * boost * wO +
        input.skipOptimism * 32 -
        input.mechanismHardness * 10 +
        (opaque ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.skipOptimism * 45 +
        input.opaqueBaselineRate * 35 -
        input.mechanismHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const probeContribution = round2(
    clamp(
      probeCoverage * 0.2 +
        probeScore * 0.2 +
        mechanismOptScore * 0.2 +
        packIntegrity * 0.2 +
        opaqueBaselineScore * 0.2,
      0,
      100,
    ),
  );
  const opaqueContribution = round2(
    clamp(
      opaqueBaselineScore * 0.55 +
        input.skipOptimism * 30 +
        input.opaqueBaselineRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      opaqueContribution * (opaque ? 0.78 : 0.5) +
        probeContribution * (opaque ? 0.22 : 0.5) -
        input.mechanismHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "opaque_pathogenicity_baseline",
    probeCoverage,
    probeScore,
    mechanismOptScore,
    packIntegrity,
    opaqueBaselineScore,
    confidence,
    probeContribution,
    opaqueContribution,
    overall,
  };
}
