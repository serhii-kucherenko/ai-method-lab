/**
 * Paper-inspired constrained personalization sketch:
 * naive preference-only / greedy selection vs hard-rule gated preference maximize.
 * Lab method experiment — not FlyEnJoy, not the authors' RLO checklist product.
 */

export type PackItem = {
  id: string;
  weight: number;
  utility: number;
  banned: boolean;
  depends_on: string | null;
};

export type PackFitInput = {
  /** Luggage capacity (weight units). */
  capacity?: number;
  /**
   * Catalog encoding: `id:weight:utility[:B][:DdepId]` joined by `|`.
   * B = banned / hard-blocked. DdepId = requires dependency item id.
   */
  items?: string;
  /** Claim constrained while skipping hard rules — must reject. */
  preference_cheat?: boolean;
};

export type PackFitOk = {
  status: "ok";
  capacity: number;
  item_count: number;
  naive: {
    label: "naive_preference_only";
    utility: number;
    weight: number;
    violations: number;
    feasible: boolean;
    /** Higher = worse (infeasibility risk). */
    risk_score: number;
    action: "greedy_pick" | "empty";
    selected: string[];
  };
  constrained: {
    label: "hard_rule_gated";
    utility: number;
    weight: number;
    violations: number;
    feasible: boolean;
    risk_score: number;
    action: "select_feasible" | "empty";
    rejected: number;
    selected: string[];
  };
  /** Positive means constrained reduced infeasibility risk vs naive. */
  delta_score: number;
};

export type PackFitReject = {
  status: "reject";
  reason: string;
};

export type PackFitResult = PackFitOk | PackFitReject;

const DEFAULT_ITEMS =
  "passport:1:10|phone:1:9|charger:1:8:Dphone|camera:3:7:Dcharger|liquids:2:6:B|coat:4:5|book:2:4|socks:1:3";
const DEFAULT_CAPACITY = 8;
const CAP_MIN = 1;
const CAP_MAX = 40;

