import {
  type DragWallInput,
  type DragWallQuality,
  biasWeight,
  clamp,
  dragLoad,
  round2,
} from "./types";

/**
 * ES closed-loop wall controller scorer (good path A):
 * rewards wall coverage, sensor fidelity, and channel fit under drag pressure.
 */
export function scoreEsClosedLoop(input: DragWallInput): DragWallQuality {
  const closed = input.profile === "es_closed_loop";
  const boost = closed ? 1.12 : 0.96;
  const wE = biasWeight(input.controlBias, "es_strict");
  const wS = biasWeight(input.controlBias, "sensor_first");
  const wO = biasWeight(input.controlBias, "open_loop_first");
  const avgBias = (wE + wS + wO) / 3;
  const load = dragLoad(input.dragPressure, input.wallCoverage);

  const dragDiagnosis = round2(
    clamp(
      (input.wallCoverage * 55 + input.sensorFidelity * 25 - load * 10) *
        boost *
        avgBias +
        (closed ? 8 : 0) -
        input.leakageRisk * (closed ? 6 : 14) -
        (input.controlBias === "open_loop_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const shearDiagnosis = round2(
    clamp(
      input.sensorFidelity * 60 * boost +
        input.wallCoverage * 25 +
        (closed ? 8 : 0) -
        input.openLoopOptimism * (closed ? 4 : 16) -
        (input.controlBias === "open_loop_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const actuatorReasonScore = round2(
    clamp(
      input.closedLoopAgreement * 58 * boost * wS +
        input.wallCoverage * 28 +
        (closed ? 10 : 0) -
        load * 12 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const sensorIntegrity = round2(
    clamp(
      input.channelFit * 50 * boost * wE +
        input.sensorFidelity * 25 +
        input.wallCoverage * 15 +
        (closed ? 8 : 0) -
        (input.controlBias === "open_loop_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const openLoopScore = round2(
    clamp(
      input.openLoopAccuracy * 55 * boost +
        input.openLoopOptimism * 20 -
        input.dragPressure * 18 -
        (closed ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.wallCoverage * 40 +
        input.sensorFidelity * 30 +
        input.channelFit * 25 -
        input.openLoopOptimism * 15,
      0,
      100,
    ),
  );
  const closedLoopContribution = round2(
    clamp(
      dragDiagnosis * 0.26 +
        shearDiagnosis * 0.24 +
        actuatorReasonScore * 0.28 +
        sensorIntegrity * 0.22,
      0,
      100,
    ),
  );
  const openLoopContribution = round2(
    clamp(
      openLoopScore * 0.7 +
        input.openLoopAccuracy * 20 +
        input.openLoopOptimism * 10 -
        load * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      closedLoopContribution * (closed ? 0.82 : 0.4) +
        openLoopContribution * (closed ? 0.18 : 0.6) +
        (closed ? 4 : 0) -
        (input.controlBias === "open_loop_first" && closed ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "es_closed_loop",
    dragDiagnosis,
    shearDiagnosis,
    actuatorReasonScore,
    sensorIntegrity,
    openLoopScore,
    confidence,
    closedLoopContribution,
    openLoopContribution,
    overall,
  };
}

/**
 * Open-loop / gradient baseline (path B):
 * rewards open-loop accuracy + optimism, weak on closed-loop honesty.
 */
export function scoreOpenLoopGradient(input: DragWallInput): DragWallQuality {
  const naive = input.profile === "open_loop_gradient";
  const boost = naive ? 1.08 : 0.92;
  const wO = biasWeight(input.controlBias, "open_loop_first");
  const load = dragLoad(input.dragPressure, input.wallCoverage);

  const dragDiagnosis = round2(
    clamp(
      input.openLoopAccuracy * 35 * boost +
        wO * 10 -
        input.dragPressure * 22 -
        input.leakageRisk * 12 -
        (input.controlBias === "es_strict" ? 8 : 0),
      0,
      100,
    ),
  );
  const shearDiagnosis = round2(
    clamp(
      input.openLoopOptimism * 40 * boost +
        input.openLoopAccuracy * 25 -
        load * 15 -
        input.wallCoverage * 8,
      0,
      100,
    ),
  );
  const actuatorReasonScore = round2(
    clamp(
      input.openLoopOptimism * 38 * boost +
        input.openLoopAccuracy * 20 -
        input.channelFit * (naive ? 5 : 0) -
        load * 18 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const sensorIntegrity = round2(
    clamp(
      input.openLoopAccuracy * 42 * boost +
        input.openLoopOptimism * 28 -
        input.wallCoverage * 10 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const openLoopScore = round2(
    clamp(
      input.openLoopAccuracy * 58 * boost * wO +
        input.openLoopOptimism * 32 -
        input.dragPressure * 10 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.openLoopOptimism * 45 +
        input.openLoopAccuracy * 35 -
        input.dragPressure * 20 -
        input.leakageRisk * 10,
      0,
      100,
    ),
  );
  const closedLoopContribution = round2(
    clamp(
      dragDiagnosis * 0.2 +
        shearDiagnosis * 0.2 +
        actuatorReasonScore * 0.2 +
        sensorIntegrity * 0.2 +
        openLoopScore * 0.2,
      0,
      100,
    ),
  );
  const openLoopContribution = round2(
    clamp(
      openLoopScore * 0.55 +
        input.openLoopOptimism * 30 +
        input.openLoopAccuracy * 20 -
        load * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      openLoopContribution * (naive ? 0.78 : 0.5) +
        closedLoopContribution * (naive ? 0.22 : 0.5) -
        input.dragPressure * 8 -
        input.leakageRisk * 6,
      0,
      100,
    ),
  );

  return {
    mode: "open_loop_gradient",
    dragDiagnosis,
    shearDiagnosis,
    actuatorReasonScore,
    sensorIntegrity,
    openLoopScore,
    confidence,
    closedLoopContribution,
    openLoopContribution,
    overall,
  };
}
