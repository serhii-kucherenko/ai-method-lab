/**
 * Game-theoretic truth planning scoring (paper-inspired, soft simulation).
 * Axes: structured challenge among agents, payoff scoring, multi_agent awareness.
 * Good plan: game-theoretic multi-agent truth planning across arenas (human-in-loop).
 * Naive: single-agent; flat majority vote without game structure; confidence-only filters.
 * Never claim hallucination-elimination product or authors' game-theory multi-agent framework. Soft desk only.
 */

export type TruthAxes = {
  /** 0 = single-agent unchecked answers, 1 = structured challenge among agents handling */
  challenge_structure: number;
  /** 0 = majority-vote high-confidence, 1 = payoff scoring */
  payoff_scoring: number;
  /** 0 = confidence-only filters, 1 = multi-agent game awareness */
  multi_agent: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = TruthAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type TruthInput = {
  /** Arena / claim-set profile (adni, aibl, nacc, oasis, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Feature-coverage floor (10–200); higher → stricter acquisition. */
  min_n?: number;
  /** How extreme single-agent answers lean (0.5–3). */
  bias_scale?: number;
  challenge_structure_lean?: number;
  payoff_scoring_lean?: number;
  multi_agent_lean?: number;
  /** Claim game-theoretic while skipping acquisition — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  majority_vote_cheat?: boolean;
  confidence_only_cheat?: boolean;
  stage_blind_cheat?: boolean;
  single_agent_cheat?: boolean;
  /** Compat aliases from prior desk clones */
  skill_library_lean?: number;
  perception_lean?: number;
  transitions_lean?: number;
  skip_transitions_cheat?: boolean;
  flat_only_cheat?: boolean;
  rbf_only_cheat?: boolean;
  feature_blind_cheat?: boolean;
  linear_only_cheat?: boolean;
  quantum_maps_lean?: number;
  multi_kernel_lean?: number;
  activity_steering_lean?: number;
};

export type StrategyLabel =
  | "single_agent"
  | "majority_vote"
  | "confidence_only"
  | "game_theoretic";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  truth_score: number;
  action: string;
  screened: boolean;
};

