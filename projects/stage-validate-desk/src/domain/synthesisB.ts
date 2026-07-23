/**
 * Dual-impl twin of synthesis.ts — must agree on all golden fixtures.
 * Alternate formulation: stage costs via iterative accumulation;
 * tolerance applied as stepwise clamps instead of direct add.
 */
import {
  confirmable,
  matchEffect,
  misalignmentCost,
  preferencePreset,
  type ChartPoint,
  type StageAxes,
  type StageInput,
  type StageResult,
  type StrategyScore,
} from "./synthesis";

const DEFAULT_CORPUS = "default";
const DEFAULT_MIN_N = 40;
const DEFAULT_BIAS = 1.2;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

function buildChartB(
  corpus: string,
  minN: number,
  biasScale: number,
): ChartPoint[] {
  const presets: Record<
    string,
    { k: number; base: number; layers: number; hard: number[] }
  > = {
    default: { k: 8, base: 42, layers: 4, hard: [0, 3] },
    longctx: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    quant4: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    kernel: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    shortbench: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    port: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    memory: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    latency: { k: 7, base: 40, layers: 3, hard: [2] },
    small: { k: 4, base: 28, layers: 3, hard: [1] },
    large: { k: 12, base: 55, layers: 5, hard: [2, 5, 9] },
    homogeneous: { k: 6, base: 40, layers: 4, hard: [] },
    contaminated: { k: 10, base: 35, layers: 4, hard: [0, 1, 2, 7] },
    sparse: { k: 5, base: 22, layers: 2, hard: [0, 4] },
    highrisk: { k: 9, base: 50, layers: 5, hard: [0, 3, 6] },
    techlean: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    workplace: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    policing: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    warfare: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    healthcare: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    education: { k: 6, base: 36, layers: 3, hard: [0, 4] },
    finance: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    transport: { k: 7, base: 40, layers: 3, hard: [2] },
  };
  const p = presets[corpus] ?? {
    k: 6 + (corpus.length % 5),
    base: 30 + (corpus.length % 7) * 3,
    layers: 2 + (corpus.length % 4),
    hard: [0, Math.min(2, corpus.length % 4)],
  };

  const points: ChartPoint[] = [];
  for (let i = 0; i < p.k; i++) {
    const isHard = p.hard.includes(i);
    const layer = Math.max(0, (i % p.layers) - (isHard ? 1 : 0));
    const jitter = ((i % 5) - 2) * 1.4;
    const value = round4(
      p.base + (i % 4) * 3.5 + jitter - (isHard ? biasScale * 4 : 0),
    );
    points.push({ layer, index: i, value });
    void minN;
  }
  return points;
}

function countEligible(points: ChartPoint[], minN: number): number {
  let n = 0;
  for (const p of points) {
    if (confirmable(p, minN)) n += 1;
  }
  return n;
}

function meanAxes(prefs: StageAxes): number {
  let sum = 0;
  sum += prefs.stage_gate;
  sum += prefs.long_context;
  sum += prefs.bit_measure;
  return sum / 3;
}

