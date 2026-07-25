import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreMarkerBased, scoreMarkerFree } from "./domain/fusion";
import {
  clamp,
  readinessFromQuality,
  round2,
  type SpecimenDomain,
  type FusionBias,
  type FusionInput,
  type FusionQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  SpecimenDomain,
  FusionBias,
  FusionInput,
  FusionQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CasePack = {
  id: string;
  label: string;
  version: string;
  anatomyFocus: string;
  scanBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SpecimenStatus = "draft" | "active" | "archived";

export type SpecimenScan = {
  id: string;
  packId: string;
  label: string;
  domain: SpecimenDomain;
  sliceCount: number;
  surfaceWeight: number;
  deformableWeight: number;
  status: SpecimenStatus;
  notes: string;
  createdAt: string;
};

export type FusionStatus = "draft" | "open" | "scored" | "archived";

export type FusionConfig = {
  id: string;
  packId?: string;
  label: string;
  fusionSummary: string;
  successCondition: string;
  fusionChannel: string;
  status: FusionStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type MarginRun = {
  id: string;
  fusionId: string;
  specimenId: string;
  deformableQuality: number;
  surfaceFidelity: number;
  marginClarity: number;
  fusionStability: number;
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
  defaultFusionBias: FusionBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type MarginCompare = {
  id: string;
  name: string;
  fusionId: string;
  specimenId: string;
  runId: string;
  input: FusionInput;
  markerFree: FusionQuality;
  markerBased: FusionQuality;
  winner: "marker_free" | "marker_based" | "tie";
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
  packs: CasePack[];
  specimens: SpecimenScan[];
  fusions: FusionConfig[];
  runs: MarginRun[];
  audits: AuditEntry[];
  compares: MarginCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __marginFusionStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const specimenId = "specimen-demo";
  const fusionId = "fusion-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Margin Fusion Org",
      webhookUrl: "",
      webhookSecret: "margin-fusion-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultFusionBias: "balanced",
      defaultMode: "marker_free",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@margin-fusion.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Breast Resection Soft-Sim Pack",
        version: "2026.1",
        anatomyFocus: "breast resection with deformable margin fusion",
        scanBudget: 36,
        status: "active",
        notes: "Seed pack for marker-free vs marker-based compare",
        createdAt: now(),
      },
    ],
    specimens: [
      {
        id: specimenId,
        packId,
        label: "Ex-vivo specimen scan (soft-sim)",
        domain: "breast",
        sliceCount: 48,
        surfaceWeight: 0.58,
        deformableWeight: 0.42,
        status: "active",
        notes: "Soft-sim scan — not surgical device cleared, not live OR",
        createdAt: now(),
      },
    ],
    fusions: [
      {
        id: fusionId,
        packId,
        label: "Marker-free deformable fusion config",
        fusionSummary:
          "Soft-sim marker-free deformable registration vs marker-based baseline.",
        successCondition: "lock_soft_sim",
        fusionChannel: "soft_sim_margin",
        status: "scored",
        notes: "Seed fusion for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        fusionId,
        specimenId,
        deformableQuality: 0.62,
        surfaceFidelity: 0.7,
        marginClarity: 0.74,
        fusionStability: 0.68,
        reviewerNotes:
          "Marker-free path looks informative but marker baseline drifts under soft deformation",
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
        detail: "Demo pack, specimen, fusion, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__marginFusionStore) g.__marginFusionStore = seed();
  return g.__marginFusionStore;
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
  g.__marginFusionStore = seed();
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
  if (patch.defaultFusionBias !== undefined) {
    org.defaultFusionBias = patch.defaultFusionBias;
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
  items: CasePack[];
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
        p.anatomyFocus.toLowerCase().includes(q) ||
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
  anatomyFocus: string;
  scanBudget?: number;
  notes?: string;
}): CasePack {
  const pack: CasePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    anatomyFocus: input.anatomyFocus,
    scanBudget: input.scanBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CasePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listSpecimens(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SpecimenScan[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().specimens];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSpecimen(input: {
  packId: string;
  label: string;
  domain: SpecimenDomain;
  sliceCount: number;
  surfaceWeight: number;
  deformableWeight?: number;
  notes?: string;
}): SpecimenScan | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const specimen: SpecimenScan = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    domain: input.domain,
    sliceCount: Math.max(1, Math.floor(input.sliceCount)),
    surfaceWeight: clamp(input.surfaceWeight, 0, 1),
    deformableWeight: clamp(
      input.deformableWeight ?? 1 - input.surfaceWeight,
      0,
      1,
    ),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().specimens.unshift(specimen);
  audit("evaluator", "specimen.create", specimen.label);
  return specimen;
}

export function archiveSpecimen(id: string): SpecimenScan | null {
  const specimen = state().specimens.find((m) => m.id === id);
  if (!specimen) return null;
  specimen.status = "archived";
  audit("evaluator", "specimen.archive", id);
  return specimen;
}

export function listFusions(opts?: {
  q?: string;
  fusionChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: FusionConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().fusions];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.fusionSummary.toLowerCase().includes(q) ||
        c.fusionChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.fusionChannel) {
    items = items.filter((c) => c.fusionChannel === opts.fusionChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createFusion(input: {
  packId?: string;
  label: string;
  fusionSummary: string;
  successCondition: string;
  fusionChannel: string;
  notes?: string;
}): FusionConfig {
  const fusion: FusionConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    fusionSummary: input.fusionSummary,
    successCondition: input.successCondition,
    fusionChannel: input.fusionChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().fusions.unshift(fusion);
  audit("evaluator", "fusion.create", fusion.label);
  return fusion;
}

export function archiveFusion(id: string): FusionConfig | null {
  const fusion = state().fusions.find((c) => c.id === id);
  if (!fusion) return null;
  fusion.status = "archived";
  audit("evaluator", "fusion.archive", id);
  return fusion;
}

export function listRuns(opts?: {
  fusionId?: string;
  specimenId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: MarginRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.fusionId) {
    items = items.filter((r) => r.fusionId === opts.fusionId);
  }
  if (opts?.specimenId) {
    items = items.filter((r) => r.specimenId === opts.specimenId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  fusionId: string;
  specimenId: string;
  deformableQuality: number;
  surfaceFidelity: number;
  marginClarity: number;
  fusionStability: number;
  reviewerNotes?: string;
}): MarginRun | null {
  if (!state().fusions.some((c) => c.id === input.fusionId)) {
    return null;
  }
  if (!state().specimens.some((m) => m.id === input.specimenId)) return null;
  const run: MarginRun = {
    id: randomUUID(),
    fusionId: input.fusionId,
    specimenId: input.specimenId,
    deformableQuality: clamp(input.deformableQuality, 0, 1),
    surfaceFidelity: clamp(input.surfaceFidelity, 0, 1),
    marginClarity: clamp(input.marginClarity, 0, 1),
    fusionStability: clamp(input.fusionStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const fusion = state().fusions.find((c) => c.id === input.fusionId);
  if (fusion) fusion.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): MarginCompare[] {
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
  fusionId: string;
  specimenId: string;
  runId: string;
  fusionBias?: FusionBias;
  bias?: FusionBias;
  markerPassRate?: number;
  markerOptimism?: number;
  deformationHardness?: number;
  overclaimRisk?: number;
}): MarginCompare | null {
  const fusion = state().fusions.find((c) => c.id === input.fusionId);
  const specimen = state().specimens.find((m) => m.id === input.specimenId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!fusion || !specimen || !run) return null;

  const goldWeight = outcomeWeight(String(fusion.successCondition));
  const fusionInput: FusionInput = {
    deformableQuality: clamp(run.deformableQuality, 0, 1),
    surfaceFidelity: clamp(run.surfaceFidelity, 0, 1),
    marginClarity: clamp(run.marginClarity, 0, 1),
    fusionStability: clamp((run.fusionStability + goldWeight) / 2, 0, 1),
    markerPassRate: input.markerPassRate ?? 0.82,
    markerOptimism: input.markerOptimism ?? 0.7,
    deformationHardness:
      input.deformationHardness ??
      clamp(1 - specimen.surfaceWeight + 0.15, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(specimen.sliceCount > 64 ? 0.55 : 0.28, 0, 1),
    fusionBias:
      input.fusionBias ?? input.bias ?? state().org.defaultFusionBias,
    profile: "marker_free",
  };

  const markerFree = scoreMarkerFree({
    ...fusionInput,
    profile: "marker_free",
  });
  const markerBased = scoreMarkerBased({
    ...fusionInput,
    profile: "marker_based",
  });
  const gap = Math.abs(markerFree.overall - markerBased.overall);
  let winner: MarginCompare["winner"] = "tie";
  if (markerFree.overall > markerBased.overall + 0.5) {
    winner = "marker_free";
  } else if (markerBased.overall > markerFree.overall + 0.5) {
    winner = "marker_based";
  }

  const compare: MarginCompare = {
    id: randomUUID(),
    name: input.name,
    fusionId: fusion.id,
    specimenId: specimen.id,
    runId: run.id,
    input: fusionInput,
    markerFree,
    markerBased,
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

export function getScoreboard(): MarginCompare[] {
  return [...state().compares].sort(
    (a, b) => b.markerFree.overall - a.markerFree.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      specimens: state().specimens,
      fusions: state().fusions,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,markerFreeOverall,markerBasedOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.markerFree.overall},${c.markerBased.overall},${c.createdAt}`,
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
    { id: "case-packs", name: "Case pack registry" },
    { id: "pack-versions", name: "Versioned case packs" },
    { id: "specimen-scans", name: "Specimen scan import" },
    { id: "surface-editor", name: "Surface vs deformable weight editor" },
    { id: "specimen-search", name: "Specimen search and filter" },
    { id: "seed-packs", name: "Seed case packs" },
    { id: "fusion-configs", name: "Fusion config workspace" },
    { id: "fusion-filters", name: "Fusion filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "margin-runs", name: "Margin soft-sim runs" },
    { id: "fusion-bias", name: "Fusion bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Marker-free vs marker-based compare" },
    { id: "delta-view", name: "Margin delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-device / not-OR notes" },
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

export function scorePreview(input: FusionInput): {
  markerFree: FusionQuality;
  markerBased: FusionQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const markerFree = scoreMarkerFree({
    ...input,
    profile: "marker_free",
  });
  const markerBased = scoreMarkerBased({
    ...input,
    profile: "marker_based",
  });
  return {
    markerFree,
    markerBased,
    readiness: readinessFromQuality(markerFree.overall),
  };
}
