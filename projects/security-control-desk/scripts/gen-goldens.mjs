/**
 * Generate ≥25 dual-impl control-fit golden fixtures.
 * Run: node scripts/gen-goldens.mjs
 * Scoring must match src/domain/controlFit.ts (and controlFitB.ts).
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

const MAG_MIN = -60;
const MAG_MAX = -1;
const DUR_MIN = 5;
const DUR_MAX = 50;

function parseCandidates(hint) {
  const parts = String(hint ?? "")
    .split(/[|,]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const out = [];
  for (const p of parts) {
    const [a, b] = p.split(":");
    const magnitude = Number(a);
    const duration = Number(b);
    if (!Number.isFinite(magnitude) || !Number.isFinite(duration)) continue;
    out.push({ magnitude, duration: Math.floor(duration) });
  }
  return out;
}

function isFeasible(c) {
  if (!(c.magnitude <= MAG_MAX && c.magnitude >= MAG_MIN)) return false;
  if (!(c.duration >= DUR_MIN && c.duration <= DUR_MAX)) return false;
  return true;
}

function baseForecast(basePeak, horizon) {
  const H = Math.max(1, horizon);
  const start = Math.round(basePeak * 0.55);
  const series = [];
  for (let t = 0; t < H; t++) {
    series.push(Math.round(start + ((basePeak - start) * (t + 1)) / H));
  }
  return series;
}

function injectPhysics(forecast, magnitude, duration) {
  const δ = Math.max(0, Math.floor(duration));
  return forecast.map((y, t) => {
    const offset = t < δ ? magnitude * (t + 1) : magnitude * δ;
    return Math.round(y + offset);
  });
}

function peakRisk(series) {
  if (!series.length) return 0;
  return Math.max(...series);
}

function score(input) {
  if (input.open_loop_cheat === true) {
    return { status: "reject", reason: "open_loop_cheat" };
  }
  const rawPeak = Number(input.base_peak ?? 1100);
  const base_peak =
    !Number.isFinite(rawPeak) || rawPeak < 1 ? 1100 : Math.floor(rawPeak);
  const rawTh = Number(input.threshold ?? 1000);
  const threshold =
    !Number.isFinite(rawTh) || rawTh < 1 ? 1000 : Math.floor(rawTh);
  const rawH = Number(input.horizon ?? 20);
  const horizon =
    !Number.isFinite(rawH) || rawH < 1 ? 20 : Math.floor(rawH);

  let candidates = [];
  if (input.candidates !== undefined) {
    candidates = parseCandidates(input.candidates);
  } else if (input.magnitude !== undefined || input.duration !== undefined) {
    const magnitude = Number(input.magnitude ?? -20);
    const duration = Number(input.duration ?? 10);
    candidates = [
      {
        magnitude: Number.isFinite(magnitude) ? magnitude : -20,
        duration: Number.isFinite(duration) ? Math.floor(duration) : 10,
      },
    ];
  }

  const forecast = baseForecast(base_peak, horizon);
  const R_base = peakRisk(forecast);

  let naive_risk = R_base;
  if (candidates.length > 0) {
    const first = candidates[0];
    naive_risk = peakRisk(
      injectPhysics(forecast, first.magnitude, first.duration),
    );
  }

  let safer_risk = R_base;
  let rejected = 0;
  for (const c of candidates) {
    if (!isFeasible(c)) {
      rejected += 1;
      continue;
    }
    const R_sim = peakRisk(injectPhysics(forecast, c.magnitude, c.duration));
    if (R_sim >= R_base) {
      rejected += 1;
      continue;
    }
    if (R_sim < safer_risk) safer_risk = R_sim;
    else rejected += 1;
  }

  return {
    status: "ok",
    base_peak,
    threshold,
    horizon,
    naive_risk,
    safer_risk,
    delta_score: naive_risk - safer_risk,
    rejected,
  };
}

const cases = [
  { id: "std-001", title: "default peak 1100", input: {} },
  { id: "std-002", title: "peak 1050", input: { base_peak: 1050 } },
  { id: "std-003", title: "peak 1200", input: { base_peak: 1200 } },
  { id: "std-004", title: "peak 900 under threshold", input: { base_peak: 900 } },
  { id: "std-005", title: "zero peak clamped", input: { base_peak: 0 } },
  { id: "std-006", title: "negative peak clamped", input: { base_peak: -5 } },
  { id: "std-007", title: "fractional peak floor", input: { base_peak: 1100.9 } },
  {
    id: "std-008",
    title: "moderate drain",
    input: { base_peak: 1100, magnitude: -25, duration: 12 },
  },
  {
    id: "std-009",
    title: "emergency drain",
    input: { base_peak: 1200, magnitude: -50, duration: 20 },
  },
  {
    id: "std-010",
    title: "slow drain",
    input: { base_peak: 1080, magnitude: -12, duration: 30 },
  },
  {
    id: "std-011",
    title: "positive magnitude hallucination",
    input: { base_peak: 1100, magnitude: 20, duration: 10 },
  },
  {
    id: "std-012",
    title: "magnitude too strong",
    input: { base_peak: 1100, magnitude: -80, duration: 10 },
  },
  {
    id: "std-013",
    title: "duration too short",
    input: { base_peak: 1100, magnitude: -20, duration: 2 },
  },
  {
    id: "std-014",
    title: "duration too long",
    input: { base_peak: 1100, magnitude: -20, duration: 80 },
  },
  {
    id: "std-015",
    title: "open-loop cheat reject",
    input: { open_loop_cheat: true, magnitude: -30, duration: 15 },
  },
  {
    id: "std-016",
    title: "two candidates pick better",
    input: { base_peak: 1150, candidates: "-10:8|-40:15" },
  },
  {
    id: "std-017",
    title: "hallucination then good",
    input: { base_peak: 1150, candidates: "30:10|-35:18" },
  },
  {
    id: "std-018",
    title: "all hallucinated",
    input: { base_peak: 1100, candidates: "10:10|15:12" },
  },
  {
    id: "std-019",
    title: "pipe-separated candidates",
    input: { base_peak: 1120, candidates: "-15:10|-45:22" },
  },
  {
    id: "std-020",
    title: "comma-separated candidates",
    input: { base_peak: 1120, candidates: "-18:12,-42:16" },
  },
  {
    id: "std-021",
    title: "short horizon",
    input: { base_peak: 1100, horizon: 8, magnitude: -30, duration: 6 },
  },
  {
    id: "std-022",
    title: "long horizon",
    input: { base_peak: 1100, horizon: 40, magnitude: -22, duration: 25 },
  },
  {
    id: "std-023",
    title: "custom threshold 800",
    input: { base_peak: 950, threshold: 800, magnitude: -40, duration: 20 },
  },
  {
    id: "std-024",
    title: "ineffective tiny drain",
    input: { base_peak: 1100, magnitude: -1, duration: 5 },
  },
  {
    id: "std-025",
    title: "three-way planner set",
    input: { base_peak: 1180, candidates: "-12:8|-28:14|-55:20" },
  },
  {
    id: "std-026",
    title: "blind fill worsens naive",
    input: { base_peak: 1050, candidates: "40:15|-30:12" },
  },
  {
    id: "std-027",
    title: "monitor only no candidates",
    input: { base_peak: 1020, threshold: 1000 },
  },
  {
    id: "std-028",
    title: "edge duration 5 and 50",
    input: { base_peak: 1160, candidates: "-20:5|-25:50" },
  },
];

for (const c of cases) {
  const live = score(c.input);
  const expect =
    live.status === "reject"
      ? { status: "reject", reason: live.reason }
      : {
          status: "ok",
          base_peak: live.base_peak,
          naive_risk: live.naive_risk,
          safer_risk: live.safer_risk,
          delta_score: live.delta_score,
        };
  const doc = {
    id: c.id,
    title: c.title,
    input: c.input,
    expect,
  };
  writeFileSync(join(dir, `${c.id}.json`), JSON.stringify(doc, null, 2) + "\n");
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
