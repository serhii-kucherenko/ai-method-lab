/**
 * Paper-inspired plan / learn / adapt sketch for day itineraries.
 * Dual-impl goldens must agree with itineraryPlan.ts.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "test", "fixtures");
mkdirSync(dir, { recursive: true });

for (const f of readdirSync(dir)) {
  if (f.endsWith(".json")) unlinkSync(join(dir, f));
}

// Load compiled scoring via tsx-compatible dynamic import after we spawn — use inline mirror.
const DEFAULT_POIS =
  "museum:10:17:2:9|cafe:8:20:1:7|park:9:18:2:8|shop:11:19:1:6|gallery:10:16:2:8|viewpoint:7:19:1:5";

function parsePois(hint) {
  const parts = String(hint ?? "")
    .split(/[|,]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const out = [];
  const seen = new Set();
  for (const p of parts) {
    const bits = p.split(":");
    if (bits.length < 5) continue;
    const id = bits[0].trim();
    const open = Number(bits[1]);
    const close = Number(bits[2]);
    const duration = Number(bits[3]);
    const preference = Number(bits[4]);
    if (!id || !Number.isFinite(open) || !Number.isFinite(close)) continue;
    if (!Number.isFinite(duration) || !Number.isFinite(preference)) continue;
    if (seen.has(id) || close <= open) continue;
    seen.add(id);
    out.push({
      id,
      open: Math.max(0, Math.min(23, Math.floor(open))),
      close: Math.max(1, Math.min(24, Math.floor(close))),
      duration: Math.max(1, Math.floor(duration)),
      preference: Math.floor(preference),
    });
  }
  return out;
}

function stackSchedule(ordered, dayStart, travelH) {
  const stops = [];
  let t = dayStart;
  for (let i = 0; i < ordered.length; i++) {
    if (i > 0) t += travelH;
    const poi = ordered[i];
    const start = t;
    const end = start + poi.duration;
    stops.push({ id: poi.id, start, end });
    t = end;
  }
  return stops;
}

function summarizeSchedule(ordered, dayStart, dayBudget, travelH) {
  const stops = stackSchedule(ordered, dayStart, travelH);
  let preference = 0;
  let violations = 0;
  for (let i = 0; i < ordered.length; i++) {
    const poi = ordered[i];
    const stop = stops[i];
    preference += poi.preference;
    if (stop.start < poi.open) violations += 1;
    if (stop.end > poi.close) violations += 1;
  }
  const used_hours =
    stops.length === 0
      ? 0
      : Number((stops[stops.length - 1].end - dayStart).toFixed(4));
  if (used_hours > dayBudget) violations += Math.ceil(used_hours - dayBudget);
  return {
    preference,
    used_hours,
    violations,
    feasible: violations === 0,
    stops,
  };
}

function canPlaceAt(poi, start, dayStart, dayBudget) {
  const end = start + poi.duration;
  if (start < poi.open) return false;
  if (end > poi.close) return false;
  if (end - dayStart > dayBudget) return false;
  return true;
}

function tryFeasibleOrder(ordered, dayStart, dayBudget, travelH) {
  const stops = [];
  let t = dayStart;
  for (let i = 0; i < ordered.length; i++) {
    if (i > 0) t += travelH;
    const poi = ordered[i];
    const start = Math.max(t, poi.open);
    if (!canPlaceAt(poi, start, dayStart, dayBudget)) return null;
    const end = start + poi.duration;
    stops.push({ id: poi.id, start, end });
    t = end;
  }
  return stops;
}

function naiveSchedule(pois, dayStart, dayBudget, travelH) {
  const ranked = [...pois].sort((a, b) =>
    b.preference !== a.preference
      ? b.preference - a.preference
      : a.id.localeCompare(b.id),
  );
  const softBudget = Math.max(dayBudget * 2, dayBudget + 1);
  const picked = [];
  for (const poi of ranked) {
    const trial = [...picked, poi];
    const sum = summarizeSchedule(trial, dayStart, softBudget, travelH);
    if (sum.used_hours > softBudget) continue;
    picked.push(poi);
  }
  return picked;
}

function preferenceOf(ordered) {
  return ordered.reduce((s, p) => s + p.preference, 0);
}

function permuteIndices(n) {
  if (n === 0) return [[]];
  if (n > 7) return [];
  const out = [];
  const used = new Array(n).fill(false);
  const cur = [];
  function dfs() {
    if (cur.length === n) {
      out.push([...cur]);
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      cur.push(i);
      dfs();
      cur.pop();
      used[i] = false;
    }
  }
  dfs();
  return out;
}

function subsets(n) {
  const out = [];
  const limit = 1 << n;
  for (let mask = 1; mask < limit; mask++) {
    const idx = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) idx.push(i);
    out.push(idx);
  }
  return out;
}

function plaSchedule(pois, dayStart, dayBudget, travelH) {
  const n = pois.length;
  if (n === 0) return { ordered: [], candidates: 0, adapted: false };
  if (n > 7) {
    const ranked = [...pois].sort((a, b) => {
      const da = a.preference / a.duration;
      const db = b.preference / b.duration;
      if (db !== da) return db - da;
      return a.id.localeCompare(b.id);
    });
    const picked = [];
    for (const poi of ranked) {
      const trial = [...picked, poi];
      if (tryFeasibleOrder(trial, dayStart, dayBudget, travelH)) picked.push(poi);
    }
    return { ordered: picked, candidates: picked.length ? 1 : 0, adapted: false };
  }
  let best = [];
  let bestPref = -1;
  let candidates = 0;
  const idOrder = (arr) => arr.map((p) => p.id).join(",");
  for (const idxs of subsets(n)) {
    const subset = idxs.map((i) => pois[i]);
    const perms =
      subset.length <= 5
        ? permuteIndices(subset.length)
        : [
            [...subset.keys()].sort(
              (a, b) =>
                subset[b].preference - subset[a].preference ||
                subset[a].id.localeCompare(subset[b].id),
            ),
          ];
    for (const perm of perms) {
      const ordered = perm.map((i) => subset[i]);
      if (!tryFeasibleOrder(ordered, dayStart, dayBudget, travelH)) continue;
      candidates += 1;
      const pref = preferenceOf(ordered);
      if (pref > bestPref) {
        bestPref = pref;
        best = ordered;
      } else if (pref === bestPref && pref >= 0) {
        if (idOrder(ordered) < idOrder(best)) best = ordered;
      }
    }
  }
  let adapted = false;
  if (best.length >= 2) {
    let current = [...best];
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < current.length - 1; i++) {
        const trial = [...current];
        const tmp = trial[i];
        trial[i] = trial[i + 1];
        trial[i + 1] = tmp;
        if (!tryFeasibleOrder(trial, dayStart, dayBudget, travelH)) continue;
        const pref = preferenceOf(trial);
        const curPref = preferenceOf(current);
        if (
          pref > curPref ||
          (pref === curPref && idOrder(trial) < idOrder(current))
        ) {
          current = trial;
          adapted = true;
          improved = true;
          break;
        }
      }
    }
    best = current;
  }
  return { ordered: best, candidates, adapted };
}

function score(input) {
  if (input.preference_cheat === true) {
    return { status: "reject", reason: "preference_cheat" };
  }
  const rawBudget = Number(input.day_budget ?? 8);
  const day_budget = !Number.isFinite(rawBudget)
    ? 8
    : Math.max(1, Math.min(16, Math.floor(rawBudget)));
  const rawStart = Number(input.day_start ?? 9);
  const day_start = !Number.isFinite(rawStart)
    ? 9
    : Math.max(0, Math.min(18, Math.floor(rawStart)));
  const rawTravel = Number(input.travel_min ?? 30);
  const travel_min = !Number.isFinite(rawTravel)
    ? 30
    : Math.max(0, Math.min(120, Math.floor(rawTravel)));
  const travel_h = travel_min / 60;
  const raw =
    input.pois !== undefined && String(input.pois).trim()
      ? String(input.pois)
      : DEFAULT_POIS;
  let pois = parsePois(raw);
  if (!pois.length) pois = parsePois(DEFAULT_POIS);

  const naiveOrdered = naiveSchedule(pois, day_start, day_budget, travel_h);
  const pla = plaSchedule(pois, day_start, day_budget, travel_h);
  const naiveSum = summarizeSchedule(naiveOrdered, day_start, day_budget, travel_h);
  const plaStops = tryFeasibleOrder(pla.ordered, day_start, day_budget, travel_h);
  const plaFeasible = plaStops !== null;
  const plaPref = preferenceOf(pla.ordered);
  const plaUsed =
    !plaStops || plaStops.length === 0
      ? 0
      : Number((plaStops[plaStops.length - 1].end - day_start).toFixed(4));
  const naive_risk = naiveSum.violations * 100 + (naiveSum.feasible ? 0 : 10);
  const safer_risk = plaFeasible ? 0 : 100;

  return {
    status: "ok",
    day_budget,
    poi_count: pois.length,
    naive_preference: naiveSum.preference,
    pla_preference: plaPref,
    naive_violations: naiveSum.violations,
    pla_violations: plaFeasible ? 0 : 1,
    naive_risk,
    safer_risk,
    delta_score: naive_risk - safer_risk,
    naive_feasible: naiveSum.feasible,
    pla_feasible: plaFeasible,
  };
}

const cases = [
  { id: "std-001", title: "default POI catalog budget 8", input: {} },
  { id: "std-002", title: "tight day budget 4", input: { day_budget: 4 } },
  { id: "std-003", title: "roomy day budget 12", input: { day_budget: 12 } },
  { id: "std-004", title: "budget 6", input: { day_budget: 6 } },
  { id: "std-005", title: "budget 0 clamped", input: { day_budget: 0 } },
  { id: "std-006", title: "negative budget clamped", input: { day_budget: -3 } },
  { id: "std-007", title: "fractional budget floor", input: { day_budget: 7.9 } },
  {
    id: "std-008",
    title: "late-open museum vs early cafe",
    input: {
      day_budget: 5,
      day_start: 9,
      pois: "museum:12:17:2:9|cafe:8:20:1:7|park:9:18:2:5",
    },
  },
  {
    id: "std-009",
    title: "short visits fit more stops",
    input: {
      day_budget: 6,
      pois: "a:9:18:1:5|b:9:18:1:6|c:9:18:1:7|d:9:18:1:4",
    },
  },
  {
    id: "std-010",
    title: "closing window blocks long visit",
    input: {
      day_budget: 8,
      day_start: 15,
      pois: "gallery:10:16:2:9|cafe:8:20:1:4",
    },
  },
  {
    id: "std-011",
    title: "all POIs closed before start",
    input: {
      day_budget: 8,
      day_start: 18,
      pois: "a:9:12:2:9|b:10:14:2:8|c:8:11:1:7",
    },
  },
  {
    id: "std-012",
    title: "single POI",
    input: { day_budget: 4, pois: "museum:10:17:2:10" },
  },
  {
    id: "std-013",
    title: "visit longer than budget",
    input: { day_budget: 2, pois: "trek:8:20:5:50" },
  },
  {
    id: "std-014",
    title: "preference cheat reject",
    input: { preference_cheat: true, day_budget: 8 },
  },
  {
    id: "std-015",
    title: "beach morning cluster",
    input: {
      day_budget: 6,
      day_start: 8,
      pois: "beach:7:19:2:9|cafe:8:18:1:7|shop:10:20:1:5|museum:11:17:2:8",
    },
  },
  {
    id: "std-016",
    title: "evening lights only",
    input: {
      day_budget: 5,
      day_start: 16,
      pois: "lights:17:22:2:9|dinner:18:23:2:8|bar:19:24:1:6",
    },
  },
  {
    id: "std-017",
    title: "zero travel minutes",
    input: {
      day_budget: 6,
      travel_min: 0,
      pois: "a:9:18:2:8|b:9:18:2:7|c:9:18:1:5",
    },
  },
  {
    id: "std-018",
    title: "large budget takes more",
    input: { day_budget: 14 },
  },
  {
    id: "std-019",
    title: "tiny budget forces sparse",
    input: { day_budget: 2 },
  },
  {
    id: "std-020",
    title: "equal preferences stable tie-break",
    input: {
      day_budget: 5,
      pois: "a:9:18:2:5|b:9:18:2:5|c:9:18:2:5|d:9:18:1:1",
    },
  },
  {
    id: "std-021",
    title: "long travel between stops",
    input: {
      day_budget: 8,
      travel_min: 90,
      pois: "museum:10:17:2:9|park:9:18:2:8|cafe:8:20:1:7",
    },
  },
  {
    id: "std-022",
    title: "empty pois string falls back",
    input: { day_budget: 8, pois: "" },
  },
  {
    id: "std-023",
    title: "garbage tokens ignored",
    input: {
      day_budget: 5,
      pois: "bad|x:y|museum:10:17:2:9|ok:9:18:1:4",
    },
  },
  {
    id: "std-024",
    title: "duplicate ids ignored",
    input: {
      day_budget: 5,
      pois: "museum:10:17:2:9|museum:9:18:1:99|cafe:8:20:1:5",
    },
  },
  {
    id: "std-025",
    title: "high preference but impossible window",
    input: {
      day_budget: 4,
      day_start: 9,
      pois: "night:20:24:2:100|ok:9:18:1:5|ok2:9:18:1:4",
    },
  },
  {
    id: "std-026",
    title: "budget 9 default catalog",
    input: { day_budget: 9 },
  },
  {
    id: "std-027",
    title: "city culture loop",
    input: {
      day_budget: 8,
      pois:
        "museum:10:17:2:9|gallery:10:16:2:8|cafe:8:20:1:6|park:9:18:1:5|shop:11:19:1:4",
    },
  },
  {
    id: "std-028",
    title: "family afternoon outing",
    input: {
      day_budget: 6,
      day_start: 12,
      pois:
        "zoo:10:17:3:9|playground:9:18:1:7|icecream:11:20:1:6|museum:10:16:2:8",
    },
  },
];

for (const c of cases) {
  const live = score(c.input);
  const expect =
    live.status === "reject"
      ? { status: "reject", reason: live.reason }
      : {
          status: "ok",
          day_budget: live.day_budget,
          naive_risk: live.naive_risk,
          safer_risk: live.safer_risk,
          delta_score: live.delta_score,
          naive_preference: live.naive_preference,
          pla_preference: live.pla_preference,
          naive_violations: live.naive_violations,
        };
  const doc = {
    id: c.id,
    title: c.title,
    input: c.input,
    expect,
  };
  writeFileSync(join(dir, `${c.id}.json`), `${JSON.stringify(doc, null, 2)}\n`);
}

console.log(`Wrote ${cases.length} fixtures to ${dir}`);
