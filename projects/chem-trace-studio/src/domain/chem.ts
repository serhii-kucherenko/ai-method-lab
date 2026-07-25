import {
  type ChemInput,
  type ChemQuality,
  biasWeight,
  clamp,
  round2,
  transitionLoad,
} from "./types";

/**
 * Typed trace-state validated scorer (good path A):
 * rewards pack coverage, rule fidelity, recovery clarity, run stability.
 */
export function scoreTypedTraceValidated(input: ChemInput): ChemQuality {
  const only = input.profile === "typed_trace_validated";
  const boost = only ? 1.12 : 0.96;
  const wT = biasWeight(input.traceBias, "trace_first");
  const wR = biasWeight(input.traceBias, "recovery_first");
  const wU = biasWeight(input.traceBias, "ungated_first");
  const avgBias = (wT + wR + wU) / 3;
  const load = transitionLoad(input.transitionHardness, input.packCoverage);

  const ruleCoverage = round2(
    clamp(
      (input.packCoverage * 55 +
        input.ruleFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (only ? 8 : 0) -
        input.overclaimRisk * (only ? 6 : 14) -
        (input.traceBias === "ungated_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const traceDiagnosis = round2(
    clamp(
      input.ruleFidelity * 60 * boost +
        input.packCoverage * 25 +
        (only ? 8 : 0) -
        input.skipOptimism * (only ? 4 : 16) -
        (input.traceBias === "ungated_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const recoveryOptScore = round2(
    clamp(
      input.recoveryClarity * 58 * boost * wR +
        input.packCoverage * 28 +
        (only ? 10 : 0) -
        load * 12 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.runStability * 50 * boost * wT +
        input.ruleFidelity * 25 +
        input.packCoverage * 15 +
        (only ? 8 : 0) -
        (input.traceBias === "ungated_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const ungatedScore = round2(
    clamp(
      input.ungatedPassRate * 55 * boost +
        input.skipOptimism * 20 -
        input.transitionHardness * 18 -
        (only ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.packCoverage * 40 +
        input.ruleFidelity * 30 +
        input.recoveryClarity * 25 -
        input.skipOptimism * 15,
      0,
      100,
    ),
  );
  const validatedContribution = round2(
    clamp(
      ruleCoverage * 0.26 +
        traceDiagnosis * 0.24 +
        recoveryOptScore * 0.28 +
        packIntegrity * 0.22,
      0,
      100,
    ),
  );
  const ungatedContribution = round2(
    clamp(
      ungatedScore * 0.7 +
        input.ungatedPassRate * 20 +
        input.skipOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      validatedContribution * (only ? 0.82 : 0.4) +
        ungatedContribution * (only ? 0.18 : 0.6) +
        (only ? 4 : 0) -
        (input.traceBias === "ungated_first" && only ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "typed_trace_validated",
    ruleCoverage,
    traceDiagnosis,
    recoveryOptScore,
    packIntegrity,
    ungatedScore,
    confidence,
    validatedContribution,
    ungatedContribution,
    overall,
  };
}

/**
 * Ungated agent baseline (path B):
 * rewards ungated pass rate + skip optimism, weak on typed-trace honesty.
 */
export function scoreUngatedAgent(input: ChemInput): ChemQuality {
  const ungated = input.profile === "ungated_agent";
  const boost = ungated ? 1.08 : 0.92;
  const wU = biasWeight(input.traceBias, "ungated_first");
  const load = transitionLoad(input.transitionHardness, input.packCoverage);

  const ruleCoverage = round2(
    clamp(
      input.ungatedPassRate * 35 * boost +
        wU * 10 -
        input.transitionHardness * 22 -
        input.overclaimRisk * 12 -
        (input.traceBias === "trace_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const traceDiagnosis = round2(
    clamp(
      input.skipOptimism * 40 * boost +
        input.ungatedPassRate * 25 -
        load * 15 -
        input.packCoverage * 8,
      0,
      100,
    ),
  );
  const recoveryOptScore = round2(
    clamp(
      input.skipOptimism * 38 * boost +
        input.ungatedPassRate * 20 -
        input.recoveryClarity * (ungated ? 5 : 0) -
        load * 18 -
        (ungated ? 0 : 6),
      0,
      100,
    ),
  );
  const packIntegrity = round2(
    clamp(
      input.ungatedPassRate * 42 * boost +
        input.skipOptimism * 28 -
        input.packCoverage * 10 +
        (ungated ? 5 : 0),
      0,
      100,
    ),
  );
  const ungatedScore = round2(
    clamp(
      input.ungatedPassRate * 58 * boost * wU +
        input.skipOptimism * 32 -
        input.transitionHardness * 10 +
        (ungated ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.skipOptimism * 45 +
        input.ungatedPassRate * 35 -
        input.transitionHardness * 20 -
        input.overclaimRisk * 10,
      0,
      100,
    ),
  );
  const validatedContribution = round2(
    clamp(
      ruleCoverage * 0.2 +
        traceDiagnosis * 0.2 +
        recoveryOptScore * 0.2 +
        packIntegrity * 0.2 +
        ungatedScore * 0.2,
      0,
      100,
    ),
  );
  const ungatedContribution = round2(
    clamp(
      ungatedScore * 0.55 +
        input.skipOptimism * 30 +
        input.ungatedPassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      ungatedContribution * (ungated ? 0.78 : 0.5) +
        validatedContribution * (ungated ? 0.22 : 0.5) -
        input.transitionHardness * 8 -
        input.overclaimRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "ungated_agent",
    ruleCoverage,
    traceDiagnosis,
    recoveryOptScore,
    packIntegrity,
    ungatedScore,
    confidence,
    validatedContribution,
    ungatedContribution,
    overall,
  };
}
