import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreDistributedEgoExoFusion,
  scoreEgoOnlyBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type WearerKind,
  type ObserverKind,
  type MotionBias,
  type ScoreMode,
  type PairedMotionInput,
  type PairedMotionQuality,
} from "./domain/types";

export type {
  WearerKind,
  ObserverKind,
  MotionBias,
  ScoreMode,
  PairedMotionInput,
  PairedMotionQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CapturePack = {
  id: string;
  label: string;
  version: string;
  captureFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type WearerStatus = "draft" | "active" | "archived";

export type Wearer = {
  id: string;
  packId: string;
  label: string;
  kind: WearerKind;
  egoHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: WearerStatus;
  notes: string;
  createdAt: string;
};

export type ObserverStatus = "draft" | "active" | "archived";

export type Observer = {
  id: string;
  packId: string;
  label: string;
  kind: ObserverKind;
  exoHint: string;
  viewCount: number;
  baselineMeters: number;
  metricHint: string;
  status: ObserverStatus;
  notes: string;
  createdAt: string;
};

export type SessionStatus = "draft" | "open" | "scored" | "archived";

export type CaptureSession = {
  id: string;
  packId?: string;
  label: string;
  sessionNotes: string;
  lockCondition: string;
  captureChannel: string;
  status: SessionStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type CaptureRun = {
  id: string;
  sessionId: string;
  wearerId: string;
  observerId: string;
  egoCoverage: number;
  exoCoverage: number;
  fusionClarity: number;
  packCompleteness: number;
  runNotes: string;
  status: RunStatus;
  createdAt: string;
};

export type AuditEvent = {
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
  defaultMotionBias: MotionBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type PairedMotionCompare = {
  id: string;
  name: string;
  sessionId: string;
  wearerId: string;
  observerId: string;
  runId: string;
  input: PairedMotionInput;
  fusion: PairedMotionQuality;
  egoOnly: PairedMotionQuality;
  winner:
    | "distributed_ego_exo_fusion"
    | "ego_only_baseline"
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
  packs: CapturePack[];
  wearers: Wearer[];
  observers: Observer[];
  sessions: CaptureSession[];
  runs: CaptureRun[];
  audits: AuditEvent[];
  compares: PairedMotionCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __pairedMotionStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const wearerId = "wearer-demo";
  const observerId = "observer-demo";
  const sessionId = "session-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Paired Motion Org",
      webhookUrl: "",
      webhookSecret: "paired-motion-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultMotionBias: "balanced",
      defaultMode: "distributed_ego_exo_fusion",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@paired-motion.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Paired HMD Soft-Sim Pack",
        version: "2026.1",
        captureFocus:
          "Distributed ego+exo fusion vs ego-only baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for distributed ego+exo vs ego-only motion soft-sim",
        createdAt: now(),
      },
    ],
    wearers: [
      {
        id: wearerId,
        packId,
        label: "Primary HMD wearer",
        kind: "hmd_wearer",
        egoHint: "ego_coverage,fusion_clarity,pack_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Ego coverage and occlusion hardness for paired HMD soft-sim",
        status: "active",
        notes:
          "Soft-sim wearer — not live HMD fleet / not Meta Aria deploy",
        createdAt: now(),
      },
    ],
    observers: [
      {
        id: observerId,
        packId,
        label: "Room exo observer",
        kind: "exo_camera",
        exoHint: "exo_coverage,baseline_meters,multi_view",
        viewCount: 2,
        baselineMeters: 3.2,
        metricHint: "Exo coverage and world-space anchor for fusion",
        status: "active",
        notes: "Soft-sim observer — not production mocap suit replacement",
        createdAt: now(),
      },
    ],
    sessions: [
      {
        id: sessionId,
        packId,
        label: "Paired walking take",
        sessionNotes: "Occluded limbs under dual HMD+exo views",
        lockCondition: "lock_soft_sim",
        captureChannel: "soft_sim_distributed_ego_exo",
        status: "scored",
        notes: "Seed session for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        sessionId,
        wearerId,
        observerId,
        egoCoverage: 0.62,
        exoCoverage: 0.7,
        fusionClarity: 0.74,
        packCompleteness: 0.68,
        runNotes:
          "Fusion looks strong but ego-only still leads when exo is sparse",
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
        detail: "Demo pack, wearers, observers, sessions, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__pairedMotionStore) g.__pairedMotionStore = seed();
  return g.__pairedMotionStore;
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
  g.__pairedMotionStore = seed();
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
  if (patch.defaultMotionBias !== undefined) {
    org.defaultMotionBias = patch.defaultMotionBias;
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
  items: CapturePack[];
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
        p.captureFocus.toLowerCase().includes(q) ||
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
  captureFocus: string;
  sessionBudget?: number;
  notes?: string;
}): CapturePack {
  const pack: CapturePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    captureFocus: input.captureFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CapturePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listWearers(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Wearer[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().wearers];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.egoHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createWearer(input: {
  packId: string;
  label: string;
  kind: WearerKind;
  egoHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): Wearer | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Wearer = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    egoHint: input.egoHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().wearers.unshift(row);
  audit("evaluator", "wearer.create", row.label);
  return row;
}

export function archiveWearer(id: string): Wearer | null {
  const row = state().wearers.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "wearer.archive", id);
  return row;
}

export function listObservers(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Observer[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().observers];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.exoHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createObserver(input: {
  packId: string;
  label: string;
  kind: ObserverKind;
  exoHint: string;
  viewCount: number;
  baselineMeters: number;
  metricHint?: string;
  notes?: string;
}): Observer | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: Observer = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    exoHint: input.exoHint,
    viewCount: input.viewCount,
    baselineMeters: input.baselineMeters,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().observers.unshift(row);
  audit("evaluator", "observer.create", row.label);
  return row;
}

export function archiveObserver(id: string): Observer | null {
  const row = state().observers.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "observer.archive", id);
  return row;
}

export function listSessions(opts?: {
  q?: string;
  captureChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CaptureSession[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().sessions];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.sessionNotes.toLowerCase().includes(q) ||
        c.captureChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.captureChannel) {
    items = items.filter((c) => c.captureChannel === opts.captureChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSession(input: {
  packId?: string;
  label: string;
  sessionNotes: string;
  lockCondition: string;
  captureChannel: string;
  notes?: string;
}): CaptureSession {
  const row: CaptureSession = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    sessionNotes: input.sessionNotes,
    lockCondition: input.lockCondition,
    captureChannel: input.captureChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().sessions.unshift(row);
  audit("evaluator", "session.create", row.label);
  return row;
}

export function archiveSession(id: string): CaptureSession | null {
  const row = state().sessions.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "session.archive", id);
  return row;
}

export function listRuns(opts?: {
  sessionId?: string;
  wearerId?: string;
  observerId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CaptureRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.sessionId) {
    items = items.filter((r) => r.sessionId === opts.sessionId);
  }
  if (opts?.wearerId) {
    items = items.filter((r) => r.wearerId === opts.wearerId);
  }
  if (opts?.observerId) {
    items = items.filter((r) => r.observerId === opts.observerId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  sessionId: string;
  wearerId: string;
  observerId: string;
  egoCoverage: number;
  exoCoverage: number;
  fusionClarity: number;
  packCompleteness: number;
  runNotes?: string;
}): CaptureRun | null {
  if (!state().sessions.some((c) => c.id === input.sessionId)) {
    return null;
  }
  if (!state().wearers.some((m) => m.id === input.wearerId)) {
    return null;
  }
  if (!state().observers.some((m) => m.id === input.observerId)) {
    return null;
  }
  const run: CaptureRun = {
    id: randomUUID(),
    sessionId: input.sessionId,
    wearerId: input.wearerId,
    observerId: input.observerId,
    egoCoverage: clamp(input.egoCoverage, 0, 1),
    exoCoverage: clamp(input.exoCoverage, 0, 1),
    fusionClarity: clamp(input.fusionClarity, 0, 1),
    packCompleteness: clamp(input.packCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().sessions.find((c) => c.id === input.sessionId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): PairedMotionCompare[] {
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
    default: {
      const _exhaustive: string = label;
      void _exhaustive;
      return 0.55;
    }
  }
}

export function runCompare(input: {
  name: string;
  sessionId: string;
  wearerId: string;
  observerId: string;
  runId: string;
  motionBias?: MotionBias;
  bias?: MotionBias;
  egoOnlyAdherence?: number;
  driftRisk?: number;
  occlusionHardness?: number;
  overclaimRisk?: number;
}): PairedMotionCompare | null {
  const session = state().sessions.find((c) => c.id === input.sessionId);
  const wearer = state().wearers.find((m) => m.id === input.wearerId);
  const observer = state().observers.find((m) => m.id === input.observerId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!session || !wearer || !observer || !run) return null;

  const goldWeight = outcomeWeight(String(session.lockCondition));
  const span = Math.max(0.05, wearer.hardnessMax - wearer.hardnessMin);
  const pmInput: PairedMotionInput = {
    egoCoverage: clamp(run.egoCoverage, 0, 1),
    exoCoverage: clamp(run.exoCoverage, 0, 1),
    fusionClarity: clamp(run.fusionClarity, 0, 1),
    packCompleteness: clamp((run.packCompleteness + goldWeight) / 2, 0, 1),
    egoOnlyAdherence: input.egoOnlyAdherence ?? 0.82,
    driftRisk: input.driftRisk ?? 0.7,
    occlusionHardness:
      input.occlusionHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    motionBias:
      input.motionBias ?? input.bias ?? state().org.defaultMotionBias,
    profile: "distributed_ego_exo_fusion",
  };

  const fusion = scoreDistributedEgoExoFusion({
    ...pmInput,
    profile: "distributed_ego_exo_fusion",
  });
  const egoOnly = scoreEgoOnlyBaseline({
    ...pmInput,
    profile: "ego_only_baseline",
  });
  const gap = Math.abs(fusion.overall - egoOnly.overall);
  let winner: PairedMotionCompare["winner"] = "tie";
  if (fusion.overall > egoOnly.overall + 0.5) {
    winner = "distributed_ego_exo_fusion";
  } else if (egoOnly.overall > fusion.overall + 0.5) {
    winner = "ego_only_baseline";
  }

  const compare: PairedMotionCompare = {
    id: randomUUID(),
    name: input.name,
    sessionId: session.id,
    wearerId: wearer.id,
    observerId: observer.id,
    runId: run.id,
    input: pmInput,
    fusion,
    egoOnly,
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

export function getScoreboard(): PairedMotionCompare[] {
  return [...state().compares].sort(
    (a, b) => b.fusion.overall - a.fusion.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      wearers: state().wearers,
      observers: state().observers,
      sessions: state().sessions,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,fusionOverall,egoOnlyOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.fusion.overall},${c.egoOnly.overall},${c.createdAt}`,
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
    { id: "capture-packs", name: "Capture pack registry" },
    { id: "pack-versions", name: "Versioned capture packs" },
    { id: "wearers", name: "Wearer configs" },
    { id: "wearer-editor", name: "HMD wearer editor" },
    { id: "wearer-search", name: "Wearer search and filter" },
    { id: "observers", name: "Observer configs" },
    { id: "observer-editor", name: "Exo observer editor" },
    { id: "sessions", name: "Capture session registry" },
    { id: "session-filters", name: "Session filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "capture-runs", name: "Capture soft-sim runs" },
    { id: "motion-bias", name: "Motion bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Distributed ego+exo fusion vs ego-only baseline compare",
    },
    { id: "delta-view", name: "Motion delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not live HMD fleet / not mocap suit / not Meta Aria / not EgoExoMoCap",
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

export function scorePreview(input: PairedMotionInput): {
  fusion: PairedMotionQuality;
  egoOnly: PairedMotionQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const fusion = scoreDistributedEgoExoFusion({
    ...input,
    profile: "distributed_ego_exo_fusion",
  });
  const egoOnly = scoreEgoOnlyBaseline({
    ...input,
    profile: "ego_only_baseline",
  });
  return {
    fusion,
    egoOnly,
    readiness: readinessFromQuality(fusion.overall),
  };
}
