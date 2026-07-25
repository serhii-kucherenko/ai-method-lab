import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreUnifiedInverse, scoreNaiveGenerative } from "./domain/pore";
import {
  clamp,
  readinessFromQuality,
  round2,
  type MaterialsDomain,
  type PoreBias,
  type PoreInput,
  type PoreQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  MaterialsDomain,
  PoreBias,
  PoreInput,
  PoreQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type MaterialsPack = {
  id: string;
  label: string;
  version: string;
  applicationFocus: string;
  poreBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type TargetStatus = "draft" | "active" | "archived";

export type PoreTarget = {
  id: string;
  packId: string;
  label: string;
  domain: MaterialsDomain;
  poreDiameterNm: number;
  surfaceAreaWeight: number;
  selectivityWeight: number;
  metricHint: string;
  status: TargetStatus;
  notes: string;
  createdAt: string;
};

export type DesignerStatus = "draft" | "open" | "scored" | "archived";

export type DesignerConfig = {
  id: string;
  packId?: string;
  label: string;
  designerSummary: string;
  successCondition: string;
  designerChannel: string;
  status: DesignerStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type PoreRun = {
  id: string;
  designerId: string;
  targetId: string;
  inverseCoverage: number;
  poreFidelity: number;
  targetClarity: number;
  designerStability: number;
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
  defaultPoreBias: PoreBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type PoreCompare = {
  id: string;
  name: string;
  designerId: string;
  targetId: string;
  runId: string;
  input: PoreInput;
  unifiedInverse: PoreQuality;
  naiveGenerative: PoreQuality;
  winner: "unified_inverse" | "naive_generative" | "tie";
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
  packs: MaterialsPack[];
  targets: PoreTarget[];
  designers: DesignerConfig[];
  runs: PoreRun[];
  audits: AuditEntry[];
  compares: PoreCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __poreInverseStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const targetId = "target-demo";
  const designerId = "designer-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Pore Inverse Org",
      webhookUrl: "",
      webhookSecret: "pore-inverse-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPoreBias: "balanced",
      defaultMode: "unified_inverse",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@pore-inverse.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "CO₂ Capture Soft-Sim Pack",
        version: "2026.1",
        applicationFocus: "CO₂ capture with unified inverse pore design",
        poreBudget: 36,
        status: "active",
        notes: "Seed pack for unified inverse vs naive generative compare",
        createdAt: now(),
      },
    ],
    targets: [
      {
        id: targetId,
        packId,
        label: "Selective micropore target (soft-sim)",
        domain: "co2_capture",
        poreDiameterNm: 0.85,
        surfaceAreaWeight: 0.58,
        selectivityWeight: 0.42,
        metricHint: "BET + CO₂/N₂ selectivity",
        status: "active",
        notes: "Soft-sim target — not certified performance, not live plant",
        createdAt: now(),
      },
    ],
    designers: [
      {
        id: designerId,
        packId,
        label: "Unified inverse designer config",
        designerSummary:
          "Soft-sim unified inverse design vs naive generative baseline.",
        successCondition: "lock_soft_sim",
        designerChannel: "soft_sim_pore",
        status: "scored",
        notes: "Seed designer for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        designerId,
        targetId,
        inverseCoverage: 0.62,
        poreFidelity: 0.7,
        targetClarity: 0.74,
        designerStability: 0.68,
        reviewerNotes:
          "Unified inverse path looks informative but generative baseline drifts under sparse pore metrics",
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
        detail: "Demo pack, target, designer, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__poreInverseStore) g.__poreInverseStore = seed();
  return g.__poreInverseStore;
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
  g.__poreInverseStore = seed();
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
  if (patch.defaultPoreBias !== undefined) {
    org.defaultPoreBias = patch.defaultPoreBias;
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
  items: MaterialsPack[];
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
        p.applicationFocus.toLowerCase().includes(q) ||
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
  applicationFocus: string;
  poreBudget?: number;
  notes?: string;
}): MaterialsPack {
  const pack: MaterialsPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    applicationFocus: input.applicationFocus,
    poreBudget: input.poreBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): MaterialsPack | null {
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
  items: PoreTarget[];
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
        m.domain.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
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
  domain: MaterialsDomain;
  poreDiameterNm: number;
  surfaceAreaWeight: number;
  selectivityWeight?: number;
  metricHint?: string;
  notes?: string;
}): PoreTarget | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const target: PoreTarget = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    domain: input.domain,
    poreDiameterNm: Math.max(0.1, input.poreDiameterNm),
    surfaceAreaWeight: clamp(input.surfaceAreaWeight, 0, 1),
    selectivityWeight: clamp(
      input.selectivityWeight ?? 1 - input.surfaceAreaWeight,
      0,
      1,
    ),
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().targets.unshift(target);
  audit("evaluator", "target.create", target.label);
  return target;
}

export function archiveTarget(id: string): PoreTarget | null {
  const target = state().targets.find((m) => m.id === id);
  if (!target) return null;
  target.status = "archived";
  audit("evaluator", "target.archive", id);
  return target;
}

export function listDesigners(opts?: {
  q?: string;
  designerChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DesignerConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().designers];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.designerSummary.toLowerCase().includes(q) ||
        c.designerChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.designerChannel) {
    items = items.filter((c) => c.designerChannel === opts.designerChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createDesigner(input: {
  packId?: string;
  label: string;
  designerSummary: string;
  successCondition: string;
  designerChannel: string;
  notes?: string;
}): DesignerConfig {
  const designer: DesignerConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    designerSummary: input.designerSummary,
    successCondition: input.successCondition,
    designerChannel: input.designerChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().designers.unshift(designer);
  audit("evaluator", "designer.create", designer.label);
  return designer;
}

export function archiveDesigner(id: string): DesignerConfig | null {
  const designer = state().designers.find((c) => c.id === id);
  if (!designer) return null;
  designer.status = "archived";
  audit("evaluator", "designer.archive", id);
  return designer;
}

export function listRuns(opts?: {
  designerId?: string;
  targetId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PoreRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.designerId) {
    items = items.filter((r) => r.designerId === opts.designerId);
  }
  if (opts?.targetId) {
    items = items.filter((r) => r.targetId === opts.targetId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  designerId: string;
  targetId: string;
  inverseCoverage: number;
  poreFidelity: number;
  targetClarity: number;
  designerStability: number;
  reviewerNotes?: string;
}): PoreRun | null {
  if (!state().designers.some((c) => c.id === input.designerId)) {
    return null;
  }
  if (!state().targets.some((m) => m.id === input.targetId)) return null;
  const run: PoreRun = {
    id: randomUUID(),
    designerId: input.designerId,
    targetId: input.targetId,
    inverseCoverage: clamp(input.inverseCoverage, 0, 1),
    poreFidelity: clamp(input.poreFidelity, 0, 1),
    targetClarity: clamp(input.targetClarity, 0, 1),
    designerStability: clamp(input.designerStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const designer = state().designers.find((c) => c.id === input.designerId);
  if (designer) designer.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): PoreCompare[] {
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
  designerId: string;
  targetId: string;
  runId: string;
  poreBias?: PoreBias;
  bias?: PoreBias;
  generativePassRate?: number;
  generativeOptimism?: number;
  poreHardness?: number;
  overclaimRisk?: number;
}): PoreCompare | null {
  const designer = state().designers.find((c) => c.id === input.designerId);
  const target = state().targets.find((m) => m.id === input.targetId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!designer || !target || !run) return null;

  const goldWeight = outcomeWeight(String(designer.successCondition));
  const poreInput: PoreInput = {
    inverseCoverage: clamp(run.inverseCoverage, 0, 1),
    poreFidelity: clamp(run.poreFidelity, 0, 1),
    targetClarity: clamp(run.targetClarity, 0, 1),
    designerStability: clamp((run.designerStability + goldWeight) / 2, 0, 1),
    generativePassRate: input.generativePassRate ?? 0.82,
    generativeOptimism: input.generativeOptimism ?? 0.7,
    poreHardness:
      input.poreHardness ??
      clamp(1 - target.surfaceAreaWeight + 0.15, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(target.poreDiameterNm < 0.4 ? 0.55 : 0.28, 0, 1),
    poreBias: input.poreBias ?? input.bias ?? state().org.defaultPoreBias,
    profile: "unified_inverse",
  };

  const unifiedInverse = scoreUnifiedInverse({
    ...poreInput,
    profile: "unified_inverse",
  });
  const naiveGenerative = scoreNaiveGenerative({
    ...poreInput,
    profile: "naive_generative",
  });
  const gap = Math.abs(unifiedInverse.overall - naiveGenerative.overall);
  let winner: PoreCompare["winner"] = "tie";
  if (unifiedInverse.overall > naiveGenerative.overall + 0.5) {
    winner = "unified_inverse";
  } else if (naiveGenerative.overall > unifiedInverse.overall + 0.5) {
    winner = "naive_generative";
  }

  const compare: PoreCompare = {
    id: randomUUID(),
    name: input.name,
    designerId: designer.id,
    targetId: target.id,
    runId: run.id,
    input: poreInput,
    unifiedInverse,
    naiveGenerative,
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

export function getScoreboard(): PoreCompare[] {
  return [...state().compares].sort(
    (a, b) => b.unifiedInverse.overall - a.unifiedInverse.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      targets: state().targets,
      designers: state().designers,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,unifiedInverseOverall,naiveGenerativeOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.unifiedInverse.overall},${c.naiveGenerative.overall},${c.createdAt}`,
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
    { id: "materials-packs", name: "Materials pack registry" },
    { id: "pack-versions", name: "Versioned materials packs" },
    { id: "pore-targets", name: "Pore target definitions" },
    { id: "metric-editor", name: "Surface area vs selectivity editor" },
    { id: "target-search", name: "Target search and filter" },
    { id: "seed-packs", name: "Seed materials packs" },
    { id: "designer-configs", name: "Inverse designer workspace" },
    { id: "designer-filters", name: "Designer filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "pore-runs", name: "Pore soft-sim runs" },
    { id: "pore-bias", name: "Pore bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Unified inverse vs naive generative compare" },
    { id: "delta-view", name: "Pore delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-certified / not-plant notes" },
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

export function scorePreview(input: PoreInput): {
  unifiedInverse: PoreQuality;
  naiveGenerative: PoreQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const unifiedInverse = scoreUnifiedInverse({
    ...input,
    profile: "unified_inverse",
  });
  const naiveGenerative = scoreNaiveGenerative({
    ...input,
    profile: "naive_generative",
  });
  return {
    unifiedInverse,
    naiveGenerative,
    readiness: readinessFromQuality(unifiedInverse.overall),
  };
}
