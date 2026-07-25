import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreNaiveOverlay, scorePhysicsAware } from "./domain/terrain";
import {
  readinessFromQuality,
  type AlignmentBias,
  type ScoreMode,
  type TerrainInput,
  type TerrainProfile,
  type TerrainQuality,
} from "./domain/types";

export type {
  AlignmentBias,
  ScoreMode,
  TerrainInput,
  TerrainProfile,
  TerrainQuality,
};

export type MemberRole = "owner" | "planner" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type TerrainPack = {
  id: string;
  label: string;
  region: string;
  elevationSpanM: number;
  fuelLoadIndex: number;
  version: string;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type AerialStatus = "draft" | "ready" | "archived";

export type AerialRefresh = {
  id: string;
  packId: string;
  captureDate: string;
  resolutionCm: number;
  cloudCover: number;
  overlapRatio: number;
  status: AerialStatus;
  notes: string;
  createdAt: string;
};

export type PlanStatus = "draft" | "active" | "archived";

export type AlignmentPlan = {
  id: string;
  packId: string;
  aerialId: string;
  controlPointDensity: number;
  elevationPriorStrength: number;
  seamBudgetM: number;
  alignmentBias: AlignmentBias;
  status: PlanStatus;
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
  defaultBias: AlignmentBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type RefreshCompare = {
  id: string;
  name: string;
  packId: string;
  aerialId: string;
  planId: string;
  input: TerrainInput;
  physicsAware: TerrainQuality;
  naiveOverlay: TerrainQuality;
  winner: "physics_aware" | "naive_overlay" | "tie";
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
  packs: TerrainPack[];
  aerials: AerialRefresh[];
  plans: AlignmentPlan[];
  audits: AuditEntry[];
  compares: RefreshCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __tfsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const aerialId = "aerial-demo";
  const planId = "plan-demo";
  return {
    org: {
      name: "Terrain Fire Org",
      webhookUrl: "",
      webhookSecret: "tfs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultBias: "balanced",
      defaultMode: "physics_aware",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "gis-lead@terrain-fire.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Ridge Creek Unit",
        region: "Northern Sierra",
        elevationSpanM: 820,
        fuelLoadIndex: 0.62,
        version: "2025.3",
        status: "active",
        notes: "Seed pack for demo compare",
        createdAt: now(),
      },
    ],
    aerials: [
      {
        id: aerialId,
        packId,
        captureDate: "2026-06-12",
        resolutionCm: 22,
        cloudCover: 0.12,
        overlapRatio: 0.72,
        status: "ready",
        notes: "Post-winter aerial strip",
        createdAt: now(),
      },
    ],
    plans: [
      {
        id: planId,
        packId,
        aerialId,
        controlPointDensity: 0.68,
        elevationPriorStrength: 0.74,
        seamBudgetM: 4.5,
        alignmentBias: "elevation_first",
        status: "active",
        notes: "Elevation-prior alignment for steep ridges",
        createdAt: now(),
      },
    ],
    audits: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, aerial, and alignment plan seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__tfsStore) g.__tfsStore = seed();
  return g.__tfsStore;
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
  g.__tfsStore = seed();
}

export function getOrg(): OrgSettings {
  return { ...state().org };
}

export function updateOrg(patch: Partial<OrgSettings>): OrgSettings {
  const org = state().org;
  Object.assign(org, patch);
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
}): { items: TerrainPack[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
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
  region: string;
  elevationSpanM: number;
  fuelLoadIndex: number;
  version: string;
  notes?: string;
}): TerrainPack {
  const pack: TerrainPack = {
    id: randomUUID(),
    label: input.label,
    region: input.region,
    elevationSpanM: input.elevationSpanM,
    fuelLoadIndex: input.fuelLoadIndex,
    version: input.version,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("planner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): TerrainPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("planner", "pack.archive", id);
  return pack;
}

export function listAerials(opts?: {
  packId?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AerialRefresh[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().aerials];
  if (opts?.packId) items = items.filter((a) => a.packId === opts.packId);
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (a) =>
        a.captureDate.includes(q) ||
        a.notes.toLowerCase().includes(q) ||
        a.id.includes(q),
    );
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAerial(input: {
  packId: string;
  captureDate: string;
  resolutionCm: number;
  cloudCover: number;
  overlapRatio: number;
  notes?: string;
}): AerialRefresh | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const aerial: AerialRefresh = {
    id: randomUUID(),
    packId: input.packId,
    captureDate: input.captureDate,
    resolutionCm: input.resolutionCm,
    cloudCover: input.cloudCover,
    overlapRatio: input.overlapRatio,
    status: "ready",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().aerials.unshift(aerial);
  audit("planner", "aerial.create", aerial.captureDate);
  return aerial;
}

export function listPlans(opts?: {
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AlignmentPlan[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().plans];
  if (opts?.packId) items = items.filter((p) => p.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPlan(input: {
  packId: string;
  aerialId: string;
  controlPointDensity: number;
  elevationPriorStrength: number;
  seamBudgetM: number;
  alignmentBias: AlignmentBias;
  notes?: string;
}): AlignmentPlan | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  if (!state().aerials.some((a) => a.id === input.aerialId)) return null;
  const plan: AlignmentPlan = {
    id: randomUUID(),
    packId: input.packId,
    aerialId: input.aerialId,
    controlPointDensity: input.controlPointDensity,
    elevationPriorStrength: input.elevationPriorStrength,
    seamBudgetM: input.seamBudgetM,
    alignmentBias: input.alignmentBias,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().plans.unshift(plan);
  audit("planner", "plan.create", plan.id);
  return plan;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): RefreshCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  aerialId: string;
  planId: string;
  elevationChangeM?: number;
  slopeSteepness?: number;
  fuelDrift?: number;
}): RefreshCompare | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  const aerial = state().aerials.find((a) => a.id === input.aerialId);
  const plan = state().plans.find((p) => p.id === input.planId);
  if (!pack || !aerial || !plan) return null;

  const terrainInput: TerrainInput = {
    photoResolutionCm: aerial.resolutionCm,
    cloudCover: aerial.cloudCover,
    overlapRatio: aerial.overlapRatio,
    elevationChangeM:
      input.elevationChangeM ?? Math.max(2, pack.elevationSpanM * 0.08),
    slopeSteepness:
      input.slopeSteepness ?? clamp01(pack.elevationSpanM / 1500),
    fuelDrift: input.fuelDrift ?? pack.fuelLoadIndex * 0.35,
    controlPointDensity: plan.controlPointDensity,
    elevationPriorStrength: plan.elevationPriorStrength,
    seamBudgetM: plan.seamBudgetM,
    alignmentBias: plan.alignmentBias,
    profile: "physics_aware",
  };

  const physicsAware = scorePhysicsAware({
    ...terrainInput,
    profile: "physics_aware",
  });
  const naiveOverlay = scoreNaiveOverlay({
    ...terrainInput,
    profile: "naive_overlay",
  });
  const gap = Math.abs(physicsAware.overall - naiveOverlay.overall);
  let winner: RefreshCompare["winner"] = "tie";
  if (physicsAware.overall > naiveOverlay.overall + 0.5) {
    winner = "physics_aware";
  } else if (naiveOverlay.overall > physicsAware.overall + 0.5) {
    winner = "naive_overlay";
  }

  const compare: RefreshCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    aerialId: aerial.id,
    planId: plan.id,
    input: terrainInput,
    physicsAware,
    naiveOverlay,
    winner,
    gap: Math.round(gap * 100) / 100,
    createdAt: now(),
  };
  state().compares.unshift(compare);
  audit(
    "planner",
    "compare.run",
    `${compare.name} winner=${winner} gap=${compare.gap}`,
  );
  return compare;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function exportPacksJson(): string {
  return JSON.stringify(
    { exportedAt: now(), packs: state().packs },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,physicsOverall,naiveOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.physicsAware.overall},${c.naiveOverlay.overall},${c.createdAt}`,
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
  return { ok: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count) };
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
    { id: "packs", name: "Terrain pack registry" },
    { id: "pack-search", name: "Pack search and filter" },
    { id: "aerials", name: "Aerial refresh workspace" },
    { id: "alignment", name: "Alignment plan board" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Physics-aware vs naive compare" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-dispatch notes" },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "Idempotent webhook" },
    { id: "export-json", name: "Export packs JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "seed-onboarding", name: "Seed demo pack from onboarding" },
    { id: "pagination", name: "Pagination on list APIs" },
    { id: "plan-status", name: "Alignment plan status board" },
  ];
}

export function scorePreview(input: TerrainInput): {
  physicsAware: TerrainQuality;
  naiveOverlay: TerrainQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const physicsAware = scorePhysicsAware({
    ...input,
    profile: "physics_aware",
  });
  const naiveOverlay = scoreNaiveOverlay({
    ...input,
    profile: "naive_overlay",
  });
  return {
    physicsAware,
    naiveOverlay,
    readiness: readinessFromQuality(physicsAware.overall),
  };
}
