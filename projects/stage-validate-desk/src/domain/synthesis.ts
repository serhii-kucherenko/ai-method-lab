/**
 * Stage-validated inference / port plan scoring (paper-inspired).
 * Axes: stage-gate strictness, long-context measurement, bit-width/kernel measure.
 * Stage-gated plan vs naive intuition (short-bench only, assume 4-bit faster,
 * assume hand GEMM is ceiling). Soft simulation — not real CUDA.
 * Never brand MiniCPM / Fermi / Tesla C2075 as the product name.
 */

export type StageAxes = {
  /** 0 = skip gates / intuition, 1 = gate every stage */
  stage_gate: number;
  /** 0 = short-bench only (2k stands in for 10k), 1 = tiered long-context measured */
  long_context: number;
  /** 0 = assume 4-bit / hand GEMM, 1 = bit-width + kernel measured */
  bit_measure: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = StageAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type StageInput = {
  /** Port / workload profile (default, longctx, quant4, kernel, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Tolerance floor (10–200); higher → stricter stage reference. */
  min_n?: number;
  /** How extreme naive intuition leans (0.5–3). */
  bias_scale?: number;
  stage_gate_lean?: number;
  long_context_lean?: number;
  bit_measure_lean?: number;
  /** Claim stage-gated while skipping gates — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  skip_gates_cheat?: boolean;
};

export type StrategyLabel =
  | "naive_intuition"
  | "assume_4bit_faster"
  | "assume_hand_gemm"
  | "stage_gated";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type StageOk = {
  status: "ok";
  corpus: string;
  min_n: number;
  bias_scale: number;
  k_total: number;
  k_eligible: number;
  k_excluded: number;
  mu: number;
  se: number;
  tau2: number;
  q: number;
  i2: number;
  prefs: StageAxes;
  risk_perception: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type StageReject = {
  status: "reject";
  reason: string;
};

export type StageResult = StageOk | StageReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = StageInput;
export type GovernanceResult = StageResult;
export type SynthesisInput = StageInput;
export type SynthesisResult = StageResult;
export type StudyRow = ChartPoint;
export type TactileInput = StageInput;
export type TactileResult = StageResult;

const DEFAULT_CORPUS = "default";
const DEFAULT_MIN_N = 40;
const DEFAULT_BIAS = 1.2;

const MIN_N_LO = 10;
const MIN_N_HI = 200;
const BIAS_LO = 0.5;
const BIAS_HI = 3;

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

/** Workload / port profile presets for stage-gate leans. */
export function preferencePreset(corpus: string): StageAxes {
  const presets: Record<string, StageAxes> = {
    default: { stage_gate: 0.62, long_context: 0.55, bit_measure: 0.48 },
    longctx: { stage_gate: 0.7, long_context: 0.88, bit_measure: 0.5 },
    quant4: { stage_gate: 0.58, long_context: 0.42, bit_measure: 0.82 },
    kernel: { stage_gate: 0.75, long_context: 0.5, bit_measure: 0.9 },
    shortbench: { stage_gate: 0.25, long_context: 0.15, bit_measure: 0.2 },
    port: { stage_gate: 0.8, long_context: 0.65, bit_measure: 0.7 },
    memory: { stage_gate: 0.66, long_context: 0.72, bit_measure: 0.55 },
    latency: { stage_gate: 0.6, long_context: 0.45, bit_measure: 0.68 },
    small: { stage_gate: 0.5, long_context: 0.45, bit_measure: 0.4 },
    large: { stage_gate: 0.72, long_context: 0.68, bit_measure: 0.62 },
    homogeneous: { stage_gate: 0.55, long_context: 0.55, bit_measure: 0.55 },
    contaminated: { stage_gate: 0.35, long_context: 0.3, bit_measure: 0.25 },
    sparse: { stage_gate: 0.8, long_context: 0.4, bit_measure: 0.7 },
    highrisk: { stage_gate: 0.9, long_context: 0.85, bit_measure: 0.75 },
    techlean: { stage_gate: 0.25, long_context: 0.2, bit_measure: 0.15 },
    // legacy governance corpus names still resolve for harness reuse
    workplace: { stage_gate: 0.58, long_context: 0.42, bit_measure: 0.35 },
    policing: { stage_gate: 0.78, long_context: 0.72, bit_measure: 0.5 },
    warfare: { stage_gate: 0.88, long_context: 0.82, bit_measure: 0.8 },
    healthcare: { stage_gate: 0.74, long_context: 0.68, bit_measure: 0.55 },
    education: { stage_gate: 0.6, long_context: 0.65, bit_measure: 0.45 },
    finance: { stage_gate: 0.7, long_context: 0.5, bit_measure: 0.6 },
    transport: { stage_gate: 0.66, long_context: 0.58, bit_measure: 0.52 },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    stage_gate: clamp01(0.4 + (h % 7) * 0.07),
    long_context: clamp01(0.35 + (h % 5) * 0.09),
    bit_measure: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in stage rows — eligibility = stage passes reference tolerance
 * under min_n floor. Soft simulation; not real CUDA.
 */
export function buildChart(
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

/** Stage row is clear enough under the reference tolerance floor. */
export function confirmable(p: ChartPoint, minN: number): boolean {
  const address = p.layer * 12 + p.index * 4 + 20;
  return address >= minN;
}

function resolve(input: StageInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: StageAxes;
  risk_perception: number;
} {
  const corpus = String(input.corpus ?? DEFAULT_CORPUS).trim() || DEFAULT_CORPUS;
  const rawMin = Number(input.min_n ?? DEFAULT_MIN_N);
  const min_n = !Number.isFinite(rawMin)
    ? DEFAULT_MIN_N
    : Math.max(MIN_N_LO, Math.min(MIN_N_HI, Math.floor(rawMin)));
  const rawBias = Number(input.bias_scale ?? DEFAULT_BIAS);
  const bias_scale = !Number.isFinite(rawBias)
    ? DEFAULT_BIAS
    : Math.max(BIAS_LO, Math.min(BIAS_HI, Number(rawBias.toFixed(4))));

  const points =
    Array.isArray(input.points) && input.points.length > 0
      ? input.points.map((p) => ({
          layer: Math.max(0, Math.floor(Number(p.layer))),
          index: Math.max(0, Math.floor(Number(p.index))),
          value: Number(p.value),
        }))
      : buildChart(corpus, min_n, bias_scale);

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

  return { corpus, min_n, bias_scale, points, prefs, risk_perception };
}

/** Misalignment cost of a plan vs stated stage / measure leans. */
export function misalignmentCost(
  prefs: StageAxes,
  proposal: StageAxes,
  biasScale: number,
): number {
  const ds = Math.abs(prefs.stage_gate - proposal.stage_gate);
  const dp = Math.abs(prefs.long_context - proposal.long_context);
  const di = Math.abs(prefs.bit_measure - proposal.bit_measure);
  return round2((ds * 42 + dp * 36 + di * 30) * biasScale + (ds + dp + di) * 8);
}

/** Plan-match effect (higher = closer to required measurements). */
export function matchEffect(prefs: StageAxes, proposal: StageAxes): number {
  const ds = 1 - Math.abs(prefs.stage_gate - proposal.stage_gate);
  const dp = 1 - Math.abs(prefs.long_context - proposal.long_context);
  const di = 1 - Math.abs(prefs.bit_measure - proposal.bit_measure);
  return round4((ds + dp + di) / 3);
}

export function scoreSynthesis(input: StageInput): StageResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.skip_gates_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points, prefs, risk_perception } =
    resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
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
  const gated: StageAxes = { ...prefs };

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

  const mu = round4(
    (prefs.stage_gate + prefs.long_context + prefs.bit_measure) / 3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - gatedRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.stage_gate - extreme) +
      Math.abs(prefs.long_context - extreme) +
      Math.abs(prefs.bit_measure - extreme),
  );
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

export function scoreGovernance(input: StageInput): StageResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: StageInput): StageResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: StageInput): StageResult {
  return scoreSynthesis(input);
}
