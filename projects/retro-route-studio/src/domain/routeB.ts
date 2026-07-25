import {
  type RouteInput,
  type RouteQuality,
  biasWeight,
  clamp,
  deadEndLoad,
  round2,
} from "./types";

/**
 * Structured-memory agentic retrosynthesis (good path A):
 * rewards global search-state use — tried routes, intermediate properties,
 * branch avoidance — and discounts greedy single-step fluency.
 */
export function scoreStructuredMemory(input: RouteInput): RouteQuality {
  const mem = input.profile === "structured_memory";
  const boost = mem ? 1.12 : 0.96;
  const wM = biasWeight(input.memoryBias, "memory_first");
  const wI = biasWeight(input.memoryBias, "intermediate_first");
  const wG = biasWeight(input.memoryBias, "greedy_first");
  const avgBias = (wM + wI + wG) / 3;
  const pressure = deadEndLoad(input.deadEndPressure, input.branchAvoidance);

  const memoryScore = round2(
    clamp(
      (input.memoryCoverage * 55 +
        input.triedPathRecall * 25 -
        pressure * 10) *
        boost *
        avgBias +
        (mem ? 8 : 0) -
        input.routeDrift * (mem ? 6 : 14) -
        (input.memoryBias === "greedy_first" ? 12 : 0),
      0,
      100,
    ),
  );
  const intermediateScore = round2(
    clamp(
      input.intermediateCoverage * 60 * boost +
        input.routeCoherence * 25 +
        (mem ? 8 : 0) -
        input.singleStepFluency * (mem ? 4 : 16) -
        (input.memoryBias === "greedy_first" ? 10 : 0),
      0,
      100,
    ),
  );
  const branchScore = round2(
    clamp(
      input.branchAvoidance * 58 * boost * wI +
        input.triedPathRecall * 28 +
        (mem ? 10 : 0) -
        pressure * 12 -
        input.routeDrift * 10,
      0,
      100,
    ),
  );
  const routeIntegrity = round2(
    clamp(
      input.routeCoherence * 50 * boost * wM +
        input.intermediateCoverage * 25 +
        input.memoryCoverage * 15 +
        (mem ? 8 : 0) -
        (input.memoryBias === "greedy_first" ? 14 : 0),
      0,
      100,
    ),
  );
  const greedyLocalScore = round2(
    clamp(
      input.localGreedyFit * 55 * boost +
        input.singleStepFluency * 20 -
        input.deadEndPressure * 18 -
        (mem ? 6 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.triedPathRecall * 40 +
        input.routeCoherence * 30 +
        input.branchAvoidance * 25 -
        input.singleStepFluency * 15,
      0,
      100,
    ),
  );
  const structuredContribution = round2(
    clamp(
      memoryScore * 0.26 +
        intermediateScore * 0.24 +
        branchScore * 0.28 +
        routeIntegrity * 0.22,
      0,
      100,
    ),
  );
  const naiveContribution = round2(
    clamp(
      greedyLocalScore * 0.7 +
        input.localGreedyFit * 20 +
        input.singleStepFluency * 10 -
        pressure * 12,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      structuredContribution * (mem ? 0.82 : 0.4) +
        naiveContribution * (mem ? 0.18 : 0.6) +
        (mem ? 4 : 0) -
        (input.memoryBias === "greedy_first" && mem ? 3 : 0),
      0,
      100,
    ),
  );

  return {
    mode: "structured_memory",
    memoryScore,
    intermediateScore,
    branchScore,
    routeIntegrity,
    greedyLocalScore,
    confidence,
    structuredContribution,
    naiveContribution,
    overall,
  };
}

/**
 * Naive local / greedy reaction search baseline (path B):
 * rewards single-step fluency + local greedy fit; weak on global memory.
 */
export function scoreNaiveLocal(input: RouteInput): RouteQuality {
  const naive = input.profile === "naive_local";
  const boost = naive ? 1.08 : 0.92;
  const wG = biasWeight(input.memoryBias, "greedy_first");
  const pressure = deadEndLoad(input.deadEndPressure, input.branchAvoidance);

  const memoryScore = round2(
    clamp(
      input.localGreedyFit * 35 * boost +
        wG * 10 -
        input.deadEndPressure * 22 -
        input.routeDrift * 12 -
        (input.memoryBias === "memory_first" ? 8 : 0),
      0,
      100,
    ),
  );
  const intermediateScore = round2(
    clamp(
      input.singleStepFluency * 40 * boost +
        input.localGreedyFit * 25 -
        pressure * 15 -
        input.intermediateCoverage * 8,
      0,
      100,
    ),
  );
  const branchScore = round2(
    clamp(
      input.singleStepFluency * 38 * boost +
        input.localGreedyFit * 20 -
        input.branchAvoidance * (naive ? 5 : 0) -
        pressure * 18 -
        (naive ? 0 : 6),
      0,
      100,
    ),
  );
  const routeIntegrity = round2(
    clamp(
      input.localGreedyFit * 42 * boost +
        input.singleStepFluency * 28 -
        input.routeCoherence * 10 +
        (naive ? 5 : 0),
      0,
      100,
    ),
  );
  const greedyLocalScore = round2(
    clamp(
      input.localGreedyFit * 58 * boost * wG +
        input.singleStepFluency * 32 -
        input.deadEndPressure * 10 +
        (naive ? 8 : 0),
      0,
      100,
    ),
  );
  const confidence = round2(
    clamp(
      input.singleStepFluency * 45 +
        input.localGreedyFit * 35 -
        input.deadEndPressure * 20 -
        input.routeDrift * 10,
      0,
      100,
    ),
  );
  const structuredContribution = round2(
    clamp(
      memoryScore * 0.2 +
        intermediateScore * 0.2 +
        branchScore * 0.2 +
        routeIntegrity * 0.2 +
        greedyLocalScore * 0.2,
      0,
      100,
    ),
  );
  const naiveContribution = round2(
    clamp(
      greedyLocalScore * 0.55 +
        input.singleStepFluency * 30 +
        input.localGreedyFit * 20 -
        pressure * 8,
      0,
      100,
    ),
  );
  const overall = round2(
    clamp(
      naiveContribution * (naive ? 0.78 : 0.5) +
        structuredContribution * (naive ? 0.22 : 0.5) -
        input.deadEndPressure * 8 -
        input.routeDrift * 6,
      0,
      100,
    ),
  );

  return {
    mode: "naive_local",
    memoryScore,
    intermediateScore,
    branchScore,
    routeIntegrity,
    greedyLocalScore,
    confidence,
    structuredContribution,
    naiveContribution,
    overall,
  };
}
