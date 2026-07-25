import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreChannelAware, scoreUniform } from "./domain/quant";
import {
  readinessFromQuality,
  type CpuClass,
  type QuantInput,
  type QuantProfile,
  type QuantQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  CpuClass,
  QuantInput,
  QuantProfile,
  QuantQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "reader" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "draft" | "ready" | "archived";

export type ModelPack = {
  id: string;
  name: string;
  paramScaleB: number;
  layerCount: number;
  activationSkew: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EdgeTarget = {
  id: string;
  name: string;
  cpuClass: CpuClass;
  memoryMb: number;
  lutAffinity: number;
  simdWidth: number;
  notes: string;
  createdAt: string;
};

export type ChannelPlanStatus = "draft" | "scored" | "reviewed" | "archived";

export type ChannelPlan = {
  id: string;
  packId: string;
  targetId: string;
  name: string;
  status: ChannelPlanStatus;
  avgBitBudget: number;
  saliencySkew: number;
  activationEnergy: number;
  paletteSpan: number;
  clusterRegularity: number;
  layoutMerge: number;
  memoryHeadroom: number;
  targetAffinity: number;
  profile: QuantProfile;
  channelOverall: number | null;
  uniformOverall: number | null;
  notes: string;
  createdAt: string;
};

export type RuntimePlanStatus = "draft" | "planned" | "archived";

export type RuntimePlan = {
  id: string;
  channelPlanId: string;
  name: string;
  status: RuntimePlanStatus;
  clusterBlocks: number;
  kernelPaths: number;
  reorderTrafficPct: number;
  notes: string;
  createdAt: string;
};

export type MemoryBudget = {
  id: string;
  targetId: string;
  name: string;
  weightMb: number;
  kvMb: number;
  activationMb: number;
  headroomMb: number;
  notes: string;
  createdAt: string;
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
  defaultProfile: QuantProfile;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CompareResult = {
  id: string;
  name: string;
  channelPlanId: string;
  input: QuantInput;
  channelAware: QuantQuality;
  uniform: QuantQuality;
  winner: "channel_aware" | "uniform" | "tie";
  gap: number;
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
  packs: ModelPack[];
  targets: EdgeTarget[];
  channelPlans: ChannelPlan[];
  runtimePlans: RuntimePlan[];
  budgets: MemoryBudget[];
  audits: AuditEntry[];
  compares: CompareResult[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __eqsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seedInput(): QuantInput {
  return {
    saliencySkew: 0.78,
    activationEnergy: 0.72,
    avgBitBudget: 3.7,
    paletteSpan: 0.85,
    clusterRegularity: 0.74,
    layoutMerge: 0.7,
    memoryHeadroom: 0.68,
    targetAffinity: 0.76,
    profile: "channel",
  };
}

function seed(): StoreState {
  const packId = "pack-demo";
  const targetId = "target-demo";
  const planId = "plan-demo";
  return {
    org: {
      name: "Edge Quant Org",
      webhookUrl: "",
      webhookSecret: "eqs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProfile: "channel",
      defaultMode: "channel_aware",
      rateLimitPerMinute: 120,
    },
    members: [
      { id: "m1", email: "owner@edge-quant.local", role: "owner" },
      { id: "m2", email: "reader@edge-quant.local", role: "reader" },
      { id: "m3", email: "viewer@edge-quant.local", role: "viewer" },
    ],
    packs: [
      {
        id: packId,
        name: "Falcon-edge-3B pack",
        paramScaleB: 3.2,
        layerCount: 32,
        activationSkew: 0.78,
        status: "ready",
        notes: "Seed model pack for channel-aware planning",
        createdAt: now(),
      },
    ],
    targets: [
      {
        id: targetId,
        name: "Laptop AVX2 edge",
        cpuClass: "laptop",
        memoryMb: 8192,
        lutAffinity: 0.72,
        simdWidth: 256,
        notes: "Seed laptop CPU target",
        createdAt: now(),
      },
    ],
    channelPlans: [
      {
        id: planId,
        packId,
        targetId,
        name: "3.7b channel waterfill",
        status: "scored",
        avgBitBudget: 3.7,
        saliencySkew: 0.78,
        activationEnergy: 0.72,
        paletteSpan: 0.85,
        clusterRegularity: 0.74,
        layoutMerge: 0.7,
        memoryHeadroom: 0.68,
        targetAffinity: 0.76,
        profile: "channel",
        channelOverall: null,
        uniformOverall: null,
        notes: "Seed channel plan",
        createdAt: now(),
      },
    ],
    runtimePlans: [
      {
        id: "runtime-demo",
        channelPlanId: planId,
        name: "LUT cluster runtime",
        status: "planned",
        clusterBlocks: 12,
        kernelPaths: 4,
        reorderTrafficPct: 18.5,
        notes: "Seed soft-sim runtime plan",
        createdAt: now(),
      },
    ],
    budgets: [
      {
        id: "budget-demo",
        targetId,
        name: "Laptop memory envelope",
        weightMb: 2800,
        kvMb: 900,
        activationMb: 400,
        headroomMb: 600,
        notes: "Seed honesty budget",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: randomUUID(),
        at: now(),
        actor: "system",
        action: "store.seed",
        detail: "Edge Quant Studio seed state",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__eqsStore) g.__eqsStore = seed();
  return g.__eqsStore;
}

export function resetStore(): void {
  g.__eqsStore = seed();
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
  const org = state().org;
  Object.assign(org, patch);
  audit("owner", "org.update", JSON.stringify(Object.keys(patch)));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(
  email: string,
  role: MemberRole = "reader",
): Member {
  const row: Member = {
    id: randomUUID(),
    email: email.trim().toLowerCase(),
    role,
  };
  state().members.push(row);
  audit("owner", "member.invite", `${row.email}:${row.role}`);
  return row;
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === state().org.bearerToken;
}

export function checkRateLimit(): { ok: boolean; remaining: number } {
  const bucket = state().rateBucket;
  const limit = state().org.rateLimitPerMinute;
  const nowMs = Date.now();
  if (nowMs - bucket.windowStart > 60_000) {
    bucket.windowStart = nowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  if (bucket.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: Math.max(0, limit - bucket.count) };
}

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 20,
): { items: T[]; page: number; pageSize: number; total: number } {
  const p = Math.max(1, page);
  const ps = Math.min(100, Math.max(1, pageSize));
  const start = (p - 1) * ps;
  return {
    items: items.slice(start, start + ps),
    page: p,
    pageSize: ps,
    total: items.length,
  };
}

export function listPacks(q?: string, page = 1, pageSize = 20, status?: PackStatus) {
  let rows = [...state().packs];
  if (status) rows = rows.filter((p) => p.status === status);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.notes.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createPack(input: {
  name: string;
  paramScaleB?: number;
  layerCount?: number;
  activationSkew?: number;
  status?: PackStatus;
  notes?: string;
}): ModelPack {
  const row: ModelPack = {
    id: randomUUID(),
    name: input.name.trim(),
    paramScaleB: input.paramScaleB ?? 3,
    layerCount: input.layerCount ?? 32,
    activationSkew: input.activationSkew ?? 0.7,
    status: input.status ?? "draft",
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().packs.unshift(row);
  audit("owner", "pack.create", row.id);
  return row;
}

export function listTargets(q?: string, page = 1, pageSize = 20, cpuClass?: CpuClass) {
  let rows = [...state().targets];
  if (cpuClass) rows = rows.filter((t) => t.cpuClass === cpuClass);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter(
      (t) =>
        t.name.toLowerCase().includes(needle) ||
        t.cpuClass.toLowerCase().includes(needle),
    );
  }
  return paginate(rows, page, pageSize);
}

export function createTarget(input: {
  name: string;
  cpuClass: CpuClass;
  memoryMb?: number;
  lutAffinity?: number;
  simdWidth?: number;
  notes?: string;
}): EdgeTarget {
  const row: EdgeTarget = {
    id: randomUUID(),
    name: input.name.trim(),
    cpuClass: input.cpuClass,
    memoryMb: input.memoryMb ?? 8192,
    lutAffinity: input.lutAffinity ?? 0.7,
    simdWidth: input.simdWidth ?? 256,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().targets.unshift(row);
  audit("owner", "target.create", row.id);
  return row;
}

export function listChannelPlans(
  q?: string,
  page = 1,
  pageSize = 20,
  packId?: string,
) {
  let rows = [...state().channelPlans];
  if (packId) rows = rows.filter((p) => p.packId === packId);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((p) => p.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createChannelPlan(input: {
  packId: string;
  targetId: string;
  name: string;
  status?: ChannelPlanStatus;
  avgBitBudget?: number;
  saliencySkew?: number;
  activationEnergy?: number;
  paletteSpan?: number;
  clusterRegularity?: number;
  layoutMerge?: number;
  memoryHeadroom?: number;
  targetAffinity?: number;
  profile?: QuantProfile;
  notes?: string;
}): ChannelPlan {
  if (!state().packs.some((p) => p.id === input.packId)) {
    throw new Error("pack_not_found");
  }
  if (!state().targets.some((t) => t.id === input.targetId)) {
    throw new Error("target_not_found");
  }
  const row: ChannelPlan = {
    id: randomUUID(),
    packId: input.packId,
    targetId: input.targetId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    avgBitBudget: input.avgBitBudget ?? 3.7,
    saliencySkew: input.saliencySkew ?? 0.7,
    activationEnergy: input.activationEnergy ?? 0.65,
    paletteSpan: input.paletteSpan ?? 0.8,
    clusterRegularity: input.clusterRegularity ?? 0.7,
    layoutMerge: input.layoutMerge ?? 0.65,
    memoryHeadroom: input.memoryHeadroom ?? 0.6,
    targetAffinity: input.targetAffinity ?? 0.7,
    profile: input.profile ?? "channel",
    channelOverall: null,
    uniformOverall: null,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().channelPlans.unshift(row);
  audit("owner", "channel_plan.create", row.id);
  return row;
}

export function scoreChannelPlan(id: string): ChannelPlan {
  const row = state().channelPlans.find((p) => p.id === id);
  if (!row) throw new Error("plan_not_found");
  const input: QuantInput = {
    saliencySkew: row.saliencySkew,
    activationEnergy: row.activationEnergy,
    avgBitBudget: row.avgBitBudget,
    paletteSpan: row.paletteSpan,
    clusterRegularity: row.clusterRegularity,
    layoutMerge: row.layoutMerge,
    memoryHeadroom: row.memoryHeadroom,
    targetAffinity: row.targetAffinity,
    profile: row.profile,
  };
  const channel = scoreChannelAware({ ...input, profile: "channel" });
  const uniform = scoreUniform({ ...input, profile: "uniform" });
  row.channelOverall = channel.overall;
  row.uniformOverall = uniform.overall;
  row.status = "scored";
  audit("owner", "channel_plan.score", `${id}:${channel.overall}/${uniform.overall}`);
  return { ...row };
}

export function listRuntimePlans(q?: string, page = 1, pageSize = 20) {
  let rows = [...state().runtimePlans];
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createRuntimePlan(input: {
  channelPlanId: string;
  name: string;
  status?: RuntimePlanStatus;
  clusterBlocks?: number;
  kernelPaths?: number;
  reorderTrafficPct?: number;
  notes?: string;
}): RuntimePlan {
  if (!state().channelPlans.some((p) => p.id === input.channelPlanId)) {
    throw new Error("plan_not_found");
  }
  const row: RuntimePlan = {
    id: randomUUID(),
    channelPlanId: input.channelPlanId,
    name: input.name.trim(),
    status: input.status ?? "draft",
    clusterBlocks: input.clusterBlocks ?? 8,
    kernelPaths: input.kernelPaths ?? 3,
    reorderTrafficPct: input.reorderTrafficPct ?? 25,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().runtimePlans.unshift(row);
  audit("owner", "runtime.create", row.id);
  return row;
}

export function listBudgets(q?: string, page = 1, pageSize = 20) {
  let rows = [...state().budgets];
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((b) => b.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createBudget(input: {
  targetId: string;
  name: string;
  weightMb?: number;
  kvMb?: number;
  activationMb?: number;
  headroomMb?: number;
  notes?: string;
}): MemoryBudget {
  if (!state().targets.some((t) => t.id === input.targetId)) {
    throw new Error("target_not_found");
  }
  const row: MemoryBudget = {
    id: randomUUID(),
    targetId: input.targetId,
    name: input.name.trim(),
    weightMb: input.weightMb ?? 2000,
    kvMb: input.kvMb ?? 800,
    activationMb: input.activationMb ?? 400,
    headroomMb: input.headroomMb ?? 500,
    notes: input.notes?.trim() || "",
    createdAt: now(),
  };
  state().budgets.unshift(row);
  audit("owner", "budget.create", row.id);
  return row;
}

export function listCompares(q?: string, page = 1, pageSize = 20) {
  let rows = [...state().compares];
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((c) => c.name.toLowerCase().includes(needle));
  }
  return paginate(rows, page, pageSize);
}

export function createCompare(input: {
  name: string;
  channelPlanId?: string;
  quantInput?: Partial<QuantInput>;
}): CompareResult {
  const plan = input.channelPlanId
    ? state().channelPlans.find((p) => p.id === input.channelPlanId)
    : state().channelPlans[0];
  const base = plan
    ? {
        saliencySkew: plan.saliencySkew,
        activationEnergy: plan.activationEnergy,
        avgBitBudget: plan.avgBitBudget,
        paletteSpan: plan.paletteSpan,
        clusterRegularity: plan.clusterRegularity,
        layoutMerge: plan.layoutMerge,
        memoryHeadroom: plan.memoryHeadroom,
        targetAffinity: plan.targetAffinity,
        profile: plan.profile as QuantProfile,
      }
    : seedInput();
  const quantInput: QuantInput = { ...base, ...input.quantInput };
  const channelAware = scoreChannelAware({ ...quantInput, profile: "channel" });
  const uniform = scoreUniform({ ...quantInput, profile: "uniform" });
  const gap = Math.round((channelAware.overall - uniform.overall) * 100) / 100;
  let winner: CompareResult["winner"] = "tie";
  if (gap > 0.5) winner = "channel_aware";
  else if (gap < -0.5) winner = "uniform";
  const row: CompareResult = {
    id: randomUUID(),
    name: input.name.trim(),
    channelPlanId: plan?.id ?? "none",
    input: quantInput,
    channelAware,
    uniform,
    winner,
    gap,
    createdAt: now(),
  };
  state().compares.unshift(row);
  audit("owner", "compare.create", `${row.id}:${winner}`);
  return row;
}

export function listAudits(page = 1, pageSize = 50) {
  return paginate([...state().audits], page, pageSize);
}

export function exportPlansJson(): string {
  return JSON.stringify(
    {
      packs: state().packs,
      channelPlans: state().channelPlans,
      runtimePlans: state().runtimePlans,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const header =
    "id,name,winner,gap,channelOverall,uniformOverall,createdAt\n";
  const lines = state().compares.map(
    (c) =>
      `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.channelAware.overall},${c.uniform.overall},${c.createdAt}`,
  );
  return header + lines.join("\n");
}

export function listFeatures(): string[] {
  return [
    "marketing_landing",
    "model_pack_registry",
    "pack_search_filter",
    "edge_target_profiles",
    "cpu_class_tagging",
    "channel_bitwidth_plans",
    "channel_plan_scoring",
    "dual_score_panel",
    "uniform_vs_channel_compare",
    "runtime_compile_soft_sim",
    "memory_latency_budgets",
    "honesty_fence",
    "org_settings",
    "member_invite",
    "bearer_auth",
    "rate_limit",
    "idempotent_webhook",
    "export_plans_json",
    "export_compares_csv",
    "features_api",
    "goldens_sample_api",
    "audit_trail",
    "onboarding_checklist",
    "in_app_guide_link",
    "try_html_demo",
  ];
}

export function ingestWebhook(
  rawBody: string,
  signature: string | null,
  idempotencyKey: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const given = (signature ?? "").replace(/^sha256=/, "");
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "invalid_signature" };
  }
  const key = idempotencyKey?.trim() || randomUUID();
  if (state().webhookEvents.some((e) => e.idempotencyKey === key)) {
    return { ok: true, duplicate: true };
  }
  let payload: unknown = rawBody;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    /* keep raw */
  }
  const row: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey: key,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(row);
  audit("webhook", "webhook.ingest", key);
  return { ok: true, id: row.id };
}

export function planReadiness(overall: number) {
  return readinessFromQuality(overall);
}
