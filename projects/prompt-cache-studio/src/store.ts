import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreCacheAware, scoreNaiveBust } from "./domain/cache";
import {
  readinessFromQuality,
  type CacheInput,
  type CacheQuality,
  type CompressProfile,
  type CostReadiness,
  type ScoreMode,
} from "./domain/types";

export type {
  CacheInput,
  CacheQuality,
  CompressProfile,
  CostReadiness,
  ScoreMode,
};

export type MemberRole = "owner" | "operator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type ProviderKind = "anthropic" | "openai" | "google" | "other";

export type LlmDeployment = {
  id: string;
  name: string;
  provider: ProviderKind;
  model: string;
  region: string;
  notes: string;
  createdAt: string;
};

export type PromptAsset = {
  id: string;
  deploymentId: string;
  name: string;
  prefixTokens: number;
  suffixTokens: number;
  sharedPrefix: boolean;
  notes: string;
  createdAt: string;
};

export type PolicyStatus = "draft" | "active" | "stale" | "archived";

export type CompressionPolicy = {
  id: string;
  deploymentId: string;
  name: string;
  mode: ScoreMode;
  status: PolicyStatus;
  profile: CompressProfile;
  quality?: CacheQuality;
  readiness?: CostReadiness;
  createdAt: string;
  updatedAt: string;
};

export type CacheTier = {
  id: string;
  deploymentId: string;
  label: string;
  cachedUsdPerMTok: number;
  uncachedUsdPerMTok: number;
  ttlMinutes: number;
  createdAt: string;
};

export type CostEstimate = {
  id: string;
  policyId: string;
  deploymentId: string;
  label: string;
  monthlyCalls: number;
  cachedSpend: number;
  uncachedSpend: number;
  totalSpend: number;
  savingsVsNaive: number;
  createdAt: string;
};

export type HitOutcome = "hit" | "miss" | "partial";

export type AuditHit = {
  id: string;
  deploymentId: string;
  policyId: string;
  outcome: HitOutcome;
  prefixHash: string;
  detail: string;
  at: string;
};

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export type OrgSettings = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  bearerToken: string;
  defaultProfile: CompressProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  deploymentId: string;
  input: CacheInput;
  cacheAware: CacheQuality;
  naiveBust: CacheQuality;
  winner: "cache-aware" | "naive-bust" | "tie";
  createdAt: string;
};

export type WebhookEvent = {
  id: string;
  idempotencyKey: string;
  receivedAt: string;
  payload: unknown;
};

