/**
 * Pocket-conditioned + property-aware molecule scoring (paper-inspired).
 * Axes: multi-scale pocket conditioning, binding affinity, developability (ADMET).
 * Pocket-property plan vs unconditioned / ligand-only / affinity-only /
 * property-blind pocket-fill baselines.
 * Soft simulation — not wet-lab chemistry. Never brand ConDitar / msPRL /
 * paOPT / CDH as the product name.
 */

export type MoleculeAxes = {
  /** 0 = ignore pocket geometry, 1 = multi-scale pocket conditioning */
  pocket_conditioning: number;
  /** 0 = ignore binding score, 1 = affinity-aware steering */
  binding_affinity: number;
  /** 0 = property-blind fill, 1 = ADMET / developability steering */
  developability: number;
};

/** Compatibility alias used by goldens / store / UI. */
export type PreferenceAxes = MoleculeAxes;

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type MoleculeInput = {
  /** Pocket / target profile (kinase, protease, gpcr, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Pocket fit floor (10–200); higher → stricter acquisition. */
  min_n?: number;
  /** How extreme unconditioned answers lean (0.5–3). */
  bias_scale?: number;
  pocket_conditioning_lean?: number;
  binding_affinity_lean?: number;
  developability_lean?: number;
  /** Claim pocket-property while skipping acquisition — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
  affinity_only_cheat?: boolean;
  property_blind_cheat?: boolean;
  stage_blind_cheat?: boolean;
  unconditioned_cheat?: boolean;
  /** Compat aliases from prior desk clones */
  skill_library_lean?: number;
  perception_lean?: number;
  transitions_lean?: number;
  skip_transitions_cheat?: boolean;
  flat_only_cheat?: boolean;
};

