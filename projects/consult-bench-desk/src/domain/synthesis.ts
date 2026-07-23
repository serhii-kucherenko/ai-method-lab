/**
 * Multimodal consult evaluation scoring (paper-inspired, soft simulation).
 * Axes: text + image evidence, real consult cases, cross_modal awareness.
 * Good plan: real-world multimodal consult evaluation across cohorts (human-in-loop).
 * Naive: text-only; image-blind scoring; synthetic-chat-only benches.
 * Never claim telemedicine product or authors' MedRealMM benchmark. Soft desk only.
 */

export type ConsultAxes = {
  /** 0 = text-only scoring without images, 1 = text + image evidence handling */
  text_image: number;
  /** 0 = image-blind high-confidence, 1 = real consult cases */
  real_cases: number;
  /** 0 = synthetic-chat-only benches, 1 = cross-modal rubric awareness */
  cross_modal: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = ConsultAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type ConsultInput = {
  /** Cohort / modality profile (adni, aibl, nacc, oasis, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Feature-coverage floor (10–200); higher → stricter acquisition. */
  min_n?: number;
  /** How extreme text-only answers lean (0.5–3). */
  bias_scale?: number;
  text_image_lean?: number;
  real_cases_lean?: number;
  cross_modal_lean?: number;
  /** Claim multimodal-realworld while skipping acquisition — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  image_blind_cheat?: boolean;
  synthetic_chat_cheat?: boolean;
  stage_blind_cheat?: boolean;
  text_only_cheat?: boolean;
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
  | "text_only"
  | "image_blind"
  | "synthetic_chat"
  | "multimodal_realworld";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  bench_score: number;
  action: string;
  screened: boolean;
};

export type ConsultOk = {
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
  prefs: ConsultAxes;
  bench_activity: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type ConsultReject = {
  status: "reject";
  reason: string;
};

export type ConsultResult = ConsultOk | ConsultReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = ConsultInput;
export type GovernanceResult = ConsultResult;
export type SynthesisInput = ConsultInput;
export type SynthesisResult = ConsultResult;
export type StudyRow = ChartPoint;
export type TactileInput = ConsultInput;
export type TactileResult = ConsultResult;
export type StageInput = ConsultInput;
export type StageResult = ConsultResult;
export type StageAxes = ConsultAxes;
export type LocoInput = ConsultInput;
export type LocoResult = ConsultResult;
export type LocoAxes = ConsultAxes;
export type KernelInput = ConsultInput;
export type KernelResult = ConsultResult;
export type KernelAxes = ConsultAxes;

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

/** Cohort / modality presets for missingness · calibration · cohort-shift leans. */
export function preferencePreset(corpus: string): ConsultAxes {
  const presets: Record<string, ConsultAxes> = {
    default: {
      text_image: 0.62,
      real_cases: 0.55,
      cross_modal: 0.48,
    },
    adni: {
      text_image: 0.78,
      real_cases: 0.72,
      cross_modal: 0.7,
    },
    aibl: {
      text_image: 0.74,
      real_cases: 0.68,
      cross_modal: 0.66,
    },
    nacc: {
      text_image: 0.82,
      real_cases: 0.8,
      cross_modal: 0.78,
    },
    oasis: {
      text_image: 0.7,
      real_cases: 0.85,
      cross_modal: 0.6,
    },
    clinic_a: {
      text_image: 0.88,
      real_cases: 0.82,
      cross_modal: 0.85,
    },
    clinic_b: {
      text_image: 0.25,
      real_cases: 0.2,
      cross_modal: 0.15,
    },
    mixed: {
      text_image: 0.9,
      real_cases: 0.85,
      cross_modal: 0.75,
    },
    highrisk: {
      text_image: 0.9,
      real_cases: 0.85,
      cross_modal: 0.75,
    },
    sparse: {
      text_image: 0.8,
      real_cases: 0.4,
      cross_modal: 0.7,
    },
    contaminated: {
      text_image: 0.35,
      real_cases: 0.3,
      cross_modal: 0.25,
    },
    homogeneous: {
      text_image: 0.55,
      real_cases: 0.55,
      cross_modal: 0.55,
    },
    small: {
      text_image: 0.5,
      real_cases: 0.45,
      cross_modal: 0.4,
    },
    large: {
      text_image: 0.72,
      real_cases: 0.68,
      cross_modal: 0.62,
    },
    techlean: {
      text_image: 0.25,
      real_cases: 0.2,
      cross_modal: 0.15,
    },
    flat: {
      text_image: 0.25,
      real_cases: 0.2,
      cross_modal: 0.15,
    },
    // legacy corpus names still resolve for harness reuse
    tka: {
      text_image: 0.78,
      real_cases: 0.72,
      cross_modal: 0.7,
    },
    tha: {
      text_image: 0.74,
      real_cases: 0.68,
      cross_modal: 0.66,
    },
    acl: {
      text_image: 0.82,
      real_cases: 0.8,
      cross_modal: 0.78,
    },
    rotator: {
      text_image: 0.7,
      real_cases: 0.85,
      cross_modal: 0.6,
    },
    spine: {
      text_image: 0.88,
      real_cases: 0.82,
      cross_modal: 0.85,
    },
    fracture: {
      text_image: 0.25,
      real_cases: 0.2,
      cross_modal: 0.15,
    },
    arthritis: {
      text_image: 0.72,
      real_cases: 0.78,
      cross_modal: 0.65,
    },
    sports: {
      text_image: 0.8,
      real_cases: 0.75,
      cross_modal: 0.72,
    },
    revision: {
      text_image: 0.66,
      real_cases: 0.58,
      cross_modal: 0.55,
    },
    infection: {
      text_image: 0.6,
      real_cases: 0.7,
      cross_modal: 0.5,
    },
    rehab_heavy: {
      text_image: 0.5,
      real_cases: 0.45,
      cross_modal: 0.4,
    },
    admission: {
      text_image: 0.72,
      real_cases: 0.68,
      cross_modal: 0.62,
    },
    periop: {
      text_image: 0.55,
      real_cases: 0.55,
      cross_modal: 0.55,
    },
    discharge: {
      text_image: 0.35,
      real_cases: 0.3,
      cross_modal: 0.25,
    },
    rehab: {
      text_image: 0.8,
      real_cases: 0.4,
      cross_modal: 0.7,
    },
    mud: {
      text_image: 0.6,
      real_cases: 0.7,
      cross_modal: 0.5,
    },
    stairs: {
      text_image: 0.78,
      real_cases: 0.72,
      cross_modal: 0.7,
    },
    hurdles: {
      text_image: 0.74,
      real_cases: 0.68,
      cross_modal: 0.66,
    },
    gaps: {
      text_image: 0.82,
      real_cases: 0.8,
      cross_modal: 0.78,
    },
    stones: {
      text_image: 0.7,
      real_cases: 0.85,
      cross_modal: 0.6,
    },
    forest: {
      text_image: 0.72,
      real_cases: 0.78,
      cross_modal: 0.65,
    },
    rubble: {
      text_image: 0.8,
      real_cases: 0.75,
      cross_modal: 0.72,
    },
    slopes: {
      text_image: 0.66,
      real_cases: 0.58,
      cross_modal: 0.55,
    },
    longctx: {
      text_image: 0.7,
      real_cases: 0.88,
      cross_modal: 0.5,
    },
    quant4: {
      text_image: 0.58,
      real_cases: 0.42,
      cross_modal: 0.82,
    },
    kernel: {
      text_image: 0.75,
      real_cases: 0.5,
      cross_modal: 0.9,
    },
    shortbench: {
      text_image: 0.25,
      real_cases: 0.15,
      cross_modal: 0.2,
    },
    port: {
      text_image: 0.8,
      real_cases: 0.65,
      cross_modal: 0.7,
    },
    memory: {
      text_image: 0.66,
      real_cases: 0.72,
      cross_modal: 0.55,
    },
    latency: {
      text_image: 0.6,
      real_cases: 0.45,
      cross_modal: 0.68,
    },
    healthcare: {
      text_image: 0.74,
      real_cases: 0.68,
      cross_modal: 0.55,
    },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    text_image: clamp01(0.4 + (h % 7) * 0.07),
    real_cases: clamp01(0.35 + (h % 5) * 0.09),
    cross_modal: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in bench cells — eligibility = cell complete enough under min_n.
 * Soft simulation; not a telemedicine consult service run.
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

function resolve(input: ConsultInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: ConsultAxes;
  bench_activity: number;
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
  const bench_activity = round4(min_n / 100);
  const gateBoost = bench_activity * 0.25;
  const prefs: ConsultAxes = {
    text_image: clamp01(
      input.text_image_lean !== undefined
        ? Number(input.text_image_lean)
        : input.quantum_maps_lean !== undefined
          ? Number(input.quantum_maps_lean)
          : input.skill_library_lean !== undefined
            ? Number(input.skill_library_lean)
            : base.text_image + gateBoost,
    ),
    real_cases: clamp01(
      input.real_cases_lean !== undefined
        ? Number(input.real_cases_lean)
        : input.multi_kernel_lean !== undefined
          ? Number(input.multi_kernel_lean)
          : input.perception_lean !== undefined
            ? Number(input.perception_lean)
            : base.real_cases,
    ),
    cross_modal: clamp01(
      input.cross_modal_lean !== undefined
        ? Number(input.cross_modal_lean)
        : input.activity_steering_lean !== undefined
          ? Number(input.activity_steering_lean)
          : input.transitions_lean !== undefined
            ? Number(input.transitions_lean)
            : base.cross_modal,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, bench_activity };
}

/** Misalignment cost of a plan vs stated multimodal-realworld / calibrated leans. */
export function misalignmentCost(
  prefs: ConsultAxes,
  proposal: ConsultAxes,
  biasScale: number,
): number {
  const dh = Math.abs(prefs.text_image - proposal.text_image);
  const de = Math.abs(prefs.real_cases - proposal.real_cases);
  const ds = Math.abs(prefs.cross_modal - proposal.cross_modal);
  return round2((dh * 42 + de * 36 + ds * 30) * biasScale + (dh + de + ds) * 8);
}

/** Plan-match effect (higher = closer to required multimodal-realworld capabilities). */
export function matchEffect(prefs: ConsultAxes, proposal: ConsultAxes): number {
  const dh = 1 - Math.abs(prefs.text_image - proposal.text_image);
  const de = 1 - Math.abs(prefs.real_cases - proposal.real_cases);
  const ds = 1 - Math.abs(prefs.cross_modal - proposal.cross_modal);
  return round4((dh + de + ds) / 3);
}

export function scoreSynthesis(input: ConsultInput): ConsultResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.image_blind_cheat === true ||
    input.synthetic_chat_cheat === true ||
    input.stage_blind_cheat === true ||
    input.text_only_cheat === true ||
    input.skip_transitions_cheat === true ||
    input.flat_only_cheat === true ||
    input.rbf_only_cheat === true ||
    input.feature_blind_cheat === true ||
    input.linear_only_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points, prefs, bench_activity } =
    resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;

  const extreme = clamp01(0.08 * bias_scale);

  const naiveParametric: ConsultAxes = {
    text_image: extreme,
    real_cases: extreme,
    cross_modal: extreme,
  };
  const affinityOnly: ConsultAxes = {
    text_image: prefs.text_image,
    real_cases: extreme,
    cross_modal: prefs.cross_modal,
  };
  const externalOnly: ConsultAxes = {
    text_image: extreme,
    real_cases: prefs.real_cases,
    cross_modal: prefs.cross_modal,
  };
  const dual: ConsultAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const affinityRisk = misalignmentCost(prefs, affinityOnly, bias_scale);
  const blindRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  const dualRisk = round2(
    misalignmentCost(prefs, dual, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "text_only",
    effect: matchEffect(prefs, naiveParametric),
    k_used: k_total,
    bench_score: round2(naiveRisk * 0.96),
    action: "text_only_without_images",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "image_blind",
    effect: matchEffect(prefs, affinityOnly),
    k_used: k_total,
    bench_score: affinityRisk,
    action: "localize_without_real_cases",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "synthetic_chat",
    effect: matchEffect(prefs, externalOnly),
    k_used: k_eligible,
    bench_score: blindRisk,
    action: "calibrated_without_text_image",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "multimodal_realworld",
    effect: matchEffect(prefs, dual),
    k_used: k_eligible,
    bench_score: dualRisk,
    action: "text_image_plus_real_cases_plus_cross_modal",
    screened: true,
  };

  const mu = round4(
    (prefs.text_image + prefs.real_cases + prefs.cross_modal) /
      3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - dualRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.text_image - extreme) +
      Math.abs(prefs.real_cases - extreme) +
      Math.abs(prefs.cross_modal - extreme),
  );
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );

  const bestNaive = Math.min(naive.bench_score, affinityRisk, blindRisk);

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
    bench_activity,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive.bench_score - dualRisk),
    vs_best_naive: round2(bestNaive - dualRisk),
  };
}

export function scoreGovernance(input: ConsultInput): ConsultResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: ConsultInput): ConsultResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: ConsultInput): ConsultResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: ConsultInput): ConsultResult {
  return scoreSynthesis(input);
}

export function scoreConsult(input: ConsultInput): ConsultResult {
  return scoreSynthesis(input);
}