type StoreState = {
  org: OrgSettings;
  members: Member[];
  deployments: LlmDeployment[];
  prompts: PromptAsset[];
  policies: CompressionPolicy[];
  tiers: CacheTier[];
  costs: CostEstimate[];
  hits: AuditHit[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __pcsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function seedInput(): CacheInput {
  return {
    prefixShare: 0.72,
    queryVolatility: 0.38,
    compressionTarget: 0.55,
    prefixStability: 0.82,
    cacheTtlFit: 0.74,
    hitRatePrior: 0.68,
    tokenVolume: 0.7,
    tierDiscount: 0.78,
    rewriteAggression: 0.28,
    suffixShare: 0.32,
    providerCacheSupport: 0.88,
    promptCount: 14,
    profile: "balanced",
  };
}

function seed(): StoreState {
  const deploymentId = "dep-demo";
  const promptId = "prompt-demo";
  const policyId = "policy-demo";
  const input = seedInput();
  const quality = scoreCacheAware(input);
  const readiness = readinessFromQuality(quality, input);

  return {
    org: {
      name: "Prompt Cache Org",
      webhookUrl: "",
      webhookSecret: "pcs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "balanced",
      defaultMode: "cache-aware",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@studio.local", role: "owner" },
      { id: "m2", email: "platform@studio.local", role: "operator" },
      { id: "m3", email: "viewer@studio.local", role: "viewer" },
    ],
    deployments: [
      {
        id: deploymentId,
        name: "Assist API · us-east",
        provider: "anthropic",
        model: "claude-sonnet",
        region: "us-east-1",
        notes: "Shared system prefix for support assistants",
        createdAt: now(),
      },
    ],
    prompts: [
      {
        id: promptId,
        deploymentId,
        name: "Support system + tools prefix",
        prefixTokens: 2400,
        suffixTokens: 420,
        sharedPrefix: true,
        notes: "Stable tools schema + brand voice",
        createdAt: now(),
      },
    ],
    policies: [
      {
        id: policyId,
        deploymentId,
        name: "Cache-aware suffix compress",
        mode: "cache-aware",
        status: "active",
        profile: "balanced",
        quality,
        readiness,
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    tiers: [
      {
        id: "tier-demo",
        deploymentId,
        label: "Provider two-tier",
        cachedUsdPerMTok: 0.3,
        uncachedUsdPerMTok: 3.0,
        ttlMinutes: 60,
        createdAt: now(),
      },
    ],
    costs: [
      {
        id: "cost-demo",
        policyId,
        deploymentId,
        label: "Monthly assist traffic",
        monthlyCalls: 120_000,
        cachedSpend: round2(quality.tierSavings * 12.4),
        uncachedSpend: round2((100 - quality.tierSavings) * 8.2),
        totalSpend: round2(
          quality.tierSavings * 12.4 + (100 - quality.tierSavings) * 8.2,
        ),
        savingsVsNaive: round2(quality.tierSavings * 4.8),
        createdAt: now(),
      },
    ],
    hits: [
      {
        id: "hit-demo",
        deploymentId,
        policyId,
        outcome: "hit",
        prefixHash: "pfx-a1b2",
        detail: "Shared prefix matched within TTL",
        at: now(),
      },
    ],
    audits: [
      {
        id: "a1",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo deployment, prompt, policy, tier, and hit loaded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pcsStore) g.__pcsStore = seed();
  return g.__pcsStore;
}

export function resetStore(): void {
  g.__pcsStore = seed();
}

function audit(actor: string, action: string, detail: string): void {
  state().audits.unshift({
    id: randomUUID(),
    at: now(),
    actor,
    action,
    detail,
  });
}

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  Object.assign(state().org, patch);
  audit("owner", "settings.update", JSON.stringify(patch));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole): Member {
  const m: Member = { id: randomUUID(), email, role };
  state().members.push(m);
  audit("owner", "member.invite", `${email} as ${role}`);
  return m;
}

export function listDeployments(q?: string): LlmDeployment[] {
  const all = [...state().deployments].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (!q) return all;
  const needle = q.toLowerCase();
  return all.filter(
    (d) =>
      d.name.toLowerCase().includes(needle) ||
      d.provider.toLowerCase().includes(needle) ||
      d.model.toLowerCase().includes(needle) ||
      d.region.toLowerCase().includes(needle) ||
      d.notes.toLowerCase().includes(needle),
  );
}

export function createDeployment(input: {
  name: string;
  provider: ProviderKind;
  model: string;
  region: string;
  notes: string;
}): LlmDeployment {
  const row: LlmDeployment = {
    id: randomUUID(),
    name: input.name.trim(),
    provider: input.provider,
    model: input.model.trim(),
    region: input.region.trim(),
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().deployments.unshift(row);
  audit("operator", "deployment.create", row.name);
  return row;
}

export function getDeployment(id: string): LlmDeployment | undefined {
  return state().deployments.find((d) => d.id === id);
}

export function listPrompts(deploymentId?: string, q?: string): PromptAsset[] {
  let rows = [...state().prompts];
  if (deploymentId) rows = rows.filter((p) => p.deploymentId === deploymentId);
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.notes.toLowerCase().includes(needle),
    );
  }
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPrompt(input: {
  deploymentId: string;
  name: string;
  prefixTokens: number;
  suffixTokens: number;
  sharedPrefix: boolean;
  notes: string;
}): PromptAsset {
  const dep = getDeployment(input.deploymentId);
  if (!dep) throw new Error("deployment_not_found");
  const row: PromptAsset = {
    id: randomUUID(),
    deploymentId: input.deploymentId,
    name: input.name.trim(),
    prefixTokens: Math.max(0, Math.round(input.prefixTokens)),
    suffixTokens: Math.max(0, Math.round(input.suffixTokens)),
    sharedPrefix: input.sharedPrefix,
    notes: input.notes.trim(),
    createdAt: now(),
  };
  state().prompts.unshift(row);
  audit("operator", "prompt.create", row.name);
  return row;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function inputFromDeployment(
  dep: LlmDeployment,
  prompts: PromptAsset[],
  patch?: Partial<CacheInput>,
  profile?: CompressProfile,
): CacheInput {
  const base = seedInput();
  const shared = prompts.filter((p) => p.sharedPrefix);
  const totalPrefix = shared.reduce((s, p) => s + p.prefixTokens, 0);
  const totalSuffix = prompts.reduce((s, p) => s + p.suffixTokens, 0);
  const total = Math.max(1, totalPrefix + totalSuffix);
  const providerBoost =
    dep.provider === "anthropic"
      ? 0.9
      : dep.provider === "openai"
        ? 0.78
        : dep.provider === "google"
          ? 0.7
          : 0.55;
  return {
    ...base,
    ...patch,
    prefixShare:
      patch?.prefixShare ?? clamp01(totalPrefix / total),
    suffixShare:
      patch?.suffixShare ?? clamp01(totalSuffix / total),
    prefixStability:
      patch?.prefixStability ??
      clamp01(0.45 + (shared.length / Math.max(1, prompts.length)) * 0.4),
    providerCacheSupport: patch?.providerCacheSupport ?? providerBoost,
    promptCount:
      patch?.promptCount ?? Math.max(1, Math.min(100, prompts.length || 4)),
    profile: profile ?? state().org.defaultProfile,
  };
}

export function listPolicies(deploymentId?: string): CompressionPolicy[] {
  let rows = [...state().policies];
  if (deploymentId) rows = rows.filter((p) => p.deploymentId === deploymentId);
  return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPolicy(input: {
  deploymentId: string;
  name: string;
  mode?: ScoreMode;
  profile?: CompressProfile;
  cacheInput?: Partial<CacheInput>;
}): CompressionPolicy {
  const dep = getDeployment(input.deploymentId);
  if (!dep) throw new Error("deployment_not_found");
  const prompts = listPrompts(dep.id);
  const profile = input.profile ?? state().org.defaultProfile;
  const mode = input.mode ?? state().org.defaultMode;
  const emb = inputFromDeployment(dep, prompts, input.cacheInput, profile);
  const quality =
    mode === "naive-bust" ? scoreNaiveBust(emb) : scoreCacheAware(emb);
  const readiness = readinessFromQuality(quality, emb);
  const row: CompressionPolicy = {
    id: randomUUID(),
    deploymentId: dep.id,
    name: input.name.trim(),
    mode,
    status: "active",
    profile,
    quality,
    readiness,
    createdAt: now(),
    updatedAt: now(),
  };
  state().policies.unshift(row);
  audit("operator", "policy.create", `${row.name} (${row.mode})`);
  return row;
}

export function getPolicy(id: string): CompressionPolicy | undefined {
  return state().policies.find((p) => p.id === id);
}

export function listTiers(deploymentId?: string): CacheTier[] {
  let rows = [...state().tiers];
  if (deploymentId) rows = rows.filter((t) => t.deploymentId === deploymentId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createTier(input: {
  deploymentId: string;
  label: string;
  cachedUsdPerMTok: number;
  uncachedUsdPerMTok: number;
  ttlMinutes: number;
}): CacheTier {
  const dep = getDeployment(input.deploymentId);
  if (!dep) throw new Error("deployment_not_found");
  const row: CacheTier = {
    id: randomUUID(),
    deploymentId: dep.id,
    label: input.label.trim(),
    cachedUsdPerMTok: Math.max(0, input.cachedUsdPerMTok),
    uncachedUsdPerMTok: Math.max(0, input.uncachedUsdPerMTok),
    ttlMinutes: Math.max(1, Math.round(input.ttlMinutes)),
    createdAt: now(),
  };
  state().tiers.unshift(row);
  audit("operator", "tier.create", row.label);
  return row;
}

export function listCosts(deploymentId?: string): CostEstimate[] {
  let rows = [...state().costs];
  if (deploymentId) rows = rows.filter((c) => c.deploymentId === deploymentId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createCostEstimate(input: {
  policyId: string;
  label?: string;
  monthlyCalls?: number;
}): CostEstimate {
  const policy = getPolicy(input.policyId);
  if (!policy) throw new Error("policy_not_found");
  const q = policy.quality;
  const calls = Math.max(1000, input.monthlyCalls ?? 100_000);
  const hit = (q?.cacheHitRate ?? 40) / 100;
  const tier = (q?.tierSavings ?? 30) / 100;
  const cachedSpend = round2(calls * 0.00012 * hit * (1 - tier * 0.4));
  const uncachedSpend = round2(calls * 0.00045 * (1 - hit));
  const totalSpend = round2(cachedSpend + uncachedSpend);
  const naiveTotal = round2(calls * 0.00045);
  const row: CostEstimate = {
    id: randomUUID(),
    policyId: policy.id,
    deploymentId: policy.deploymentId,
    label: (input.label ?? `Estimate · ${policy.name}`).trim(),
    monthlyCalls: calls,
    cachedSpend,
    uncachedSpend,
    totalSpend,
    savingsVsNaive: round2(Math.max(0, naiveTotal - totalSpend)),
    createdAt: now(),
  };
  state().costs.unshift(row);
  audit("operator", "cost.create", row.label);
  return row;
}

export function listHits(deploymentId?: string): AuditHit[] {
  let rows = [...state().hits];
  if (deploymentId) rows = rows.filter((h) => h.deploymentId === deploymentId);
  return rows.sort((a, b) => b.at.localeCompare(a.at));
}

export function recordHit(input: {
  deploymentId: string;
  policyId: string;
  outcome: HitOutcome;
  prefixHash?: string;
  detail?: string;
}): AuditHit {
  const dep = getDeployment(input.deploymentId);
  if (!dep) throw new Error("deployment_not_found");
  const policy = getPolicy(input.policyId);
  if (!policy) throw new Error("policy_not_found");
  const row: AuditHit = {
    id: randomUUID(),
    deploymentId: dep.id,
    policyId: policy.id,
    outcome: input.outcome,
    prefixHash: (input.prefixHash ?? `pfx-${randomUUID().slice(0, 6)}`).trim(),
    detail: (input.detail ?? `${input.outcome} recorded`).trim(),
    at: now(),
  };
  state().hits.unshift(row);
  audit("operator", "hit.record", `${row.outcome} ${row.prefixHash}`);
  return row;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, Math.max(1, limit));
}

export function exportAuditsCsv(): string {
  const rows = listAudits(200);
  const header = "at,actor,action,detail";
  const body = rows
    .map(
      (r) =>
        `${r.at},${r.actor},${r.action},"${r.detail.replace(/"/g, '""')}"`,
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function exportCostsJson(): string {
  return JSON.stringify({ items: listCosts() }, null, 2);
}

export function listCompares(): CompareResult[] {
  return [...state().compares].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function createCompare(input: {
  name: string;
  deploymentId: string;
  cacheInput?: Partial<CacheInput>;
}): CompareResult {
  const dep = getDeployment(input.deploymentId);
  if (!dep) throw new Error("deployment_not_found");
  const prompts = listPrompts(dep.id);
  const emb = inputFromDeployment(dep, prompts, input.cacheInput);
  const cacheAware = scoreCacheAware(emb);
  const naiveBust = scoreNaiveBust(emb);
  let winner: CompareResult["winner"] = "tie";
  if (cacheAware.overall > naiveBust.overall + 0.5) winner = "cache-aware";
  else if (naiveBust.overall > cacheAware.overall + 0.5) winner = "naive-bust";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    deploymentId: dep.id,
    input: emb,
    cacheAware,
    naiveBust,
    winner,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("operator", "compare.create", `${row.name} → ${row.winner}`);
  return row;
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  return token === state().org.bearerToken;
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const org = state().org;
  const bucket = state().rateBucket;
  const nowMs = Date.now();
  if (nowMs - bucket.windowStart > 60_000) {
    bucket.windowStart = nowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  const remaining = Math.max(0, org.rateLimitPerMinute - bucket.count);
  return { ok: bucket.count <= org.rateLimitPerMinute, remaining };
}

export function signWebhook(body: string): string {
  return createHmac("sha256", state().org.webhookSecret)
    .update(body)
    .digest("hex");
}

export function ingestWebhook(
  body: string,
  signature: string | null,
  idempotencyKey: string,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const expected = signWebhook(body);
  const sig = (signature ?? "").replace(/^sha256=/, "");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(sig, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "invalid_signature" };
    }
  } catch {
    return { ok: false, error: "invalid_signature" };
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, id: existing.id };
  let payload: unknown = body;
  try {
    payload = JSON.parse(body);
  } catch {
    /* keep raw */
  }
  const ev: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(ev);
  audit("webhook", "ingest", idempotencyKey);
  return { ok: true, duplicate: false, id: ev.id };
}

export function listFeatures(): string[] {
  return [
    "Marketing landing for LLM cost buyers",
    "LLM deployment registry",
    "Prompt library with shared prefixes",
    "Cache-aware compression policies",
    "Two-tier cost model estimates",
    "Cache hit / miss audit",
    "Cache-aware vs naive-bust compare",
    "Org settings",
    "Member invite",
    "Webhook config with HMAC",
    "Idempotent inbound webhook",
    "Bearer auth on APIs",
    "Rate-limit feedback",
    "Search / filter deployments",
    "Search / filter prompts",
    "Pagination on list APIs",
    "CSV audit export",
    "JSON cost export",
    "Dual-impl golden verify",
    "Honesty fence + Sources",
    "Onboarding checklist on deployments",
    "Policy profile balanced / aggressive",
    "Features catalog API",
    "Goldens sample API",
    "Offline try.html demo",
  ];
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 20,
): { items: T[]; page: number; pageSize: number; total: number } {
  const p = Math.max(1, page);
  const size = Math.max(1, Math.min(100, pageSize));
  const start = (p - 1) * size;
  return {
    items: items.slice(start, start + size),
    page: p,
    pageSize: size,
    total: items.length,
  };
}