export function parseItems(hint: string): PackItem[] {
  const parts = String(hint ?? "")
    .split(/[|,]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const out: PackItem[] = [];
  const seen = new Set<string>();
  for (const p of parts) {
    const bits = p.split(":");
    if (bits.length < 3) continue;
    const id = bits[0].trim();
    const weight = Number(bits[1]);
    const utility = Number(bits[2]);
    if (!id || !Number.isFinite(weight) || !Number.isFinite(utility)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    let banned = false;
    let depends_on: string | null = null;
    for (let i = 3; i < bits.length; i++) {
      const flag = bits[i].trim();
      if (flag === "B" || flag.toLowerCase() === "banned") banned = true;
      else if (flag.startsWith("D") && flag.length > 1) depends_on = flag.slice(1);
    }
    out.push({
      id,
      weight: Math.max(1, Math.floor(weight)),
      utility: Math.floor(utility),
      banned,
      depends_on,
    });
  }
  return out;
}

export function summarizeSelection(
  selected: PackItem[],
  capacity: number,
): { utility: number; weight: number; violations: number; feasible: boolean } {
  const ids = new Set(selected.map((s) => s.id));
  let utility = 0;
  let weight = 0;
  let violations = 0;
  for (const item of selected) {
    utility += item.utility;
    weight += item.weight;
    if (item.banned) violations += 1;
    if (item.depends_on && !ids.has(item.depends_on)) violations += 1;
  }
  if (weight > capacity) violations += weight - capacity;
  return {
    utility,
    weight,
    violations,
    feasible: violations === 0,
  };
}

/** Preference-only greedy: rank by utility, add while ignoring banned + deps (capacity soft). */
export function naiveSelect(items: PackItem[], capacity: number): PackItem[] {
  const ranked = [...items].sort((a, b) => {
    if (b.utility !== a.utility) return b.utility - a.utility;
    return a.id.localeCompare(b.id);
  });
  const picked: PackItem[] = [];
  let weight = 0;
  // Soft capacity = 2× hard capacity so preference greed routinely overpacks.
  const softCap = Math.max(capacity * 2, capacity + 1);
  for (const item of ranked) {
    if (weight + item.weight > softCap) continue;
    picked.push(item);
    weight += item.weight;
  }
  return picked;
}

function isFeasibleSubset(subset: PackItem[], capacity: number): boolean {
  return summarizeSelection(subset, capacity).feasible;
}

/** Exact max-utility feasible subset (n ≤ 16 via enumeration). */
export function constrainedSelect(items: PackItem[], capacity: number): PackItem[] {
  const eligible = items.filter((i) => !i.banned);
  const n = eligible.length;
  if (n === 0) return [];
  if (n > 16) {
    // Greedy fallback with hard gates for oversized catalogs.
    const ranked = [...eligible].sort((a, b) => {
      if (b.utility !== a.utility) return b.utility - a.utility;
      return a.id.localeCompare(b.id);
    });
    const picked: PackItem[] = [];
    let weight = 0;
    const ids = new Set<string>();
    for (const item of ranked) {
      if (item.depends_on && !ids.has(item.depends_on)) {
        const dep = eligible.find((e) => e.id === item.depends_on);
        if (!dep) continue;
        if (weight + dep.weight + item.weight > capacity) continue;
        if (!ids.has(dep.id)) {
          picked.push(dep);
          ids.add(dep.id);
          weight += dep.weight;
        }
      }
      if (item.depends_on && !ids.has(item.depends_on)) continue;
      if (weight + item.weight > capacity) continue;
      if (ids.has(item.id)) continue;
      picked.push(item);
      ids.add(item.id);
      weight += item.weight;
    }
    return isFeasibleSubset(picked, capacity) ? picked : [];
  }

  let best: PackItem[] = [];
  let bestUtil = -1;
  const limit = 1 << n;
  for (let mask = 0; mask < limit; mask++) {
    const subset: PackItem[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(eligible[i]);
    }
    if (!isFeasibleSubset(subset, capacity)) continue;
    const util = subset.reduce((s, it) => s + it.utility, 0);
    if (util > bestUtil) {
      bestUtil = util;
      best = subset;
    } else if (util === bestUtil && util >= 0) {
      const a = subset.map((x) => x.id).sort().join(",");
      const b = best.map((x) => x.id).sort().join(",");
      if (a < b) best = subset;
    }
  }
  return best;
}

function resolveInputs(input: PackFitInput): {
  capacity: number;
  items: PackItem[];
} {
  const rawCap = Number(input.capacity ?? DEFAULT_CAPACITY);
  const capacity = !Number.isFinite(rawCap)
    ? DEFAULT_CAPACITY
    : Math.max(CAP_MIN, Math.min(CAP_MAX, Math.floor(rawCap)));
  const raw =
    input.items !== undefined && String(input.items).trim()
      ? String(input.items)
      : DEFAULT_ITEMS;
  const items = parseItems(raw);
  return { capacity, items: items.length ? items : parseItems(DEFAULT_ITEMS) };
}

export function scorePackFit(input: PackFitInput): PackFitResult {
  if (input.preference_cheat === true) {
    return { status: "reject", reason: "preference_cheat" };
  }

  const { capacity, items } = resolveInputs(input);
  const naivePicked = naiveSelect(items, capacity);
  const constrainedPicked = constrainedSelect(items, capacity);
  const naiveSum = summarizeSelection(naivePicked, capacity);
  const consSum = summarizeSelection(constrainedPicked, capacity);
  const naiveRisk = naiveSum.violations * 100 + (naiveSum.feasible ? 0 : 10);
  const consRisk = consSum.violations * 100;

  return {
    status: "ok",
    capacity,
    item_count: items.length,
    naive: {
      label: "naive_preference_only",
      utility: naiveSum.utility,
      weight: naiveSum.weight,
      violations: naiveSum.violations,
      feasible: naiveSum.feasible,
      risk_score: naiveRisk,
      action: naivePicked.length ? "greedy_pick" : "empty",
      selected: naivePicked.map((i) => i.id).sort(),
    },
    constrained: {
      label: "hard_rule_gated",
      utility: consSum.utility,
      weight: consSum.weight,
      violations: consSum.violations,
      feasible: consSum.feasible,
      risk_score: consRisk,
      action: constrainedPicked.length ? "select_feasible" : "empty",
      rejected: items.length - constrainedPicked.length,
      selected: constrainedPicked.map((i) => i.id).sort(),
    },
    delta_score: naiveRisk - consRisk,
  };
}

/** @deprecated alias kept for transitional imports */
export const scoreControlFit = scorePackFit;
export type ControlFitInput = PackFitInput;
export type ControlFitResult = PackFitResult;
export type ControlFitOk = PackFitOk;
export type ControlFitReject = PackFitReject;
