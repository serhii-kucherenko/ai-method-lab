/**
 * Conjoint-style AI governance preference scoring (paper-inspired).
 * Axes: safety↔innovation, public↔private, international↔national.
 * Preference-aligned proposal vs always-innovation / always-private /
 * always-national (and tech-first composite). Lab method experiment —
 * never brand as a government AI regulator or EU AI Act product.
 */

export type PreferenceAxes = {
  /** 0 = innovation pole, 1 = safety pole */
  safety: number;
  /** 0 = private pole, 1 = public pole */
  public: number;
  /** 0 = national pole, 1 = international pole */
  international: number;
};

export type ChartPoint = {
  layer: number;
  index: number;
  value: number;
};

export type GovernanceInput = {
  /** Profile / domain preset (workplace, policing, warfare, …). */
  corpus?: string;
  points?: ChartPoint[];
  /** Risk-perception floor (10–200); higher → stronger safety lean. */
  min_n?: number;
  /** How extreme the tech-first / always-* baselines lean (0.5–3). */
  bias_scale?: number;
  safety_lean?: number;
  public_lean?: number;
  international_lean?: number;
  /** Claim preference-aligned while ignoring prefs — must reject. */
  skip_verify_cheat?: boolean;
  perfect_homogeneity_cheat?: boolean;
  ignore_prefs_cheat?: boolean;
};

export type StrategyLabel =
  | "always_innovation"
  | "always_private"
  | "always_national"
  | "preference_aligned";

export type StrategyScore = {
  label: StrategyLabel;
  effect: number;
  k_used: number;
  risk_score: number;
  action: string;
  screened: boolean;
};

export type GovernanceOk = {
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
  prefs: PreferenceAxes;
  risk_perception: number;
  naive: StrategyScore;
  pla: StrategyScore;
  screened: StrategyScore;
  include_all_fe: StrategyScore;
  unweighted_eligible: StrategyScore;
  delta_score: number;
  vs_best_naive: number;
};

export type GovernanceReject = {
  status: "reject";
  reason: string;
};

export type GovernanceResult = GovernanceOk | GovernanceReject;

/** Compatibility aliases used by goldens / store / UI. */
export type SynthesisInput = GovernanceInput;
export type SynthesisResult = GovernanceResult;
export type StudyRow = ChartPoint;
export type TactileInput = GovernanceInput;
export type TactileResult = GovernanceResult;

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

/** Domain / profile presets for conjoint preference leans. */
export function preferencePreset(corpus: string): PreferenceAxes {
  const presets: Record<string, PreferenceAxes> = {
    default: { safety: 0.62, public: 0.55, international: 0.48 },
    workplace: { safety: 0.58, public: 0.42, international: 0.35 },
    policing: { safety: 0.78, public: 0.72, international: 0.5 },
    warfare: { safety: 0.88, public: 0.82, international: 0.8 },
    healthcare: { safety: 0.74, public: 0.68, international: 0.55 },
    education: { safety: 0.6, public: 0.65, international: 0.45 },
    finance: { safety: 0.7, public: 0.5, international: 0.6 },
    transport: { safety: 0.66, public: 0.58, international: 0.52 },
    small: { safety: 0.5, public: 0.45, international: 0.4 },
    large: { safety: 0.72, public: 0.68, international: 0.62 },
    homogeneous: { safety: 0.55, public: 0.55, international: 0.55 },
    contaminated: { safety: 0.35, public: 0.3, international: 0.25 },
    sparse: { safety: 0.8, public: 0.4, international: 0.7 },
    highrisk: { safety: 0.9, public: 0.85, international: 0.75 },
    techlean: { safety: 0.25, public: 0.2, international: 0.15 },
  };
  if (presets[corpus]) return { ...presets[corpus]! };
  const h = corpus.length;
  return {
    safety: clamp01(0.4 + (h % 7) * 0.07),
    public: clamp01(0.35 + (h % 5) * 0.09),
    international: clamp01(0.3 + (h % 6) * 0.08),
  };
}

/**
 * Soft stand-in rows for harness charts — eligibility = axis clarity under
 * risk floor (min_n). Higher risk perception excludes ambiguous preference cells.
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
    workplace: { k: 7, base: 38, layers: 3, hard: [1, 5] },
    policing: { k: 9, base: 48, layers: 4, hard: [0, 2, 7] },
    warfare: { k: 10, base: 55, layers: 5, hard: [1, 3, 8] },
    healthcare: { k: 8, base: 44, layers: 4, hard: [2, 6] },
    education: { k: 6, base: 36, layers: 3, hard: [0, 4] },
    finance: { k: 8, base: 46, layers: 4, hard: [1, 5] },
    transport: { k: 7, base: 40, layers: 3, hard: [2] },
    small: { k: 4, base: 28, layers: 3, hard: [1] },
    large: { k: 12, base: 55, layers: 5, hard: [2, 5, 9] },
    homogeneous: { k: 6, base: 40, layers: 4, hard: [] },
    contaminated: { k: 10, base: 35, layers: 4, hard: [0, 1, 2, 7] },
    sparse: { k: 5, base: 22, layers: 2, hard: [0, 4] },
    highrisk: { k: 9, base: 50, layers: 5, hard: [0, 3, 6] },
    techlean: { k: 6, base: 30, layers: 3, hard: [1, 4] },
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

/** Preference cell is clear enough under the risk-perception floor. */
export function confirmable(p: ChartPoint, minN: number): boolean {
  const address = p.layer * 12 + p.index * 4 + 20;
  return address >= minN;
}

