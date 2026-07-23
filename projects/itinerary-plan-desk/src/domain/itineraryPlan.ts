/**
 * Paper-inspired plan / learn / adapt sketch for day itineraries:
 * naive preference-only schedules vs feasibility-first candidates under
 * opening hours, travel, and day budget — then preference reward + local adapt.
 * Lab method experiment — not FlyEnJoy, not the authors' on-device product.
 */

export type Poi = {
  id: string;
  /** Opening hour (0–24). */
  open: number;
  /** Closing hour (0–24). */
  close: number;
  /** Visit duration in hours. */
  duration: number;
  /** Soft preference weight. */
  preference: number;
};

export type ItineraryInput = {
  /** Day budget in hours (hard for PLA path; soft for naive). */
  day_budget?: number;
  /** Day start hour (default 9). */
  day_start?: number;
  /** Travel minutes between consecutive stops (default 30). */
  travel_min?: number;
  /**
   * Catalog encoding: `id:open:close:duration:preference` joined by `|`.
   * Hours are integers; duration ≥ 1.
   */
  pois?: string;
  /** Claim preference ranking while skipping hard windows — must reject. */
  preference_cheat?: boolean;
};

export type ScheduleStop = {
  id: string;
  start: number;
  end: number;
};

export type ItineraryOk = {
  status: "ok";
  day_budget: number;
  day_start: number;
  travel_h: number;
  poi_count: number;
  naive: {
    label: "naive_preference_only";
    preference: number;
    used_hours: number;
    violations: number;
    feasible: boolean;
    risk_score: number;
    action: "greedy_stack" | "empty";
    stops: string[];
  };
  pla: {
    label: "plan_learn_adapt";
    preference: number;
    used_hours: number;
    violations: number;
    feasible: boolean;
    risk_score: number;
    action: "plan_learn_adapt" | "empty";
    candidates: number;
    adapted: boolean;
    stops: string[];
  };
  /** Positive means PLA reduced infeasibility risk vs naive. */
  delta_score: number;
};

export type ItineraryReject = {
  status: "reject";
  reason: string;
};

export type ItineraryResult = ItineraryOk | ItineraryReject;

const DEFAULT_POIS =
  "museum:10:17:2:9|cafe:8:20:1:7|park:9:18:2:8|shop:11:19:1:6|gallery:10:16:2:8|viewpoint:7:19:1:5";
const DEFAULT_BUDGET = 8;
const DEFAULT_START = 9;
const DEFAULT_TRAVEL_MIN = 30;
const BUDGET_MIN = 1;
const BUDGET_MAX = 16;

