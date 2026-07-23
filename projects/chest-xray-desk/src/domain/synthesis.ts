/**
 * Chest X-ray detection scoring (paper-inspired, soft simulation).
 * Axes: label + region localization, clinical validation gate, clinical_validate awareness.
 * Good plan: classify → localize → clinically validate across sites (human-in-loop).
 * Naive: classification-only; localization without clinical gate; unverified single-threshold alerts.
 * Never claim medical device / radiology product or authors' Thailand deep learning system. Soft desk only.
 */

export type XrayAxes = {
  /** 0 = classification-only without regions, 1 = label + region localization handling */
  label_region: number;
  /** 0 = localize_no_gate high-confidence, 1 = clinical validation gate */
  clinical_gate: number;
  /** 0 = unverified single-threshold alerts, 1 = clinical validation awareness aware */
  clinical_validate: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = XrayAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type XrayInput = {
  /** Site / protocol profile (adni, aibl, nacc, oasis, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Feature-coverage floor (10–200); higher → stricter acquisition. */
  min_n?: number;
  /** How extreme classify-only answers lean (0.5–3). */
  bias_scale?: number;
  label_region_lean?: number;
  clinical_gate_lean?: number;
  clinical_validate_lean?: number;
  /** Claim classify-localize-validate while skipping acquisition — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  localize_no_gate_cheat?: boolean;
  threshold_alert_cheat?: boolean;
  stage_blind_cheat?: boolean;
  classify_only_cheat?: boolean;
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
  | "classify_only"
  | "localize_no_gate"
  | "threshold_alert"
  | "classify_localize_validate";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  plan_score: number;
  action: string;
  screened: boolean;
};

export type XrayOk = {
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
  prefs: XrayAxes;
  plan_activity: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type XrayReject = {
  status: "reject";
  reason: string;
};

export type XrayResult = XrayOk | XrayReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = XrayInput;
export type GovernanceResult = XrayResult;
export type SynthesisInput = XrayInput;
export type SynthesisResult = XrayResult;
export type StudyRow = ChartPoint;
export type TactileInput = XrayInput;
export type TactileResult = XrayResult;
export type StageInput = XrayInput;
export type StageResult = XrayResult;
export type StageAxes = XrayAxes;
export type LocoInput = XrayInput;
export type LocoResult = XrayResult;
export type LocoAxes = XrayAxes;
export type KernelInput = XrayInput;
export type KernelResult = XrayResult;
export type KernelAxes = XrayAxes;

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

/** Site / protocol presets for missingness · calibration · site-shift leans. */
export function preferencePreset(corpus: string): XrayAxes {
  const presets: Record<string, XrayAxes> = {
    default: {
      label_region: 0.62,
      clinical_gate: 0.55,
      clinical_validate: 0.48,
    },
    adni: {
      label_region: 0.78,
      clinical_gate: 0.72,
      clinical_validate: 0.7,
    },
    aibl: {
      label_region: 0.74,
      clinical_gate: 0.68,
      clinical_validate: 0.66,
    },
    nacc: {
      label_region: 0.82,
      clinical_gate: 0.8,
      clinical_validate: 0.78,
    },
    oasis: {
      label_region: 0.7,
      clinical_gate: 0.85,
      clinical_validate: 0.6,
    },
    clinic_a: {
      label_region: 0.88,
      clinical_gate: 0.82,
      clinical_validate: 0.85,
    },
    clinic_b: {
      label_region: 0.25,
      clinical_gate: 0.2,
      clinical_validate: 0.15,
    },
    mixed: {
      label_region: 0.9,
      clinical_gate: 0.85,
      clinical_validate: 0.75,
    },
    highrisk: {
      label_region: 0.9,
      clinical_gate: 0.85,
      clinical_validate: 0.75,
    },
    sparse: {
      label_region: 0.8,
      clinical_gate: 0.4,
      clinical_validate: 0.7,
    },
    contaminated: {
      label_region: 0.35,
      clinical_gate: 0.3,
      clinical_validate: 0.25,
    },
    homogeneous: {
      label_region: 0.55,
      clinical_gate: 0.55,
      clinical_validate: 0.55,
    },
    small: {
      label_region: 0.5,
      clinical_gate: 0.45,
      clinical_validate: 0.4,
    },
    large: {
      label_region: 0.72,
      clinical_gate: 0.68,
      clinical_validate: 0.62,
    },
    techlean: {
      label_region: 0.25,
      clinical_gate: 0.2,
      clinical_validate: 0.15,
    },
    flat: {
      label_region: 0.25,
      clinical_gate: 0.2,
      clinical_validate: 0.15,
    },
    // legacy corpus names still resolve for harness reuse
    tka: {
      label_region: 0.78,
      clinical_gate: 0.72,
      clinical_validate: 0.7,
    },
    tha: {
      label_region: 0.74,
      clinical_gate: 0.68,
      clinical_validate: 0.66,
    },
    acl: {
      label_region: 0.82,
      clinical_gate: 0.8,
      clinical_validate: 0.78,
    },
    rotator: {
      label_region: 0.7,
      clinical_gate: 0.85,
      clinical_validate: 0.6,
    },
    spine: {
      label_region: 0.88,
      clinical_gate: 0.82,
      clinical_validate: 0.85,
    },
    fracture: {
      label_region: 0.25,
      clinical_gate: 0.2,
      clinical_validate: 0.15,
    },
    arthritis: {
      label_region: 0.72,
      clinical_gate: 0.78,
      clinical_validate: 0.65,
    },
    sports: {
      label_region: 0.8,
      clinical_gate: 0.75,
      clinical_validate: 0.72,
    },
    revision: {
      label_region: 0.66,
      clinical_gate: 0.58,
      clinical_validate: 0.55,
    },
    infection: {
      label_region: 0.6,
      clinical_gate: 0.7,
      clinical_validate: 0.5,
    },
    rehab_heavy: {
      label_region: 0.5,
      clinical_gate: 0.45,
      clinical_validate: 0.4,
    },
    admission: {
      label_region: 0.72,
      clinical_gate: 0.68,
      clinical_validate: 0.62,
    },
    periop: {
      label_region: 0.55,
      clinical_gate: 0.55,
      clinical_validate: 0.55,
    },
    discharge: {
      label_region: 0.35,
      clinical_gate: 0.3,
      clinical_validate: 0.25,
    },
    rehab: {
      label_region: 0.8,
      clinical_gate: 0.4,
      clinical_validate: 0.7,
    },
    mud: {
      label_region: 0.6,
      clinical_gate: 0.7,
      clinical_validate: 0.5,
    },
    stairs: {
      label_region: 0.78,
      clinical_gate: 0.72,
      clinical_validate: 0.7,
    },
    hurdles: {
      label_region: 0.74,
      clinical_gate: 0.68,
      clinical_validate: 0.66,
    },
    gaps: {
      label_region: 0.82,
      clinical_gate: 0.8,
      clinical_validate: 0.78,
    },
    stones: {
      label_region: 0.7,
      clinical_gate: 0.85,
      clinical_validate: 0.6,
    },
    forest: {
      label_region: 0.72,
      clinical_gate: 0.78,
      clinical_validate: 0.65,
    },
    rubble: {
      label_region: 0.8,
      clinical_gate: 0.75,
      clinical_validate: 0.72,
    },
    slopes: {
      label_region: 0.66,
      clinical_gate: 0.58,
      clinical_validate: 0.55,
    },
    longctx: {
      label_region: 0.7,
      clinical_gate: 0.88,
      clinical_validate: 0.5,
    },
    quant4: {
      label_region: 0.58,
      clinical_gate: 0.42,
      clinical_validate: 0.82,
    },
    kernel: {
      label_region: 0.75,
      clinical_gate: 0.5,
      clinical_validate: 0.9,
    },
    shortbench: {
      label_region: 0.25,
      clinical_gate: 0.15,
      clinical_validate: 0.2,
    },
    port: {
      label_region: 0.8,
      clinical_gate: 0.65,
      clinical_validate: 0.7,
    },
    memory: {
      label_region: 0.66,
      clinical_gate: 0.72,
      clinical_validate: 0.55,
    },
    latency: {
      label_region: 0.6,
      clinical_gate: 0.45,
      clinical_validate: 0.68,
    },
    healthcare: {
      label_region: 0.74,
      clinical_gate: 0.68,
      clinical_validate: 0.55,
    },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    label_region: clamp01(0.4 + (h % 7) * 0.07),
    clinical_gate: clamp01(0.35 + (h % 5) * 0.09),
    clinical_validate: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in plan cells — eligibility = cell complete enough under min_n.
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

function resolve(input: XrayInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: XrayAxes;
  plan_activity: number;
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
  const plan_activity = round4(min_n / 100);
  const gateBoost = plan_activity * 0.25;
  const prefs: XrayAxes = {
    label_region: clamp01(
      input.label_region_lean !== undefined
        ? Number(input.label_region_lean)
        : input.quantum_maps_lean !== undefined
          ? Number(input.quantum_maps_lean)
          : input.skill_library_lean !== undefined
            ? Number(input.skill_library_lean)
            : base.label_region + gateBoost,
    ),
    clinical_gate: clamp01(
      input.clinical_gate_lean !== undefined
        ? Number(input.clinical_gate_lean)
        : input.multi_kernel_lean !== undefined
          ? Number(input.multi_kernel_lean)
          : input.perception_lean !== undefined
            ? Number(input.perception_lean)
            : base.clinical_gate,
    ),
    clinical_validate: clamp01(
      input.clinical_validate_lean !== undefined
        ? Number(input.clinical_validate_lean)
        : input.activity_steering_lean !== undefined
          ? Number(input.activity_steering_lean)
          : input.transitions_lean !== undefined
            ? Number(input.transitions_lean)
            : base.clinical_validate,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, plan_activity };
}

/** Misalignment cost of a plan vs stated classify-localize-validate / calibrated leans. */
export function misalignmentCost(
  prefs: XrayAxes,
  proposal: XrayAxes,
  biasScale: number,
): number {
  const dh = Math.abs(prefs.label_region - proposal.label_region);
  const de = Math.abs(prefs.clinical_gate - proposal.clinical_gate);
  const ds = Math.abs(prefs.clinical_validate - proposal.clinical_validate);
  return round2((dh * 42 + de * 36 + ds * 30) * biasScale + (dh + de + ds) * 8);
}

/** Plan-match effect (higher = closer to required classify-localize-validate capabilities). */
export function matchEffect(prefs: XrayAxes, proposal: XrayAxes): number {
  const dh = 1 - Math.abs(prefs.label_region - proposal.label_region);
  const de = 1 - Math.abs(prefs.clinical_gate - proposal.clinical_gate);
  const ds = 1 - Math.abs(prefs.clinical_validate - proposal.clinical_validate);
  return round4((dh + de + ds) / 3);
}

export function scoreSynthesis(input: XrayInput): XrayResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.localize_no_gate_cheat === true ||
    input.threshold_alert_cheat === true ||
    input.stage_blind_cheat === true ||
    input.classify_only_cheat === true ||
    input.skip_transitions_cheat === true ||
    input.flat_only_cheat === true ||
    input.rbf_only_cheat === true ||
    input.feature_blind_cheat === true ||
    input.linear_only_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points, prefs, plan_activity } =
    resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;

  const extreme = clamp01(0.08 * bias_scale);

  const naiveParametric: XrayAxes = {
    label_region: extreme,
    clinical_gate: extreme,
    clinical_validate: extreme,
  };
  const affinityOnly: XrayAxes = {
    label_region: prefs.label_region,
    clinical_gate: extreme,
    clinical_validate: prefs.clinical_validate,
  };
  const externalOnly: XrayAxes = {
    label_region: extreme,
    clinical_gate: prefs.clinical_gate,
    clinical_validate: prefs.clinical_validate,
  };
  const dual: XrayAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const affinityRisk = misalignmentCost(prefs, affinityOnly, bias_scale);
  const blindRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  const dualRisk = round2(
    misalignmentCost(prefs, dual, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "classify_only",
    effect: matchEffect(prefs, naiveParametric),
    k_used: k_total,
    plan_score: round2(naiveRisk * 0.96),
    action: "classify_only_without_regions",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "localize_no_gate",
    effect: matchEffect(prefs, affinityOnly),
    k_used: k_total,
    plan_score: affinityRisk,
    action: "localize_without_clinical_gate",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "threshold_alert",
    effect: matchEffect(prefs, externalOnly),
    k_used: k_eligible,
    plan_score: blindRisk,
    action: "calibrated_without_label_region",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "classify_localize_validate",
    effect: matchEffect(prefs, dual),
    k_used: k_eligible,
    plan_score: dualRisk,
    action: "label_region_plus_clinical_gate_plus_clinical_validate",
    screened: true,
  };

  const mu = round4(
    (prefs.label_region + prefs.clinical_gate + prefs.clinical_validate) /
      3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - dualRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.label_region - extreme) +
      Math.abs(prefs.clinical_gate - extreme) +
      Math.abs(prefs.clinical_validate - extreme),
  );
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );

  const bestNaive = Math.min(naive.plan_score, affinityRisk, blindRisk);

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
    plan_activity,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive.plan_score - dualRisk),
    vs_best_naive: round2(bestNaive - dualRisk),
  };
}

export function scoreGovernance(input: XrayInput): XrayResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: XrayInput): XrayResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: XrayInput): XrayResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: XrayInput): XrayResult {
  return scoreSynthesis(input);
}

export function scoreXray(input: XrayInput): XrayResult {
  return scoreSynthesis(input);
}
