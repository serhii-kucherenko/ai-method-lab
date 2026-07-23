/**
 * Screened evidence synthesis vs naive pooling (paper-inspired).
 * Screen / eligibility → Hedges' g → DerSimonian–Laird random-effects
 * + heterogeneity, versus averaging reported numbers (skip screening).
 * Lab method experiment — never brand AutoSynthesis as the product.
 */

export type StudyRow = {
  mean_t: number;
  sd_t: number;
  n_t: number;
  mean_c: number;
  sd_c: number;
  n_c: number;
  /** Naive reported effect (often unstandardized / biased). */
  reported: number;
};

export type SynthesisInput = {
  /** Preset corpus id (see buildCorpus). */
  corpus?: string;
  studies?: StudyRow[];
  /** Minimum total n (n_t + n_c) for eligibility. */
  min_n?: number;
  /** How strongly ineligible studies inflate reported numbers. */
  bias_scale?: number;
  /** Claim I²=0 always — must reject. */
  perfect_homogeneity_cheat?: boolean;
};

export type StrategyLabel =
  | "naive_average_skip_screen"
  | "fixed_effect_include_ineligible"
  | "unweighted_eligible_mean"
  | "screened_random_effects";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type SynthesisOk = {
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
  /** Alias used by harness / goldens (naive average). */
  naive: StrategyScore;
  /** Screened random-effects path. */
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  /** Positive means screened lower risk than naive. */
  delta_score: number;
  /** Positive means screened beats best of three naive-ish baselines. */
  vs_best_naive: number;
};

export type SynthesisReject = {
  status: "reject";
  reason: string;
};

export type SynthesisResult = SynthesisOk | SynthesisReject;

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

/** Hedges' g with small-sample correction. */
export function hedgesG(s: StudyRow): { g: number; v: number } {
  const n = s.n_t + s.n_c;
  const df = Math.max(1, n - 2);
  const sp = Math.sqrt(
    ((s.n_t - 1) * s.sd_t * s.sd_t + (s.n_c - 1) * s.sd_c * s.sd_c) / df,
  );
  const d = sp > 0 ? (s.mean_t - s.mean_c) / sp : 0;
  const j = 1 - 3 / (4 * df - 1);
  const g = j * d;
  const v =
    n / Math.max(1, s.n_t * s.n_c) + (g * g) / (2 * Math.max(1, n));
  return { g: round4(g), v: Math.max(1e-8, round4(v)) };
}

