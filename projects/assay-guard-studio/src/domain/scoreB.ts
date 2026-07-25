import {
  type AssayInput,
  type AssayQuality,
  biasWeight,
  protocolLoad,
  clamp,
  round2,
} from "./types";

/**
 * Assay-aware protocol validation scorer (good path A):
 * rewards deck coverage, assay fidelity, and protocol integrity under hardness.
 */
export function scoreAssayAware(input: AssayInput): AssayQuality {
  const aware = input.profile === "assay_aware";
  const boost = aware ? 1.12 : 0.96;
  const wA = biasWeight(input.assayBias, "assay_strict");
  const wFirst = biasWeight(input.assayBias, "monitor_first");
  const wR = biasWeight(input.assayBias, "runner_first");
  const avgBias = (wA + wFirst + wR) / 3;
  const load = protocolLoad(input.protocolHardness, input.deckCoverage);

  const ruleCoverage = round2(
    clamp(
      (input.deckCoverage * 55 +
        input.assayFidelity * 25 -
        load * 10) *
        boost *
        avgBias +
        (aware ? 8 : 0) -
        input.leakageRisk * (aware ? 6 : 14) -
        (input.assayBias === "runner_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const assayDiagnosis = round2(
    clamp(
      input.assayFidelity * 60 * boost +
        input.deckCoverage * 25 +
        (aware ? 8 : 0) -
        input.skipOptimism * (aware ? 4 : 16) -
        (input.assayBias === "runner_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const protocolOptScore = round2(
    clamp(
      input.protocolIntegrity * 58 * boost * wFirst +
        input.deckCoverage * 28 +
        (aware ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const deckIntegrity = round2(
    clamp(
      input.assayFit * 50 * boost * wA +
        input.assayFidelity * 25 +
        input.deckCoverage * 15 +
        (aware ? 8 : 0) -
        (input.assayBias === "runner_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const runnerScore = round2(
    clamp(
      input.naivePassRate * 55 * boost +
        input.skipOptimism * 20 -
        input.protocolHardness * 18 -
        (aware ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.deckCoverage * 40 +
        input.assayFidelity * 30 +
        input.assayFit * 25 -
        input.skipOptimism * 15,
      0,
      100,
    ),
  );
  const assayContribution = round2(
    clamp(
      ruleCoverage * 0.26 +
        assayDiagnosis * 0.24 +
        protocolOptScore * 0.28 +
        deckIntegrity * 0.22,
      0,
      100,
    ),
  );
  const runnerContribution = round2(
    clamp(
      runnerScore * 0.7 +
        input.naivePassRate * 20 +
        input.skipOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      assayContribution * (aware ? 0.82 : 0.4) +
        runnerContribution * (aware ? 0.18 : 0.6) +
        (aware ? 4 : 0) -
        (input.assayBias === "runner_first" && aware ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "assay_aware",
    ruleCoverage,
    assayDiagnosis,
    protocolOptScore,
    deckIntegrity,
    runnerScore,
    confidence,
    assayContribution,
    runnerContribution,
    overall,
  };
}

/**
 * Naive protocol runner (path B):
 * rewards naive pass rate + skip optimism, weak on assay honesty.
 */
export function scoreNaiveProtocolRunner(input: AssayInput): AssayQuality {
  const runner = input.profile === "naive_protocol_runner";
  const boost = runner ? 1.08 : 0.92;
  const wR = biasWeight(input.assayBias, "runner_first");
  const load = protocolLoad(input.protocolHardness, input.deckCoverage);

  const ruleCoverage = round2(
    clamp(
      input.naivePassRate * 35 * boost +
        wR * 10 -
        input.protocolHardness * 22 -
        input.leakageRisk * 12 -
        (input.assayBias === "assay_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const assayDiagnosis = round2(
    clamp(
      input.skipOptimism * 40 * boost +
        input.naivePassRate * 25 -
        load * 15 -
        input.deckCoverage * 8,
      0,
      100,
    ),
  );
  const protocolOptScore = round2(
    clamp(
      input.skipOptimism * 38 * boost +
        input.naivePassRate * 20 -
        input.assayFit * (runner ? 5 : 0) -
        load * 18 -
        (runner ? 0 : 6),
      0,
      100,
    ),
  );
  const deckIntegrity = round2(
    clamp(
      input.naivePassRate * 42 * boost +
        input.skipOptimism * 28 -
        input.deckCoverage * 10 +
        (runner ? 5 : 0),
      0,
      100,
    ),
  );
  const runnerScore = round2(
    clamp(
      input.naivePassRate * 58 * boost * wR +
        input.skipOptimism * 32 -
        input.protocolHardness * 10 +
        (runner ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.skipOptimism * 45 +
        input.naivePassRate * 35 -
        input.protocolHardness * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const assayContribution = round2(
    clamp(
      ruleCoverage * 0.2 +
        assayDiagnosis * 0.2 +
        protocolOptScore * 0.2 +
        deckIntegrity * 0.2 +
        runnerScore * 0.2,
      0,
      100,
    ),
  );
  const runnerContribution = round2(
    clamp(
      runnerScore * 0.55 +
        input.skipOptimism * 30 +
        input.naivePassRate * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      runnerContribution * (runner ? 0.78 : 0.5) +
        assayContribution * (runner ? 0.22 : 0.5) -
        input.protocolHardness * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_protocol_runner",
    ruleCoverage,
    assayDiagnosis,
    protocolOptScore,
    deckIntegrity,
    runnerScore,
    confidence,
    assayContribution,
    runnerContribution,
    overall,
  };
}
