import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreNaiveCloudFootprintBaseline,
  scoreSovereignInfraWeeAccounting,
} from "./domain/cost";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ModelKind,
  type CostBias,
  type ScoreMode,
  type CostInput,
  type CostQuality,
} from "./domain/types";

export type {
  ModelKind,
  CostBias,
  ScoreMode,
  CostInput,
  CostQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CostPack = {
  id: string;
  label: string;
  version: string;
  infraTarget: string;
  modelBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ModelStatus = "draft" | "active" | "archived";

export type ImpactModel = {
  id: string;
  packId: string;
  label: string;
  kind: ModelKind;
  factors: string;
  factorCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: ModelStatus;
  notes: string;
  createdAt: string;
};

export type ScenarioStatus = "draft" | "open" | "scored" | "archived";

export type CostScenario = {
  id: string;
  packId?: string;
  label: string;
  scenarioText: string;
  successCondition: string;
  regionChannel: string;
  status: ScenarioStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type CostRun = {
  id: string;
  scenarioId: string;
  modelId: string;
  waterIntensity: number;
  energyIntensity: number;
  emissionsClarity: number;
  scenarioStability: number;
  reviewerNotes: string;
  status: RunStatus;
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
  defaultCostBias: CostBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CostCompare = {
  id: string;
  name: string;
  scenarioId: string;
  modelId: string;
  runId: string;
  input: CostInput;
  sovereignWee: CostQuality;
  naiveCloud: CostQuality;
  winner:
    | "sovereign_infra_wee_accounting"
    | "naive_cloud_footprint_baseline"
    | "tie";
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
  packs: CostPack[];
  models: ImpactModel[];
  scenarios: CostScenario[];
  runs: CostRun[];
  audits: AuditEntry[];
  compares: CostCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __sovereignCostStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const modelId = "model-demo";
  const scenarioId = "scenario-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Sovereign Cost Org",
      webhookUrl: "",
      webhookSecret: "sovereign-cost-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultCostBias: "balanced",
      defaultMode: "sovereign_infra_wee_accounting",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@sovereign-cost.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Sovereign AI Soft-Sim Cost Pack",
        version: "2026.1",
        infraTarget: "National AI cluster + regional cooling soft-sim",
        modelBudget: 36,
        status: "active",
        notes:
          "Seed pack for sovereign-infra W/E/E accounting vs naive cloud-footprint compare",
        createdAt: now(),
      },
    ],
    models: [
      {
        id: modelId,
        packId,
        label: "Hydro + grid hybrid W/E/E gate",
        kind: "hybrid",
        factors: "water,energy,emissions,cooling",
        factorCount: 4,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint: "Sovereign-infra W/E/E accounting under soft-sim honesty",
        status: "active",
        notes: "Soft-sim model — not certified carbon audit",
        createdAt: now(),
      },
    ],
    scenarios: [
      {
        id: scenarioId,
        packId,
        label: "Sovereign infra water–energy scenario",
        scenarioText:
          "Does sovereign-infra W/E/E accounting beat naive cloud-footprint baselines before lock?",
        successCondition: "lock_soft_sim",
        regionChannel: "soft_sim_sovereign_infra",
        status: "scored",
        notes: "Seed scenario for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        scenarioId,
        modelId,
        waterIntensity: 0.62,
        energyIntensity: 0.7,
        emissionsClarity: 0.74,
        scenarioStability: 0.68,
        reviewerNotes:
          "Sovereign W/E/E looks trustworthy but naive cloud footprints miss water loads",
        status: "active",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, model, scenario, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__sovereignCostStore) g.__sovereignCostStore = seed();
  return g.__sovereignCostStore;
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

export function resetStore(): void {
  g.__sovereignCostStore = seed();
}

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  const org = state().org;
  if (patch.name !== undefined) org.name = patch.name;
  if (patch.webhookUrl !== undefined) org.webhookUrl = patch.webhookUrl;
  if (patch.webhookSecret !== undefined) org.webhookSecret = patch.webhookSecret;
  if (patch.bearerToken !== undefined) org.bearerToken = patch.bearerToken;
  if (patch.defaultCostBias !== undefined) {
    org.defaultCostBias = patch.defaultCostBias;
  }
  if (patch.defaultMode !== undefined) org.defaultMode = patch.defaultMode;
  if (patch.rateLimitPerMinute !== undefined) {
    org.rateLimitPerMinute = patch.rateLimitPerMinute;
  }
  audit("owner", "org.update", JSON.stringify(patch));
  return getOrg();
}

export function listMembers(): Member[] {
  return [...state().members];
}

export function inviteMember(email: string, role: MemberRole): Member {
  const member: Member = { id: randomUUID(), email, role };
  state().members.push(member);
  audit("owner", "member.invite", `${email} as ${role}`);
  return member;
}

export function listPacks(opts?: {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CostPack[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.infraTarget.toLowerCase().includes(q) ||
        p.version.toLowerCase().includes(q),
    );
  }
  if (opts?.status) {
    items = items.filter((p) => p.status === opts.status);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPack(input: {
  label: string;
  version: string;
  infraTarget: string;
  modelBudget?: number;
  notes?: string;
}): CostPack {
  const pack: CostPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    infraTarget: input.infraTarget,
    modelBudget: input.modelBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CostPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listModels(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ImpactModel[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().models];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.factors.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createModel(input: {
  packId: string;
  label: string;
  kind: ModelKind;
  factors: string;
  factorCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): ImpactModel | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const model: ImpactModel = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    factors: input.factors,
    factorCount: input.factorCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().models.unshift(model);
  audit("evaluator", "model.create", model.label);
  return model;
}

export function archiveModel(id: string): ImpactModel | null {
  const model = state().models.find((m) => m.id === id);
  if (!model) return null;
  model.status = "archived";
  audit("evaluator", "model.archive", id);
  return model;
}

export function listScenarios(opts?: {
  q?: string;
  regionChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CostScenario[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().scenarios];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.scenarioText.toLowerCase().includes(q) ||
        c.regionChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.regionChannel) {
    items = items.filter((c) => c.regionChannel === opts.regionChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createScenario(input: {
  packId?: string;
  label: string;
  scenarioText: string;
  successCondition: string;
  regionChannel: string;
  notes?: string;
}): CostScenario {
  const row: CostScenario = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    scenarioText: input.scenarioText,
    successCondition: input.successCondition,
    regionChannel: input.regionChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().scenarios.unshift(row);
  audit("evaluator", "scenario.create", row.label);
  return row;
}

export function archiveScenario(id: string): CostScenario | null {
  const row = state().scenarios.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "scenario.archive", id);
  return row;
}

export function listRuns(opts?: {
  scenarioId?: string;
  modelId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CostRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.scenarioId) {
    items = items.filter((r) => r.scenarioId === opts.scenarioId);
  }
  if (opts?.modelId) {
    items = items.filter((r) => r.modelId === opts.modelId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  scenarioId: string;
  modelId: string;
  waterIntensity: number;
  energyIntensity: number;
  emissionsClarity: number;
  scenarioStability: number;
  reviewerNotes?: string;
}): CostRun | null {
  if (!state().scenarios.some((c) => c.id === input.scenarioId)) {
    return null;
  }
  if (!state().models.some((m) => m.id === input.modelId)) return null;
  const run: CostRun = {
    id: randomUUID(),
    scenarioId: input.scenarioId,
    modelId: input.modelId,
    waterIntensity: clamp(input.waterIntensity, 0, 1),
    energyIntensity: clamp(input.energyIntensity, 0, 1),
    emissionsClarity: clamp(input.emissionsClarity, 0, 1),
    scenarioStability: clamp(input.scenarioStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().scenarios.find((c) => c.id === input.scenarioId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): CostCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "hold_pack":
      return 0.2;
    case "review":
      return 0.45;
    case "lock_soft_sim":
      return 0.7;
    case "strong_lock":
      return 0.92;
    default:
      return 0.55;
  }
}

export function runCompare(input: {
  name: string;
  scenarioId: string;
  modelId: string;
  runId: string;
  costBias?: CostBias;
  bias?: CostBias;
  cloudFootprintRate?: number;
  cloudOptimism?: number;
  infraHardness?: number;
  overclaimRisk?: number;
}): CostCompare | null {
  const scenario = state().scenarios.find((c) => c.id === input.scenarioId);
  const model = state().models.find((m) => m.id === input.modelId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!scenario || !model || !run) return null;

  const goldWeight = outcomeWeight(String(scenario.successCondition));
  const span = Math.max(0.05, model.coverageMax - model.coverageMin);
  const costInput: CostInput = {
    waterIntensity: clamp(run.waterIntensity, 0, 1),
    energyIntensity: clamp(run.energyIntensity, 0, 1),
    emissionsClarity: clamp(run.emissionsClarity, 0, 1),
    scenarioStability: clamp((run.scenarioStability + goldWeight) / 2, 0, 1),
    cloudFootprintRate: input.cloudFootprintRate ?? 0.82,
    cloudOptimism: input.cloudOptimism ?? 0.7,
    infraHardness: input.infraHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    costBias: input.costBias ?? input.bias ?? state().org.defaultCostBias,
    profile: "sovereign_infra_wee_accounting",
  };

  const sovereignWee = scoreSovereignInfraWeeAccounting({
    ...costInput,
    profile: "sovereign_infra_wee_accounting",
  });
  const naiveCloud = scoreNaiveCloudFootprintBaseline({
    ...costInput,
    profile: "naive_cloud_footprint_baseline",
  });
  const gap = Math.abs(sovereignWee.overall - naiveCloud.overall);
  let winner: CostCompare["winner"] = "tie";
  if (sovereignWee.overall > naiveCloud.overall + 0.5) {
    winner = "sovereign_infra_wee_accounting";
  } else if (naiveCloud.overall > sovereignWee.overall + 0.5) {
    winner = "naive_cloud_footprint_baseline";
  }

  const compare: CostCompare = {
    id: randomUUID(),
    name: input.name,
    scenarioId: scenario.id,
    modelId: model.id,
    runId: run.id,
    input: costInput,
    sovereignWee,
    naiveCloud,
    winner,
    gap: round2(gap),
    createdAt: now(),
  };
  state().compares.unshift(compare);
  audit(
    "evaluator",
    "compare.run",
    `${compare.name} winner=${winner} gap=${compare.gap}`,
  );
  return compare;
}

export function getScoreboard(): CostCompare[] {
  return [...state().compares].sort(
    (a, b) => b.sovereignWee.overall - a.sovereignWee.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      models: state().models,
      scenarios: state().scenarios,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,sovereignWeeOverall,naiveCloudOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.sovereignWee.overall},${c.naiveCloud.overall},${c.createdAt}`,
    ),
  ];
  return rows.join("\n");
}

export function checkBearer(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  const expected = state().org.bearerToken;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
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
  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
  };
}

export function ingestWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  const body = JSON.stringify(payload ?? {});
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  if (!signature || signature !== `sha256=${expected}`) {
    return { ok: false, error: "bad_signature" };
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) return { ok: true, duplicate: true, id: existing.id };
  const event: WebhookEvent = {
    id: randomUUID(),
    idempotencyKey,
    receivedAt: now(),
    payload,
  };
  state().webhookEvents.unshift(event);
  audit("webhook", "webhook.ingest", idempotencyKey);
  return { ok: true, id: event.id };
}

export function featureInventory(): { id: string; name: string }[] {
  return [
    { id: "landing", name: "Marketing landing" },
    { id: "pricing", name: "Pricing tiers" },
    { id: "demo", name: "Guided demo" },
    { id: "onboarding", name: "Onboarding checklist" },
    { id: "flows", name: "Multi-flow index" },
    { id: "cost-packs", name: "Cost pack registry" },
    { id: "pack-versions", name: "Versioned cost packs" },
    { id: "impact-models", name: "Water–energy–emissions models" },
    { id: "model-editor", name: "Model factor / coverage editor" },
    { id: "model-search", name: "Model search and filter" },
    { id: "seed-packs", name: "Seed cost packs" },
    { id: "scenarios", name: "Infrastructure scenario workspace" },
    { id: "scenario-filters", name: "Scenario filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "cost-runs", name: "Cost soft-sim runs" },
    { id: "cost-bias", name: "Cost bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Sovereign-infra W/E/E vs naive cloud-footprint compare",
    },
    { id: "delta-view", name: "Cost delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not certified audit / not live metering / not policy",
    },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "HMAC webhook ingest" },
    { id: "export-json", name: "Export packs JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "pagination", name: "Pagination on list APIs" },
  ];
}

export function scorePreview(input: CostInput): {
  sovereignWee: CostQuality;
  naiveCloud: CostQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const sovereignWee = scoreSovereignInfraWeeAccounting({
    ...input,
    profile: "sovereign_infra_wee_accounting",
  });
  const naiveCloud = scoreNaiveCloudFootprintBaseline({
    ...input,
    profile: "naive_cloud_footprint_baseline",
  });
  return {
    sovereignWee,
    naiveCloud,
    readiness: readinessFromQuality(sovereignWee.overall),
  };
}