export function parsePois(hint: string): Poi[] {
  const parts = String(hint ?? "")
    .split(/[|,]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const out: Poi[] = [];
  const seen = new Set<string>();
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
    if (seen.has(id)) continue;
    if (close <= open) continue;
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

function travelHours(travelMin: number): number {
  return Math.max(0, travelMin) / 60;
}

/** Schedule ordered POIs from day_start with travel gaps; no window checks. */
export function stackSchedule(
  ordered: Poi[],
  dayStart: number,
  travelH: number,
): ScheduleStop[] {
  const stops: ScheduleStop[] = [];
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

export function summarizeSchedule(
  ordered: Poi[],
  dayStart: number,
  dayBudget: number,
  travelH: number,
): {
  preference: number;
  used_hours: number;
  violations: number;
  feasible: boolean;
  stops: ScheduleStop[];
} {
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
  const used =
    stops.length === 0
      ? 0
      : stops[stops.length - 1].end -
        dayStart +
        (stops.length > 1 ? 0 : 0);
  const used_hours =
    stops.length === 0
      ? 0
      : Number((stops[stops.length - 1].end - dayStart).toFixed(4));
  if (used_hours > dayBudget) {
    violations += Math.ceil(used_hours - dayBudget);
  }
  void used;
  return {
    preference,
    used_hours,
    violations,
    feasible: violations === 0,
    stops,
  };
}

/** Preference-only greedy: rank by preference, stack ignoring hard windows. */
export function naiveSchedule(
  pois: Poi[],
  dayStart: number,
  dayBudget: number,
  travelH: number,
): Poi[] {
  const ranked = [...pois].sort((a, b) => {
    if (b.preference !== a.preference) return b.preference - a.preference;
    return a.id.localeCompare(b.id);
  });
  // Soft budget = 2× hard so preference greed routinely overruns the day.
  const softBudget = Math.max(dayBudget * 2, dayBudget + 1);
  const picked: Poi[] = [];
  for (const poi of ranked) {
    const trial = [...picked, poi];
    const sum = summarizeSchedule(trial, dayStart, softBudget, travelH);
    if (sum.used_hours > softBudget) continue;
    picked.push(poi);
  }
  return picked;
}

function canPlaceAt(
  poi: Poi,
  start: number,
  dayStart: number,
  dayBudget: number,
): boolean {
  const end = start + poi.duration;
  if (start < poi.open) return false;
  if (end > poi.close) return false;
  if (end - dayStart > dayBudget) return false;
  return true;
}

/**
 * Feasibility-preserving schedule builder: earliest feasible start for each
 * candidate order; returns null if any stop cannot be placed.
 */
export function tryFeasibleOrder(
  ordered: Poi[],
  dayStart: number,
  dayBudget: number,
  travelH: number,
): ScheduleStop[] | null {
  const stops: ScheduleStop[] = [];
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

function preferenceOf(ordered: Poi[]): number {
  return ordered.reduce((s, p) => s + p.preference, 0);
}

function permuteIndices(n: number): number[][] {
  if (n === 0) return [[]];
  if (n > 7) return []; // oversized: caller uses greedy
  const out: number[][] = [];
  const used = new Array(n).fill(false);
  const cur: number[] = [];
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

function subsets(n: number): number[][] {
  const out: number[][] = [];
  const limit = 1 << n;
  for (let mask = 1; mask < limit; mask++) {
    const idx: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) idx.push(i);
    }
    out.push(idx);
  }
  return out;
}

/** Plan diverse feasible candidates, learn max preference, adapt with local swap. */
export function plaSchedule(
  pois: Poi[],
  dayStart: number,
  dayBudget: number,
  travelH: number,
): { ordered: Poi[]; candidates: number; adapted: boolean } {
  const n = pois.length;
  if (n === 0) return { ordered: [], candidates: 0, adapted: false };

  if (n > 7) {
    // Greedy earliest-feasible by preference density for oversized catalogs.
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
  const idOrder = (arr: Poi[]) => arr.map((p) => p.id).join(",");

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
      const stops = tryFeasibleOrder(ordered, dayStart, dayBudget, travelH);
      if (!stops) continue;
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

  // Adapt: try adjacent swaps; keep only if still feasible and preference ≥.
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
        if (pref > curPref || (pref === curPref && idOrder(trial) < idOrder(current))) {
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

function resolveInputs(input: ItineraryInput): {
  day_budget: number;
  day_start: number;
  travel_h: number;
  pois: Poi[];
} {
  const rawBudget = Number(input.day_budget ?? DEFAULT_BUDGET);
  const day_budget = !Number.isFinite(rawBudget)
    ? DEFAULT_BUDGET
    : Math.max(BUDGET_MIN, Math.min(BUDGET_MAX, Math.floor(rawBudget)));
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
    travel_h: travelHours(travel_min),
    pois: pois.length ? pois : parsePois(DEFAULT_POIS),
  };
}

export function scoreItinerary(input: ItineraryInput): ItineraryResult {
  if (input.preference_cheat === true) {
    return { status: "reject", reason: "preference_cheat" };
  }

  const { day_budget, day_start, travel_h, pois } = resolveInputs(input);
  const naiveOrdered = naiveSchedule(pois, day_start, day_budget, travel_h);
  const pla = plaSchedule(pois, day_start, day_budget, travel_h);
  const naiveSum = summarizeSchedule(naiveOrdered, day_start, day_budget, travel_h);
  const plaStops = tryFeasibleOrder(pla.ordered, day_start, day_budget, travel_h);
  const plaFeasible = plaStops !== null;
  const plaPref = pla.ordered.reduce((s, p) => s + p.preference, 0);
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