export type TruthOk = {
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
  prefs: TruthAxes;
  truth_activity: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type TruthReject = {
  status: "reject";
  reason: string;
};

export type TruthResult = TruthOk | TruthReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = TruthInput;
export type GovernanceResult = TruthResult;
export type SynthesisInput = TruthInput;
export type SynthesisResult = TruthResult;
export type StudyRow = ChartPoint;
export type TactileInput = TruthInput;
export type TactileResult = TruthResult;
export type StageInput = TruthInput;
export type StageResult = TruthResult;
export type StageAxes = TruthAxes;
export type LocoInput = TruthInput;
export type LocoResult = TruthResult;
export type LocoAxes = TruthAxes;
export type KernelInput = TruthInput;
export type KernelResult = TruthResult;
export type KernelAxes = TruthAxes;

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

/** Arena / claim-set presets for challenge · payoff · multi-agent leans. */
export function preferencePreset(corpus: string): TruthAxes {
  const presets: Record<string, TruthAxes> = {
    default: {
      challenge_structure: 0.62,
      payoff_scoring: 0.55,
      multi_agent: 0.48,
    },
    adni: {
      challenge_structure: 0.78,
      payoff_scoring: 0.72,
      multi_agent: 0.7,
    },
    aibl: {
      challenge_structure: 0.74,
      payoff_scoring: 0.68,
      multi_agent: 0.66,
    },
    nacc: {
      challenge_structure: 0.82,
      payoff_scoring: 0.8,
      multi_agent: 0.78,
    },
    oasis: {
      challenge_structure: 0.7,
      payoff_scoring: 0.85,
      multi_agent: 0.6,
    },
    clinic_a: {
      challenge_structure: 0.88,
      payoff_scoring: 0.82,
      multi_agent: 0.85,
    },
    clinic_b: {
      challenge_structure: 0.25,
      payoff_scoring: 0.2,
      multi_agent: 0.15,
    },
    mixed: {
      challenge_structure: 0.9,
      payoff_scoring: 0.85,
      multi_agent: 0.75,
    },
    highrisk: {
      challenge_structure: 0.9,
      payoff_scoring: 0.85,
      multi_agent: 0.75,
    },
    sparse: {
      challenge_structure: 0.8,
      payoff_scoring: 0.4,
      multi_agent: 0.7,
    },
    contaminated: {
      challenge_structure: 0.35,
      payoff_scoring: 0.3,
      multi_agent: 0.25,
    },
    homogeneous: {
      challenge_structure: 0.55,
      payoff_scoring: 0.55,
      multi_agent: 0.55,
    },
    small: {
      challenge_structure: 0.5,
      payoff_scoring: 0.45,
      multi_agent: 0.4,
    },
    large: {
      challenge_structure: 0.72,
      payoff_scoring: 0.68,
      multi_agent: 0.62,
    },
    techlean: {
      challenge_structure: 0.25,
      payoff_scoring: 0.2,
      multi_agent: 0.15,
    },
    flat: {
      challenge_structure: 0.25,
      payoff_scoring: 0.2,
      multi_agent: 0.15,
    },
    // legacy corpus names still resolve for harness reuse
    tka: {
      challenge_structure: 0.78,
      payoff_scoring: 0.72,
      multi_agent: 0.7,
    },
    tha: {
      challenge_structure: 0.74,
      payoff_scoring: 0.68,
      multi_agent: 0.66,
    },
    acl: {
      challenge_structure: 0.82,
      payoff_scoring: 0.8,
      multi_agent: 0.78,
    },
    rotator: {
      challenge_structure: 0.7,
      payoff_scoring: 0.85,
      multi_agent: 0.6,
    },
    spine: {
      challenge_structure: 0.88,
      payoff_scoring: 0.82,
      multi_agent: 0.85,
    },
    fracture: {
      challenge_structure: 0.25,
      payoff_scoring: 0.2,
      multi_agent: 0.15,
    },
    arthritis: {
      challenge_structure: 0.72,
      payoff_scoring: 0.78,
      multi_agent: 0.65,
    },
    sports: {
      challenge_structure: 0.8,
      payoff_scoring: 0.75,
      multi_agent: 0.72,
    },
    revision: {
      challenge_structure: 0.66,
      payoff_scoring: 0.58,
      multi_agent: 0.55,
    },
    infection: {
      challenge_structure: 0.6,
      payoff_scoring: 0.7,
      multi_agent: 0.5,
    },
    rehab_heavy: {
      challenge_structure: 0.5,
      payoff_scoring: 0.45,
      multi_agent: 0.4,
    },
    admission: {
      challenge_structure: 0.72,
      payoff_scoring: 0.68,
      multi_agent: 0.62,
    },
    periop: {
      challenge_structure: 0.55,
      payoff_scoring: 0.55,
      multi_agent: 0.55,
    },
    discharge: {
      challenge_structure: 0.35,
      payoff_scoring: 0.3,
      multi_agent: 0.25,
    },
    rehab: {
      challenge_structure: 0.8,
      payoff_scoring: 0.4,
      multi_agent: 0.7,
    },
    mud: {
      challenge_structure: 0.6,
      payoff_scoring: 0.7,
      multi_agent: 0.5,
    },
    stairs: {
      challenge_structure: 0.78,
      payoff_scoring: 0.72,
      multi_agent: 0.7,
    },
    hurdles: {
      challenge_structure: 0.74,
      payoff_scoring: 0.68,
      multi_agent: 0.66,
    },
    gaps: {
      challenge_structure: 0.82,
      payoff_scoring: 0.8,
      multi_agent: 0.78,
    },
    stones: {
      challenge_structure: 0.7,
      payoff_scoring: 0.85,
      multi_agent: 0.6,
    },
    forest: {
      challenge_structure: 0.72,
      payoff_scoring: 0.78,
      multi_agent: 0.65,
    },
    rubble: {
      challenge_structure: 0.8,
      payoff_scoring: 0.75,
      multi_agent: 0.72,
    },
    slopes: {
      challenge_structure: 0.66,
      payoff_scoring: 0.58,
      multi_agent: 0.55,
    },
    longctx: {
      challenge_structure: 0.7,
      payoff_scoring: 0.88,
      multi_agent: 0.5,
    },
    quant4: {
      challenge_structure: 0.58,
      payoff_scoring: 0.42,
      multi_agent: 0.82,
    },
    kernel: {
      challenge_structure: 0.75,
      payoff_scoring: 0.5,
      multi_agent: 0.9,
    },
    shortbench: {
      challenge_structure: 0.25,
      payoff_scoring: 0.15,
      multi_agent: 0.2,
    },
    port: {
      challenge_structure: 0.8,
      payoff_scoring: 0.65,
      multi_agent: 0.7,
    },
    memory: {
      challenge_structure: 0.66,
      payoff_scoring: 0.72,
      multi_agent: 0.55,
    },
    latency: {
      challenge_structure: 0.6,
      payoff_scoring: 0.45,
      multi_agent: 0.68,
    },
    healthcare: {
      challenge_structure: 0.74,
      payoff_scoring: 0.68,
      multi_agent: 0.55,
    },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    challenge_structure: clamp01(0.4 + (h % 7) * 0.07),
    payoff_scoring: clamp01(0.35 + (h % 5) * 0.09),
    multi_agent: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in truth cells — eligibility = cell complete enough under min_n.
 * Soft simulation; not a hallucination-elimination product run.
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
    adni: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    aibl: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    nacc: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    oasis: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    clinic_a: { k: 10, base: 50, layers: 5, hard: [0, 3, 6, 9] },
    clinic_b: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    mixed: { k: 10, base: 50, layers: 5, hard: [0, 3, 6, 9] },
    highrisk: { k: 9, base: 50, layers: 5, hard: [0, 3, 6] },
    sparse: { k: 5, base: 22, layers: 2, hard: [0, 4] },
    contaminated: { k: 10, base: 35, layers: 4, hard: [0, 1, 2, 7] },
    homogeneous: { k: 6, base: 40, layers: 4, hard: [] },
    small: { k: 4, base: 28, layers: 3, hard: [1] },
    large: { k: 12, base: 55, layers: 5, hard: [2, 5, 9] },
    techlean: { k: 6, base: 30, layers: 3, hard: [1, 4] },
    flat: { k: 6, base: 30, layers: 3, hard: [1, 4] },
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

/** Feature cell is complete enough under the coverage floor. */
export function confirmable(p: ChartPoint, minN: number): boolean {
  const address = p.layer * 12 + p.index * 4 + 20;
  return address >= minN;
}

function resolve(input: TruthInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: TruthAxes;
  truth_activity: number;
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
  const truth_activity = round4(min_n / 100);
  const gateBoost = truth_activity * 0.25;
  const prefs: TruthAxes = {
    challenge_structure: clamp01(
      input.challenge_structure_lean !== undefined
        ? Number(input.challenge_structure_lean)
        : input.quantum_maps_lean !== undefined
          ? Number(input.quantum_maps_lean)
          : input.skill_library_lean !== undefined
            ? Number(input.skill_library_lean)
            : base.challenge_structure + gateBoost,
    ),
    payoff_scoring: clamp01(
      input.payoff_scoring_lean !== undefined
        ? Number(input.payoff_scoring_lean)
        : input.multi_kernel_lean !== undefined
          ? Number(input.multi_kernel_lean)
          : input.perception_lean !== undefined
            ? Number(input.perception_lean)
            : base.payoff_scoring,
    ),
    multi_agent: clamp01(
      input.multi_agent_lean !== undefined
        ? Number(input.multi_agent_lean)
        : input.activity_steering_lean !== undefined
          ? Number(input.activity_steering_lean)
          : input.transitions_lean !== undefined
            ? Number(input.transitions_lean)
            : base.multi_agent,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, truth_activity };
}

/** Misalignment cost of a plan vs stated game-theoretic / calibrated leans. */
export function misalignmentCost(
  prefs: TruthAxes,
  proposal: TruthAxes,
  biasScale: number,
): number {
  const dh = Math.abs(prefs.challenge_structure - proposal.challenge_structure);
  const de = Math.abs(prefs.payoff_scoring - proposal.payoff_scoring);
  const ds = Math.abs(prefs.multi_agent - proposal.multi_agent);
  return round2((dh * 42 + de * 36 + ds * 30) * biasScale + (dh + de + ds) * 8);
}

/** Plan-match effect (higher = closer to required game-theoretic capabilities). */
export function matchEffect(prefs: TruthAxes, proposal: TruthAxes): number {
  const dh = 1 - Math.abs(prefs.challenge_structure - proposal.challenge_structure);
  const de = 1 - Math.abs(prefs.payoff_scoring - proposal.payoff_scoring);
  const ds = 1 - Math.abs(prefs.multi_agent - proposal.multi_agent);
  return round4((dh + de + ds) / 3);
}

export function scoreSynthesis(input: TruthInput): TruthResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.majority_vote_cheat === true ||
    input.confidence_only_cheat === true ||
    input.stage_blind_cheat === true ||
    input.single_agent_cheat === true ||
    input.skip_transitions_cheat === true ||
    input.flat_only_cheat === true ||
    input.rbf_only_cheat === true ||
    input.feature_blind_cheat === true ||
    input.linear_only_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points, prefs, truth_activity } =
    resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;

  const extreme = clamp01(0.08 * bias_scale);

  const naiveParametric: TruthAxes = {
    challenge_structure: extreme,
    payoff_scoring: extreme,
    multi_agent: extreme,
  };
  const affinityOnly: TruthAxes = {
    challenge_structure: prefs.challenge_structure,
    payoff_scoring: extreme,
    multi_agent: prefs.multi_agent,
  };
  const externalOnly: TruthAxes = {
    challenge_structure: extreme,
    payoff_scoring: prefs.payoff_scoring,
    multi_agent: prefs.multi_agent,
  };
  const dual: TruthAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const affinityRisk = misalignmentCost(prefs, affinityOnly, bias_scale);
  const blindRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  const dualRisk = round2(
    misalignmentCost(prefs, dual, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "single_agent",
    effect: matchEffect(prefs, naiveParametric),
    k_used: k_total,
    truth_score: round2(naiveRisk * 0.96),
    action: "single_agent_unchecked",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "majority_vote",
    effect: matchEffect(prefs, affinityOnly),
    k_used: k_total,
    truth_score: affinityRisk,
    action: "majority_vote_without_game",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "confidence_only",
    effect: matchEffect(prefs, externalOnly),
    k_used: k_eligible,
    truth_score: blindRisk,
    action: "confidence_only_without_game",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "game_theoretic",
    effect: matchEffect(prefs, dual),
    k_used: k_eligible,
    truth_score: dualRisk,
    action: "challenge_structure_plus_payoff_scoring_plus_multi_agent",
    screened: true,
  };

  const mu = round4(
    (prefs.challenge_structure + prefs.payoff_scoring + prefs.multi_agent) /
      3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - dualRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.challenge_structure - extreme) +
      Math.abs(prefs.payoff_scoring - extreme) +
      Math.abs(prefs.multi_agent - extreme),
  );
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );

  const bestNaive = Math.min(naive.truth_score, affinityRisk, blindRisk);

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
    truth_activity,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive.truth_score - dualRisk),
    vs_best_naive: round2(bestNaive - dualRisk),
  };
}

export function scoreGovernance(input: TruthInput): TruthResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: TruthInput): TruthResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: TruthInput): TruthResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: TruthInput): TruthResult {
  return scoreSynthesis(input);
}

export function scoreTruth(input: TruthInput): TruthResult {
  return scoreSynthesis(input);
}
