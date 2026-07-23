/**
 * Dual-impl twin of synthesis.ts — must agree on all golden fixtures.
 * Alternate formulation: locomotion costs via iterative accumulation;
 * perception floor applied as stepwise clamps instead of direct add.
 */
import {
  confirmable,
  matchEffect,
  misalignmentCost,
  preferencePreset,
  type ChartPoint,
  type LocoAxes,
  type LocoInput,
  type LocoResult,
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
    stairs: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    hurdles: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    gaps: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    stones: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    mixed: { k: 10, base: 50, layers: 5, hard: [0, 3, 6, 9] },
    flat: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    forest: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    rubble: { k: 9, base: 52, layers: 4, hard: [0, 4, 7] },
    slopes: { k: 7, base: 40, layers: 3, hard: [2] },
    mud: { k: 7, base: 36, layers: 3, hard: [0, 4] },
    small: { k: 4, base: 28, layers: 3, hard: [1] },
    large: { k: 12, base: 55, layers: 5, hard: [2, 5, 9] },
    homogeneous: { k: 6, base: 40, layers: 4, hard: [] },
    contaminated: { k: 10, base: 35, layers: 4, hard: [0, 1, 2, 7] },
    sparse: { k: 5, base: 22, layers: 2, hard: [0, 4] },
    highrisk: { k: 9, base: 50, layers: 5, hard: [0, 3, 6] },
    techlean: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    longctx: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    quant4: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    kernel: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    shortbench: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    port: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    memory: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    latency: { k: 7, base: 40, layers: 3, hard: [2] },
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
  let i = 0;
  while (i < p.k) {
    const isHard = p.hard.includes(i);
    let layer = i % p.layers;
    if (isHard && layer > 0) layer -= 1;
    let acc = p.base;
    acc += (i % 4) * 3.5;
    acc += ((i % 5) - 2) * 1.4;
    if (isHard) acc -= biasScale * 4;
    points.push({ layer, index: i, value: round4(acc) });
    i += 1;
  }
  void minN;
  return points;
}

function resolveB(input: LocoInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: LocoAxes;
  risk_perception: number;
} {
  const corpus = String(input.corpus ?? DEFAULT_CORPUS).trim() || DEFAULT_CORPUS;
  let min_n = DEFAULT_MIN_N;
  const rawMin = Number(input.min_n ?? DEFAULT_MIN_N);
  if (Number.isFinite(rawMin)) {
    min_n = Math.floor(rawMin);
    if (min_n < 10) min_n = 10;
    if (min_n > 200) min_n = 200;
  }
  let bias_scale = DEFAULT_BIAS;
  const rawBias = Number(input.bias_scale ?? DEFAULT_BIAS);
  if (Number.isFinite(rawBias)) {
    bias_scale = Number(rawBias.toFixed(4));
    if (bias_scale < 0.5) bias_scale = 0.5;
    if (bias_scale > 3) bias_scale = 3;
  }

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
  const boost = risk_perception * 0.25;
  let skill = base.skill_library + boost;
  let perc = base.perception;
  let trans = base.transitions;
  if (input.skill_library_lean !== undefined) skill = Number(input.skill_library_lean);
  if (input.perception_lean !== undefined) perc = Number(input.perception_lean);
  if (input.transitions_lean !== undefined) trans = Number(input.transitions_lean);

  return {
    corpus,
    min_n,
    bias_scale,
    points,
    prefs: {
      skill_library: clamp01(skill),
      perception: clamp01(perc),
      transitions: clamp01(trans),
    },
    risk_perception,
  };
}

export function scoreSynthesisB(input: LocoInput): LocoResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.skip_transitions_cheat === true ||
    input.flat_only_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points, prefs, risk_perception } =
    resolveB(input);
  const k_total = points.length;
  let k_eligible = 0;
  for (const p of points) {
    if (confirmable(p, min_n)) k_eligible += 1;
  }
  const k_excluded = k_total - k_eligible;
  const extreme = clamp01(0.08 * bias_scale);

  const naiveFlat: LocoAxes = {
    skill_library: extreme,
    perception: extreme,
    transitions: extreme,
  };
  const flatOnly: LocoAxes = {
    skill_library: prefs.skill_library,
    perception: extreme,
    transitions: prefs.transitions,
  };
  const noTransitions: LocoAxes = {
    skill_library: prefs.skill_library,
    perception: prefs.perception,
    transitions: extreme,
  };
  const multi: LocoAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveFlat, bias_scale);
  const flatRisk = misalignmentCost(prefs, flatOnly, bias_scale);
  const stuckRisk = misalignmentCost(prefs, noTransitions, bias_scale);
  let multiRisk = misalignmentCost(prefs, multi, 1) * 0.15;
  multiRisk += Math.min(6, k_excluded) * 0.6;
  multiRisk += bias_scale * 0.5;
  multiRisk = round2(multiRisk);

  const naive: StrategyScore = {
    label: "naive_flat",
    effect: matchEffect(prefs, naiveFlat),
    k_used: k_total,
    risk_score: round2(naiveRisk * 0.96),
    action: "single_skill_flat_terrain_only",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "flat_only",
    effect: matchEffect(prefs, flatOnly),
    k_used: k_total,
    risk_score: flatRisk,
    action: "ignore_onboard_perception_flat_policy",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "no_transitions",
    effect: matchEffect(prefs, noTransitions),
    k_used: k_eligible,
    risk_score: stuckRisk,
    action: "skill_library_without_autonomous_transitions",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "multi_skill",
    effect: matchEffect(prefs, multi),
    k_used: k_eligible,
    risk_score: multiRisk,
    action: "skill_library_plus_perception_plus_transitions",
    screened: true,
  };

  const mu = round4(
    (prefs.skill_library + prefs.perception + prefs.transitions) / 3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - multiRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.skill_library - extreme) +
      Math.abs(prefs.perception - extreme) +
      Math.abs(prefs.transitions - extreme),
  );
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );
  const bestNaive = Math.min(naive.risk_score, flatRisk, stuckRisk);

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
    delta_score: round2(naive.risk_score - multiRisk),
    vs_best_naive: round2(bestNaive - multiRisk),
  };
}

export function scoreGovernanceB(input: LocoInput): LocoResult {
  return scoreSynthesisB(input);
}

export function scoreTactileB(input: LocoInput): LocoResult {
  return scoreSynthesisB(input);
}
