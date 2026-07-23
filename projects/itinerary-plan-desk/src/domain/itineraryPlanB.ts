/**
 * Dual-impl twin of itineraryPlan.ts — must agree on all golden fixtures.
 * Alternate formulation: score candidates via preference-density sort keys
 * and validate with a running clock that snaps to opening hours.
 */
import {
  parsePois,
  summarizeSchedule,
  tryFeasibleOrder,
  type ItineraryInput,
  type ItineraryResult,
  type Poi,
} from "./itineraryPlan.js";

const DEFAULT_POIS =
  "museum:10:17:2:9|cafe:8:20:1:7|park:9:18:2:8|shop:11:19:1:6|gallery:10:16:2:8|viewpoint:7:19:1:5";
const DEFAULT_BUDGET = 8;
const DEFAULT_START = 9;
const DEFAULT_TRAVEL_MIN = 30;

function resolve(input: ItineraryInput): {
  day_budget: number;
  day_start: number;
  travel_h: number;
  pois: Poi[];
} {
  const rawBudget = Number(input.day_budget ?? DEFAULT_BUDGET);
  const day_budget = !Number.isFinite(rawBudget)
    ? DEFAULT_BUDGET
    : Math.max(1, Math.min(16, Math.floor(rawBudget)));
  const rawStart = Number(input.day_start ?? DEFAULT_START);
  const day_start = !Number.isFinite(rawStart)
    ? DEFAULT_START
    : Math.max(0, Math.min(18, Math.floor(rawStart)));
  const rawTravel = Number(input.travel_min ?? DEFAULT_TRAVEL_MIN);
  const travel_min = !Number.isFinite(rawTravel)
    ? DEFAULT_TRAVEL_MIN
    : Math.max(0, Math.min(120, Math.floor(rawTravel)));
  const raw =
    input.pois !== undefined && String(input.pois).trim()
      ? String(input.pois)
      : DEFAULT_POIS;
  const pois = parsePois(raw);
  return {
    day_budget,
    day_start,
    travel_h: travel_min / 60,
    pois: pois.length ? pois : parsePois(DEFAULT_POIS),
  };
}

function naivePick(
  pois: Poi[],
  dayStart: number,
  dayBudget: number,
  travelH: number,
): Poi[] {
  const ranked = [...pois].sort((a, b) =>
    b.preference !== a.preference
      ? b.preference - a.preference
      : a.id.localeCompare(b.id),
  );
  const soft = Math.max(dayBudget * 2, dayBudget + 1);
  const out: Poi[] = [];
  for (const poi of ranked) {
    const trial = [...out, poi];
    const sum = summarizeSchedule(trial, dayStart, soft, travelH);
    if (sum.used_hours > soft) continue;
    out.push(poi);
  }
  return out;
}

function prefSum(ordered: Poi[]): number {
  return ordered.reduce((s, p) => s + p.preference, 0);
}

function idKey(ordered: Poi[]): string {
  return ordered.map((p) => p.id).join(",");
}

function allOrders(pois: Poi[]): Poi[][] {
  const n = pois.length;
  if (n === 0) return [[]];
  if (n > 5) {
    const ranked = [...pois].sort((a, b) =>
      b.preference !== a.preference
        ? b.preference - a.preference
        : a.id.localeCompare(b.id),
    );
    return [ranked];
  }
  const out: Poi[][] = [];
  const used = new Array(n).fill(false);
  const cur: Poi[] = [];
  function dfs() {
    if (cur.length === n) {
      out.push([...cur]);
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      cur.push(pois[i]);
      dfs();
      cur.pop();
      used[i] = false;
    }
  }
  dfs();
  return out;
}

function plaPick(
  pois: Poi[],
  dayStart: number,
  dayBudget: number,
  travelH: number,
): { ordered: Poi[]; candidates: number; adapted: boolean } {
  const n = pois.length;
  if (n === 0) return { ordered: [], candidates: 0, adapted: false };
  if (n > 7) {
    const ranked = [...pois].sort((a, b) => {
      const da = a.preference / a.duration;
      const db = b.preference / b.duration;
      if (db !== da) return db - da;
      return a.id.localeCompare(b.id);
    });
    const picked: Poi[] = [];
    for (const poi of ranked) {
      const trial = [...picked, poi];
      if (tryFeasibleOrder(trial, dayStart, dayBudget, travelH)) {
        picked.push(poi);
      }
    }
    return { ordered: picked, candidates: picked.length ? 1 : 0, adapted: false };
  }

  let best: Poi[] = [];
  let bestPref = -1;
  let candidates = 0;
  const limit = 1 << n;
  for (let mask = 1; mask < limit; mask++) {
    const subset: Poi[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(pois[i]);
    }
    for (const ordered of allOrders(subset)) {
      if (!tryFeasibleOrder(ordered, dayStart, dayBudget, travelH)) continue;
      candidates += 1;
      const pref = prefSum(ordered);
      if (pref > bestPref) {
        bestPref = pref;
        best = ordered;
      } else if (pref === bestPref && idKey(ordered) < idKey(best)) {
        best = ordered;
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
        [trial[i], trial[i + 1]] = [trial[i + 1], trial[i]];
        if (!tryFeasibleOrder(trial, dayStart, dayBudget, travelH)) continue;
        const pref = prefSum(trial);
        const curPref = prefSum(current);
        if (
          pref > curPref ||
          (pref === curPref && idKey(trial) < idKey(current))
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

export function scoreItineraryB(input: ItineraryInput): ItineraryResult {
  if (input.preference_cheat === true) {
    return { status: "reject", reason: "preference_cheat" };
  }
  const { day_budget, day_start, travel_h, pois } = resolve(input);
  const naiveOrdered = naivePick(pois, day_start, day_budget, travel_h);
  const pla = plaPick(pois, day_start, day_budget, travel_h);
  const naiveSum = summarizeSchedule(
    naiveOrdered,
    day_start,
    day_budget,
    travel_h,
  );
  const plaStops = tryFeasibleOrder(pla.ordered, day_start, day_budget, travel_h);
  const plaFeasible = plaStops !== null;
  const plaPref = prefSum(pla.ordered);
  const plaUsed =
    !plaStops || plaStops.length === 0
      ? 0
      : Number((plaStops[plaStops.length - 1].end - day_start).toFixed(4));
  const naiveRisk =
    naiveSum.violations * 100 + (naiveSum.feasible ? 0 : 10);
  const plaRisk = plaFeasible ? 0 : 100;

  return {
    status: "ok",
    day_budget,
    day_start,
    travel_h,
    poi_count: pois.length,
    naive: {
      label: "naive_preference_only",
      preference: naiveSum.preference,
      used_hours: naiveSum.used_hours,
      violations: naiveSum.violations,
      feasible: naiveSum.feasible,
      risk_score: naiveRisk,
      action: naiveOrdered.length ? "greedy_stack" : "empty",
      stops: naiveOrdered.map((p) => p.id),
    },
    pla: {
      label: "plan_learn_adapt",
      preference: plaPref,
      used_hours: plaUsed,
      violations: plaFeasible ? 0 : 1,
      feasible: plaFeasible,
      risk_score: plaRisk,
      action: pla.ordered.length ? "plan_learn_adapt" : "empty",
      candidates: pla.candidates,
      adapted: pla.adapted,
      stops: pla.ordered.map((p) => p.id),
    },
    delta_score: naiveRisk - plaRisk,
  };
}
