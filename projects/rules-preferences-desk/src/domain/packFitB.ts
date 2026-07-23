/**
 * Dual-impl twin of packFit.ts — must agree on all golden fixtures.
 * Alternate formulation: score via bitmask utility table (same rules).
 */
import {
  parseItems,
  summarizeSelection,
  type PackFitInput,
  type PackFitResult,
  type PackItem,
} from "./packFit.js";

const DEFAULT_ITEMS =
  "passport:1:10|phone:1:9|charger:1:8:Dphone|camera:3:7:Dcharger|liquids:2:6:B|coat:4:5|book:2:4|socks:1:3";
const DEFAULT_CAPACITY = 8;

function resolve(input: PackFitInput): { capacity: number; items: PackItem[] } {
  const rawCap = Number(input.capacity ?? DEFAULT_CAPACITY);
  const capacity = !Number.isFinite(rawCap)
    ? DEFAULT_CAPACITY
    : Math.max(1, Math.min(40, Math.floor(rawCap)));
  const raw =
    input.items !== undefined && String(input.items).trim()
      ? String(input.items)
      : DEFAULT_ITEMS;
  const items = parseItems(raw);
  return { capacity, items: items.length ? items : parseItems(DEFAULT_ITEMS) };
}

function naivePick(items: PackItem[], capacity: number): PackItem[] {
  const ranked = [...items].sort((a, b) =>
    b.utility !== a.utility ? b.utility - a.utility : a.id.localeCompare(b.id),
  );
  const soft = Math.max(capacity * 2, capacity + 1);
  const out: PackItem[] = [];
  let w = 0;
  for (const it of ranked) {
    if (w + it.weight > soft) continue;
    out.push(it);
    w += it.weight;
  }
  return out;
}

function constrainedPick(items: PackItem[], capacity: number): PackItem[] {
  const eligible = items.filter((i) => !i.banned);
  const n = eligible.length;
  if (n === 0) return [];
  if (n > 16) {
    const ranked = [...eligible].sort((a, b) =>
      b.utility !== a.utility ? b.utility - a.utility : a.id.localeCompare(b.id),
    );
    const picked: PackItem[] = [];
    const ids = new Set<string>();
    let weight = 0;
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
      if (ids.has(item.id)) continue;
      if (weight + item.weight > capacity) continue;
      picked.push(item);
      ids.add(item.id);
      weight += item.weight;
    }
    return summarizeSelection(picked, capacity).feasible ? picked : [];
  }

  let best: PackItem[] = [];
  let bestUtil = -1;
  for (let mask = 0; mask < 1 << n; mask++) {
    const subset: PackItem[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(eligible[i]);
    }
    const sum = summarizeSelection(subset, capacity);
    if (!sum.feasible) continue;
    if (sum.utility > bestUtil) {
      bestUtil = sum.utility;
      best = subset;
    } else if (sum.utility === bestUtil) {
      const a = subset.map((x) => x.id).sort().join(",");
      const b = best.map((x) => x.id).sort().join(",");
      if (a < b) best = subset;
    }
  }
  return best;
}

export function scorePackFitB(input: PackFitInput): PackFitResult {
  if (input.preference_cheat === true) {
    return { status: "reject", reason: "preference_cheat" };
  }
  const { capacity, items } = resolve(input);
  const naivePicked = naivePick(items, capacity);
  const constrainedPicked = constrainedPick(items, capacity);
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

export const scoreControlFitB = scorePackFitB;