export type StrategyLabel =
  | "unconditioned"
  | "affinity_only"
  | "property_blind"
  | "pocket_property";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type MoleculeOk = {
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
  prefs: MoleculeAxes;
  risk_developability: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type MoleculeReject = {
  status: "reject";
  reason: string;
};

export type MoleculeResult = MoleculeOk | MoleculeReject;

/** Compatibility aliases used by goldens / store / UI. */
export type GovernanceInput = MoleculeInput;
export type GovernanceResult = MoleculeResult;
export type SynthesisInput = MoleculeInput;
export type SynthesisResult = MoleculeResult;
export type StudyRow = ChartPoint;
export type TactileInput = MoleculeInput;
export type TactileResult = MoleculeResult;
export type StageInput = MoleculeInput;
export type StageResult = MoleculeResult;
export type StageAxes = MoleculeAxes;
export type LocoInput = MoleculeInput;
export type LocoResult = MoleculeResult;
export type LocoAxes = MoleculeAxes;

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

/** Pocket / target presets for pocket · affinity · developability leans. */
export function preferencePreset(corpus: string): MoleculeAxes {
  const presets: Record<string, MoleculeAxes> = {
    default: {
      pocket_conditioning: 0.62,
      binding_affinity: 0.55,
      developability: 0.48,
    },
    tka: {
      pocket_conditioning: 0.78,
      binding_affinity: 0.72,
      developability: 0.7,
    },
    tha: {
      pocket_conditioning: 0.74,
      binding_affinity: 0.68,
      developability: 0.66,
    },
    acl: {
      pocket_conditioning: 0.82,
      binding_affinity: 0.8,
      developability: 0.78,
    },
    rotator: {
      pocket_conditioning: 0.7,
      binding_affinity: 0.85,
      developability: 0.6,
    },
    spine: {
      pocket_conditioning: 0.88,
      binding_affinity: 0.82,
      developability: 0.85,
    },
    fracture: {
      pocket_conditioning: 0.25,
      binding_affinity: 0.2,
      developability: 0.15,
    },
    arthritis: {
      pocket_conditioning: 0.72,
      binding_affinity: 0.78,
      developability: 0.65,
    },
    sports: {
      pocket_conditioning: 0.8,
      binding_affinity: 0.75,
      developability: 0.72,
    },
    revision: {
      pocket_conditioning: 0.66,
      binding_affinity: 0.58,
      developability: 0.55,
    },
    infection: {
      pocket_conditioning: 0.6,
      binding_affinity: 0.7,
      developability: 0.5,
    },
    rehab_heavy: {
      pocket_conditioning: 0.5,
      binding_affinity: 0.45,
      developability: 0.4,
    },
    admission: {
      pocket_conditioning: 0.72,
      binding_affinity: 0.68,
      developability: 0.62,
    },
    periop: {
      pocket_conditioning: 0.55,
      binding_affinity: 0.55,
      developability: 0.55,
    },
    discharge: {
      pocket_conditioning: 0.35,
      binding_affinity: 0.3,
      developability: 0.25,
    },
    rehab: {
      pocket_conditioning: 0.8,
      binding_affinity: 0.4,
      developability: 0.7,
    },
    mixed: {
      pocket_conditioning: 0.9,
      binding_affinity: 0.85,
      developability: 0.75,
    },
    highrisk: {
      pocket_conditioning: 0.9,
      binding_affinity: 0.85,
      developability: 0.75,
    },
    techlean: {
      pocket_conditioning: 0.25,
      binding_affinity: 0.2,
      developability: 0.15,
    },
    small: {
      pocket_conditioning: 0.5,
      binding_affinity: 0.45,
      developability: 0.4,
    },
    large: {
      pocket_conditioning: 0.72,
      binding_affinity: 0.68,
      developability: 0.62,
    },
    homogeneous: {
      pocket_conditioning: 0.55,
      binding_affinity: 0.55,
      developability: 0.55,
    },
    contaminated: {
      pocket_conditioning: 0.35,
      binding_affinity: 0.3,
      developability: 0.25,
    },
    sparse: {
      pocket_conditioning: 0.8,
      binding_affinity: 0.4,
      developability: 0.7,
    },
    flat: {
      pocket_conditioning: 0.25,
      binding_affinity: 0.2,
      developability: 0.15,
    },
    mud: {
      pocket_conditioning: 0.6,
      binding_affinity: 0.7,
      developability: 0.5,
    },
    // legacy corpus names still resolve for harness reuse
    stairs: {
      pocket_conditioning: 0.78,
      binding_affinity: 0.72,
      developability: 0.7,
    },
    hurdles: {
      pocket_conditioning: 0.74,
      binding_affinity: 0.68,
      developability: 0.66,
    },
    gaps: {
      pocket_conditioning: 0.82,
      binding_affinity: 0.8,
      developability: 0.78,
    },
    stones: {
      pocket_conditioning: 0.7,
      binding_affinity: 0.85,
      developability: 0.6,
    },
    forest: {
      pocket_conditioning: 0.72,
      binding_affinity: 0.78,
      developability: 0.65,
    },
    rubble: {
      pocket_conditioning: 0.8,
      binding_affinity: 0.75,
      developability: 0.72,
    },
    slopes: {
      pocket_conditioning: 0.66,
      binding_affinity: 0.58,
      developability: 0.55,
    },
    longctx: {
      pocket_conditioning: 0.7,
      binding_affinity: 0.88,
      developability: 0.5,
    },
    quant4: {
      pocket_conditioning: 0.58,
      binding_affinity: 0.42,
      developability: 0.82,
    },
    kernel: {
      pocket_conditioning: 0.75,
      binding_affinity: 0.5,
      developability: 0.9,
    },
    shortbench: {
      pocket_conditioning: 0.25,
      binding_affinity: 0.15,
      developability: 0.2,
    },
    port: {
      pocket_conditioning: 0.8,
      binding_affinity: 0.65,
      developability: 0.7,
    },
    memory: {
      pocket_conditioning: 0.66,
      binding_affinity: 0.72,
      developability: 0.55,
    },
    latency: {
      pocket_conditioning: 0.6,
      binding_affinity: 0.45,
      developability: 0.68,
    },
    healthcare: {
      pocket_conditioning: 0.74,
      binding_affinity: 0.68,
      developability: 0.55,
    },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    pocket_conditioning: clamp01(0.4 + (h % 7) * 0.07),
    binding_affinity: clamp01(0.35 + (h % 5) * 0.09),
    developability: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in pocket cells — eligibility = cell complete enough
 * under min_n acquisition floor. Soft simulation; not docking engine access.
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

function resolve(input: MoleculeInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: MoleculeAxes;
  risk_developability: number;
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
  const risk_developability = round4(min_n / 100);
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

/** Misalignment cost of a plan vs stated pocket-property / stage leans. */
export function misalignmentCost(
  prefs: MoleculeAxes,
  proposal: MoleculeAxes,
  biasScale: number,
): number {
  const dh = Math.abs(prefs.pocket_conditioning - proposal.pocket_conditioning);
  const de = Math.abs(prefs.binding_affinity - proposal.binding_affinity);
  const ds = Math.abs(prefs.developability - proposal.developability);
  return round2((dh * 42 + de * 36 + ds * 30) * biasScale + (dh + de + ds) * 8);
}

/** Plan-match effect (higher = closer to required pocket-property capabilities). */
export function matchEffect(prefs: MoleculeAxes, proposal: MoleculeAxes): number {
  const dh = 1 - Math.abs(prefs.pocket_conditioning - proposal.pocket_conditioning);
  const de = 1 - Math.abs(prefs.binding_affinity - proposal.binding_affinity);
  const ds = 1 - Math.abs(prefs.developability - proposal.developability);
  return round4((dh + de + ds) / 3);
}

export function scoreSynthesis(input: MoleculeInput): MoleculeResult {
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
    resolve(input);
  const k_total = points.length;
  const kept = points.filter((p) => confirmable(p, min_n));
  const k_eligible = kept.length;
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
  const dual: MoleculeAxes = { ...prefs };

  const naiveRisk = misalignmentCost(prefs, naiveParametric, bias_scale);
  const affinityRisk = misalignmentCost(prefs, affinityOnly, bias_scale);
  const blindRisk = misalignmentCost(prefs, externalOnly, bias_scale);
  const dualRisk = round2(
    misalignmentCost(prefs, dual, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

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
  const q = round4(
    Math.abs(prefs.pocket_conditioning - extreme) +
      Math.abs(prefs.binding_affinity - extreme) +
      Math.abs(prefs.developability - extreme),
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

export function scoreGovernance(input: MoleculeInput): MoleculeResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: MoleculeInput): MoleculeResult {
  return scoreSynthesis(input);
}

export function scoreStage(input: MoleculeInput): MoleculeResult {
  return scoreSynthesis(input);
}

export function scoreLoco(input: MoleculeInput): MoleculeResult {
  return scoreSynthesis(input);
}

export function scoreCare(input: MoleculeInput): MoleculeResult {
  return scoreSynthesis(input);
}