function resolve(input: GovernanceInput): {
  corpus: string;
  min_n: number;
  bias_scale: number;
  points: ChartPoint[];
  prefs: PreferenceAxes;
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
  const safetyBoost = risk_perception * 0.25;
  const prefs: PreferenceAxes = {
    safety: clamp01(
      input.safety_lean !== undefined
        ? Number(input.safety_lean)
        : base.safety + safetyBoost,
    ),
    public: clamp01(
      input.public_lean !== undefined ? Number(input.public_lean) : base.public,
    ),
    international: clamp01(
      input.international_lean !== undefined
        ? Number(input.international_lean)
        : base.international,
    ),
  };

  return { corpus, min_n, bias_scale, points, prefs, risk_perception };
}

/** Misalignment cost of a proposal vs stated preference leans. */
export function misalignmentCost(
  prefs: PreferenceAxes,
  proposal: PreferenceAxes,
  biasScale: number,
): number {
  const ds = Math.abs(prefs.safety - proposal.safety);
  const dp = Math.abs(prefs.public - proposal.public);
  const di = Math.abs(prefs.international - proposal.international);
  return round2((ds * 42 + dp * 36 + di * 30) * biasScale + (ds + dp + di) * 8);
}

/** Preference-match effect (higher = closer to public lean). */
export function matchEffect(
  prefs: PreferenceAxes,
  proposal: PreferenceAxes,
): number {
  const ds = 1 - Math.abs(prefs.safety - proposal.safety);
  const dp = 1 - Math.abs(prefs.public - proposal.public);
  const di = 1 - Math.abs(prefs.international - proposal.international);
  return round4((ds + dp + di) / 3);
}

export function scoreSynthesis(input: GovernanceInput): GovernanceResult {
  if (
    input.skip_verify_cheat === true ||
    input.perfect_homogeneity_cheat === true ||
    input.ignore_prefs_cheat === true
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

  const alwaysInnovation: PreferenceAxes = {
    safety: extreme,
    public: prefs.public,
    international: prefs.international,
  };
  const alwaysPrivate: PreferenceAxes = {
    safety: prefs.safety,
    public: extreme,
    international: prefs.international,
  };
  const alwaysNational: PreferenceAxes = {
    safety: prefs.safety,
    public: prefs.public,
    international: extreme,
  };
  const techFirst: PreferenceAxes = {
    safety: extreme,
    public: extreme,
    international: extreme,
  };
  const aligned: PreferenceAxes = { ...prefs };

  const innovRisk = misalignmentCost(prefs, alwaysInnovation, bias_scale);
  const privateRisk = misalignmentCost(prefs, alwaysPrivate, bias_scale);
  const nationalRisk = misalignmentCost(prefs, alwaysNational, bias_scale);
  const techRisk = misalignmentCost(prefs, techFirst, bias_scale);
  const alignedRisk = round2(
    misalignmentCost(prefs, aligned, 1) * 0.15 +
      Math.min(6, k_excluded) * 0.6 +
      bias_scale * 0.5,
  );

  const naive: StrategyScore = {
    label: "always_innovation",
    effect: matchEffect(prefs, techFirst),
    k_used: k_total,
    risk_score: round2(Math.max(innovRisk, techRisk * 0.92)),
    action: "tech_first_ignore_safety_public_intl",
    screened: false,
  };
  const include_all_fe: StrategyScore = {
    label: "always_private",
    effect: matchEffect(prefs, alwaysPrivate),
    k_used: k_total,
    risk_score: privateRisk,
    action: "always_private_governance",
    screened: false,
  };
  const unweighted_eligible: StrategyScore = {
    label: "always_national",
    effect: matchEffect(prefs, alwaysNational),
    k_used: k_eligible,
    risk_score: nationalRisk,
    action: "always_national_scope",
    screened: true,
  };
  const screened: StrategyScore = {
    label: "preference_aligned",
    effect: matchEffect(prefs, aligned),
    k_used: k_eligible,
    risk_score: alignedRisk,
    action: "conjoint_preference_aligned_proposal",
    screened: true,
  };

  const mu = round4(
    (prefs.safety + prefs.public + prefs.international) / 3,
  );
  const se = round4(0.04 + k_excluded * 0.01 + bias_scale * 0.02);
  const tau2 = round4(Math.max(0, (techRisk - alignedRisk) * 0.01));
  const q = round4(
    Math.abs(prefs.safety - extreme) +
      Math.abs(prefs.public - extreme) +
      Math.abs(prefs.international - extreme),
  );
  const i2 = round2(
    Math.min(99, (1 - mu) * 40 + k_excluded * 2 + bias_scale * 5),
  );

  const bestNaive = Math.min(naive.risk_score, privateRisk, nationalRisk);

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
    delta_score: round2(naive.risk_score - alignedRisk),
    vs_best_naive: round2(bestNaive - alignedRisk),
  };
}

export function scoreGovernance(input: GovernanceInput): GovernanceResult {
  return scoreSynthesis(input);
}

export function scoreTactile(input: GovernanceInput): GovernanceResult {
  return scoreSynthesis(input);
}
