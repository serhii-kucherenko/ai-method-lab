/**
 * Touch-first chart sensemaking vs speech-only (paper-inspired).
 * Soft RTD layers: select → confirm → ask agent → verify on chart.
 * Lab method experiment — never brand Feelogue / CTDI / Dot Pad as the product.
 */

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type TactileInput = {
  /** Preset chart id (see buildChart). */
  corpus?: string;
  points?: ChartPoint[];
  /** Soft layer count / resolution floor for confirmable selection. */
  min_n?: number;
  /** How strongly speech-only invents values away from the chart. */
  bias_scale?: number;
  /** Claim verification always passes without chart check — must reject. */
  skip_verify_cheat?: boolean;
  /** Alias kept for harness compatibility with prior desks. */
  perfect_homogeneity_cheat?: boolean;
};

export type StrategyLabel =
  | "speech_only_ungrounded"
  | "select_skip_confirm"
  | "agent_no_verify"
  | "grounded_select_confirm_verify";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type TactileOk = {
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
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type TactileReject = {
  status: "reject";
  reason: string;
};

export type TactileResult = TactileOk | TactileReject;

/** Compatibility aliases used by goldens / store. */
export type SynthesisInput = TactileInput;
export type SynthesisResult = TactileResult;
export type StudyRow = ChartPoint;

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

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/**
 * Soft layered chart: each point has a layer (RTD height) and bar value.
 * Points with layer*10 + index*3 below min_n are hard to confirm (ambiguous).
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
    small: { k: 4, base: 28, layers: 3, hard: [1] },
    large: { k: 12, base: 55, layers: 5, hard: [2, 5, 9] },
    homogeneous: { k: 6, base: 40, layers: 4, hard: [] },
    contaminated: { k: 10, base: 35, layers: 4, hard: [0, 1, 2, 7] },
    sparse: { k: 5, base: 22, layers: 2, hard: [0, 4] },
    sales: { k: 9, base: 48, layers: 5, hard: [3, 8] },
    weather: { k: 7, base: 30, layers: 3, hard: [1, 4] },
    inventory: { k: 8, base: 38, layers: 4, hard: [2, 6] },
    survey: { k: 6, base: 25, layers: 3, hard: [0, 5] },
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

/** Confirmable when layered address clears the soft resolution floor. */
export function confirmable(p: ChartPoint, minN: number): boolean {
  const address = p.layer * 12 + p.index * 4 + 20;
  return address >= minN;
}

function resolve(input: TactileInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
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

  return { corpus, min_n, bias_scale, points };
}

/** True chart mean of confirmed points (or all if none confirmable). */
export function groundedMean(points: ChartPoint[], minN: number): number {
  const kept = points.filter((p) => confirmable(p, minN));
  const src = kept.length > 0 ? kept : points;
  return round4(mean(src.map((p) => p.value)));
}

/**
 * Speech-only invents a drifted answer — no tactile select/confirm/verify.
 */
export function speechOnlyAnswer(
  points: ChartPoint[],
  biasScale: number,
): number {
  const trueMean = mean(points.map((p) => p.value));
  const invent =
    trueMean +
    biasScale * (8 + points.length * 0.35) +
    (points.length % 3) * 1.2;
  return round4(invent);
}

export function scoreSynthesis(input: TactileInput): TactileResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points } = resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;

  const trueGrounded = groundedMean(points, min_n);
  const speech = speechOnlyAnswer(points, bias_scale);

  // Select without confirm: average all points including ambiguous layers.
  const selectSkip = round4(mean(points.map((p) => p.value)));

  // Agent after select but no verify: slight calc drift on confirmed set.
  const agentNoVerify = round4(
    trueGrounded + bias_scale * 1.5 + (k_excluded > 0 ? 0.8 : 0.2),
  );

  const verifyGap = Math.abs(agentNoVerify - trueGrounded);
  const speechGap = Math.abs(speech - trueGrounded);
  const skipGap = Math.abs(selectSkip - trueGrounded);

  const naive_risk = round2(
    speechGap * 4 + k_excluded * 6 + 18 + bias_scale * 8,
  );
  const skip_risk = round2(skipGap * 5 + k_excluded * 5 + 14 + bias_scale * 3);
  const no_verify_risk = round2(
    verifyGap * 20 + 10 + bias_scale * 2 + (k_excluded > 0 ? 4 : 0),
  );
  const grounded_risk = round2(
    4 + Math.min(6, k_excluded) * 0.5 + bias_scale * 0.4,
  );

  const naive: StrategyScore = {
    label: "speech_only_ungrounded",
    effect: speech,
    k_used: k_total,
    risk_score: naive_risk,
    action: "speech_answer_skip_tactile_grounding",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "select_skip_confirm",
    effect: selectSkip,
    k_used: k_total,
    risk_score: skip_risk,
    action: "touch_select_without_confirm",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "agent_no_verify",
    effect: agentNoVerify,
    k_used: k_eligible,
    risk_score: no_verify_risk,
    action: "ask_agent_skip_chart_verify",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "grounded_select_confirm_verify",
    effect: trueGrounded,
    k_used: k_eligible,
    risk_score: grounded_risk,
    action: "select_confirm_ask_verify_on_chart",
    screened: true,
  };

  const se = round4(0.4 + k_excluded * 0.08 + bias_scale * 0.05);
  const tau2 = round4(Math.max(0, (speechGap - verifyGap) * 0.1));
  const q = round4(speechGap + skipGap);
  const i2 = round2(Math.min(99, speechGap * 3 + k_excluded * 2));

  const bestNaive = Math.min(naive_risk, skip_risk, no_verify_risk);

  return {
    status: "ok",
    corpus,
    min_n,
    bias_scale,
    k_total,
    k_eligible,
    k_excluded,
    mu: trueGrounded,
    se,
    tau2,
    q,
    i2,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive_risk - grounded_risk),
    vs_best_naive: round2(bestNaive - grounded_risk),
  };
}

export function scoreTactile(input: TactileInput): TactileResult {
  return scoreSynthesis(input);
}
