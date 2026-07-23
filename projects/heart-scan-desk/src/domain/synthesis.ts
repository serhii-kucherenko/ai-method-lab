/**
 * Cardiac CT pathway scoring (paper-inspired, soft simulation).
 * Axes: joint structure+phenotype, phenotype linked to structure, multicenter awareness.
 * Good plan: unified segmentation + phenotyping across centers (human-in-loop).
 * Naive: segmentation-only; phenotype-from-raw-pixels-only; single-center unchecked.
 * Never claim medical device or authors' foundation model. Soft desk only.
 */

export type ScanAxes = {
  /** 0 = segmentation-only then classify, 1 = joint structure+phenotype handling */
  joint_structure: number;
  /** 0 = pheno_pixels high-confidence, 1 = phenotype linked to structure */
  phenotype_link: number;
  /** 0 = single-center unchecked, 1 = multicenter-aware validation aware */
  multicenter: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = ScanAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type ScanInput = {
  /** Center / site profile (adni, aibl, nacc, oasis, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Feature-coverage floor (10–200); higher → stricter acquisition. */
  min_n?: number;
  /** How extreme seg-only answers lean (0.5–3). */
  bias_scale?: number;
  joint_structure_lean?: number;
  phenotype_link_lean?: number;
  multicenter_lean?: number;
  /** Claim unified-seg-pheno while skipping acquisition — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  pheno_pixels_cheat?: boolean;
  single_center_cheat?: boolean;
  stage_blind_cheat?: boolean;
  seg_only_cheat?: boolean;
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
  | "seg_only"
  | "pheno_pixels"
  | "single_center"
  | "unified_seg_pheno";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  pathway_score: number;
  action: string;
  screened: boolean;
};

export type ScanOk = {
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
  prefs: ScanAxes;
  pathway_activity: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type ScanReject = {
  status: "reject";
  reason: string;
};

export type ScanResult = ScanOk | ScanReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = ScanInput;
export type GovernanceResult = ScanResult;
export type SynthesisInput = ScanInput;
export type SynthesisResult = ScanResult;
export type StudyRow = ChartPoint;
export type TactileInput = ScanInput;
export type TactileResult = ScanResult;
export type StageInput = ScanInput;
export type StageResult = ScanResult;
export type StageAxes = ScanAxes;
export type LocoInput = ScanInput;
export type LocoResult = ScanResult;
export type LocoAxes = ScanAxes;
export type KernelInput = ScanInput;
export type KernelResult = ScanResult;
export type KernelAxes = ScanAxes;

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

/** Center / site presets for missingness · calibration · site-shift leans. */
export function preferencePreset(corpus: string): ScanAxes {
  const presets: Record<string, ScanAxes> = {
    default: {
      joint_structure: 0.62,
      phenotype_link: 0.55,
      multicenter: 0.48,
    },
    adni: {
      joint_structure: 0.78,
      phenotype_link: 0.72,
      multicenter: 0.7,
    },
    aibl: {
      joint_structure: 0.74,
      phenotype_link: 0.68,
      multicenter: 0.66,
    },
    nacc: {
      joint_structure: 0.82,
      phenotype_link: 0.8,
      multicenter: 0.78,
    },
    oasis: {
      joint_structure: 0.7,
      phenotype_link: 0.85,
      multicenter: 0.6,
    },
    clinic_a: {
      joint_structure: 0.88,
      phenotype_link: 0.82,
      multicenter: 0.85,
    },
    clinic_b: {
      joint_structure: 0.25,
      phenotype_link: 0.2,
      multicenter: 0.15,
    },
    mixed: {
      joint_structure: 0.9,
      phenotype_link: 0.85,
      multicenter: 0.75,
    },
    highrisk: {
      joint_structure: 0.9,
      phenotype_link: 0.85,
      multicenter: 0.75,
    },
    sparse: {
      joint_structure: 0.8,
      phenotype_link: 0.4,
      multicenter: 0.7,
    },
    contaminated: {
      joint_structure: 0.35,
      phenotype_link: 0.3,
      multicenter: 0.25,
    },
    homogeneous: {
      joint_structure: 0.55,
      phenotype_link: 0.55,
      multicenter: 0.55,
    },
    small: {
      joint_structure: 0.5,
      phenotype_link: 0.45,
      multicenter: 0.4,
    },
    large: {
      joint_structure: 0.72,
      phenotype_link: 0.68,
      multicenter: 0.62,
    },
    techlean: {
      joint_structure: 0.25,
      phenotype_link: 0.2,
      multicenter: 0.15,
    },
    flat: {
      joint_structure: 0.25,
      phenotype_link: 0.2,
      multicenter: 0.15,
    },
    // legacy corpus names still resolve for harness reuse
    tka: {
      joint_structure: 0.78,
      phenotype_link: 0.72,
      multicenter: 0.7,
    },
    tha: {
      joint_structure: 0.74,
      phenotype_link: 0.68,
      multicenter: 0.66,
    },
    acl: {
      joint_structure: 0.82,
      phenotype_link: 0.8,
      multicenter: 0.78,
    },
    rotator: {
      joint_structure: 0.7,
      phenotype_link: 0.85,
      multicenter: 0.6,
    },
    spine: {
      joint_structure: 0.88,
      phenotype_link: 0.82,
      multicenter: 0.85,
    },
    fracture: {
      joint_structure: 0.25,
      phenotype_link: 0.2,
      multicenter: 0.15,
    },
    arthritis: {
      joint_structure: 0.72,
      phenotype_link: 0.78,
      multicenter: 0.65,
    },
    sports: {
      joint_structure: 0.8,
      phenotype_link: 0.75,
      multicenter: 0.72,
    },
    revision: {
      joint_structure: 0.66,
      phenotype_link: 0.58,
      multicenter: 0.55,
    },
    infection: {
      joint_structure: 0.6,
      phenotype_link: 0.7,
      multicenter: 0.5,
    },
    rehab_heavy: {
      joint_structure: 0.5,
      phenotype_link: 0.45,
      multicenter: 0.4,
    },
    admission: {
      joint_structure: 0.72,
      phenotype_link: 0.68,
      multicenter: 0.62,
    },
    periop: {
      joint_structure: 0.55,
      phenotype_link: 0.55,
      multicenter: 0.55,
    },
    discharge: {
      joint_structure: 0.35,
      phenotype_link: 0.3,
      multicenter: 0.25,
    },
    rehab: {
      joint_structure: 0.8,
      phenotype_link: 0.4,
      multicenter: 0.7,
    },
    mud: {
      joint_structure: 0.6,
      phenotype_link: 0.7,
      multicenter: 0.5,
    },
    stairs: {
      joint_structure: 0.78,
      phenotype_link: 0.72,
      multicenter: 0.7,
    },
    hurdles: {
      joint_structure: 0.74,
      phenotype_link: 0.68,
      multicenter: 0.66,
    },
    gaps: {
      joint_structure: 0.82,
      phenotype_link: 0.8,
      multicenter: 0.78,
    },
    stones: {
      joint_structure: 0.7,
      phenotype_link: 0.85,
      multicenter: 0.6,
    },
    forest: {
      joint_structure: 0.72,
      phenotype_link: 0.78,
      multicenter: 0.65,
    },
    rubble: {
      joint_structure: 0.8,
      phenotype_link: 0.75,
      multicenter: 0.72,
    },
    slopes: {
      joint_structure: 0.66,
      phenotype_link: 0.58,
      multicenter: 0.55,
    },
    longctx: {
      joint_structure: 0.7,
      phenotype_link: 0.88,
      multicenter: 0.5,
    },
    quant4: {
      joint_structure: 0.58,
      phenotype_link: 0.42,
      multicenter: 0.82,
    },
    kernel: {
      joint_structure: 0.75,
      phenotype_link: 0.5,
      multicenter: 0.9,
    },
    shortbench: {
      joint_structure: 0.25,
      phenotype_link: 0.15,
      multicenter: 0.2,
    },
    port: {
      joint_structure: 0.8,
      phenotype_link: 0.65,
      multicenter: 0.7,
    },
    memory: {
      joint_structure: 0.66,
      phenotype_link: 0.72,
      multicenter: 0.55,
    },
    latency: {
      joint_structure: 0.6,
      phenotype_link: 0.45,
      multicenter: 0.68,
    },
    healthcare: {
      joint_structure: 0.74,
      phenotype_link: 0.68,
      multicenter: 0.55,
    },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    joint_structure: clamp01(0.4 + (h % 7) * 0.07),
    phenotype_link: clamp01(0.35 + (h % 5) * 0.09),
    multicenter: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in pathway cells — eligibility = cell complete enough under min_n.
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

function resolve(input: ScanInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: ScanAxes;
  pathway_activity: number;
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
  const pathway_activity = round4(min_n / 100);
  const gateBoost = pathway_activity * 0.25;
  const prefs: ScanAxes = {
    joint_structure: clamp01(
      input.joint_structure_lean !== undefined
        ? Number(input.joint_structure_lean)
        : input.quantum_maps_lean !== undefined
          ? Number(input.quantum_maps_lean)
          : input.skill_library_lean !== undefined
            ? Number(input.skill_library_lean)
            : base.joint_structure + gateBoost,
    ),
    phenotype_link: clamp01(
      input.phenotype_link_lean !== undefined
        ? Number(input.phenotype_link_lean)
        : input.multi_kernel_lean !== undefined
          ? Number(input.multi_kernel_lean)
          : input.perception_lean !== undefined
            ? Number(input.perception_lean)
            : base.phenotype_link,
    ),
    multicenter: clamp01(
      input.multicenter_lean !== undefined
        ? Number(input.multicenter_lean)
        : input.activity_steering_lean !== undefined
          ? Number(input.activity_steering_lean)
          : input.transitions_lean !== undefined
            ? Number(input.transitions_lean)
            : base.multicenter,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, pathway_activity };
}

/** Misalignment cost of a plan vs stated unified-seg-pheno / calibrated leans. */
export function misalignmentCost(
  prefs: ScanAxes,
  proposal: ScanAxes,
  biasScale: number,
): number {
  const dh = Math.abs(prefs.joint_structure - proposal.joint_structure);
  const de = Math.abs(prefs.phenotype_link - proposal.phenotype_link);
  const ds = Math.abs(prefs.multicenter - proposal.multicenter);
  return round2((dh * 42 + de * 36 + ds * 30) * biasScale + (dh + de + ds) * 8);
}

/** Plan-match effect (higher = closer to required unified-seg-pheno capabilities). */
export function matchEffect(prefs: ScanAxes, proposal: ScanAxes): number {
  const dh = 1 - Math.abs(prefs.joint_structure - proposal.joint_structure);
  const de = 1 - Math.abs(prefs.phenotype_link - proposal.phenotype_link);
  const ds = 1 - Math.abs(prefs.multicenter - proposal.multicenter);
  return round4((dh + de + ds) / 3);
}

export function scoreSynthesis(input: ScanInput): ScanResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.pheno_pixels_cheat === true ||
    input.single_center_cheat === true ||
    input.stage_blind_cheat === true ||
    input.seg_only_cheat === true ||
    input.skip_transitions_cheat === true ||
    input.flat_only_cheat === true ||
    input.rbf_only_cheat === true ||
    input.feature_blind_cheat === true ||
    input.linear_only_cheat === true
  ) {
    return { status: "reject", reason: "skip_verify_cheat" };
  }

  const { corpus, min_n, bias_scale, points, prefs, pathway_activity } =
    resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;

  const extreme = clamp01(0.08 * bias_scale);

  const naiveParametric: ScanAxes = {
    joint_structure: extreme,
    phenotype_link: extreme,
    multicenter: extreme,
  };
  const affinityOnly: ScanAxes = {
    joint_structure: prefs.joint_structure,
    phenotype_link: extreme,
    multicenter: prefs.multicenter,
  };
  const externalOnly: ScanAxes = {
    joint_structure: extreme,
    phenotype_link: prefs.phenotype_link,
    multicenter: prefs.multicenter,
  };
  const dual: ScanAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const affinityRisk = misalignmentCost(prefs, affinityOnly, bias_scale);
  const blindRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  const dualRisk = round2(
    misalignmentCost(prefs, dual, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "seg_only",
    effect: matchEffect(prefs, naiveParametric),
    k_used: k_total,
    pathway_score: round2(naiveRisk * 0.96),
    action: "seg_only_without_phenotype",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "pheno_pixels",
    effect: matchEffect(prefs, affinityOnly),
    k_used: k_total,
    pathway_score: affinityRisk,
    action: "joint_structure_without_calibration",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "single_center",
    effect: matchEffect(prefs, externalOnly),
    k_used: k_eligible,
    pathway_score: blindRisk,
    action: "calibrated_without_joint_structure",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "unified_seg_pheno",
    effect: matchEffect(prefs, dual),
    k_used: k_eligible,
    pathway_score: dualRisk,
    action: "joint_structure_plus_phenotype_link_plus_multicenter",
    screened: true,
  };

  const mu = round4(
    (prefs.joint_structure + prefs.phenotype_link + prefs.multicenter) /
      3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - dualRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.joint_structure - extreme) +
      Math.abs(prefs.phenotype_link - extreme) +
      Math.abs(prefs.multicenter - extreme),
  );
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );

  const bestNaive = Math.min(naive.pathway_score, affinityRisk, blindRisk);

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
    pathway_activity,
    naive,
    pla: screened,
    screened,
    include_all_fe,
    unweighted_eligible,
    delta_score: round2(naive.pathway_score - dualRisk),
    vs_best_naive: round2(bestNaive - dualRisk),
  };
}

export function scoreGovernance(input: ScanInput): ScanResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: ScanInput): ScanResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: ScanInput): ScanResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: ScanInput): ScanResult {
  return scoreSynthesis(input);
}

export function scoreScan(input: ScanInput): ScanResult {
  return scoreSynthesis(input);
}
