/**
 * Dual-impl twin of synthesis.ts — must agree on all golden fixtures.
 * Alternate formulation: eligibility via running totals, RE via iterative
 * weight updates instead of the closed-form weighted mean.
 */
import {
  hedgesG,
  type StrategyScore,
  type SynthesisInput,
  type SynthesisResult,
  type StudyRow,
} from "./synthesis.js";

const DEFAULT_CORPUS = "default";
const DEFAULT_MIN_N = 40;
const DEFAULT_BIAS = 1.2;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

function buildCorpusB(
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
    const df = n_t + n_c - 2;
    const sp = Math.sqrt(
      ((n_t - 1) * sd_t * sd_t + (n_c - 1) * sd_c * sd_c) / df,
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

function randomEffectsIter(
  effects: { g: number; v: number }[],
): { mu: number; se: number; tau2: number; q: number; i2: number } {
  if (effects.length === 0) {
    return { mu: 0, se: 1, tau2: 0, q: 0, i2: 0 };
  }
  if (effects.length === 1) {
    const e = effects[0]!;
    return { mu: e.g, se: Math.sqrt(e.v), tau2: 0, q: 0, i2: 0 };
  }
  let sumW = 0;
  let sumWg = 0;
  for (const e of effects) {
    const w = 1 / e.v;
    sumW += w;
    sumWg += w * e.g;
  }
  const muFixed = sumWg / sumW;
  let q = 0;
  let sumW2 = 0;
  for (const e of effects) {
    const w = 1 / e.v;
    const d = e.g - muFixed;
    q += w * d * d;
    sumW2 += w * w;
  }
  const c = sumW - sumW2 / sumW;
  const k = effects.length;
  const tau2 = Math.max(0, (q - (k - 1)) / Math.max(1e-12, c));
  let sumWs = 0;
  let sumWsg = 0;
  for (const e of effects) {
    const w = 1 / (e.v + tau2);
    sumWs += w;
    sumWsg += w * e.g;
  }
  const mu = sumWsg / sumWs;
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

export function scoreSynthesisB(input: SynthesisInput): SynthesisResult {
  if (input.perfect_homogeneity_cheat === true) {
    return { status: "reject", reason: "perfect_homogeneity_cheat" };
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
      : buildCorpusB(corpus, min_n, bias_scale);

  const k_total = studies.length;
  const kept: StudyRow[] = [];
  for (const s of studies) {
    if (s.n_t + s.n_c >= min_n) kept.push(s);
  }
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;

  const allG = studies.map((s) => hedgesG(s));
  const keptG = kept.map((s) => hedgesG(s));
  const re = randomEffectsIter(keptG.length > 0 ? keptG : allG);

  let reportedSum = 0;
  for (const s of studies) reportedSum += s.reported;
  const naiveEffect = round4(reportedSum / Math.max(1, k_total));

  let sumW = 0;
  let sumWg = 0;
  for (const e of allG) {
    const w = 1 / e.v;
    sumW += w;
    sumWg += w * e.g;
  }
  const feMu = allG.length === 0 ? 0 : round4(sumWg / sumW);

  let gSum = 0;
  for (const e of keptG) gSum += e.g;
  const unweighted = round4(gSum / Math.max(1, keptG.length));

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
