/**
 * Quantum multiple-kernel SAR scoring (paper-inspired).
 * Axes: quantum-style feature maps, multi-kernel stacking, activity steering.
 * Quantum multi-kernel plan vs classical linear_only / rbf_only /
 * feature_blind flat-score baselines.
 * Soft simulation — not quantum hardware. Never brand Q²SAR as the product name.
 */

export type KernelAxes = {
  /** 0 = classical maps only, 1 = quantum-style feature maps */
  quantum_maps: number;
  /** 0 = single kernel, 1 = multiple stacked kernels */
  multi_kernel: number;
  /** 0 = feature-blind flat score, 1 = activity-aware SAR steering */
  activity_steering: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = KernelAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type KernelInput = {
  /** Assay / series profile (kinase, protease, gpcr, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Kernel coverage floor (10–200); higher → stricter acquisition. */
  min_n?: number;
  /** How extreme linear_only answers lean (0.5–3). */
  bias_scale?: number;
  quantum_maps_lean?: number;
  multi_kernel_lean?: number;
  activity_steering_lean?: number;
  /** Claim quantum-multi-kernel while skipping acquisition — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  rbf_only_cheat?: boolean;
  feature_blind_cheat?: boolean;
  stage_blind_cheat?: boolean;
  linear_only_cheat?: boolean;
  /** Compat aliases from prior desk clones */
  skill_library_lean?: number;
  perception_lean?: number;
  transitions_lean?: number;
  skip_transitions_cheat?: boolean;
  flat_only_cheat?: boolean;
};

export type StrategyLabel =
  | "linear_only"
  | "rbf_only"
  | "feature_blind"
  | "quantum_multi_kernel";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type KernelOk = {
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
  prefs: KernelAxes;
  risk_activity: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type KernelReject = {
  status: "reject";
  reason: string;
};

export type KernelResult = KernelOk | KernelReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = KernelInput;
export type GovernanceResult = KernelResult;
export type SynthesisInput = KernelInput;
export type SynthesisResult = KernelResult;
export type StudyRow = ChartPoint;
export type TactileInput = KernelInput;
export type TactileResult = KernelResult;
export type StageInput = KernelInput;
export type StageResult = KernelResult;
export type StageAxes = KernelAxes;
export type LocoInput = KernelInput;
export type LocoResult = KernelResult;
export type LocoAxes = KernelAxes;

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

/** Assay / series presets for quantum maps · multi-kernel · activity leans. */
export function preferencePreset(corpus: string): KernelAxes {
  const presets: Record<string, KernelAxes> = {
    default: {
      quantum_maps: 0.62,
      multi_kernel: 0.55,
      activity_steering: 0.48,
    },
    tka: {
      quantum_maps: 0.78,
      multi_kernel: 0.72,
      activity_steering: 0.7,
    },
    tha: {
      quantum_maps: 0.74,
      multi_kernel: 0.68,
      activity_steering: 0.66,
    },
    acl: {
      quantum_maps: 0.82,
      multi_kernel: 0.8,
      activity_steering: 0.78,
    },
    rotator: {
      quantum_maps: 0.7,
      multi_kernel: 0.85,
      activity_steering: 0.6,
    },
    spine: {
      quantum_maps: 0.88,
      multi_kernel: 0.82,
      activity_steering: 0.85,
    },
    fracture: {
      quantum_maps: 0.25,
      multi_kernel: 0.2,
      activity_steering: 0.15,
    },
    arthritis: {
      quantum_maps: 0.72,
      multi_kernel: 0.78,
      activity_steering: 0.65,
    },
    sports: {
      quantum_maps: 0.8,
      multi_kernel: 0.75,
      activity_steering: 0.72,
    },
    revision: {
      quantum_maps: 0.66,
      multi_kernel: 0.58,
      activity_steering: 0.55,
    },
    infection: {
      quantum_maps: 0.6,
      multi_kernel: 0.7,
      activity_steering: 0.5,
    },
    rehab_heavy: {
      quantum_maps: 0.5,
      multi_kernel: 0.45,
      activity_steering: 0.4,
    },
    admission: {
      quantum_maps: 0.72,
      multi_kernel: 0.68,
      activity_steering: 0.62,
    },
    periop: {
      quantum_maps: 0.55,
      multi_kernel: 0.55,
      activity_steering: 0.55,
    },
    discharge: {
      quantum_maps: 0.35,
      multi_kernel: 0.3,
      activity_steering: 0.25,
    },
    rehab: {
      quantum_maps: 0.8,
      multi_kernel: 0.4,
      activity_steering: 0.7,
    },
    mixed: {
      quantum_maps: 0.9,
      multi_kernel: 0.85,
      activity_steering: 0.75,
    },
    highrisk: {
      quantum_maps: 0.9,
      multi_kernel: 0.85,
      activity_steering: 0.75,
    },
    techlean: {
      quantum_maps: 0.25,
      multi_kernel: 0.2,
      activity_steering: 0.15,
    },
    small: {
      quantum_maps: 0.5,
      multi_kernel: 0.45,
      activity_steering: 0.4,
    },
    large: {
      quantum_maps: 0.72,
      multi_kernel: 0.68,
      activity_steering: 0.62,
    },
    homogeneous: {
      quantum_maps: 0.55,
      multi_kernel: 0.55,
      activity_steering: 0.55,
    },
    contaminated: {
      quantum_maps: 0.35,
      multi_kernel: 0.3,
      activity_steering: 0.25,
    },
    sparse: {
      quantum_maps: 0.8,
      multi_kernel: 0.4,
      activity_steering: 0.7,
    },
    flat: {
      quantum_maps: 0.25,
      multi_kernel: 0.2,
      activity_steering: 0.15,
    },
    mud: {
      quantum_maps: 0.6,
      multi_kernel: 0.7,
      activity_steering: 0.5,
    },
    // legacy corpus names still resolve for harness reuse
    stairs: {
      quantum_maps: 0.78,
      multi_kernel: 0.72,
      activity_steering: 0.7,
    },
    hurdles: {
      quantum_maps: 0.74,
      multi_kernel: 0.68,
      activity_steering: 0.66,
    },
    gaps: {
      quantum_maps: 0.82,
      multi_kernel: 0.8,
      activity_steering: 0.78,
    },
    stones: {
      quantum_maps: 0.7,
      multi_kernel: 0.85,
      activity_steering: 0.6,
    },
    forest: {
      quantum_maps: 0.72,
      multi_kernel: 0.78,
      activity_steering: 0.65,
    },
    rubble: {
      quantum_maps: 0.8,
      multi_kernel: 0.75,
      activity_steering: 0.72,
    },
    slopes: {
      quantum_maps: 0.66,
      multi_kernel: 0.58,
      activity_steering: 0.55,
    },
    longctx: {
      quantum_maps: 0.7,
      multi_kernel: 0.88,
      activity_steering: 0.5,
    },
    quant4: {
      quantum_maps: 0.58,
      multi_kernel: 0.42,
      activity_steering: 0.82,
    },
    kernel: {
      quantum_maps: 0.75,
      multi_kernel: 0.5,
      activity_steering: 0.9,
    },
    shortbench: {
      quantum_maps: 0.25,
      multi_kernel: 0.15,
      activity_steering: 0.2,
    },
    port: {
      quantum_maps: 0.8,
      multi_kernel: 0.65,
      activity_steering: 0.7,
    },
    memory: {
      quantum_maps: 0.66,
      multi_kernel: 0.72,
      activity_steering: 0.55,
    },
    latency: {
      quantum_maps: 0.6,
      multi_kernel: 0.45,
      activity_steering: 0.68,
    },
    healthcare: {
      quantum_maps: 0.74,
      multi_kernel: 0.68,
      activity_steering: 0.55,
    },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    quantum_maps: clamp01(0.4 + (h % 7) * 0.07),
    multi_kernel: clamp01(0.35 + (h % 5) * 0.09),
    activity_steering: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in kernel feature cells — eligibility = feature cell complete enough
 * under min_n acquisition floor. Soft simulation; not quantum hardware access.
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

/** Evidence cell is complete enough under the acquisition floor. */
export function confirmable(p: ChartPoint, minN: number): boolean {
  const address = p.layer * 12 + p.index * 4 + 20;
  return address >= minN;
}

function resolve(input: KernelInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: KernelAxes;
  risk_activity: number;
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
  const risk_activity = round4(min_n / 100);
  const gateBoost = risk_activity * 0.25;
  const prefs: KernelAxes = {
    quantum_maps: clamp01(
      input.quantum_maps_lean !== undefined
        ? Number(input.quantum_maps_lean)
        : input.skill_library_lean !== undefined
          ? Number(input.skill_library_lean)
          : base.quantum_maps + gateBoost,
    ),
    multi_kernel: clamp01(
      input.multi_kernel_lean !== undefined
        ? Number(input.multi_kernel_lean)
        : input.perception_lean !== undefined
          ? Number(input.perception_lean)
          : base.multi_kernel,
    ),
    activity_steering: clamp01(
      input.activity_steering_lean !== undefined
        ? Number(input.activity_steering_lean)
        : input.transitions_lean !== undefined
          ? Number(input.transitions_lean)
          : base.activity_steering,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, risk_activity };
}

/** Misalignment cost of a plan vs stated quantum-multi-kernel / stage leans. */
export function misalignmentCost(
  prefs: KernelAxes,
  proposal: KernelAxes,
  biasScale: number,
): number {
  const dh = Math.abs(prefs.quantum_maps - proposal.quantum_maps);
  const de = Math.abs(prefs.multi_kernel - proposal.multi_kernel);
  const ds = Math.abs(prefs.activity_steering - proposal.activity_steering);
  return round2((dh * 42 + de * 36 + ds * 30) * biasScale + (dh + de + ds) * 8);
}

/** Plan-match effect (higher = closer to required quantum-multi-kernel capabilities). */
export function matchEffect(prefs: KernelAxes, proposal: KernelAxes): number {
  const dh = 1 - Math.abs(prefs.quantum_maps - proposal.quantum_maps);
  const de = 1 - Math.abs(prefs.multi_kernel - proposal.multi_kernel);
  const ds = 1 - Math.abs(prefs.activity_steering - proposal.activity_steering);
  return round4((dh + de + ds) / 3);
}

export function scoreSynthesis(input: KernelInput): KernelResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.rbf_only_cheat === true ||
    input.feature_blind_cheat === true ||
    input.stage_blind_cheat === true ||
    input.linear_only_cheat === true ||
    input.skip_transitions_cheat === true ||
    input.flat_only_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points, prefs, risk_activity } =
    resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;

  const extreme = clamp01(0.08 * bias_scale);

  const naiveParametric: KernelAxes = {
    quantum_maps: extreme,
    multi_kernel: extreme,
    activity_steering: extreme,
  };
  const affinityOnly: KernelAxes = {
    quantum_maps: prefs.quantum_maps,
    multi_kernel: extreme,
    activity_steering: prefs.activity_steering,
  };
  const externalOnly: KernelAxes = {
    quantum_maps: extreme,
    multi_kernel: prefs.multi_kernel,
    activity_steering: prefs.activity_steering,
  };
  const dual: KernelAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const affinityRisk = misalignmentCost(prefs, affinityOnly, bias_scale);
  const blindRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  const dualRisk = round2(
    misalignmentCost(prefs, dual, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "linear_only",
    effect: matchEffect(prefs, naiveParametric),
    k_used: k_total,
    risk_score: round2(naiveRisk * 0.96),
    action: "parametric_memory_only_single_shot",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "rbf_only",
    effect: matchEffect(prefs, affinityOnly),
    k_used: k_total,
    risk_score: affinityRisk,
    action: "quantum_maps_without_multi_kernel",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "feature_blind",
    effect: matchEffect(prefs, externalOnly),
    k_used: k_eligible,
    risk_score: blindRisk,
    action: "multi_kernel_without_quantum_maps",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "quantum_multi_kernel",
    effect: matchEffect(prefs, dual),
    k_used: k_eligible,
    risk_score: dualRisk,
    action: "quantum_maps_plus_multi_kernel_plus_activity",
    screened: true,
  };

  const mu = round4(
    (prefs.quantum_maps + prefs.multi_kernel + prefs.activity_steering) /
      3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - dualRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.quantum_maps - extreme) +
      Math.abs(prefs.multi_kernel - extreme) +
      Math.abs(prefs.activity_steering - extreme),
  );
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
    risk_activity,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive.risk_score - dualRisk),
    vs_best_naive: round2(bestNaive - dualRisk),
  };
}

export function scoreGovernance(input: KernelInput): KernelResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: KernelInput): KernelResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: KernelInput): KernelResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: KernelInput): KernelResult {
  return scoreSynthesis(input);
}

export function scoreKernel(input: KernelInput): KernelResult {
  return scoreSynthesis(input);
}
