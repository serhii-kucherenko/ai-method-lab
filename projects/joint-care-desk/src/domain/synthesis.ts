/**
 * Dual-evidence musculoskeletal pathway scoring (paper-inspired).
 * Axes: in-hospital evidence, external knowledge, stage-aware pathway.
 * Dual-evidence plan vs naive parametric-memory / hospital-only /
 * external-only / stage-blind baselines.
 * Soft simulation — not clinical care. Never brand OrthoPilot / CHEESE /
 * OrthoBench / ORACLE as the product name.
 */

export type CareAxes = {
  /** 0 = ignore hospital chart, 1 = retrieve in-hospital evidence */
  hospital_evidence: number;
  /** 0 = ignore guidelines / external knowledge, 1 = ground externally */
  external_knowledge: number;
  /** 0 = stage-blind single-shot, 1 = admission→peri-op→discharge→rehab */
  stage_awareness: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = CareAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type CareInput = {
  /** Care pathway / indication profile (tka, tha, acl, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Evidence completeness floor (10–200); higher → stricter acquisition. */
  min_n?: number;
  /** How extreme naive parametric answers lean (0.5–3). */
  bias_scale?: number;
  hospital_evidence_lean?: number;
  external_knowledge_lean?: number;
  stage_awareness_lean?: number;
  /** Claim dual-evidence while skipping acquisition — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  hospital_only_cheat?: boolean;
  external_only_cheat?: boolean;
  stage_blind_cheat?: boolean;
  parametric_cheat?: boolean;
  /** Compat aliases from prior desk clones */
  skill_library_lean?: number;
  perception_lean?: number;
  transitions_lean?: number;
  skip_transitions_cheat?: boolean;
  flat_only_cheat?: boolean;
};

export type StrategyLabel =
  | "naive_parametric"
  | "hospital_only"
  | "external_only"
  | "dual_evidence";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type CareOk = {
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
  prefs: CareAxes;
  risk_perception: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type CareReject = {
  status: "reject";
  reason: string;
};

export type CareResult = CareOk | CareReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = CareInput;
export type GovernanceResult = CareResult;
export type SynthesisInput = CareInput;
export type SynthesisResult = CareResult;
export type StudyRow = ChartPoint;
export type TactileInput = CareInput;
export type TactileResult = CareResult;
export type StageInput = CareInput;
export type StageResult = CareResult;
export type StageAxes = CareAxes;
export type LocoInput = CareInput;
export type LocoResult = CareResult;
export type LocoAxes = CareAxes;

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

/** Indication / pathway presets for hospital · external · stage leans. */
export function preferencePreset(corpus: string): CareAxes {
  const presets: Record<string, CareAxes> = {
    default: {
      hospital_evidence: 0.62,
      external_knowledge: 0.55,
      stage_awareness: 0.48,
    },
    tka: {
      hospital_evidence: 0.78,
      external_knowledge: 0.72,
      stage_awareness: 0.7,
    },
    tha: {
      hospital_evidence: 0.74,
      external_knowledge: 0.68,
      stage_awareness: 0.66,
    },
    acl: {
      hospital_evidence: 0.82,
      external_knowledge: 0.8,
      stage_awareness: 0.78,
    },
    rotator: {
      hospital_evidence: 0.7,
      external_knowledge: 0.85,
      stage_awareness: 0.6,
    },
    spine: {
      hospital_evidence: 0.88,
      external_knowledge: 0.82,
      stage_awareness: 0.85,
    },
    fracture: {
      hospital_evidence: 0.25,
      external_knowledge: 0.2,
      stage_awareness: 0.15,
    },
    arthritis: {
      hospital_evidence: 0.72,
      external_knowledge: 0.78,
      stage_awareness: 0.65,
    },
    sports: {
      hospital_evidence: 0.8,
      external_knowledge: 0.75,
      stage_awareness: 0.72,
    },
    revision: {
      hospital_evidence: 0.66,
      external_knowledge: 0.58,
      stage_awareness: 0.55,
    },
    infection: {
      hospital_evidence: 0.6,
      external_knowledge: 0.7,
      stage_awareness: 0.5,
    },
    rehab_heavy: {
      hospital_evidence: 0.5,
      external_knowledge: 0.45,
      stage_awareness: 0.4,
    },
    admission: {
      hospital_evidence: 0.72,
      external_knowledge: 0.68,
      stage_awareness: 0.62,
    },
    periop: {
      hospital_evidence: 0.55,
      external_knowledge: 0.55,
      stage_awareness: 0.55,
    },
    discharge: {
      hospital_evidence: 0.35,
      external_knowledge: 0.3,
      stage_awareness: 0.25,
    },
    rehab: {
      hospital_evidence: 0.8,
      external_knowledge: 0.4,
      stage_awareness: 0.7,
    },
    mixed: {
      hospital_evidence: 0.9,
      external_knowledge: 0.85,
      stage_awareness: 0.75,
    },
    highrisk: {
      hospital_evidence: 0.9,
      external_knowledge: 0.85,
      stage_awareness: 0.75,
    },
    techlean: {
      hospital_evidence: 0.25,
      external_knowledge: 0.2,
      stage_awareness: 0.15,
    },
    small: {
      hospital_evidence: 0.5,
      external_knowledge: 0.45,
      stage_awareness: 0.4,
    },
    large: {
      hospital_evidence: 0.72,
      external_knowledge: 0.68,
      stage_awareness: 0.62,
    },
    homogeneous: {
      hospital_evidence: 0.55,
      external_knowledge: 0.55,
      stage_awareness: 0.55,
    },
    contaminated: {
      hospital_evidence: 0.35,
      external_knowledge: 0.3,
      stage_awareness: 0.25,
    },
    sparse: {
      hospital_evidence: 0.8,
      external_knowledge: 0.4,
      stage_awareness: 0.7,
    },
    flat: {
      hospital_evidence: 0.25,
      external_knowledge: 0.2,
      stage_awareness: 0.15,
    },
    mud: {
      hospital_evidence: 0.6,
      external_knowledge: 0.7,
      stage_awareness: 0.5,
    },
    // legacy corpus names still resolve for harness reuse
    stairs: {
      hospital_evidence: 0.78,
      external_knowledge: 0.72,
      stage_awareness: 0.7,
    },
    hurdles: {
      hospital_evidence: 0.74,
      external_knowledge: 0.68,
      stage_awareness: 0.66,
    },
    gaps: {
      hospital_evidence: 0.82,
      external_knowledge: 0.8,
      stage_awareness: 0.78,
    },
    stones: {
      hospital_evidence: 0.7,
      external_knowledge: 0.85,
      stage_awareness: 0.6,
    },
    forest: {
      hospital_evidence: 0.72,
      external_knowledge: 0.78,
      stage_awareness: 0.65,
    },
    rubble: {
      hospital_evidence: 0.8,
      external_knowledge: 0.75,
      stage_awareness: 0.72,
    },
    slopes: {
      hospital_evidence: 0.66,
      external_knowledge: 0.58,
      stage_awareness: 0.55,
    },
    longctx: {
      hospital_evidence: 0.7,
      external_knowledge: 0.88,
      stage_awareness: 0.5,
    },
    quant4: {
      hospital_evidence: 0.58,
      external_knowledge: 0.42,
      stage_awareness: 0.82,
    },
    kernel: {
      hospital_evidence: 0.75,
      external_knowledge: 0.5,
      stage_awareness: 0.9,
    },
    shortbench: {
      hospital_evidence: 0.25,
      external_knowledge: 0.15,
      stage_awareness: 0.2,
    },
    port: {
      hospital_evidence: 0.8,
      external_knowledge: 0.65,
      stage_awareness: 0.7,
    },
    memory: {
      hospital_evidence: 0.66,
      external_knowledge: 0.72,
      stage_awareness: 0.55,
    },
    latency: {
      hospital_evidence: 0.6,
      external_knowledge: 0.45,
      stage_awareness: 0.68,
    },
    healthcare: {
      hospital_evidence: 0.74,
      external_knowledge: 0.68,
      stage_awareness: 0.55,
    },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    hospital_evidence: clamp01(0.4 + (h % 7) * 0.07),
    external_knowledge: clamp01(0.35 + (h % 5) * 0.09),
    stage_awareness: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in evidence cells — eligibility = cell complete enough
 * under min_n acquisition floor. Soft simulation; not EHR access.
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

function resolve(input: CareInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: CareAxes;
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
  const prefs: CareAxes = {
    hospital_evidence: clamp01(
      input.hospital_evidence_lean !== undefined
        ? Number(input.hospital_evidence_lean)
        : input.skill_library_lean !== undefined
          ? Number(input.skill_library_lean)
          : base.hospital_evidence + gateBoost,
    ),
    external_knowledge: clamp01(
      input.external_knowledge_lean !== undefined
        ? Number(input.external_knowledge_lean)
        : input.perception_lean !== undefined
          ? Number(input.perception_lean)
          : base.external_knowledge,
    ),
    stage_awareness: clamp01(
      input.stage_awareness_lean !== undefined
        ? Number(input.stage_awareness_lean)
        : input.transitions_lean !== undefined
          ? Number(input.transitions_lean)
          : base.stage_awareness,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, risk_perception };
}

/** Misalignment cost of a plan vs stated dual-evidence / stage leans. */
export function misalignmentCost(
  prefs: CareAxes,
  proposal: CareAxes,
  biasScale: number,
): number {
  const dh = Math.abs(prefs.hospital_evidence - proposal.hospital_evidence);
  const de = Math.abs(prefs.external_knowledge - proposal.external_knowledge);
  const ds = Math.abs(prefs.stage_awareness - proposal.stage_awareness);
  return round2((dh * 42 + de * 36 + ds * 30) * biasScale + (dh + de + ds) * 8);
}

/** Plan-match effect (higher = closer to required dual-evidence capabilities). */
export function matchEffect(prefs: CareAxes, proposal: CareAxes): number {
  const dh = 1 - Math.abs(prefs.hospital_evidence - proposal.hospital_evidence);
  const de = 1 - Math.abs(prefs.external_knowledge - proposal.external_knowledge);
  const ds = 1 - Math.abs(prefs.stage_awareness - proposal.stage_awareness);
  return round4((dh + de + ds) / 3);
}

export function scoreSynthesis(input: CareInput): CareResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true ||
    input.hospital_only_cheat === true ||
    input.external_only_cheat === true ||
    input.stage_blind_cheat === true ||
    input.parametric_cheat === true ||
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

  const naiveParametric: CareAxes = {
    hospital_evidence: extreme,
    external_knowledge: extreme,
    stage_awareness: extreme,
  };
  const hospitalOnly: CareAxes = {
    hospital_evidence: prefs.hospital_evidence,
    external_knowledge: extreme,
    stage_awareness: prefs.stage_awareness,
  };
  const externalOnly: CareAxes = {
    hospital_evidence: extreme,
    external_knowledge: prefs.external_knowledge,
    stage_awareness: prefs.stage_awareness,
  };
  const dual: CareAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const hospitalRisk = misalignmentCost(prefs, hospitalOnly, bias_scale);
  const externalRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  const dualRisk = round2(
    misalignmentCost(prefs, dual, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "naive_parametric",
    effect: matchEffect(prefs, naiveParametric),
    k_used: k_total,
    risk_score: round2(naiveRisk * 0.96),
    action: "parametric_memory_only_single_shot",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "hospital_only",
    effect: matchEffect(prefs, hospitalOnly),
    k_used: k_total,
    risk_score: hospitalRisk,
    action: "hospital_evidence_without_external_knowledge",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "external_only",
    effect: matchEffect(prefs, externalOnly),
    k_used: k_eligible,
    risk_score: externalRisk,
    action: "external_knowledge_without_hospital_evidence",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "dual_evidence",
    effect: matchEffect(prefs, dual),
    k_used: k_eligible,
    risk_score: dualRisk,
    action: "hospital_plus_external_plus_stage_aware_pathway",
    screened: true,
  };

  const mu = round4(
    (prefs.hospital_evidence + prefs.external_knowledge + prefs.stage_awareness) /
      3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (naiveRisk - dualRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.hospital_evidence - extreme) +
      Math.abs(prefs.external_knowledge - extreme) +
      Math.abs(prefs.stage_awareness - extreme),
  );
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );

  const bestNaive = Math.min(naive.risk_score, hospitalRisk, externalRisk);

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
    delta_score: round2(naive.risk_score - dualRisk),
    vs_best_naive: round2(bestNaive - dualRisk),
  };
}

export function scoreGovernance(input: CareInput): CareResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: CareInput): CareResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: CareInput): CareResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: CareInput): CareResult {
  return scoreSynthesis(input);
}

export function scoreCare(input: CareInput): CareResult {
  return scoreSynthesis(input);
}
