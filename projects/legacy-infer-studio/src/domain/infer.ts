import {
  type InferInput,
  type InferQuality,
  clamp,
  round2,
} from "./types";

function stageBoost(stage: InferInput["stage"]): number {
  switch (stage) {
    case "vision_encode":
      return 0.96;
    case "token_merge":
      return 1.0;
    case "prefill":
      return 1.05;
    case "decode":
      return 1.02;
    default: {
      const _exhaustive: never = stage;
      return _exhaustive;
    }
  }
}

function residencySignal(input: InferInput): number {
  const headroom = clamp(input.vramGb - input.residentGb, -2, 2.5);
  const fit = clamp(55 + headroom * 28 - input.hostSpill * 22, 0, 100);
  return fit;
}

function throughputSignal(input: InferInput): number {
  const ctxPenalty = clamp(input.contextK / 10, 0, 1.2) * 18;
  return clamp(
    input.prefillThroughput * 42 +
      input.decodeThroughput * 36 +
      input.kernelEfficiency * 22 -
      ctxPenalty,
    0,
    100,
  );
}

/**
 * Stage-validated all-GPU plan quality (good path).
 * Resident weights + stage gates → fits tight VRAM without host spill.
 */
export function scoreStageValidated(input: InferInput): InferQuality {
  const validated = input.plan === "stage_validated";
  const boost = (validated ? 1.07 : 0.97) * stageBoost(input.stage);
  const residency = residencySignal(input);
  const thru = throughputSignal(input);

  const vramFit = round2(
    clamp(
      (residency * 0.55 +
        (1 - input.hostSpill) * 28 +
        Math.min(input.vramGb, 8) * 4) *
        boost -
        Math.max(0, input.residentGb - input.vramGb) * 18,
      0,
      100,
    ),
  );

  const stagePass = round2(
    clamp(
      (input.stageAgreement * 48 +
        input.visionPortFit * 22 +
        input.kernelEfficiency * 18 +
        (validated ? 10 : 2)) *
        boost,
      0,
      100,
    ),
  );

  const kernelScore = round2(
    clamp(
      (input.kernelEfficiency * 44 +
        input.prefillThroughput * 26 +
        input.decodeThroughput * 18) *
        boost -
        clamp(input.contextK / 10, 0, 1) * 8,
      0,
      100,
    ),
  );

  const throughputScore = round2(
    clamp(thru * boost * 0.92 + input.stageAgreement * 8, 0, 100),
  );

  const visionScore = round2(
    clamp(
      (input.visionPortFit * 46 +
        input.stageAgreement * 28 +
        (1 - input.hostSpill) * 14) *
        boost,
      0,
      100,
    ),
  );

  const spillRisk = round2(
    clamp(
      100 -
        (input.hostSpill * 55 +
          Math.max(0, input.residentGb - input.vramGb * 0.9) * 22 +
          (validated ? 0 : 12)),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      vramFit * 0.22 +
        stagePass * 0.2 +
        kernelScore * 0.16 +
        throughputScore * 0.16 +
        visionScore * 0.14 +
        spillRisk * 0.12,
      0,
      100,
    ),
  );

  return {
    mode: "stage_validated",
    vramFit,
    stagePass,
    kernelScore,
    throughputScore,
    visionScore,
    spillRisk,
    overall,
  };
}

/**
 * Naive offload baseline — streams weights / decode to host, OOM risk.
 */
export function scoreNaiveOffload(input: InferInput): InferQuality {
  const spillPenalty = clamp(
    0.38 +
      input.hostSpill * 0.28 +
      Math.max(0, input.residentGb - input.vramGb) * 0.12 +
      (1 - input.stageAgreement) * 0.14,
    0.28,
    0.94,
  );
  const thru = throughputSignal(input);

  const vramFit = round2(
    clamp(
      (residencySignal(input) * 0.35 + (1 - input.hostSpill) * 12) *
        spillPenalty,
      0,
      100,
    ),
  );

  const stagePass = round2(
    clamp(
      (input.stageAgreement * 22 + input.visionPortFit * 12) * spillPenalty,
      0,
      100,
    ),
  );

  const kernelScore = round2(
    clamp(
      (input.kernelEfficiency * 20 + input.prefillThroughput * 14) *
        spillPenalty,
      0,
      100,
    ),
  );

  const throughputScore = round2(
    clamp(
      thru * spillPenalty * 0.55 +
        input.decodeThroughput * 10 -
        (input.plan === "naive_offload" ? 0 : 3),
      0,
      100,
    ),
  );

  const visionScore = round2(
    clamp(
      (input.visionPortFit * 24 + input.stageAgreement * 10) * spillPenalty,
      0,
      100,
    ),
  );

  const spillRisk = round2(
    clamp(
      100 -
        (input.hostSpill * 72 +
          Math.max(0, input.residentGb - input.vramGb * 0.75) * 28 +
          16),
      0,
      100,
    ),
  );

  const overall = round2(
    clamp(
      vramFit * 0.14 +
        stagePass * 0.1 +
        kernelScore * 0.12 +
        throughputScore * 0.22 +
        visionScore * 0.12 +
        spillRisk * 0.3,
      0,
      100,
    ),
  );

  return {
    mode: "naive_offload",
    vramFit,
    stagePass,
    kernelScore,
    throughputScore,
    visionScore,
    spillRisk,
    overall,
  };
}
