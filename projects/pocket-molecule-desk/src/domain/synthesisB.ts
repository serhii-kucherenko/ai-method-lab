/**
 * Dual-impl twin of synthesis.ts — must agree on all golden fixtures.
 * Alternate formulation: pathway costs via iterative accumulation;
 * pocket fit floor applied as stepwise clamps instead of direct add.
 */
import {
  confirmable,
  matchEffect,
  misalignmentCost,
  preferencePreset,
  type ChartPoint,
  type MoleculeAxes,
  type MoleculeInput,
  type MoleculeResult,
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
    tka: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    tha: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    acl: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    rotator: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    spine: { k: 10, base: 50, layers: 5, hard: [0, 3, 6, 9] },
    fracture: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    arthritis: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    sports: { k: 9, base: 52, layers: 4, hard: [0, 4, 7] },
    revision: { k: 7, base: 40, layers: 3, hard: [2] },
    infection: { k: 7, base: 36, layers: 3, hard: [0, 4] },
    rehab_heavy: { k: 4, base: 28, layers: 3, hard: [1] },
    admission: { k: 12, base: 55, layers: 5, hard: [2, 5, 9] },
    periop: { k: 6, base: 40, layers: 4, hard: [] },
    discharge: { k: 10, base: 35, layers: 4, hard: [0, 1, 2, 7] },
    rehab: { k: 5, base: 22, layers: 2, hard: [0, 4] },
    mixed: { k: 10, base: 50, layers: 5, hard: [0, 3, 6, 9] },
    highrisk: { k: 9, base: 50, layers: 5, hard: [0, 3, 6] },
    techlean: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    small: { k: 4, base: 28, layers: 3, hard: [1] },
    large: { k: 12, base: 55, layers: 5, hard: [2, 5, 9] },
    homogeneous: { k: 6, base: 40, layers: 4, hard: [] },
    contaminated: { k: 10, base: 35, layers: 4, hard: [0, 1, 2, 7] },
    sparse: { k: 5, base: 22, layers: 2, hard: [0, 4] },
    flat: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    mud: { k: 7, base: 36, layers: 3, hard: [0, 4] },
    stairs: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    hurdles: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    gaps: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    stones: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    forest: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    rubble: { k: 9, base: 52, layers: 4, hard: [0, 4, 7] },
    slopes: { k: 7, base: 40, layers: 3, hard: [2] },
    longctx: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    quant4: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    kernel: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    shortbench: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    port: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    memory: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    latency: { k: 7, base: 40, layers: 3, hard: [2] },
    healthcare: { k: 8, base: 44, layers: 4, hard: [2, 6] },
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

function resolveB(input: MoleculeInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: MoleculeAxes;
  risk_developability: number;
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
  let risk_developability = 0;
  let gate = min_n;
  while (gate > 0) {
    risk_developability += 0.01;
    gate -= 1;
  }
  risk_developability = round4(risk_developability);
  const gateBoost = risk_developability * 0.25;
  const prefs: MoleculeAxes = {
    pocket_conditioning: clamp01(
      input.pocket_conditioning_lean !== undefined
        ? Number(input.pocket_conditioning_lean)
        : input.skill_library_lean !== undefined
          ? Number(input.skill_library_lean)
          : base.pocket_conditioning + gateBoost,
    ),
    binding_affinity: clamp01(
      input.binding_affinity_lean !== undefined
        ? Number(input.binding_affinity_lean)
        : input.perception_lean !== undefined
          ? Number(input.perception_lean)
          : base.binding_affinity,
    ),
    developability: clamp01(
      input.developability_lean !== undefined
        ? Number(input.developability_lean)
        : input.transitions_lean !== undefined
          ? Number(input.transitions_lean)
          : base.developability,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, risk_developability };
}

export function scoreSynthesisB(input: MoleculeInput): MoleculeResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.affinity_only_cheat === true ||
    input.property_blind_cheat === true ||
    input.stage_blind_cheat === true ||
    input.unconditioned_cheat === true ||
    input.skip_transitions_cheat === true ||
    input.flat_only_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points, prefs, risk_developability } =
    resolveB(input);
  const k_total = points.length;
  let k_eligible = 0;
  for (const p of points) {
    if (confirmable(p, min_n)) k_eligible += 1;
  }
  const k_excluded = k_total - k_eligible;

  const extreme = clamp01(0.08 * bias_scale);

  const naiveParametric: MoleculeAxes = {
    pocket_conditioning: extreme,
    binding_affinity: extreme,
    developability: extreme,
  };
  const affinityOnly: MoleculeAxes = {
    pocket_conditioning: prefs.pocket_conditioning,
    binding_affinity: extreme,
    developability: prefs.developability,
  };
  const externalOnly: MoleculeAxes = {
    pocket_conditioning: extreme,
    binding_affinity: prefs.binding_affinity,
    developability: prefs.developability,
  };
  const dual: MoleculeAxes = {
    pocket_conditioning: prefs.pocket_conditioning,
    binding_affinity: prefs.binding_affinity,
    developability: prefs.developability,
  };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const affinityRisk = misalignmentCost(prefs, affinityOnly, bias_scale);
  const blindRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  let dualRisk = misalignmentCost(prefs, dual, 1) * 0.15;
  dualRisk += Math.min(6, k_excluded) * 0.6;
  dualRisk += bias_scale * 0.5;
  dualRisk = round2(dualRisk);

  const naive: StrategyScore = {
    label: "unconditioned",
    effect: matchEffect(prefs, naiveParametric),
    k_used: k_total,
    risk_score: round2(naiveRisk * 0.96),
    action: "parametric_memory_only_single_shot",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "affinity_only",
    effect: matchEffect(prefs, affinityOnly),
    k_used: k_total,
    risk_score: affinityRisk,
    action: "pocket_conditioning_without_binding_affinity",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "property_blind",
    effect: matchEffect(prefs, externalOnly),
    k_used: k_eligible,
    risk_score: blindRisk,
    action: "binding_affinity_without_pocket_conditioning",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "pocket_property",
    effect: matchEffect(prefs, dual),
    k_used: k_eligible,
    risk_score: dualRisk,
    action: "pocket_plus_affinity_plus_developability",
    screened: true,
  };

  const mu = round4(
    (prefs.pocket_conditioning + prefs.binding_affinity + prefs.developability) /
      3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - dualRisk) * 0.01));
  let qAcc = 0;
  qAcc += Math.abs(prefs.pocket_conditioning - extreme);
  qAcc += Math.abs(prefs.binding_affinity - extreme);
  qAcc += Math.abs(prefs.developability - extreme);
  const q = round4(qAcc);
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );

  const bestNaive = Math.min(naive.risk_score, affinityRisk, blindRisk);

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
    risk_developability,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive.risk_score - dualRisk),
    vs_best_naive: round2(bestNaive - dualRisk),
  };
}

export function scoreGovernanceB(input: MoleculeInput): MoleculeResult {
  return scoreSynthesisB(input);
}

export function scoreTactileB(input: MoleculeInput): MoleculeResult {
  return scoreSynthesisB(input);
}

export function scoreStageB(input: MoleculeInput): MoleculeResult {
  return scoreSynthesisB(input);
}

export function scoreCareB(input: MoleculeInput): MoleculeResult {
  return scoreSynthesisB(input);
}
