import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreFlat, scoreHierarchical } from "./domain/horizon";
import {
  clamp,
  readinessFromQuality,
  round2,
  type Corridor,
  type HorizonBias,
  type HorizonInput,
  type HorizonQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  Corridor,
  HorizonBias,
  HorizonInput,
  HorizonQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ScenarioPack = {
  id: string;
  label: string;
  version: string;
  corridorFocus: string;
  sceneCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SceneStatus = "draft" | "open" | "structured" | "archived";

export type CoarseScene = {
  id: string;
  packId?: string;
  label: string;
  corridor: Corridor;
  structureHash: string;
  horizonSteps: number;
  structureFit: number;
  status: SceneStatus;
  notes: string;
  createdAt: string;
};

export type GeneratorStatus = "draft" | "active" | "archived";

export type DetailGenerator = {
  id: string;
  sceneId: string;
  fidelity: number;
  temporalConsistency: number;
  textureRichness: number;
  reviewerNotes: string;
  status: GeneratorStatus;
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
  defaultHorizonBias: HorizonBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type HorizonCompare = {
  id: string;
  name: string;
  sceneId: string;
  generatorId: string;
  input: HorizonInput;
  hierarchical: HorizonQuality;
  flat: HorizonQuality;
  winner: "hierarchical" | "flat" | "tie";
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
  packs: ScenarioPack[];
  scenes: CoarseScene[];
  generators: DetailGenerator[];
  audits: AuditEntry[];
  compares: HorizonCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __dhsStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const sceneId = "scene-demo";
  const generatorId = "gen-demo";
  return {
    org: {
      name: "Drive Horizon Org",
      webhookUrl: "",
      webhookSecret: "dhs-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultHorizonBias: "balanced",
      defaultMode: "hierarchical",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "eval-lead@drive-horizon.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Urban Corridor Pack",
        version: "2026.1",
        corridorFocus: "urban",
        sceneCount: 1,
        status: "active",
        notes: "Seed pack for demo compare",
        createdAt: now(),
      },
    ],
    scenes: [
      {
        id: sceneId,
        packId,
        label: "Protected left with occluded cyclist",
        corridor: "intersection",
        structureHash: "sh_demo123",
        horizonSteps: 12,
        structureFit: 0.74,
        status: "structured",
        notes: "Seed coarse scene for demo compare",
        createdAt: now(),
      },
    ],
    generators: [
      {
        id: generatorId,
        sceneId,
        fidelity: 0.78,
        temporalConsistency: 0.72,
        textureRichness: 0.7,
        reviewerNotes: "Detail generator coherent with coarse intersection structure",
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
        detail: "Demo pack, scene, and generator seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__dhsStore) g.__dhsStore = seed();
  return g.__dhsStore;
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
  g.__dhsStore = seed();
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
}): { items: ScenarioPack[]; total: number; page: number; pageSize: number } {
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
  notes?: string;
}): ScenarioPack {
  const pack: ScenarioPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    corridorFocus: input.corridorFocus,
    sceneCount: 0,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ScenarioPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listScenes(opts?: {
  q?: string;
  corridor?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): { items: CoarseScene[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().scenes];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.corridor.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.corridor) items = items.filter((c) => c.corridor === opts.corridor);
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createScene(input: {
  packId?: string;
  label: string;
  corridor: Corridor;
  structureHash: string;
  horizonSteps: number;
  structureFit: number;
  notes?: string;
}): CoarseScene {
  const scene: CoarseScene = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    corridor: input.corridor,
    structureHash: input.structureHash,
    horizonSteps: input.horizonSteps,
    structureFit: input.structureFit,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().scenes.unshift(scene);
  if (input.packId) {
    const pack = state().packs.find((p) => p.id === input.packId);
    if (pack) pack.sceneCount += 1;
  }
  audit("evaluator", "scene.create", scene.label);
  return scene;
}

export function archiveScene(id: string): CoarseScene | null {
  const scene = state().scenes.find((c) => c.id === id);
  if (!scene) return null;
  scene.status = "archived";
  audit("evaluator", "scene.archive", id);
  return scene;
}

export function listGenerators(opts?: {
  sceneId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DetailGenerator[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().generators];
  if (opts?.sceneId) items = items.filter((i) => i.sceneId === opts.sceneId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createGenerator(input: {
  sceneId: string;
  fidelity: number;
  temporalConsistency: number;
  textureRichness: number;
  reviewerNotes?: string;
}): DetailGenerator | null {
  if (!state().scenes.some((c) => c.id === input.sceneId)) return null;
  const generator: DetailGenerator = {
    id: randomUUID(),
    sceneId: input.sceneId,
    fidelity: input.fidelity,
    temporalConsistency: input.temporalConsistency,
    textureRichness: input.textureRichness,
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().generators.unshift(generator);
  const scene = state().scenes.find((c) => c.id === input.sceneId);
  if (scene && scene.status === "open") scene.status = "structured";
  audit("evaluator", "generator.create", generator.id);
  return generator;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): HorizonCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  sceneId: string;
  generatorId: string;
  horizonBias?: HorizonBias;
  rolloutSmoothness?: number;
  fluencyScore?: number;
  surprisePressure?: number;
  horizonDrift?: number;
}): HorizonCompare | null {
  const scene = state().scenes.find((c) => c.id === input.sceneId);
  const generator = state().generators.find((i) => i.id === input.generatorId);
  if (!scene || !generator) return null;

  const horizonInput: HorizonInput = {
    structureFit: clamp(scene.structureFit, 0, 1),
    detailFidelity: clamp(generator.fidelity, 0, 1),
    temporalConsistency: clamp(generator.temporalConsistency, 0, 1),
    evidenceStrength: clamp(
      (generator.textureRichness + generator.fidelity) / 2,
      0,
      1,
    ),
    sceneCoverage: clamp(
      (scene.structureFit + generator.textureRichness) / 2,
      0,
      1,
    ),
    rolloutSmoothness: input.rolloutSmoothness ?? 0.78,
    fluencyScore: input.fluencyScore ?? 0.72,
    surprisePressure:
      input.surprisePressure ??
      clamp(1 - scene.structureFit * 0.7 + scene.horizonSteps / 40, 0, 1),
    horizonDrift:
      input.horizonDrift ?? clamp(scene.horizonSteps / 30, 0.15, 0.85),
    horizonBias: input.horizonBias ?? state().org.defaultHorizonBias,
    profile: "hierarchical",
  };

  const hierarchical = scoreHierarchical({
    ...horizonInput,
    profile: "hierarchical",
  });
  const flat = scoreFlat({
    ...horizonInput,
    profile: "flat",
  });
  const gap = Math.abs(hierarchical.overall - flat.overall);
  let winner: HorizonCompare["winner"] = "tie";
  if (hierarchical.overall > flat.overall + 0.5) {
    winner = "hierarchical";
  } else if (flat.overall > hierarchical.overall + 0.5) {
    winner = "flat";
  }

  const compare: HorizonCompare = {
    id: randomUUID(),
    name: input.name,
    sceneId: scene.id,
    generatorId: generator.id,
    input: horizonInput,
    hierarchical,
    flat,
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

export function getScoreboard(): HorizonCompare[] {
  return [...state().compares].sort(
    (a, b) => b.hierarchical.overall - a.hierarchical.overall,
  );
}

export function exportScenesJson(): string {
  return JSON.stringify({ exportedAt: now(), scenes: state().scenes }, null, 2);
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,hierarchicalOverall,flatOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.hierarchical.overall},${c.flat.overall},${c.createdAt}`,
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
    { id: "packs", name: "Scenario pack registry" },
    { id: "pack-search", name: "Pack search and filter" },
    { id: "scenes", name: "Coarse scene structure board" },
    { id: "scene-search", name: "Scene search and filter" },
    { id: "scene-status", name: "Scene status lifecycle board" },
    { id: "generators", name: "Detail generator workspace" },
    { id: "generator-fidelity", name: "Generator fidelity board" },
    { id: "temporal-consistency", name: "Temporal consistency scoring" },
    { id: "reviewer-notes", name: "Reviewer notes on generators" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Hierarchical vs flat world-model compare" },
    { id: "scoreboard", name: "Compare scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-deployment notes" },
    { id: "org", name: "Org settings" },
    { id: "members", name: "Member invite" },
    { id: "auth", name: "Bearer auth" },
    { id: "rate-limit", name: "Rate-limit feedback" },
    { id: "webhook", name: "Idempotent webhook" },
    { id: "export-json", name: "Export scenes JSON" },
    { id: "export-csv", name: "Export compares CSV" },
    { id: "features-api", name: "Features inventory API" },
    { id: "goldens-api", name: "Goldens sample API" },
    { id: "audit", name: "Audit trail" },
    { id: "guide", name: "In-app guide link" },
    { id: "try-html", name: "Offline try.html demo" },
    { id: "seed-onboarding", name: "Seed demo pack from onboarding" },
    { id: "pagination", name: "Pagination on list APIs" },
    { id: "corridor-filter", name: "Corridor filter on scenes" },
  ];
}

export function scorePreview(input: HorizonInput): {
  hierarchical: HorizonQuality;
  flat: HorizonQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const hierarchical = scoreHierarchical({ ...input, profile: "hierarchical" });
  const flat = scoreFlat({
    ...input,
    profile: "flat",
  });
  return {
    hierarchical,
    flat,
    readiness: readinessFromQuality(hierarchical.overall),
  };
}
