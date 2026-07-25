import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreSampleEfficient,
  scoreNaiveGenerativeBaseline,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type MolBias,
  type MolInput,
  type MolQuality,
  type OutcomeLabel,
  type ScoreMode,
} from "./domain/types";

export type {
  MolBias,
  MolInput,
  MolQuality,
  OutcomeLabel,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CampaignPack = {
  id: string;
  label: string;
  version: string;
  designScope: string;
  sampleBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type TargetStatus = "draft" | "active" | "archived";

export type PropertyTarget = {
  id: string;
  packId: string;
  label: string;
  propertyCount: number;
  properties: string[];
  efficiencyWeight: number;
  baselineWeight: number;
  status: TargetStatus;
  notes: string;
  createdAt: string;
};

export type OptimizerStatus = "draft" | "open" | "scored" | "archived";

export type OptimizerConfig = {
  id: string;
  packId?: string;
  label: string;
  optimizerSummary: string;
  successCondition: OutcomeLabel | string;
  optimizerChannel: string;
  status: OptimizerStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type SampleRun = {
  id: string;
  optimizerId: string;
  targetId: string;
  campaignCoverage: number;
  targetConfidence: number;
  targetFit: number;
  sampleEfficiency: number;
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
  defaultMolBias: MolBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type MolCompare = {
  id: string;
  name: string;
  optimizerId: string;
  targetId: string;
  runId: string;
  input: MolInput;
  sampleEfficient: MolQuality;
  naiveGenerativeBaseline: MolQuality;
  winner: "sample_efficient" | "naive_generative_baseline" | "tie";
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
  packs: CampaignPack[];
  targets: PropertyTarget[];
  optimizers: OptimizerConfig[];
  runs: SampleRun[];
  audits: AuditEntry[];
  compares: MolCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __molStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const targetId = "target-demo";
  const optimizerId = "optimizer-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Molecule Sample Org",
      webhookUrl: "",
      webhookSecret: "mol-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultMolBias: "balanced",
      defaultMode: "sample_efficient",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "medchem-lead@mol-sample.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Kinase Soft-Sim Campaign Pack",
        version: "2026.1",
        designScope: "Kinase hinge-binder campaign (soft-sim)",
        sampleBudget: 2400,
        status: "active",
        notes: "Seed pack for demo sample-efficient vs naive compare",
        createdAt: now(),
      },
    ],
    targets: [
      {
        id: targetId,
        packId,
        label: "Lead-like property target",
        propertyCount: 8,
        properties: [
          "MW window",
          "cLogP band",
          "HBD/HBA",
          "TPSA",
          "Rotatable bonds",
          "QED floor",
          "PAINS filter",
          "Docking proxy",
        ],
        efficiencyWeight: 0.62,
        baselineWeight: 0.38,
        status: "active",
        notes: "Soft-sim targets without wet-lab claim",
        createdAt: now(),
      },
    ],
    optimizers: [
      {
        id: optimizerId,
        packId,
        label: "Sample-efficient optimizer ring",
        optimizerSummary:
          "Soft-sim sample-efficient generative optimization vs naive generative baseline.",
        successCondition: "lock_soft_sim",
        optimizerChannel: "soft_sim_optimizer",
        status: "scored",
        notes: "Seed optimizer for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        optimizerId,
        targetId,
        campaignCoverage: 0.58,
        targetConfidence: 0.7,
        targetFit: 0.74,
        sampleEfficiency: 0.68,
        reviewerNotes:
          "Sample-efficient path looks informative but naive sampling burns budget under soft-sim load",
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
        detail: "Demo pack, target, optimizer, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__molStore) g.__molStore = seed();
  return g.__molStore;
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
  g.__molStore = seed();
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
  if (patch.defaultMolBias !== undefined) {
    org.defaultMolBias = patch.defaultMolBias;
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
  items: CampaignPack[];
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
        p.designScope.toLowerCase().includes(q) ||
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
  designScope: string;
  sampleBudget?: number;
  notes?: string;
}): CampaignPack {
  const pack: CampaignPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    designScope: input.designScope,
    sampleBudget: input.sampleBudget ?? 1000,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CampaignPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listTargets(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PropertyTarget[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().targets];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.properties.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createTarget(input: {
  packId: string;
  label: string;
  properties: string[];
  propertyCount: number;
  efficiencyWeight: number;
  baselineWeight?: number;
  notes?: string;
}): PropertyTarget | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const target: PropertyTarget = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    properties: input.properties,
    propertyCount: Math.max(0, Math.floor(input.propertyCount)),
    efficiencyWeight: clamp(input.efficiencyWeight, 0, 1),
    baselineWeight: clamp(
      input.baselineWeight ?? 1 - input.efficiencyWeight,
      0,
      1,
    ),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().targets.unshift(target);
  audit("evaluator", "target.create", target.label);
  return target;
}

export function archiveTarget(id: string): PropertyTarget | null {
  const target = state().targets.find((m) => m.id === id);
  if (!target) return null;
  target.status = "archived";
  audit("evaluator", "target.archive", id);
  return target;
}

export function listOptimizers(opts?: {
  q?: string;
  optimizerChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: OptimizerConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().optimizers];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.optimizerSummary.toLowerCase().includes(q) ||
        c.optimizerChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.optimizerChannel) {
    items = items.filter((c) => c.optimizerChannel === opts.optimizerChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createOptimizer(input: {
  packId?: string;
  label: string;
  optimizerSummary: string;
  successCondition: string;
  optimizerChannel: string;
  notes?: string;
}): OptimizerConfig {
  const optimizer: OptimizerConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    optimizerSummary: input.optimizerSummary,
    successCondition: input.successCondition,
    optimizerChannel: input.optimizerChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().optimizers.unshift(optimizer);
  audit("evaluator", "optimizer.create", optimizer.label);
  return optimizer;
}

export function archiveOptimizer(id: string): OptimizerConfig | null {
  const optimizer = state().optimizers.find((c) => c.id === id);
  if (!optimizer) return null;
  optimizer.status = "archived";
  audit("evaluator", "optimizer.archive", id);
  return optimizer;
}

export function listRuns(opts?: {
  optimizerId?: string;
  targetId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SampleRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.optimizerId) {
    items = items.filter((r) => r.optimizerId === opts.optimizerId);
  }
  if (opts?.targetId) {
    items = items.filter((r) => r.targetId === opts.targetId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  optimizerId: string;
  targetId: string;
  campaignCoverage: number;
  targetConfidence: number;
  targetFit: number;
  sampleEfficiency: number;
  reviewerNotes?: string;
}): SampleRun | null {
  if (!state().optimizers.some((c) => c.id === input.optimizerId)) {
    return null;
  }
  if (!state().targets.some((m) => m.id === input.targetId)) return null;
  const run: SampleRun = {
    id: randomUUID(),
    optimizerId: input.optimizerId,
    targetId: input.targetId,
    campaignCoverage: clamp(input.campaignCoverage, 0, 1),
    targetConfidence: clamp(input.targetConfidence, 0, 1),
    targetFit: clamp(input.targetFit, 0, 1),
    sampleEfficiency: clamp(input.sampleEfficiency, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const optimizer = state().optimizers.find((c) => c.id === input.optimizerId);
  if (optimizer) optimizer.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): MolCompare[] {
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
  optimizerId: string;
  targetId: string;
  runId: string;
  molBias?: MolBias;
  bias?: MolBias;
  naiveYield?: number;
  blindOptimism?: number;
  designHardness?: number;
  leakageRisk?: number;
}): MolCompare | null {
  const optimizer = state().optimizers.find((c) => c.id === input.optimizerId);
  const target = state().targets.find((m) => m.id === input.targetId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!optimizer || !target || !run) return null;

  const goldWeight = outcomeWeight(String(optimizer.successCondition));
  const molInput: MolInput = {
    campaignCoverage: clamp(run.campaignCoverage, 0, 1),
    targetFidelity: clamp(run.targetConfidence, 0, 1),
    targetFit: clamp(run.targetFit, 0, 1),
    sampleEfficiency: clamp((run.sampleEfficiency + goldWeight) / 2, 0, 1),
    naiveYield: input.naiveYield ?? 0.82,
    blindOptimism: input.blindOptimism ?? 0.7,
    designHardness:
      input.designHardness ??
      clamp(1 - target.efficiencyWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ?? clamp(target.propertyCount > 12 ? 0.55 : 0.28, 0, 1),
    molBias: input.molBias ?? input.bias ?? state().org.defaultMolBias,
    profile: "sample_efficient",
  };

  const sampleEfficient = scoreSampleEfficient({
    ...molInput,
    profile: "sample_efficient",
  });
  const naiveGenerativeBaseline = scoreNaiveGenerativeBaseline({
    ...molInput,
    profile: "naive_generative_baseline",
  });
  const gap = Math.abs(
    sampleEfficient.overall - naiveGenerativeBaseline.overall,
  );
  let winner: MolCompare["winner"] = "tie";
  if (sampleEfficient.overall > naiveGenerativeBaseline.overall + 0.5) {
    winner = "sample_efficient";
  } else if (naiveGenerativeBaseline.overall > sampleEfficient.overall + 0.5) {
    winner = "naive_generative_baseline";
  }

  const compare: MolCompare = {
    id: randomUUID(),
    name: input.name,
    optimizerId: optimizer.id,
    targetId: target.id,
    runId: run.id,
    input: molInput,
    sampleEfficient,
    naiveGenerativeBaseline,
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

export function getScoreboard(): MolCompare[] {
  return [...state().compares].sort(
    (a, b) => b.sampleEfficient.overall - a.sampleEfficient.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      targets: state().targets,
      optimizers: state().optimizers,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,sampleEfficientOverall,naiveOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.sampleEfficient.overall},${c.naiveGenerativeBaseline.overall},${c.createdAt}`,
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
    { id: "campaign-packs", name: "Campaign pack registry" },
    { id: "pack-versions", name: "Versioned campaign packs" },
    { id: "property-targets", name: "Property target registry" },
    { id: "target-editor", name: "Efficiency vs baseline weight editor" },
    { id: "target-search", name: "Target search and filter" },
    { id: "seed-packs", name: "Seed campaign packs" },
    { id: "optimizers", name: "Sample-efficient optimizer workspace" },
    { id: "optimizer-filters", name: "Optimizer config filters" },
    { id: "success-conditions", name: "Campaign lock success conditions" },
    { id: "sample-runs", name: "Sample soft-sim runs" },
    { id: "mol-bias", name: "Molecule bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Sample-efficient vs naive compare" },
    { id: "delta-view", name: "Efficiency delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-wet-lab notes" },
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

export function scorePreview(input: MolInput): {
  sampleEfficient: MolQuality;
  naiveGenerativeBaseline: MolQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const sampleEfficient = scoreSampleEfficient({
    ...input,
    profile: "sample_efficient",
  });
  const naiveGenerativeBaseline = scoreNaiveGenerativeBaseline({
    ...input,
    profile: "naive_generative_baseline",
  });
  return {
    sampleEfficient,
    naiveGenerativeBaseline,
    readiness: readinessFromQuality(sampleEfficient.overall),
  };
}