export function scoreSynthesisB(input: StageInput): StageResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.skip_gates_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const corpus = String(input.corpus ?? DEFAULT_CORPUS).trim() || DEFAULT_CORPUS;
  const rawMin = Number(input.min_n ?? DEFAULT_MIN_N);
  const min_n = !Number.isFinite(rawMin)
    ? DEFAULT_MIN_N
    : Math.max(10, Math.min(200, Math.floor(rawMin)));
  const rawBias = Number(input.bias_scale ?? DEFAULT_BIAS);
  const bias_scale = !Number.isFinite(rawBias)
    ? DEFAULT_BIAS
    : Math.max(0.5, Math.min(3, Number(rawBias.toFixed(4))));

  const points =
    Array.isArray(input.points) && input.points.length > 0
      ? input.points.map((p) => ({
          layer: Math.max(0, Math.floor(Number(p.layer))),
          index: Math.max(0, Math.floor(Number(p.index))),
          value: Number(p.value),
        }))
      : buildChartB(corpus, min_n, bias_scale);

  const base = preferencePreset(corpus);
  const risk_perception = round4(min_n / 100);
  const gateBoost = risk_perception * 0.25;
  const prefs: StageAxes = {
    stage_gate: clamp01(
      input.stage_gate_lean !== undefined
        ? Number(input.stage_gate_lean)
        : base.stage_gate + gateBoost,
    ),
    long_context: clamp01(
      input.long_context_lean !== undefined
        ? Number(input.long_context_lean)
        : base.long_context,
    ),
    bit_measure: clamp01(
      input.bit_measure_lean !== undefined
        ? Number(input.bit_measure_lean)
        : base.bit_measure,
    ),
  };

  const k_total = points.length;
  const k_eligible = countEligible(points, min_n);
  const k_excluded = k_total - k_eligible;
  const extreme = clamp01(0.08 * bias_scale);

  const naiveIntuition: StageAxes = {
    stage_gate: extreme,
    long_context: extreme,
    bit_measure: extreme,
  };
  const assume4bit: StageAxes = {
    stage_gate: prefs.stage_gate,
    long_context: prefs.long_context,
    bit_measure: extreme,
  };
  const assumeHandGemm: StageAxes = {
    stage_gate: prefs.stage_gate,
    long_context: extreme,
    bit_measure: prefs.bit_measure,
  };
  const gated: StageAxes = {
    stage_gate: prefs.stage_gate,
    long_context: prefs.long_context,
    bit_measure: prefs.bit_measure,
  };

  const naiveRisk = misalignmentCost(prefs, naiveIntuition, bias_scale);
  const bitRisk = misalignmentCost(prefs, assume4bit, bias_scale);
  const gemmRisk = misalignmentCost(prefs, assumeHandGemm, bias_scale);
  const gatedRisk = round2(
    misalignmentCost(prefs, gated, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "naive_intuition",
    effect: matchEffect(prefs, naiveIntuition),
    k_used: k_total,
    risk_score: round2(naiveRisk * 0.96),
    action: "short_bench_skip_gates_trust_intuition",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "assume_4bit_faster",
    effect: matchEffect(prefs, assume4bit),
    k_used: k_total,
    risk_score: bitRisk,
    action: "assume_4bit_faster_skip_bit_measure",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "assume_hand_gemm",
    effect: matchEffect(prefs, assumeHandGemm),
    k_used: k_eligible,
    risk_score: gemmRisk,
    action: "assume_hand_gemm_ceiling_skip_long_ctx",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "stage_gated",
    effect: matchEffect(prefs, gated),
    k_used: k_eligible,
    risk_score: gatedRisk,
    action: "stage_gate_plus_tiered_measurements",
    screened: true,
  };

  const mu = round4(meanAxes(prefs));
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - gatedRisk) * 0.01));
  let qAcc = 0;
  qAcc += Math.abs(prefs.stage_gate - extreme);
  qAcc += Math.abs(prefs.long_context - extreme);
  qAcc += Math.abs(prefs.bit_measure - extreme);
  const q = round4(qAcc);
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );
  const bestNaive = Math.min(naive.risk_score, bitRisk, gemmRisk);

  return {
    status: "ok",
    corpus,
    min_n,
    bias_scale,
    k_total,
    k_eligible,
    k_excluded,
    mu,
    se,
    tau2,
    q,
    i2,
    prefs,
    risk_perception,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive.risk_score - gatedRisk),
    vs_best_naive: round2(bestNaive - gatedRisk),
  };
}

export function scoreGovernanceB(input: StageInput): StageResult {
  return scoreSynthesisB(input);
}

export function scoreTactileB(input: StageInput): StageResult {
  return scoreSynthesisB(input);
}

export function scoreStageB(input: StageInput): StageResult {
  return scoreSynthesisB(input);
}
