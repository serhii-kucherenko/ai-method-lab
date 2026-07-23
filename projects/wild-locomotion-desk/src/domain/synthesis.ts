/**
 * Multi-skill perceptive locomotion scoring (paper-inspired).
 * Axes: skill library depth, onboard perception, autonomous transitions.
 * Multi-skill plan vs naive single-skill / flat-terrain-only policy.
 * Soft simulation — not robot hardware. Never brand APT-RL as the product name.
 */

export type LocoAxes = {
  /** 0 = single skill, 1 = multi-skill library */
  skill_library: number;
  /** 0 = flat-terrain blind, 1 = onboard perception */
  perception: number;
  /** 0 = stuck / manual switch, 1 = autonomous skill transitions */
  transitions: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = LocoAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type LocoInput = {
  /** Terrain / route profile (stairs, hurdles, gaps, stones, mixed, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Perception clarity floor (10–200); higher → stricter obstacle reference. */
  min_n?: number;
  /** How extreme naive flat-policy leans (0.5–3). */
  bias_scale?: number;
  skill_library_lean?: number;
  perception_lean?: number;
  transitions_lean?: number;
  /** Claim multi-skill while skipping perception — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  skip_transitions_cheat?: boolean;
  flat_only_cheat?: boolean;
};

export type StrategyLabel =
  | "naive_flat"
  | "flat_only"
  | "no_transitions"
  | "multi_skill";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type LocoOk = {
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
  prefs: LocoAxes;
  risk_perception: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type LocoReject = {
  status: "reject";
  reason: string;
};

export type LocoResult = LocoOk | LocoReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = LocoInput;
export type GovernanceResult = LocoResult;
export type SynthesisInput = LocoInput;
export type SynthesisResult = LocoResult;
export type StudyRow = ChartPoint;
export type TactileInput = LocoInput;
export type TactileResult = LocoResult;
export type StageInput = LocoInput;
export type StageResult = LocoResult;
export type StageAxes = LocoAxes;

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

/** Terrain / route presets for skill · perception · transition leans. */
export function preferencePreset(corpus: string): LocoAxes {
  const presets: Record<string, LocoAxes> = {
    default: { skill_library: 0.62, perception: 0.55, transitions: 0.48 },
    stairs: { skill_library: 0.78, perception: 0.72, transitions: 0.7 },
    hurdles: { skill_library: 0.74, perception: 0.68, transitions: 0.66 },
    gaps: { skill_library: 0.82, perception: 0.8, transitions: 0.78 },
    stones: { skill_library: 0.7, perception: 0.85, transitions: 0.6 },
    mixed: { skill_library: 0.88, perception: 0.82, transitions: 0.85 },
    flat: { skill_library: 0.25, perception: 0.2, transitions: 0.15 },
    forest: { skill_library: 0.72, perception: 0.78, transitions: 0.65 },
    rubble: { skill_library: 0.8, perception: 0.75, transitions: 0.72 },
    slopes: { skill_library: 0.66, perception: 0.58, transitions: 0.55 },
    mud: { skill_library: 0.6, perception: 0.7, transitions: 0.5 },
    small: { skill_library: 0.5, perception: 0.45, transitions: 0.4 },
    large: { skill_library: 0.72, perception: 0.68, transitions: 0.62 },
    homogeneous: { skill_library: 0.55, perception: 0.55, transitions: 0.55 },
    contaminated: { skill_library: 0.35, perception: 0.3, transitions: 0.25 },
    sparse: { skill_library: 0.8, perception: 0.4, transitions: 0.7 },
    highrisk: { skill_library: 0.9, perception: 0.85, transitions: 0.75 },
    techlean: { skill_library: 0.25, perception: 0.2, transitions: 0.15 },
    // legacy corpus names still resolve for harness reuse
    longctx: { skill_library: 0.7, perception: 0.88, transitions: 0.5 },
    quant4: { skill_library: 0.58, perception: 0.42, transitions: 0.82 },
    kernel: { skill_library: 0.75, perception: 0.5, transitions: 0.9 },
    shortbench: { skill_library: 0.25, perception: 0.15, transitions: 0.2 },
    port: { skill_library: 0.8, perception: 0.65, transitions: 0.7 },
    memory: { skill_library: 0.66, perception: 0.72, transitions: 0.55 },
    latency: { skill_library: 0.6, perception: 0.45, transitions: 0.68 },
    workplace: { skill_library: 0.58, perception: 0.42, transitions: 0.35 },
    policing: { skill_library: 0.78, perception: 0.72, transitions: 0.5 },
    warfare: { skill_library: 0.88, perception: 0.82, transitions: 0.8 },
    healthcare: { skill_library: 0.74, perception: 0.68, transitions: 0.55 },
    education: { skill_library: 0.6, perception: 0.65, transitions: 0.45 },
    finance: { skill_library: 0.7, perception: 0.5, transitions: 0.6 },
    transport: { skill_library: 0.66, perception: 0.58, transitions: 0.52 },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    skill_library: clamp01(0.4 + (h % 7) * 0.07),
    perception: clamp01(0.35 + (h % 5) * 0.09),
    transitions: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in obstacle segments — eligibility = segment clear enough
 * under min_n perception floor. Soft simulation; not robot hardware.
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

/** Obstacle segment is clear enough under the perception floor. */
export function confirmable(p: ChartPoint, minN: number): boolean {
  const address = p.layer * 12 + p.index * 4 + 20;
  return address >= minN;
}

function resolve(input: LocoInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: LocoAxes;
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
  const prefs: LocoAxes = {
    skill_library: clamp01(
      input.skill_library_lean !== undefined
        ? Number(input.skill_library_lean)
        : base.skill_library + gateBoost,
    ),
    perception: clamp01(
      input.perception_lean !== undefined
        ? Number(input.perception_lean)
        : base.perception,
    ),
    transitions: clamp01(
      input.transitions_lean !== undefined
        ? Number(input.transitions_lean)
        : base.transitions,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, risk_perception };
}

/** Misalignment cost of a plan vs stated skill / perception / transition leans. */
export function misalignmentCost(
  prefs: LocoAxes,
  proposal: LocoAxes,
  biasScale: number,
): number {
  const ds = Math.abs(prefs.skill_library - proposal.skill_library);
  const dp = Math.abs(prefs.perception - proposal.perception);
  const di = Math.abs(prefs.transitions - proposal.transitions);
  return round2((ds * 42 + dp * 36 + di * 30) * biasScale + (ds + dp + di) * 8);
}

/** Plan-match effect (higher = closer to required locomotion capabilities). */
export function matchEffect(prefs: LocoAxes, proposal: LocoAxes): number {
  const ds = 1 - Math.abs(prefs.skill_library - proposal.skill_library);
  const dp = 1 - Math.abs(prefs.perception - proposal.perception);
  const di = 1 - Math.abs(prefs.transitions - proposal.transitions);
  return round4((ds + dp + di) / 3);
}

export function scoreSynthesis(input: LocoInput): LocoResult {
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
    resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
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
  const multiRisk = round2(
    misalignmentCost(prefs, multi, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

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

export function scoreGovernance(input: LocoInput): LocoResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: LocoInput): LocoResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: LocoInput): LocoResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: LocoInput): LocoResult {
  return scoreSynthesis(input);
}
