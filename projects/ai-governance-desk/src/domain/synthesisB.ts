/**
 * Dual-impl twin of synthesis.ts — must agree on all golden fixtures.
 * Alternate formulation: preference costs via iterative accumulation;
 * risk perception applied as stepwise clamps instead of direct add.
 */
import {
  confirmable,
  matchEffect,
  misalignmentCost,
  preferencePreset,
  type ChartPoint,
  type GovernanceInput,
  type GovernanceResult,
  type PreferenceAxes,
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
    workplace: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    policing: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    warfare: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    healthcare: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    education: { k: 6, base: 36, layers: 3, hard: [0, 4] },
    finance: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    transport: { k: 7, base: 40, layers: 3, hard: [2] },
    small: { k: 4, base: 28, layers: 3, hard: [1] },
    large: { k: 12, base: 55, layers: 5, hard: [2, 5, 9] },
    homogeneous: { k: 6, base: 40, layers: 4, hard: [] },
    contaminated: { k: 10, base: 35, layers: 4, hard: [0, 1, 2, 7] },
    sparse: { k: 5, base: 22, layers: 2, hard: [0, 4] },
    highrisk: { k: 9, base: 50, layers: 5, hard: [0, 3, 6] },
    techlean: { k: 6, base: 30, layers: 3, hard: [1, 4] },
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

function meanAxes(prefs: PreferenceAxes): number {
  let sum = 0;
  sum += prefs.safety;
  sum += prefs.public;
  sum += prefs.international;
  return sum / 3;
}

export function scoreSynthesisB(input: GovernanceInput): GovernanceResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true
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
  const safetyBoost = risk_perception * 0.25;
  const prefs: PreferenceAxes = {
    safety: clamp01(
      input.safety_lean !== undefined
        ? Number(input.safety_lean)
        : base.safety + safetyBoost,
    ),
    public: clamp01(
      input.public_lean !== undefined ? Number(input.public_lean) : base.public,
    ),
    international: clamp01(
      input.international_lean !== undefined
        ? Number(input.international_lean)
        : base.international,
    ),
  };

  const k_total = points.length;
  const k_eligible = countEligible(points, min_n);
  const k_excluded = k_total - k_eligible;
  const extreme = clamp01(0.08 * bias_scale);

  const alwaysInnovation: PreferenceAxes = {
    safety: extreme,
    public: prefs.public,
    international: prefs.international,
  };
  const alwaysPrivate: PreferenceAxes = {
    safety: prefs.safety,
    public: extreme,
    international: prefs.international,
  };
  const alwaysNational: PreferenceAxes = {
    safety: prefs.safety,
    public: prefs.public,
    international: extreme,
  };
  const techFirst: PreferenceAxes = {
    safety: extreme,
    public: extreme,
    international: extreme,
  };
  const aligned: PreferenceAxes = {
    safety: prefs.safety,
    public: prefs.public,
    international: prefs.international,
  };

  const innovRisk = misalignmentCost(prefs, alwaysInnovation, bias_scale);
  const privateRisk = misalignmentCost(prefs, alwaysPrivate, bias_scale);
  const nationalRisk = misalignmentCost(prefs, alwaysNational, bias_scale);
  const techRisk = misalignmentCost(prefs, techFirst, bias_scale);
  const alignedRisk = round2(
    misalignmentCost(prefs, aligned, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "always_innovation",
    effect: matchEffect(prefs, techFirst),
    k_used: k_total,
    risk_score: round2(Math.max(innovRisk, techRisk * 0.92)),
    action: "tech_first_ignore_safety_public_intl",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "always_private",
    effect: matchEffect(prefs, alwaysPrivate),
    k_used: k_total,
    risk_score: privateRisk,
    action: "always_private_governance",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "always_national",
    effect: matchEffect(prefs, alwaysNational),
    k_used: k_eligible,
    risk_score: nationalRisk,
    action: "always_national_scope",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "preference_aligned",
    effect: matchEffect(prefs, aligned),
    k_used: k_eligible,
    risk_score: alignedRisk,
    action: "conjoint_preference_aligned_proposal",
    screened: true,
  };

  const mu = round4(meanAxes(prefs));
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (techRisk - alignedRisk) * 0.01));
  let qAcc = 0;
  qAcc += Math.abs(prefs.safety - extreme);
  qAcc += Math.abs(prefs.public - extreme);
  qAcc += Math.abs(prefs.international - extreme);
  const q = round4(qAcc);
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );
  const bestNaive = Math.min(naive.risk_score, privateRisk, nationalRisk);

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
    delta_score: round2(naive.risk_score - alignedRisk),
    vs_best_naive: round2(bestNaive - alignedRisk),
  };
}

export function scoreGovernanceB(input: GovernanceInput): GovernanceResult {
  return scoreSynthesisB(input);
}

export function scoreTactileB(input: GovernanceInput): GovernanceResult {
  return scoreSynthesisB(input);
}