/** DerSimonian–Laird random-effects pool. */
export function randomEffects(
  effects: { g: number; v: number }[],
): { mu: number; se: number; tau2: number; q: number; i2: number } {
  if (effects.length === 0) {
    return { mu: 0, se: 1, tau2: 0, q: 0, i2: 0 };
  }
  if (effects.length === 1) {
    const e = effects[0]!;
    return {
      mu: e.g,
      se: Math.sqrt(e.v),
      tau2: 0,
      q: 0,
      i2: 0,
    };
  }
  const weights = effects.map((e) => 1 / e.v);
  const sumW = weights.reduce((a, b) => a + b, 0);
  const muFixed = effects.reduce((a, e, i) => a + weights[i]! * e.g, 0) / sumW;
  const q = effects.reduce(
    (a, e, i) => a + weights[i]! * (e.g - muFixed) * (e.g - muFixed),
    0,
  );
  const sumW2 = weights.reduce((a, w) => a + w * w, 0);
  const c = sumW - sumW2 / sumW;
  const k = effects.length;
  const tau2 = Math.max(0, (q - (k - 1)) / Math.max(1e-12, c));
  const wStar = effects.map((e) => 1 / (e.v + tau2));
  const sumWs = wStar.reduce((a, b) => a + b, 0);
  const mu = effects.reduce((a, e, i) => a + wStar[i]! * e.g, 0) / sumWs;
  const se = Math.sqrt(1 / sumWs);
  const i2 = q <= k - 1 ? 0 : ((q - (k - 1)) / q) * 100;
  return {
    mu: round4(mu),
    se: round4(se),
    tau2: round4(tau2),
    q: round4(q),
    i2: round2(i2),
  };
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/**
 * Build a deterministic study corpus from a named preset + knobs.
 * Ineligible rows carry inflated `reported` numbers to teach screening.
 */
export function buildCorpus(
  corpus: string,
  minN: number,
  biasScale: number,
): StudyRow[] {
  const presets: Record<
    string,
    { k: number; trueG: number; baseN: number; bad: number[] }
  > = {
    default: { k: 8, trueG: 0.45, baseN: 60, bad: [0, 3] },
    small: { k: 4, trueG: 0.3, baseN: 35, bad: [1] },
    large: { k: 12, trueG: 0.55, baseN: 80, bad: [2, 5, 9] },
    homogeneous: { k: 6, trueG: 0.4, baseN: 70, bad: [] },
    contaminated: { k: 10, trueG: 0.35, baseN: 55, bad: [0, 1, 2, 7] },
    sparse: { k: 5, trueG: 0.25, baseN: 28, bad: [0, 4] },
    cardiology: { k: 9, trueG: 0.5, baseN: 90, bad: [3, 8] },
    oncology: { k: 7, trueG: 0.6, baseN: 50, bad: [1, 4] },
    education: { k: 8, trueG: 0.2, baseN: 45, bad: [2, 6] },
    nutrition: { k: 6, trueG: 0.15, baseN: 40, bad: [0, 5] },
  };
  const p = presets[corpus] ?? {
    k: 6 + (corpus.length % 5),
    trueG: 0.3 + (corpus.length % 7) * 0.05,
    baseN: 40 + (corpus.length % 6) * 8,
    bad: [0, Math.min(2, corpus.length % 4)],
  };

  const studies: StudyRow[] = [];
  for (let i = 0; i < p.k; i++) {
    const isBad = p.bad.includes(i);
    const n_t = Math.max(8, p.baseN + (i % 5) * 4 - (isBad ? 25 : 0));
    const n_c = Math.max(8, p.baseN - 5 + (i % 3) * 3 - (isBad ? 20 : 0));
    const sd_t = 1.0 + (i % 4) * 0.05;
    const sd_c = 1.0 + ((i + 1) % 4) * 0.05;
    // Approximate means so Hedges g ≈ trueG for eligible rows.
    const sp = Math.sqrt(
      ((n_t - 1) * sd_t * sd_t + (n_c - 1) * sd_c * sd_c) / (n_t + n_c - 2),
    );
    const jitter = ((i % 5) - 2) * 0.04;
    const delta = (p.trueG + jitter) * sp;
    const mean_c = 10;
    const mean_t = mean_c + delta;
    const honest = hedgesG({
      mean_t,
      sd_t,
      n_t,
      mean_c,
      sd_c,
      n_c,
      reported: 0,
    }).g;
    const reported = isBad
      ? round4(honest + biasScale * (0.8 + (i % 3) * 0.25))
      : round4(honest + ((i % 3) - 1) * 0.02);
    studies.push({
      mean_t: round4(mean_t),
      sd_t: round4(sd_t),
      n_t,
      mean_c: round4(mean_c),
      sd_c: round4(sd_c),
      n_c,
      reported,
    });
    void minN;
  }
  return studies;
}

function eligible(s: StudyRow, minN: number): boolean {
  return s.n_t + s.n_c >= minN;
}

function resolve(input: SynthesisInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  studies: StudyRow[];
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

  const studies =
    Array.isArray(input.studies) && input.studies.length > 0
      ? input.studies.map((s) => ({
          mean_t: Number(s.mean_t),
          sd_t: Math.max(0.01, Number(s.sd_t)),
          n_t: Math.max(2, Math.floor(Number(s.n_t))),
          mean_c: Number(s.mean_c),
          sd_c: Math.max(0.01, Number(s.sd_c)),
          n_c: Math.max(2, Math.floor(Number(s.n_c))),
          reported: Number(s.reported),
        }))
      : buildCorpus(corpus, min_n, bias_scale);

  return { corpus, min_n, bias_scale, studies };
}

export function scoreSynthesis(input: SynthesisInput): SynthesisResult {
  if (input.perfect_homogeneity_cheat === true) {
    return { status: "reject", reason: "perfect_homogeneity_cheat" };
  }

  const { corpus, min_n, bias_scale, studies } = resolve(input);
  const k_total = studies.length;
  const kept = studies.filter((s) => eligible(s, min_n));
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;

  const allG = studies.map((s) => hedgesG(s));
  const keptG = kept.map((s) => hedgesG(s));
  const re = randomEffects(keptG.length > 0 ? keptG : allG);

  const naiveEffect = round4(mean(studies.map((s) => s.reported)));
  // Force tau2=0 fixed-effect style for include-all baseline.
  const feMu =
    allG.length === 0
      ? 0
      : round4(
          allG.reduce((a, e) => a + (1 / e.v) * e.g, 0) /
            allG.reduce((a, e) => a + 1 / e.v, 0),
        );
  const unweighted = round4(mean(keptG.map((e) => e.g)));

  const contamination = Math.abs(naiveEffect - re.mu);
  const naive_risk = round2(
    contamination * 100 + k_excluded * 8 + 12 + Math.abs(naiveEffect) * 5,
  );
  const screened_risk = round2(re.se * 100 + re.i2 / 20 + Math.abs(re.mu) * 2);
  const fe_risk = round2(
    Math.abs(feMu - re.mu) * 80 + k_excluded * 6 + 10 + Math.abs(feMu) * 4,
  );
  const uw_risk = round2(
    Math.abs(unweighted - re.mu) * 60 + 8 + Math.abs(unweighted) * 3,
  );

  const naive: StrategyScore = {
    label: "naive_average_skip_screen",
    effect: naiveEffect,
    k_used: k_total,
    risk_score: naive_risk,
    action: "average_reported_include_ineligible",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "fixed_effect_include_ineligible",
    effect: feMu,
    k_used: k_total,
    risk_score: fe_risk,
    action: "fixed_effect_no_screen",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "unweighted_eligible_mean",
    effect: unweighted,
    k_used: k_eligible,
    risk_score: uw_risk,
    action: "mean_hedges_g_no_re_weights",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "screened_random_effects",
    effect: re.mu,
    k_used: k_eligible,
    risk_score: screened_risk,
    action: "screen_then_hedges_g_re_pool",
    screened: true,
  };

  const bestNaive = Math.min(naive_risk, fe_risk, uw_risk);

  return {
    status: "ok",
    corpus,
    min_n,
    bias_scale,
    k_total,
    k_eligible,
    k_excluded,
    mu: re.mu,
    se: re.se,
    tau2: re.tau2,
    q: re.q,
    i2: re.i2,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive_risk - screened_risk),
    vs_best_naive: round2(bestNaive - screened_risk),
  };
}
