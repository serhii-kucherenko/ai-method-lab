import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreSingleLevel, scoreWorldCognitive } from "./domain/worldCog";
import {
  clamp,
  readinessFromQuality,
  round2,
  type Corridor,
  type DriveBias,
  type DriveInput,
  type DriveQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  Corridor,
  DriveBias,
  DriveInput,
  DriveQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type RoutePack = {
  id: string;
  label: string;
  version: string;
  corridorFocus: string;
  routeBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type WorldStatus = "draft" | "active" | "archived";

export type WorldConfig = {
  id: string;
  packId: string;
  label: string;
  corridor: Corridor;
  forecastHorizon: number;
  worldWeight: number;
  actionWeight: number;
  status: WorldStatus;
  notes: string;
  createdAt: string;
};

export type PolicyStatus = "draft" | "open" | "scored" | "archived";

export type ActionPolicy = {
  id: string;
  packId?: string;
  label: string;
  policySummary: string;
  successCondition: string;
  actionChannel: string;
  status: PolicyStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type DriveRun = {
  id: string;
  policyId: string;
  worldId: string;
  worldForecastFit: number;
  cognitiveDepth: number;
  actionAlignment: number;
  trajectoryIntegrity: number;
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
  defaultDriveBias: DriveBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type DriveCompare = {
  id: string;
  name: string;
  policyId: string;
  worldId: string;
  runId: string;
  input: DriveInput;
  worldCognitive: DriveQuality;
  singleLevel: DriveQuality;
  winner: "world_cognitive" | "single_level" | "tie";
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
  packs: RoutePack[];
  worlds: WorldConfig[];
  policies: ActionPolicy[];
  runs: DriveRun[];
  audits: AuditEntry[];
  compares: DriveCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __worldCogStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const worldId = "world-demo";
  const policyId = "policy-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "World Cog Drive Org",
      webhookUrl: "",
      webhookSecret: "world-cog-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultDriveBias: "balanced",
      defaultMode: "world_cognitive",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@world-cog-drive.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Urban Merge Soft-Sim Pack",
        version: "2026.1",
        corridorFocus: "urban merge with occluded cyclist",
        routeBudget: 36,
        status: "active",
        notes: "Seed pack for dual-level vs single-level compare",
        createdAt: now(),
      },
    ],
    worlds: [
      {
        id: worldId,
        packId,
        label: "Dual-horizon world forecast",
        corridor: "merge",
        forecastHorizon: 14,
        worldWeight: 0.64,
        actionWeight: 0.36,
        status: "active",
        notes: "Soft-sim world config without certified AV claim",
        createdAt: now(),
      },
    ],
    policies: [
      {
        id: policyId,
        packId,
        label: "Yield-then-merge action policy",
        policySummary:
          "Soft-sim dual-level world-cognitive action vs single-level reactive VLA.",
        successCondition: "lock_soft_sim",
        actionChannel: "soft_sim_actions",
        status: "scored",
        notes: "Seed policy for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        policyId,
        worldId,
        worldForecastFit: 0.62,
        cognitiveDepth: 0.7,
        actionAlignment: 0.74,
        trajectoryIntegrity: 0.68,
        reviewerNotes:
          "World-cognitive path looks informative but single-level reacts late under soft-sim load",
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
        detail: "Demo pack, world, policy, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__worldCogStore) g.__worldCogStore = seed();
  return g.__worldCogStore;
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
  g.__worldCogStore = seed();
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
  if (patch.defaultDriveBias !== undefined) {
    org.defaultDriveBias = patch.defaultDriveBias;
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
  items: RoutePack[];
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
        p.corridorFocus.toLowerCase().includes(q) ||
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
  corridorFocus: string;
  routeBudget?: number;
  notes?: string;
}): RoutePack {
  const pack: RoutePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    corridorFocus: input.corridorFocus,
    routeBudget: input.routeBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): RoutePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listWorlds(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: WorldConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().worlds];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.corridor.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createWorld(input: {
  packId: string;
  label: string;
  corridor: Corridor;
  forecastHorizon: number;
  worldWeight: number;
  actionWeight?: number;
  notes?: string;
}): WorldConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const world: WorldConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    corridor: input.corridor,
    forecastHorizon: Math.max(1, Math.floor(input.forecastHorizon)),
    worldWeight: clamp(input.worldWeight, 0, 1),
    actionWeight: clamp(input.actionWeight ?? 1 - input.worldWeight, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().worlds.unshift(world);
  audit("evaluator", "world.create", world.label);
  return world;
}

export function archiveWorld(id: string): WorldConfig | null {
  const world = state().worlds.find((m) => m.id === id);
  if (!world) return null;
  world.status = "archived";
  audit("evaluator", "world.archive", id);
  return world;
}

export function listPolicies(opts?: {
  q?: string;
  actionChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ActionPolicy[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().policies];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.policySummary.toLowerCase().includes(q) ||
        c.actionChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.actionChannel) {
    items = items.filter((c) => c.actionChannel === opts.actionChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPolicy(input: {
  packId?: string;
  label: string;
  policySummary: string;
  successCondition: string;
  actionChannel: string;
  notes?: string;
}): ActionPolicy {
  const policy: ActionPolicy = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    policySummary: input.policySummary,
    successCondition: input.successCondition,
    actionChannel: input.actionChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().policies.unshift(policy);
  audit("evaluator", "policy.create", policy.label);
  return policy;
}

export function archivePolicy(id: string): ActionPolicy | null {
  const policy = state().policies.find((c) => c.id === id);
  if (!policy) return null;
  policy.status = "archived";
  audit("evaluator", "policy.archive", id);
  return policy;
}

export function listRuns(opts?: {
  policyId?: string;
  worldId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DriveRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.policyId) {
    items = items.filter((r) => r.policyId === opts.policyId);
  }
  if (opts?.worldId) {
    items = items.filter((r) => r.worldId === opts.worldId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  policyId: string;
  worldId: string;
  worldForecastFit: number;
  cognitiveDepth: number;
  actionAlignment: number;
  trajectoryIntegrity: number;
  reviewerNotes?: string;
}): DriveRun | null {
  if (!state().policies.some((c) => c.id === input.policyId)) {
    return null;
  }
  if (!state().worlds.some((m) => m.id === input.worldId)) return null;
  const run: DriveRun = {
    id: randomUUID(),
    policyId: input.policyId,
    worldId: input.worldId,
    worldForecastFit: clamp(input.worldForecastFit, 0, 1),
    cognitiveDepth: clamp(input.cognitiveDepth, 0, 1),
    actionAlignment: clamp(input.actionAlignment, 0, 1),
    trajectoryIntegrity: clamp(input.trajectoryIntegrity, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const policy = state().policies.find((c) => c.id === input.policyId);
  if (policy) policy.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): DriveCompare[] {
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
  policyId: string;
  worldId: string;
  runId: string;
  driveBias?: DriveBias;
  bias?: DriveBias;
  singleLevelPassRate?: number;
  reactiveOptimism?: number;
  routeHardness?: number;
  leakageRisk?: number;
}): DriveCompare | null {
  const policy = state().policies.find((c) => c.id === input.policyId);
  const world = state().worlds.find((m) => m.id === input.worldId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!policy || !world || !run) return null;

  const goldWeight = outcomeWeight(String(policy.successCondition));
  const driveInput: DriveInput = {
    worldForecastFit: clamp(run.worldForecastFit, 0, 1),
    cognitiveDepth: clamp(run.cognitiveDepth, 0, 1),
    actionAlignment: clamp(run.actionAlignment, 0, 1),
    trajectoryIntegrity: clamp(
      (run.trajectoryIntegrity + goldWeight) / 2,
      0,
      1,
    ),
    singleLevelPassRate: input.singleLevelPassRate ?? 0.82,
    reactiveOptimism: input.reactiveOptimism ?? 0.7,
    routeHardness:
      input.routeHardness ?? clamp(1 - world.worldWeight + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(world.forecastHorizon > 16 ? 0.55 : 0.28, 0, 1),
    driveBias: input.driveBias ?? input.bias ?? state().org.defaultDriveBias,
    profile: "world_cognitive",
  };

  const worldCognitive = scoreWorldCognitive({
    ...driveInput,
    profile: "world_cognitive",
  });
  const singleLevel = scoreSingleLevel({
    ...driveInput,
    profile: "single_level",
  });
  const gap = Math.abs(worldCognitive.overall - singleLevel.overall);
  let winner: DriveCompare["winner"] = "tie";
  if (worldCognitive.overall > singleLevel.overall + 0.5) {
    winner = "world_cognitive";
  } else if (singleLevel.overall > worldCognitive.overall + 0.5) {
    winner = "single_level";
  }

  const compare: DriveCompare = {
    id: randomUUID(),
    name: input.name,
    policyId: policy.id,
    worldId: world.id,
    runId: run.id,
    input: driveInput,
    worldCognitive,
    singleLevel,
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

export function getScoreboard(): DriveCompare[] {
  return [...state().compares].sort(
    (a, b) => b.worldCognitive.overall - a.worldCognitive.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      worlds: state().worlds,
      policies: state().policies,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,worldCognitiveOverall,singleLevelOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.worldCognitive.overall},${c.singleLevel.overall},${c.createdAt}`,
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
    { id: "route-packs", name: "Route pack registry" },
    { id: "pack-versions", name: "Versioned route packs" },
    { id: "world-configs", name: "World forecast configs" },
    { id: "world-editor", name: "World vs action weight editor" },
    { id: "world-search", name: "World config search and filter" },
    { id: "seed-packs", name: "Seed route packs" },
    { id: "action-policies", name: "Action policy workspace" },
    { id: "policy-filters", name: "Action policy filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "drive-runs", name: "Drive soft-sim runs" },
    { id: "drive-bias", name: "Drive bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "World-cognitive vs single-level compare" },
    { id: "delta-view", name: "Drive delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-certified-AV notes" },
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

export function scorePreview(input: DriveInput): {
  worldCognitive: DriveQuality;
  singleLevel: DriveQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const worldCognitive = scoreWorldCognitive({
    ...input,
    profile: "world_cognitive",
  });
  const singleLevel = scoreSingleLevel({
    ...input,
    profile: "single_level",
  });
  return {
    worldCognitive,
    singleLevel,
    readiness: readinessFromQuality(worldCognitive.overall),
  };
}
