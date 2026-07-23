/**
 * Generate ≥28 dual-impl goldens for Prompt Cache Desk.
 * Fixtures must agree with src/domain/promptCache.ts.
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "test", "fixtures");
mkdirSync(dir, { recursive: true });

for (const f of readdirSync(dir)) {
  if (f.endsWith(".json")) unlinkSync(join(dir, f));
}

const cases = [
  { id: "std-001", title: "Default 12k prefix ratio 3", input: {} },
  {
    id: "std-002",
    title: "Reject ideal rho cheat",
    input: { ideal_rho_cheat: true },
  },
  {
    id: "std-003",
    title: "Small prefix stays hot tier",
    input: { prefix_tokens: 2000, ratio: 2, queries: 10 },
  },
  {
    id: "std-004",
    title: "Exactly at tier threshold",
    input: { prefix_tokens: 3500, ratio: 1, queries: 10 },
  },
  {
    id: "std-005",
    title: "Just below tier threshold",
    input: { prefix_tokens: 3499, ratio: 1, queries: 10 },
  },
  {
    id: "std-006",
    title: "High ratio clamps to r_max",
    input: { prefix_tokens: 12000, ratio: 8, queries: 10 },
  },
  {
    id: "std-007",
    title: "LongBench-ish 18k ratio 2",
    input: { prefix_tokens: 18000, ratio: 2, queries: 10 },
  },
  {
    id: "std-008",
    title: "LongBench-ish 18k ratio 4",
    input: { prefix_tokens: 18000, ratio: 4, queries: 10 },
  },
  {
    id: "std-009",
    title: "LongBench-ish 18k ratio 6",
    input: { prefix_tokens: 18000, ratio: 6, queries: 10 },
  },
  {
    id: "std-010",
    title: "25k doc ratio 3",
    input: { prefix_tokens: 25000, ratio: 3, queries: 10 },
  },
  {
    id: "std-011",
    title: "25k doc ratio 6 over-compress risk",
    input: { prefix_tokens: 25000, ratio: 6, queries: 10 },
  },
  {
    id: "std-012",
    title: "Enterprise tools schema 94k r=3",
    input: { prefix_tokens: 94000, ratio: 3, queries: 20 },
  },
  {
    id: "std-013",
    title: "Short session N=1",
    input: { prefix_tokens: 12000, ratio: 3, queries: 1 },
  },
  {
    id: "std-014",
    title: "Long session N=30",
    input: { prefix_tokens: 12000, ratio: 3, queries: 30 },
  },
  {
    id: "std-015",
    title: "Cheap reads amplify cache value",
    input: { prefix_tokens: 12000, ratio: 3, queries: 10, c_read: 0.05 },
  },
  {
    id: "std-016",
    title: "Expensive writes punish misses",
    input: { prefix_tokens: 12000, ratio: 3, queries: 10, c_write: 2 },
  },
  {
    id: "std-017",
    title: "Hot rho lower hurts small prefixes",
    input: { prefix_tokens: 2000, ratio: 1, queries: 10, rho_hot: 0.5 },
  },
  {
    id: "std-018",
    title: "Custom tier 4000",
    input: { prefix_tokens: 10000, ratio: 4, queries: 10, tier_threshold: 4000 },
  },
  {
    id: "std-019",
    title: "Ratio 1 no compression",
    input: { prefix_tokens: 8000, ratio: 1, queries: 10 },
  },
  {
    id: "std-020",
    title: "Minimum prefix clamp",
    input: { prefix_tokens: 100, ratio: 2, queries: 5 },
  },
  {
    id: "std-021",
    title: "Large prefix 50k ratio 5",
    input: { prefix_tokens: 50000, ratio: 5, queries: 15 },
  },
  {
    id: "std-022",
    title: "Query-aware wins only if ideal — still miss",
    input: { prefix_tokens: 7000, ratio: 7, queries: 10 },
  },
  {
    id: "std-023",
    title: "Persistent after mild compress",
    input: { prefix_tokens: 14000, ratio: 2, queries: 10 },
  },
  {
    id: "std-024",
    title: "Would fall to hot without clamp",
    input: { prefix_tokens: 10000, ratio: 5, queries: 10 },
  },
  {
    id: "std-025",
    title: "Equal c_write and c_read",
    input: { prefix_tokens: 12000, ratio: 3, queries: 10, c_write: 1, c_read: 1 },
  },
  {
    id: "std-026",
    title: "Graphify-scale 5k prefix",
    input: { prefix_tokens: 5000, ratio: 2, queries: 10 },
  },
  {
    id: "std-027",
    title: "Graphify-scale 260k capped",
    input: { prefix_tokens: 260000, ratio: 4, queries: 10 },
  },
  {
    id: "std-028",
    title: "Retail-ish small wiki prefix",
    input: { prefix_tokens: 4000, ratio: 2, queries: 50 },
  },
  {
    id: "std-029",
    title: "Ratio 2 on 12k",
    input: { prefix_tokens: 12000, ratio: 2, queries: 10 },
  },
  {
    id: "std-030",
    title: "Ratio 4 on 12k",
    input: { prefix_tokens: 12000, ratio: 4, queries: 10 },
  },
];

const require = createRequire(import.meta.url);
const tsx = join(root, "node_modules", "tsx", "dist", "cli.mjs");

function scoreViaTsx(input) {
  const payload = JSON.stringify(input);
  const code = `
    import { scorePromptCache } from ${JSON.stringify(join(root, "src/domain/promptCache.ts").replace(/\\/g, "/"))};
    const input = ${payload};
    console.log(JSON.stringify(scorePromptCache(input)));
  `;
  const r = spawnSync(process.execPath, ["--import", "tsx", "-e", code], {
    encoding: "utf8",
    cwd: root,
  });
  if (r.status !== 0) {
    // fallback: write temp and run
    const tmp = join(root, "scripts", "_score_tmp.mjs");
    writeFileSync(
      tmp,
      `import { scorePromptCache } from "../src/domain/promptCache.ts";\nconsole.log(JSON.stringify(scorePromptCache(${payload})));\n`,
    );
    const r2 = spawnSync(
      process.execPath,
      ["--import", "tsx", tmp],
      { encoding: "utf8", cwd: root },
    );
    try {
      unlinkSync(tmp);
    } catch {
      /* ignore */
    }
    if (r2.status !== 0) {
      throw new Error(r2.stderr || r.stderr || "score failed");
    }
    return JSON.parse(r2.stdout.trim());
  }
  return JSON.parse(r.stdout.trim());
}

