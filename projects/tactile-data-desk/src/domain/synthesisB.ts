/**
 * Dual-impl twin of synthesis.ts — must agree on all golden fixtures.
 * Alternate formulation: confirm via running address totals; means via
 * iterative accumulation instead of Array.reduce mean.
 */
import {
  confirmable,
  speechOnlyAnswer,
  type StrategyScore,
  type TactileInput,
  type TactileResult,
  type ChartPoint,
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

function meanIter(xs: number[]): number {
  if (xs.length === 0) return 0;
  let sum = 0;
  let n = 0;
  for (const x of xs) {
    sum += x;
    n += 1;
  }
  return sum / n;
}

function groundedMeanB(points: ChartPoint[], minN: number): number {
  const kept: number[] = [];
  for (const p of points) {
    if (confirmable(p, minN)) kept.push(p.value);
  }
  const src = kept.length > 0 ? kept : points.map((p) => p.value);
  return round4(meanIter(src));
}

export function scoreSynthesisB(input: TactileInput): TactileResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true
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

  const k_total = points.length;
  let k_eligible = 0;
  for (const p of points) {
    if (confirmable(p, min_n)) k_eligible += 1;
  }
  const k_excluded = k_total - k_eligible;

  const trueGrounded = groundedMeanB(points, min_n);
  const speech = speechOnlyAnswer(points, bias_scale);
  const selectSkip = round4(meanIter(points.map((p) => p.value)));
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
