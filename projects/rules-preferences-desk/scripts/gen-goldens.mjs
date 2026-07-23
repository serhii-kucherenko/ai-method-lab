/**
 * Generate ≥25 dual-impl pack-fit golden fixtures.
 * Run: node scripts/gen-goldens.mjs
 * Scoring must match src/domain/packFit.ts (and packFitB.ts).
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

const DEFAULT_ITEMS =
  "passport:1:10|phone:1:9|charger:1:8:Dphone|camera:3:7:Dcharger|liquids:2:6:B|coat:4:5|book:2:4|socks:1:3";
const DEFAULT_CAPACITY = 8;

function parseItems(hint) {
  const parts = String(hint ?? "")
    .split(/[|,]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const out = [];
  const seen = new Set();
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
    let depends_on = null;
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

function summarizeSelection(selected, capacity) {
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
  return { utility, weight, violations, feasible: violations === 0 };
}

function naiveSelect(items, capacity) {
  const ranked = [...items].sort((a, b) =>
    b.utility !== a.utility ? b.utility - a.utility : a.id.localeCompare(b.id),
  );
  const softCap = Math.max(capacity * 2, capacity + 1);
  const picked = [];
  let weight = 0;
  for (const item of ranked) {
    if (weight + item.weight > softCap) continue;
    picked.push(item);
    weight += item.weight;
  }
  return picked;
}

function constrainedSelect(items, capacity) {
  const eligible = items.filter((i) => !i.banned);
  const n = eligible.length;
  if (n === 0) return [];
  let best = [];
  let bestUtil = -1;
  for (let mask = 0; mask < 1 << n; mask++) {
    const subset = [];
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

function score(input) {
  if (input.preference_cheat === true) {
    return { status: "reject", reason: "preference_cheat" };
  }
  const rawCap = Number(input.capacity ?? DEFAULT_CAPACITY);
  const capacity = !Number.isFinite(rawCap)
    ? DEFAULT_CAPACITY
    : Math.max(1, Math.min(40, Math.floor(rawCap)));
  const raw =
    input.items !== undefined && String(input.items).trim()
      ? String(input.items)
      : DEFAULT_ITEMS;
  let items = parseItems(raw);
  if (!items.length) items = parseItems(DEFAULT_ITEMS);

  const naivePicked = naiveSelect(items, capacity);
  const constrainedPicked = constrainedSelect(items, capacity);
  const naiveSum = summarizeSelection(naivePicked, capacity);
  const consSum = summarizeSelection(constrainedPicked, capacity);
  const naive_risk = naiveSum.violations * 100 + (naiveSum.feasible ? 0 : 10);
  const safer_risk = consSum.violations * 100;

  return {
    status: "ok",
    capacity,
    item_count: items.length,
    naive_utility: naiveSum.utility,
    constrained_utility: consSum.utility,
    naive_violations: naiveSum.violations,
    constrained_violations: consSum.violations,
    naive_risk,
    safer_risk,
    delta_score: naive_risk - safer_risk,
    naive_feasible: naiveSum.feasible,
    constrained_feasible: consSum.feasible,
  };
}

const cases = [
  { id: "std-001", title: "default catalog capacity 8", input: {} },
  { id: "std-002", title: "tight capacity 4", input: { capacity: 4 } },
  { id: "std-003", title: "roomy capacity 12", input: { capacity: 12 } },
  { id: "std-004", title: "capacity 6", input: { capacity: 6 } },
  { id: "std-005", title: "capacity 0 clamped", input: { capacity: 0 } },
  { id: "std-006", title: "negative capacity clamped", input: { capacity: -3 } },
  { id: "std-007", title: "fractional capacity floor", input: { capacity: 7.9 } },
  {
    id: "std-008",
    title: "banned liquids dominate prefs",
    input: {
      capacity: 5,
      items: "passport:1:5|liquids:2:99:B|socks:1:2",
    },
  },
  {
    id: "std-009",
    title: "dependency camera needs charger",
    input: {
      capacity: 5,
      items: "charger:1:4|camera:3:20:Dcharger|book:2:3",
    },
  },
  {
    id: "std-010",
    title: "missing dependency blocks camera",
    input: {
      capacity: 6,
      items: "camera:3:20:Dcharger|book:2:8|socks:1:1",
    },
  },
  {
    id: "std-011",
    title: "all banned catalog",
    input: {
      capacity: 8,
      items: "a:1:9:B|b:2:8:B|c:1:7:B",
    },
  },
  {
    id: "std-012",
    title: "single light item",
    input: { capacity: 3, items: "passport:1:10" },
  },
  {
    id: "std-013",
    title: "overweight single item",
    input: { capacity: 2, items: "trunk:5:50" },
  },
  {
    id: "std-014",
    title: "preference cheat reject",
    input: { preference_cheat: true, capacity: 8 },
  },
  {
    id: "std-015",
    title: "beach light pack",
    input: {
      capacity: 6,
      items: "swimsuit:1:9|sunscreen:1:8:B|hat:1:6|towel:2:7|book:2:4",
    },
  },
  {
    id: "std-016",
    title: "winter heavy coat",
    input: {
      capacity: 7,
      items: "coat:5:9|gloves:1:6|hat:1:5|scarf:1:4|passport:1:10",
    },
  },
  {
    id: "std-017",
    title: "meds plus ice pack dependency",
    input: {
      capacity: 5,
      items: "meds:1:12|ice:2:4:Dmeds|snack:1:3|liquids:2:8:B",
    },
  },
  {
    id: "std-018",
    title: "large capacity takes more",
    input: { capacity: 20 },
  },
  {
    id: "std-019",
    title: "tiny capacity forces sparse",
    input: { capacity: 2 },
  },
  {
    id: "std-020",
    title: "equal utilities stable tie-break",
    input: {
      capacity: 4,
      items: "a:2:5|b:2:5|c:2:5|d:1:1",
    },
  },
  {
    id: "std-021",
    title: "chain dependency laptop charger cable",
    input: {
      capacity: 6,
      items: "cable:1:3|charger:2:5:Dcable|laptop:3:15:Dcharger|book:2:4",
    },
  },
  {
    id: "std-022",
    title: "empty items string falls back",
    input: { capacity: 8, items: "" },
  },
  {
    id: "std-023",
    title: "garbage tokens ignored",
    input: {
      capacity: 5,
      items: "bad|x:y|passport:1:10|ok:2:4",
    },
  },
  {
    id: "std-024",
    title: "duplicate ids ignored",
    input: {
      capacity: 5,
      items: "passport:1:10|passport:2:99|book:2:4",
    },
  },
  {
    id: "std-025",
    title: "high utility banned still rejected",
    input: {
      capacity: 4,
      items: "banned-gold:1:100:B|ok:2:5|ok2:1:4",
    },
  },
  {
    id: "std-026",
    title: "capacity 9 default catalog",
    input: { capacity: 9 },
  },
  {
    id: "std-027",
    title: "work trip electronics",
    input: {
      capacity: 8,
      items:
        "passport:1:10|laptop:4:12|charger:1:8:Dlaptop|mouse:1:5|adapter:1:6:Dcharger|liquids:2:3:B",
    },
  },
  {
    id: "std-028",
    title: "family infant extras",
    input: {
      capacity: 10,
      items:
        "passport:1:10|diapers:3:9|formula:2:8:B|wipes:2:7|clothes:3:6|toy:1:4",
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
          capacity: live.capacity,
          naive_risk: live.naive_risk,
          safer_risk: live.safer_risk,
          delta_score: live.delta_score,
          naive_utility: live.naive_utility,
          constrained_utility: live.constrained_utility,
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