// Prefer inline scoring mirror for offline generation without tsx path issues
function hitRate(prefixSent, tierThreshold, rhoHot) {
  return prefixSent >= tierThreshold ? 1 : rhoHot;
}
function tierOf(prefixSent, tierThreshold) {
  return prefixSent >= tierThreshold ? "persistent" : "hot";
}
function tierPreservingMaxRatio(prefixTokens, tierThreshold) {
  return Math.max(1, Math.floor(prefixTokens / tierThreshold));
}
function compressedSize(prefixTokens, ratio) {
  return Math.max(1, Math.ceil(prefixTokens / Math.max(1, ratio)));
}
function sessionCost(queries, prefixSent, rho, cWrite, cRead) {
  const per = (1 - rho) * prefixSent * cWrite + rho * prefixSent * cRead;
  return Number((queries * per).toFixed(4));
}
function riskFromCost(cost) {
  return Math.round(cost * 100) / 100;
}
function strategy(label, prefixSent, ratioUsed, queries, tierThreshold, rhoHot, cWrite, cRead, action, cacheStable) {
  const rho = hitRate(prefixSent, tierThreshold, rhoHot);
  const cost = sessionCost(queries, prefixSent, rho, cWrite, cRead);
  return {
    label,
    prefix_sent: prefixSent,
    ratio_used: ratioUsed,
    rho,
    tier: tierOf(prefixSent, tierThreshold),
    cost,
    risk_score: riskFromCost(cost),
    action,
    cache_stable: cacheStable,
  };
}
function scorePromptCache(input) {
  if (input.ideal_rho_cheat === true) {
    return { status: "reject", reason: "ideal_rho_cheat" };
  }
  const prefix_tokens = !Number.isFinite(Number(input.prefix_tokens ?? 12000))
    ? 12000
    : Math.max(500, Math.min(200000, Math.floor(Number(input.prefix_tokens ?? 12000))));
  const ratio = !Number.isFinite(Number(input.ratio ?? 3))
    ? 3
    : Math.max(1, Math.min(20, Math.floor(Number(input.ratio ?? 3))));
  const queries = !Number.isFinite(Number(input.queries ?? 10))
    ? 10
    : Math.max(1, Math.min(100, Math.floor(Number(input.queries ?? 10))));
  const c_write = !Number.isFinite(Number(input.c_write ?? 1))
    ? 1
    : Math.max(0.01, Math.min(100, Number(Number(input.c_write ?? 1).toFixed(4))));
  const rawC = Number(input.c_read ?? 0.1);
  const c_read = !Number.isFinite(rawC)
    ? 0.1
    : Math.max(0.001, Math.min(c_write, Number(rawC.toFixed(4))));
  const tier_threshold = !Number.isFinite(Number(input.tier_threshold ?? 3500))
    ? 3500
    : Math.max(100, Math.min(50000, Math.floor(Number(input.tier_threshold ?? 3500))));
  const rho_hot = !Number.isFinite(Number(input.rho_hot ?? 0.83))
    ? 0.83
    : Math.max(0.01, Math.min(0.99, Number(Number(input.rho_hot ?? 0.83).toFixed(4))));
  const r_max = tierPreservingMaxRatio(prefix_tokens, tier_threshold);

  const vanilla = {
    label: "vanilla_full_prompt",
    prefix_sent: prefix_tokens,
    ratio_used: 1,
    rho: 0,
    tier: tierOf(prefix_tokens, tier_threshold),
    cost: Number((queries * prefix_tokens * c_write).toFixed(4)),
    risk_score: riskFromCost(queries * prefix_tokens * c_write),
    action: "send_full_every_call",
    cache_stable: false,
  };
  const cache_only = strategy(
    "cache_only",
    prefix_tokens,
    1,
    queries,
    tier_threshold,
    rho_hot,
    c_write,
    c_read,
    "cache_full_prefix",
    true,
  );
  const qaSize = compressedSize(prefix_tokens, ratio);
  const query_aware = {
    label: "query_aware_breaks_cache",
    prefix_sent: qaSize,
    ratio_used: ratio,
    rho: 0,
    tier: tierOf(qaSize, tier_threshold),
    cost: Number((queries * qaSize * c_write).toFixed(4)),
    risk_score: riskFromCost(queries * qaSize * c_write),
    action: "compress_per_query",
    cache_stable: false,
  };
  const ratio_used = Math.min(ratio, r_max);
  const caSize = compressedSize(prefix_tokens, ratio_used);
  const cache_aware = strategy(
    "cache_aware_tier_preserving",
    caSize,
    ratio_used,
    queries,
    tier_threshold,
    rho_hot,
    c_write,
    c_read,
    ratio_used < ratio ? "clamp_ratio_preserve_tier" : "compress_once_and_cache",
    true,
  );
  const bestNaive = Math.min(
    vanilla.risk_score,
    cache_only.risk_score,
    query_aware.risk_score,
  );
  return {
    status: "ok",
    prefix_tokens,
    ratio,
    queries,
    tier_threshold,
    c_write,
    c_read,
    rho_hot,
    r_max,
    vanilla,
    cache_only,
    query_aware,
    naive: query_aware,
    pla: cache_aware,
    cache_aware,
    delta_score: Number((query_aware.risk_score - cache_aware.risk_score).toFixed(4)),
    vs_best_naive: Number((bestNaive - cache_aware.risk_score).toFixed(4)),
  };
}

void require;
void tsx;
void scoreViaTsx;
void spawnSync;

for (const c of cases) {
  const live = scorePromptCache(c.input);
  const expect =
    live.status === "reject"
      ? { status: "reject", reason: live.reason }
      : {
          status: "ok",
          prefix_tokens: live.prefix_tokens,
          naive_risk: live.naive.risk_score,
          safer_risk: live.pla.risk_score,
          delta_score: live.delta_score,
          ratio: live.ratio,
          r_max: live.r_max,
          cache_aware_tier: live.cache_aware.tier,
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
