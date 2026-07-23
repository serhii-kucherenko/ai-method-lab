/**
 * Generate ≥30 dual-impl goldens for Evidence Synthesis Desk.
 * Fixtures must agree with src/domain/synthesis.ts.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "test", "fixtures");
mkdirSync(dir, { recursive: true });

for (const f of readdirSync(dir)) {
  if (f.endsWith(".json")) unlinkSync(join(dir, f));
}

const cases = [
  { id: "std-001", title: "Default corpus min_n 40", input: {} },
  {
    id: "std-002",
    title: "Reject perfect homogeneity cheat",
    input: { perfect_homogeneity_cheat: true },
  },
  {
    id: "std-003",
    title: "Small corpus",
    input: { corpus: "small", min_n: 30 },
  },
  {
    id: "std-004",
    title: "Large contaminated corpus",
    input: { corpus: "large", min_n: 50 },
  },
  {
    id: "std-005",
    title: "Homogeneous no exclusions at min_n 20",
    input: { corpus: "homogeneous", min_n: 20 },
  },
  {
    id: "std-006",
    title: "Contaminated with high bias",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 2.5 },
  },
  {
    id: "std-007",
    title: "Sparse underpowered rows",
    input: { corpus: "sparse", min_n: 45 },
  },
  {
    id: "std-008",
    title: "Cardiology corpus",
    input: { corpus: "cardiology", min_n: 60 },
  },
  {
    id: "std-009",
    title: "Oncology corpus",
    input: { corpus: "oncology", min_n: 35 },
  },
  {
    id: "std-010",
    title: "Education corpus",
    input: { corpus: "education", min_n: 40 },
  },
  {
    id: "std-011",
    title: "Nutrition corpus",
    input: { corpus: "nutrition", min_n: 50 },
  },
  {
    id: "std-012",
    title: "Strict eligibility min_n 100",
    input: { corpus: "default", min_n: 100 },
  },
  {
    id: "std-013",
    title: "Lenient eligibility min_n 10",
    input: { corpus: "default", min_n: 10 },
  },
  {
    id: "std-014",
    title: "Low bias scale",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 0.5 },
  },
  {
    id: "std-015",
    title: "Max bias scale",
    input: { corpus: "contaminated", min_n: 40, bias_scale: 3 },
  },
  {
    id: "std-016",
    title: "Custom corpus name alpha",
    input: { corpus: "alpha-trial", min_n: 40 },
  },
  {
    id: "std-017",
    title: "Custom corpus name beta",
    input: { corpus: "beta-trial", min_n: 55 },
  },
  {
    id: "std-018",
    title: "Custom corpus gamma",
    input: { corpus: "gamma", min_n: 35, bias_scale: 1.8 },
  },
  {
    id: "std-019",
    title: "Homogeneous strict screen",
    input: { corpus: "homogeneous", min_n: 80 },
  },
  {
    id: "std-020",
    title: "Small with high bias",
    input: { corpus: "small", min_n: 40, bias_scale: 2.2 },
  },
  {
    id: "std-021",
    title: "Large lenient screen",
    input: { corpus: "large", min_n: 20 },
  },
  {
    id: "std-022",
    title: "Sparse lenient",
    input: { corpus: "sparse", min_n: 20 },
  },
  {
    id: "std-023",
    title: "Cardiology high bias",
    input: { corpus: "cardiology", min_n: 50, bias_scale: 2 },
  },
  {
    id: "std-024",
    title: "Oncology strict",
    input: { corpus: "oncology", min_n: 70 },
  },
  {
    id: "std-025",
    title: "Education mild bias",
    input: { corpus: "education", min_n: 30, bias_scale: 0.8 },
  },
  {
    id: "std-026",
    title: "Nutrition mild",
    input: { corpus: "nutrition", min_n: 30, bias_scale: 1 },
  },
  {
    id: "std-027",
    title: "Default mid screen 55",
    input: { corpus: "default", min_n: 55 },
  },
  {
    id: "std-028",
    title: "Default bias 1.5",
    input: { corpus: "default", min_n: 40, bias_scale: 1.5 },
  },
  {
    id: "std-029",
    title: "Contaminated lenient",
    input: { corpus: "contaminated", min_n: 25 },
  },
  {
    id: "std-030",
    title: "Large high bias strict",
    input: { corpus: "large", min_n: 90, bias_scale: 2.8 },
  },
];

// Inline score mirror (must stay in sync with src/domain/synthesis.ts)
function hedgesG(s) {
  const n = s.n_t + s.n_c;
  const df = Math.max(1, n - 2);
  const sp = Math.sqrt(
    ((s.n_t - 1) * s.sd_t * s.sd_t + (s.n_c - 1) * s.sd_c * s.sd_c) / df,
  );
  const d = sp > 0 ? (s.mean_t - s.mean_c) / sp : 0;
  const j = 1 - 3 / (4 * df - 1);
  const g = j * d;
  const v = n / Math.max(1, s.n_t * s.n_c) + (g * g) / (2 * Math.max(1, n));
  return { g: Math.round(g * 10000) / 10000, v: Math.max(1e-8, Math.round(v * 10000) / 10000) };
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
function round4(n) {
  return Math.round(n * 10000) / 10000;
}
function randomEffects(effects) {
  if (effects.length === 0) return { mu: 0, se: 1, tau2: 0, q: 0, i2: 0 };
  if (effects.length === 1) {
    const e = effects[0];
    return { mu: e.g, se: Math.sqrt(e.v), tau2: 0, q: 0, i2: 0 };
  }
  const weights = effects.map((e) => 1 / e.v);
  const sumW = weights.reduce((a, b) => a + b, 0);
  const muFixed = effects.reduce((a, e, i) => a + weights[i] * e.g, 0) / sumW;
  const q = effects.reduce(
    (a, e, i) => a + weights[i] * (e.g - muFixed) * (e.g - muFixed),
    0,
  );
  const sumW2 = weights.reduce((a, w) => a + w * w, 0);
  const c = sumW - sumW2 / sumW;
  const k = effects.length;
  const tau2 = Math.max(0, (q - (k - 1)) / Math.max(1e-12, c));
  const wStar = effects.map((e) => 1 / (e.v + tau2));
  const sumWs = wStar.reduce((a, b) => a + b, 0);
  const mu = effects.reduce((a, e, i) => a + wStar[i] * e.g, 0) / sumWs;
  const se = Math.sqrt(1 / sumWs);
  const i2 = q <= k - 1 ? 0 : ((q - (k - 1)) / q) * 100;
  return {
    mu: round4(mu),
    se: round4(se),
    tau2: round4(tau2),
    q: round4(q),
    i2: round2(i2),
  };
}
function buildCorpus(corpus, minN, biasScale) {
  const presets = {
    default: { k: 8, trueG: 0.45, baseN: 60, bad: [0, 3] },
    small: { k: 4, trueG: 0.3, baseN: 35, bad: [1] },
    large: { k: 12, trueG: 0.55, baseN: 80, bad: [2, 5, 9] },
    homogeneous: { k: 6, trueG: 0.4, baseN: 70, bad: [] },
    contaminated: { k: 10, trueG: 0.35, baseN: 55, bad: [0, 1, 2, 7] },
    sparse: { k: 5, trueG: 0.25, baseN: 28, bad: [0, 4] },
    cardiology: { k: 9, trueG: 0.5, baseN: 90, bad: [3, 8] },
    oncology: { k: 7, trueG: 0.6, baseN: 50, bad: [1, 4] },
    education: { k: 8, trueG: 0.2, baseN: 45, bad: [2, 6] },
    nutrition: { k: 6, trueG: 0.15, baseN: 40, bad: [0, 5] },
  };
  const p = presets[corpus] ?? {
    k: 6 + (corpus.length % 5),
    trueG: 0.3 + (corpus.length % 7) * 0.05,
    baseN: 40 + (corpus.length % 6) * 8,
    bad: [0, Math.min(2, corpus.length % 4)],
  };
  const studies = [];
  for (let i = 0; i < p.k; i++) {
    const isBad = p.bad.includes(i);
    const n_t = Math.max(8, p.baseN + (i % 5) * 4 - (isBad ? 25 : 0));
    const n_c = Math.max(8, p.baseN - 5 + (i % 3) * 3 - (isBad ? 20 : 0));
    const sd_t = 1.0 + (i % 4) * 0.05;
    const sd_c = 1.0 + ((i + 1) % 4) * 0.05;
    const sp = Math.sqrt(
      ((n_t - 1) * sd_t * sd_t + (n_c - 1) * sd_c * sd_c) / (n_t + n_c - 2),
    );
    const jitter = ((i % 5) - 2) * 0.04;
    const delta = (p.trueG + jitter) * sp;
    const mean_c = 10;
    const mean_t = mean_c + delta;
    const honest = hedgesG({
      mean_t,
      sd_t,
      n_t,
      mean_c,
      sd_c,
      n_c,
      reported: 0,
    }).g;
    const reported = isBad
      ? round4(honest + biasScale * (0.8 + (i % 3) * 0.25))
      : round4(honest + ((i % 3) - 1) * 0.02);
    studies.push({
      mean_t: round4(mean_t),
      sd_t: round4(sd_t),
      n_t,
      mean_c: round4(mean_c),
      sd_c: round4(sd_c),
      n_c,
      reported,
    });
    void minN;
  }
  return studies;
}
function scoreSynthesis(input) {
  if (input.perfect_homogeneity_cheat === true) {
    return { status: "reject", reason: "perfect_homogeneity_cheat" };
  }
  const corpus = String(input.corpus ?? "default").trim() || "default";
  const rawMin = Number(input.min_n ?? 40);
  const min_n = !Number.isFinite(rawMin)
    ? 40
    : Math.max(10, Math.min(200, Math.floor(rawMin)));
  const rawBias = Number(input.bias_scale ?? 1.2);
  const bias_scale = !Number.isFinite(rawBias)
    ? 1.2
    : Math.max(0.5, Math.min(3, Number(rawBias.toFixed(4))));
  const studies =
    Array.isArray(input.studies) && input.studies.length > 0
      ? input.studies
      : buildCorpus(corpus, min_n, bias_scale);
  const k_total = studies.length;
  const kept = studies.filter((s) => s.n_t + s.n_c >= min_n);
  const k_eligible = kept.length;
  const k_excluded = k_total - k_eligible;
  const allG = studies.map((s) => hedgesG(s));
  const keptG = kept.map((s) => hedgesG(s));
  const re = randomEffects(keptG.length > 0 ? keptG : allG);
  const naiveEffect = round4(
    studies.reduce((a, s) => a + s.reported, 0) / Math.max(1, k_total),
  );
  const feMu =
    allG.length === 0
      ? 0
      : round4(
          allG.reduce((a, e) => a + (1 / e.v) * e.g, 0) /
            allG.reduce((a, e) => a + 1 / e.v, 0),
        );
  const unweighted = round4(
    keptG.reduce((a, e) => a + e.g, 0) / Math.max(1, keptG.length),
  );
  const contamination = Math.abs(naiveEffect - re.mu);
  const naive_risk = round2(
    contamination * 100 + k_excluded * 8 + 12 + Math.abs(naiveEffect) * 5,
  );
  const screened_risk = round2(re.se * 100 + re.i2 / 20 + Math.abs(re.mu) * 2);
  const fe_risk = round2(
    Math.abs(feMu - re.mu) * 80 + k_excluded * 6 + 10 + Math.abs(feMu) * 4,
  );
  const uw_risk = round2(
    Math.abs(unweighted - re.mu) * 60 + 8 + Math.abs(unweighted) * 3,
  );
  const naive = {
    label: "naive_average_skip_screen",
    effect: naiveEffect,
    k_used: k_total,
    risk_score: naive_risk,
    action: "average_reported_include_ineligible",
    screened: false,
  };
  const screened = {
    label: "screened_random_effects",
    effect: re.mu,
    k_used: k_eligible,
    risk_score: screened_risk,
    action: "screen_then_hedges_g_re_pool",
    screened: true,
  };
  const bestNaive = Math.min(naive_risk, fe_risk, uw_risk);
  return {
    status: "ok",
    corpus,
    min_n,
    bias_scale,
    k_total,
    k_eligible,
    k_excluded,
    mu: re.mu,
    se: re.se,
    tau2: re.tau2,
    q: re.q,
    i2: re.i2,
    naive,
    pla: screened,
    screened,
    delta_score: round2(naive_risk - screened_risk),
    vs_best_naive: round2(bestNaive - screened_risk),
  };
}

for (const c of cases) {
  const live = scoreSynthesis(c.input);
  const expect =
    live.status === "reject"
      ? { status: "reject", reason: live.reason }
      : {
          status: "ok",
          corpus: live.corpus,
          naive_risk: live.naive.risk_score,
          safer_risk: live.pla.risk_score,
          delta_score: live.delta_score,
          min_n: live.min_n,
          k_eligible: live.k_eligible,
          i2: live.i2,
        };
  const doc = {
    id: c.id,
    title: c.title,
    input: c.input,
    expect,
  };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
  console.log(c.id, live.status === "ok" ? live.delta_score : live.reason);
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
