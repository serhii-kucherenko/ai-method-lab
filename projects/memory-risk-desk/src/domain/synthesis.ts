/**
 * Memory-risk scoring (paper-inspired, soft simulation).
 * Axes: native missingness, calibrated risk bands, cohort / site-shift awareness.
 * Good plan: imputation-free + calibrated-uncertainty across cohorts.
 * Naive: mean/mode imputation + flat classifier; uncalibrated high-confidence;
 * single-cohort-only ignoring site shift.
 * Never brand NITROGEN or authors' model names. Not a medical device.
 */

export type RiskAxes = {
  /** 0 = mean/mode impute then classify, 1 = native missingness handling */
  native_missingness: number;
  /** 0 = uncalibrated high-confidence, 1 = calibrated risk bands */
  calibrated_bands: number;
  /** 0 = single-cohort-only, 1 = cross-cohort site-shift aware */
  cohort_shift: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = RiskAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type RiskInput = {
  /** Cohort / site profile (adni, aibl, nacc, oasis, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Feature-coverage floor (10–200); higher → stricter acquisition. */
  min_n?: number;
  /** How extreme mean-impute answers lean (0.5–3). */
  bias_scale?: number;
  native_missingness_lean?: number;
  calibrated_bands_lean?: number;
  cohort_shift_lean?: number;
  /** Claim imputation-free while skipping acquisition — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  uncalibrated_cheat?: boolean;
  single_cohort_cheat?: boolean;
  stage_blind_cheat?: boolean;
  mean_impute_cheat?: boolean;
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
  | "mean_impute"
  | "uncalibrated"
  | "single_cohort"
  | "imputation_free_calibrated";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type RiskOk = {
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
  prefs: RiskAxes;
  risk_activity: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type RiskReject = {
  status: "reject";
  reason: string;
};

export type RiskResult = RiskOk | RiskReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = RiskInput;
export type GovernanceResult = RiskResult;
export type SynthesisInput = RiskInput;
export type SynthesisResult = RiskResult;
export type StudyRow = ChartPoint;
export type TactileInput = RiskInput;
export type TactileResult = RiskResult;
export type StageInput = RiskInput;
export type StageResult = RiskResult;
export type StageAxes = RiskAxes;
export type LocoInput = RiskInput;
export type LocoResult = RiskResult;
export type LocoAxes = RiskAxes;
export type KernelInput = RiskInput;
export type KernelResult = RiskResult;
export type KernelAxes = RiskAxes;

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

/** Cohort / site presets for missingness · calibration · site-shift leans. */
export function preferencePreset(corpus: string): RiskAxes {
  const presets: Record<string, RiskAxes> = {
    default: {
      native_missingness: 0.62,
      calibrated_bands: 0.55,
      cohort_shift: 0.48,
    },
    adni: {
      native_missingness: 0.78,
      calibrated_bands: 0.72,
      cohort_shift: 0.7,
    },
    aibl: {
      native_missingness: 0.74,
      calibrated_bands: 0.68,
      cohort_shift: 0.66,
    },
    nacc: {
      native_missingness: 0.82,
      calibrated_bands: 0.8,
      cohort_shift: 0.78,
    },
    oasis: {
      native_missingness: 0.7,
      calibrated_bands: 0.85,
      cohort_shift: 0.6,
    },
    clinic_a: {
      native_missingness: 0.88,
      calibrated_bands: 0.82,
      cohort_shift: 0.85,
    },
    clinic_b: {
      native_missingness: 0.25,
      calibrated_bands: 0.2,
      cohort_shift: 0.15,
    },
    mixed: {
      native_missingness: 0.9,
      calibrated_bands: 0.85,
      cohort_shift: 0.75,
    },
    highrisk: {
      native_missingness: 0.9,
      calibrated_bands: 0.85,
      cohort_shift: 0.75,
    },
    sparse: {
      native_missingness: 0.8,
      calibrated_bands: 0.4,
      cohort_shift: 0.7,
    },
    contaminated: {
      native_missingness: 0.35,
      calibrated_bands: 0.3,
      cohort_shift: 0.25,
    },
    homogeneous: {
      native_missingness: 0.55,
      calibrated_bands: 0.55,
      cohort_shift: 0.55,
    },
    small: {
      native_missingness: 0.5,
      calibrated_bands: 0.45,
      cohort_shift: 0.4,
    },
    large: {
      native_missingness: 0.72,
      calibrated_bands: 0.68,
      cohort_shift: 0.62,
    },
    techlean: {
      native_missingness: 0.25,
      calibrated_bands: 0.2,
      cohort_shift: 0.15,
    },
    flat: {
      native_missingness: 0.25,
      calibrated_bands: 0.2,
      cohort_shift: 0.15,
    },
    // legacy corpus names still resolve for harness reuse
    tka: {
      native_missingness: 0.78,
      calibrated_bands: 0.72,
      cohort_shift: 0.7,
    },
    tha: {
      native_missingness: 0.74,
      calibrated_bands: 0.68,
      cohort_shift: 0.66,
    },
    acl: {
      native_missingness: 0.82,
      calibrated_bands: 0.8,
      cohort_shift: 0.78,
    },
    rotator: {
      native_missingness: 0.7,
      calibrated_bands: 0.85,
      cohort_shift: 0.6,
    },
    spine: {
      native_missingness: 0.88,
      calibrated_bands: 0.82,
      cohort_shift: 0.85,
    },
    fracture: {
      native_missingness: 0.25,
      calibrated_bands: 0.2,
      cohort_shift: 0.15,
    },
    arthritis: {
      native_missingness: 0.72,
      calibrated_bands: 0.78,
      cohort_shift: 0.65,
    },
    sports: {
      native_missingness: 0.8,
      calibrated_bands: 0.75,
      cohort_shift: 0.72,
    },
    revision: {
      native_missingness: 0.66,
      calibrated_bands: 0.58,
      cohort_shift: 0.55,
    },
    infection: {
      native_missingness: 0.6,
      calibrated_bands: 0.7,
      cohort_shift: 0.5,
    },
    rehab_heavy: {
      native_missingness: 0.5,
      calibrated_bands: 0.45,
      cohort_shift: 0.4,
    },
    admission: {
      native_missingness: 0.72,
      calibrated_bands: 0.68,
      cohort_shift: 0.62,
    },
    periop: {
      native_missingness: 0.55,
      calibrated_bands: 0.55,
      cohort_shift: 0.55,
    },
    discharge: {
      native_missingness: 0.35,
      calibrated_bands: 0.3,
      cohort_shift: 0.25,
    },
    rehab: {
      native_missingness: 0.8,
      calibrated_bands: 0.4,
      cohort_shift: 0.7,
    },
    mud: {
      native_missingness: 0.6,
      calibrated_bands: 0.7,
      cohort_shift: 0.5,
    },
    stairs: {
      native_missingness: 0.78,
      calibrated_bands: 0.72,
      cohort_shift: 0.7,
    },
    hurdles: {
      native_missingness: 0.74,
      calibrated_bands: 0.68,
      cohort_shift: 0.66,
    },
    gaps: {
      native_missingness: 0.82,
      calibrated_bands: 0.8,
      cohort_shift: 0.78,
    },
    stones: {
      native_missingness: 0.7,
      calibrated_bands: 0.85,
      cohort_shift: 0.6,
    },
    forest: {
      native_missingness: 0.72,
      calibrated_bands: 0.78,
      cohort_shift: 0.65,
    },
    rubble: {
      native_missingness: 0.8,
      calibrated_bands: 0.75,
      cohort_shift: 0.72,
    },
    slopes: {
      native_missingness: 0.66,
      calibrated_bands: 0.58,
      cohort_shift: 0.55,
    },
    longctx: {
      native_missingness: 0.7,
      calibrated_bands: 0.88,
      cohort_shift: 0.5,
    },
    quant4: {
      native_missingness: 0.58,
      calibrated_bands: 0.42,
      cohort_shift: 0.82,
    },
    kernel: {
      native_missingness: 0.75,
      calibrated_bands: 0.5,
      cohort_shift: 0.9,
    },
    shortbench: {
      native_missingness: 0.25,
      calibrated_bands: 0.15,
      cohort_shift: 0.2,
    },
    port: {
      native_missingness: 0.8,
      calibrated_bands: 0.65,
      cohort_shift: 0.7,
    },
    memory: {
      native_missingness: 0.66,
      calibrated_bands: 0.72,
      cohort_shift: 0.55,
    },
    latency: {
      native_missingness: 0.6,
      calibrated_bands: 0.45,
      cohort_shift: 0.68,
    },
    healthcare: {
      native_missingness: 0.74,
      calibrated_bands: 0.68,
      cohort_shift: 0.55,
    },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    native_missingness: clamp01(0.4 + (h % 7) * 0.07),
    calibrated_bands: clamp01(0.35 + (h % 5) * 0.09),
    cohort_shift: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in feature cells — eligibility = cell complete enough under min_n.
 * Soft simulation; not a clinical diagnostic run.
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

function resolve(input: RiskInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: RiskAxes;
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
  const prefs: RiskAxes = {
    native_missingness: clamp01(
      input.native_missingness_lean !== undefined
        ? Number(input.native_missingness_lean)
        : input.quantum_maps_lean !== undefined
          ? Number(input.quantum_maps_lean)
          : input.skill_library_lean !== undefined
            ? Number(input.skill_library_lean)
            : base.native_missingness + gateBoost,
    ),
    calibrated_bands: clamp01(
      input.calibrated_bands_lean !== undefined
        ? Number(input.calibrated_bands_lean)
        : input.multi_kernel_lean !== undefined
          ? Number(input.multi_kernel_lean)
          : input.perception_lean !== undefined
            ? Number(input.perception_lean)
            : base.calibrated_bands,
    ),
    cohort_shift: clamp01(
      input.cohort_shift_lean !== undefined
        ? Number(input.cohort_shift_lean)
        : input.activity_steering_lean !== undefined
          ? Number(input.activity_steering_lean)
          : input.transitions_lean !== undefined
            ? Number(input.transitions_lean)
            : base.cohort_shift,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, risk_activity };
}

/** Misalignment cost of a plan vs stated imputation-free / calibrated leans. */
export function misalignmentCost(
  prefs: RiskAxes,
  proposal: RiskAxes,
  biasScale: number,
): number {
  const dh = Math.abs(prefs.native_missingness - proposal.native_missingness);
  const de = Math.abs(prefs.calibrated_bands - proposal.calibrated_bands);
  const ds = Math.abs(prefs.cohort_shift - proposal.cohort_shift);
  return round2((dh * 42 + de * 36 + ds * 30) * biasScale + (dh + de + ds) * 8);
}

/** Plan-match effect (higher = closer to required imputation-free capabilities). */
export function matchEffect(prefs: RiskAxes, proposal: RiskAxes): number {
  const dh = 1 - Math.abs(prefs.native_missingness - proposal.native_missingness);
  const de = 1 - Math.abs(prefs.calibrated_bands - proposal.calibrated_bands);
  const ds = 1 - Math.abs(prefs.cohort_shift - proposal.cohort_shift);
  return round4((dh + de + ds) / 3);
}

export function scoreSynthesis(input: RiskInput): RiskResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.uncalibrated_cheat === true ||
    input.single_cohort_cheat === true ||
    input.stage_blind_cheat === true ||
    input.mean_impute_cheat === true ||
    input.skip_transitions_cheat === true ||
    input.flat_only_cheat === true ||
    input.rbf_only_cheat === true ||
    input.feature_blind_cheat === true ||
    input.linear_only_cheat === true
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

  const naiveParametric: RiskAxes = {
    native_missingness: extreme,
    calibrated_bands: extreme,
    cohort_shift: extreme,
  };
  const affinityOnly: RiskAxes = {
    native_missingness: prefs.native_missingness,
    calibrated_bands: extreme,
    cohort_shift: prefs.cohort_shift,
  };
  const externalOnly: RiskAxes = {
    native_missingness: extreme,
    calibrated_bands: prefs.calibrated_bands,
    cohort_shift: prefs.cohort_shift,
  };
  const dual: RiskAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const affinityRisk = misalignmentCost(prefs, affinityOnly, bias_scale);
  const blindRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  const dualRisk = round2(
    misalignmentCost(prefs, dual, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "mean_impute",
    effect: matchEffect(prefs, naiveParametric),
    k_used: k_total,
    risk_score: round2(naiveRisk * 0.96),
    action: "mean_mode_impute_then_flat_classifier",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "uncalibrated",
    effect: matchEffect(prefs, affinityOnly),
    k_used: k_total,
    risk_score: affinityRisk,
    action: "native_missingness_without_calibration",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "single_cohort",
    effect: matchEffect(prefs, externalOnly),
    k_used: k_eligible,
    risk_score: blindRisk,
    action: "calibrated_without_native_missingness",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "imputation_free_calibrated",
    effect: matchEffect(prefs, dual),
    k_used: k_eligible,
    risk_score: dualRisk,
    action: "native_missingness_plus_calibrated_bands_plus_cohort_shift",
    screened: true,
  };

  const mu = round4(
    (prefs.native_missingness + prefs.calibrated_bands + prefs.cohort_shift) /
      3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - dualRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.native_missingness - extreme) +
      Math.abs(prefs.calibrated_bands - extreme) +
      Math.abs(prefs.cohort_shift - extreme),
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

export function scoreGovernance(input: RiskInput): RiskResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: RiskInput): RiskResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: RiskInput): RiskResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: RiskInput): RiskResult {
  return scoreSynthesis(input);
}

export function scoreRisk(input: RiskInput): RiskResult {
  return scoreSynthesis(input);
}
