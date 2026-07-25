import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreOnlineDeformableSlam,
  scoreOfflineKinematicsPriorBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type PoseKind,
  type TrackBias,
  type ScoreMode,
  type TrackMapInput,
  type TrackMapQuality,
} from "./domain/types";

export type {
  PoseKind,
  TrackBias,
  ScoreMode,
  TrackMapInput,
  TrackMapQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type TrackPack = {
  id: string;
  label: string;
  version: string;
  sceneFocus: string;
  poseBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type PoseStatus = "draft" | "active" | "archived";

export type PoseConfig = {
  id: string;
  packId: string;
  label: string;
  kind: PoseKind;
  poseHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: PoseStatus;
  notes: string;
  createdAt: string;
};

export type ReconstructionStatus = "draft" | "open" | "scored" | "archived";

export type Reconstruction = {
  id: string;
  packId?: string;
  label: string;
  field: string;
  lockCondition: string;
  visionChannel: string;
  status: ReconstructionStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type TrackRun = {
  id: string;
  reconstructionId: string;
  poseConfigId: string;
  deformCoverage: number;
  slamFidelity: number;
  poseGrounding: number;
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
  defaultTrackBias: TrackBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type TrackMapCompare = {
  id: string;
  name: string;
  reconstructionId: string;
  poseConfigId: string;
  runId: string;
  input: TrackMapInput;
  onlineSlam: TrackMapQuality;
  offlineKinematics: TrackMapQuality;
  winner:
    | "online_deformable_slam"
    | "offline_kinematics_prior_baseline"
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
  packs: TrackPack[];
  poses: PoseConfig[];
  reconstructions: Reconstruction[];
  runs: TrackRun[];
  audits: AuditEvent[];
  compares: TrackMapCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __trackMapStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const poseConfigId = "pose-demo";
  const reconstructionId = "recon-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Track Map Org",
      webhookUrl: "",
      webhookSecret: "track-map-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultTrackBias: "balanced",
      defaultMode: "online_deformable_slam",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@track-map.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Soft-Tissue Deform Soft-Sim Pack",
        version: "2026.1",
        sceneFocus:
          "Online deformable SLAM soft-sim vs offline kinematics-prior baseline",
        poseBudget: 36,
        status: "active",
        notes:
          "Seed pack for online deformable SLAM vs offline kinematics-prior baseline soft-sim",
        createdAt: now(),
      },
    ],
    poses: [
      {
        id: poseConfigId,
        packId,
        label: "Motion-aware pose set",
        kind: "motion_aware",
        poseHint:
          "deform_coverage,pose_grounding,slam_fidelity,pack_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Deform, pose grounding, fidelity, and completeness for track soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim pose set — not live robot control / not Track2Map / not diagnostic",
        createdAt: now(),
      },
    ],
    reconstructions: [
      {
        id: reconstructionId,
        packId,
        label: "Intraoperative reconstruction field",
        field:
          "Comparative deformable soft-sim (online SLAM vs kinematics-prior)",
        lockCondition: "lock_soft_sim",
        visionChannel: "soft_sim_track_map_signal",
        status: "scored",
        notes: "Seed reconstruction for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        reconstructionId,
        poseConfigId,
        deformCoverage: 0.62,
        slamFidelity: 0.7,
        poseGrounding: 0.74,
        packCompleteness: 0.68,
        runNotes:
          "Online deformable SLAM looks strong but kinematics-prior baseline still leads on hard deform cases",
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
        detail: "Demo pack, poses, reconstructions, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__trackMapStore) g.__trackMapStore = seed();
  return g.__trackMapStore;
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
  g.__trackMapStore = seed();
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
  if (patch.defaultTrackBias !== undefined) {
    org.defaultTrackBias = patch.defaultTrackBias;
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
  items: TrackPack[];
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
        p.sceneFocus.toLowerCase().includes(q) ||
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
  sceneFocus: string;
  poseBudget?: number;
  notes?: string;
}): TrackPack {
  const pack: TrackPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    sceneFocus: input.sceneFocus,
    poseBudget: input.poseBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): TrackPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listPoses(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PoseConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().poses];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.poseHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPose(input: {
  packId: string;
  label: string;
  kind: PoseKind;
  poseHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): PoseConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: PoseConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    poseHint: input.poseHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().poses.unshift(row);
  audit("evaluator", "pose.create", row.label);
  return row;
}

export function archivePose(id: string): PoseConfig | null {
  const row = state().poses.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "pose.archive", id);
  return row;
}

export function listReconstructions(opts?: {
  q?: string;
  visionChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Reconstruction[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().reconstructions];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.field.toLowerCase().includes(q) ||
        c.visionChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.visionChannel) {
    items = items.filter((c) => c.visionChannel === opts.visionChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createReconstruction(input: {
  packId?: string;
  label: string;
  field: string;
  lockCondition: string;
  visionChannel: string;
  notes?: string;
}): Reconstruction {
  const row: Reconstruction = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    field: input.field,
    lockCondition: input.lockCondition,
    visionChannel: input.visionChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().reconstructions.unshift(row);
  audit("evaluator", "reconstruction.create", row.label);
  return row;
}

export function archiveReconstruction(id: string): Reconstruction | null {
  const row = state().reconstructions.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "reconstruction.archive", id);
  return row;
}

export function listRuns(opts?: {
  reconstructionId?: string;
  poseConfigId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: TrackRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.reconstructionId) {
    items = items.filter((r) => r.reconstructionId === opts.reconstructionId);
  }
  if (opts?.poseConfigId) {
    items = items.filter((r) => r.poseConfigId === opts.poseConfigId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  reconstructionId: string;
  poseConfigId: string;
  deformCoverage: number;
  slamFidelity: number;
  poseGrounding: number;
  packCompleteness: number;
  runNotes?: string;
}): TrackRun | null {
  if (!state().reconstructions.some((c) => c.id === input.reconstructionId)) {
    return null;
  }
  if (!state().poses.some((m) => m.id === input.poseConfigId)) {
    return null;
  }
  const run: TrackRun = {
    id: randomUUID(),
    reconstructionId: input.reconstructionId,
    poseConfigId: input.poseConfigId,
    deformCoverage: clamp(input.deformCoverage, 0, 1),
    slamFidelity: clamp(input.slamFidelity, 0, 1),
    poseGrounding: clamp(input.poseGrounding, 0, 1),
    packCompleteness: clamp(input.packCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().reconstructions.find(
    (c) => c.id === input.reconstructionId,
  );
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): TrackMapCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: string): number {
  switch (label) {
    case "hold_track":
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
  reconstructionId: string;
  poseConfigId: string;
  runId: string;
  trackBias?: TrackBias;
  bias?: TrackBias;
  kinematicsConfidence?: number;
  kinematicsOptimism?: number;
  deformHardness?: number;
  overclaimRisk?: number;
}): TrackMapCompare | null {
  const recon = state().reconstructions.find(
    (c) => c.id === input.reconstructionId,
  );
  const pose = state().poses.find((m) => m.id === input.poseConfigId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!recon || !pose || !run) return null;

  const goldWeight = outcomeWeight(String(recon.lockCondition));
  const span = Math.max(0.05, pose.hardnessMax - pose.hardnessMin);
  const trackInput: TrackMapInput = {
    deformCoverage: clamp(run.deformCoverage, 0, 1),
    slamFidelity: clamp(run.slamFidelity, 0, 1),
    poseGrounding: clamp(run.poseGrounding, 0, 1),
    packCompleteness: clamp((run.packCompleteness + goldWeight) / 2, 0, 1),
    kinematicsConfidence: input.kinematicsConfidence ?? 0.82,
    kinematicsOptimism: input.kinematicsOptimism ?? 0.7,
    deformHardness: input.deformHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    trackBias: input.trackBias ?? input.bias ?? state().org.defaultTrackBias,
    profile: "online_deformable_slam",
  };

  const onlineSlam = scoreOnlineDeformableSlam({
    ...trackInput,
    profile: "online_deformable_slam",
  });
  const offlineKinematics = scoreOfflineKinematicsPriorBaseline({
    ...trackInput,
    profile: "offline_kinematics_prior_baseline",
  });
  const gap = Math.abs(onlineSlam.overall - offlineKinematics.overall);
  let winner: TrackMapCompare["winner"] = "tie";
  if (onlineSlam.overall > offlineKinematics.overall + 0.5) {
    winner = "online_deformable_slam";
  } else if (offlineKinematics.overall > onlineSlam.overall + 0.5) {
    winner = "offline_kinematics_prior_baseline";
  }

  const compare: TrackMapCompare = {
    id: randomUUID(),
    name: input.name,
    reconstructionId: recon.id,
    poseConfigId: pose.id,
    runId: run.id,
    input: trackInput,
    onlineSlam,
    offlineKinematics,
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

export function getScoreboard(): TrackMapCompare[] {
  return [...state().compares].sort(
    (a, b) => b.onlineSlam.overall - a.onlineSlam.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      poses: state().poses,
      reconstructions: state().reconstructions,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,onlineSlamOverall,offlineKinematicsOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.onlineSlam.overall},${c.offlineKinematics.overall},${c.createdAt}`,
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
    { id: "track-packs", name: "Track pack registry" },
    { id: "pack-versions", name: "Versioned track packs" },
    { id: "poses", name: "Pose optimization configs" },
    { id: "pose-editor", name: "Pose set / case editor" },
    { id: "pose-search", name: "Pose search and filter" },
    { id: "seed-packs", name: "Seed track packs" },
    { id: "reconstructions", name: "Reconstruction registry" },
    { id: "recon-filters", name: "Reconstruction filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "track-runs", name: "Track soft-sim runs" },
    { id: "track-bias", name: "Track bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Online deformable SLAM vs offline kinematics-prior baseline compare",
    },
    { id: "delta-view", name: "Track map delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not live robot / not diagnostic / not FDA / not Track2Map / not authors' system",
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

export function scorePreview(input: TrackMapInput): {
  onlineSlam: TrackMapQuality;
  offlineKinematics: TrackMapQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const onlineSlam = scoreOnlineDeformableSlam({
    ...input,
    profile: "online_deformable_slam",
  });
  const offlineKinematics = scoreOfflineKinematicsPriorBaseline({
    ...input,
    profile: "offline_kinematics_prior_baseline",
  });
  return {
    onlineSlam,
    offlineKinematics,
    readiness: readinessFromQuality(onlineSlam.overall),
  };
}
