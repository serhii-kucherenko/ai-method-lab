import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreStandardizedAsyncVideoExam,
  scoreAdHocExamBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ExamBias,
  type ProtocolKind,
  type ScoreMode,
  type SiteKind,
  type AsyncNeuroInput,
  type AsyncNeuroQuality,
} from "./domain/types";

export type {
  ExamBias,
  ProtocolKind,
  ScoreMode,
  SiteKind,
  AsyncNeuroInput,
  AsyncNeuroQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ExamPack = {
  id: string;
  label: string;
  version: string;
  studyFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type SiteStatus = "draft" | "active" | "archived";

export type StudySite = {
  id: string;
  packId: string;
  label: string;
  kind: SiteKind;
  regionHint: string;
  examinerCount: number;
  consistencyMin: number;
  consistencyMax: number;
  metricHint: string;
  status: SiteStatus;
  notes: string;
  createdAt: string;
};

export type ProtocolStatus = "draft" | "active" | "archived";

export type ExamProtocol = {
  id: string;
  packId: string;
  label: string;
  kind: ProtocolKind;
  fidelityHint: string;
  stepCount: number;
  severityFloor: number;
  metricHint: string;
  status: ProtocolStatus;
  notes: string;
  createdAt: string;
};

export type VideoStatus = "draft" | "open" | "scored" | "archived";

export type ExamVideo = {
  id: string;
  packId?: string;
  label: string;
  captureNotes: string;
  lockCondition: string;
  captureChannel: string;
  status: VideoStatus;
  notes: string;
  createdAt: string;
};

export type ExamSessionStatus = "draft" | "active" | "archived";

export type ExamSession = {
  id: string;
  videoId: string;
  siteId: string;
  protocolId: string;
  protocolFidelity: number;
  siteConsistency: number;
  videoCompleteness: number;
  packReadiness: number;
  runNotes: string;
  status: ExamSessionStatus;
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
  defaultExamBias: ExamBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type AsyncNeuroCompare = {
  id: string;
  name: string;
  videoId: string;
  siteId: string;
  protocolId: string;
  examId: string;
  input: AsyncNeuroInput;
  standardized: AsyncNeuroQuality;
  adHoc: AsyncNeuroQuality;
  winner:
    | "standardized_async_video_exam"
    | "ad_hoc_exam_baseline"
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
  packs: ExamPack[];
  sites: StudySite[];
  protocols: ExamProtocol[];
  videos: ExamVideo[];
  exams: ExamSession[];
  auditEvents: AuditEvent[];
  compares: AsyncNeuroCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __asyncNeuroStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const siteId = "site-demo";
  const protocolId = "protocol-demo";
  const videoId = "video-demo";
  const examId = "exam-demo";
  return {
    org: {
      name: "Async Neuro Org",
      webhookUrl: "",
      webhookSecret: "async-neuro-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultExamBias: "balanced",
      defaultMode: "standardized_async_video_exam",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@async-neuro.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "AD/ADRD Async Exam Soft-Sim Pack",
        version: "2026.1",
        studyFocus:
          "Standardized async video exam vs ad-hoc exam baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for standardized async video vs ad-hoc soft-sim",
        createdAt: now(),
      },
    ],
    sites: [
      {
        id: siteId,
        packId,
        label: "Memory clinic multi-site set",
        kind: "memory_clinic",
        regionHint: "site_consistency,memory_clinic,multi_center",
        examinerCount: 6,
        consistencyMin: 0.4,
        consistencyMax: 0.95,
        metricHint:
          "Site consistency and examiner drift for async exam soft-sim",
        status: "active",
        notes:
          "Soft-sim sites — not live telehealth write-back / not VANE brand",
        createdAt: now(),
      },
    ],
    protocols: [
      {
        id: protocolId,
        packId,
        label: "Full async neuro protocol",
        kind: "full_async",
        fidelityHint: "protocol_fidelity,cranial,motor,gait",
        stepCount: 8,
        severityFloor: 0.35,
        metricHint: "Protocol fidelity and capture-noise controls",
        status: "active",
        notes:
          "Soft-sim protocol — not clinical diagnostic / not FDA clearance",
        createdAt: now(),
      },
    ],
    videos: [
      {
        id: videoId,
        packId,
        label: "Async capture batch",
        captureNotes: "Home/clinic videos under dual exam methods",
        lockCondition: "lock_soft_sim",
        captureChannel: "soft_sim_async_video",
        status: "scored",
        notes: "Seed video batch for demo compare",
        createdAt: now(),
      },
    ],
    exams: [
      {
        id: examId,
        videoId,
        siteId,
        protocolId,
        protocolFidelity: 0.62,
        siteConsistency: 0.7,
        videoCompleteness: 0.74,
        packReadiness: 0.68,
        runNotes:
          "Standardized looks strong but ad-hoc still leads when protocols are thin",
        status: "active",
        createdAt: now(),
      },
    ],
    auditEvents: [
      {
        id: "audit-seed",
        at: now(),
        actor: "system",
        action: "seed",
        detail: "Demo pack, sites, protocols, videos, and exam seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__asyncNeuroStore) g.__asyncNeuroStore = seed();
  return g.__asyncNeuroStore;
}

function audit(actor: string, action: string, detail: string): void {
  state().auditEvents.unshift({
    id: randomUUID(),
    at: now(),
    actor,
    action,
    detail,
  });
}

export function resetStore(): void {
  g.__asyncNeuroStore = seed();
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
  if (patch.defaultExamBias !== undefined) {
    org.defaultExamBias = patch.defaultExamBias;
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
  items: ExamPack[];
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
        p.studyFocus.toLowerCase().includes(q) ||
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
  studyFocus: string;
  sessionBudget?: number;
  notes?: string;
}): ExamPack {
  const pack: ExamPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    studyFocus: input.studyFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ExamPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listSites(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: StudySite[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().sites];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.regionHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSite(input: {
  packId: string;
  label: string;
  kind: SiteKind;
  regionHint: string;
  examinerCount: number;
  consistencyMin: number;
  consistencyMax: number;
  metricHint?: string;
  notes?: string;
}): StudySite | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: StudySite = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    regionHint: input.regionHint,
    examinerCount: input.examinerCount,
    consistencyMin: input.consistencyMin,
    consistencyMax: input.consistencyMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().sites.unshift(row);
  audit("evaluator", "site.create", row.label);
  return row;
}

export function archiveSite(id: string): StudySite | null {
  const row = state().sites.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "site.archive", id);
  return row;
}

export function listProtocols(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ExamProtocol[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().protocols];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.fidelityHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createProtocol(input: {
  packId: string;
  label: string;
  kind: ProtocolKind;
  fidelityHint: string;
  stepCount: number;
  severityFloor: number;
  metricHint?: string;
  notes?: string;
}): ExamProtocol | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: ExamProtocol = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    fidelityHint: input.fidelityHint,
    stepCount: input.stepCount,
    severityFloor: input.severityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().protocols.unshift(row);
  audit("evaluator", "protocol.create", row.label);
  return row;
}

export function archiveProtocol(id: string): ExamProtocol | null {
  const row = state().protocols.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "protocol.archive", id);
  return row;
}

export function listVideos(opts?: {
  q?: string;
  captureChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ExamVideo[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().videos];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.captureNotes.toLowerCase().includes(q) ||
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

export function createVideo(input: {
  packId?: string;
  label: string;
  captureNotes: string;
  lockCondition: string;
  captureChannel: string;
  notes?: string;
}): ExamVideo {
  const row: ExamVideo = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    captureNotes: input.captureNotes,
    lockCondition: input.lockCondition,
    captureChannel: input.captureChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().videos.unshift(row);
  audit("evaluator", "video.create", row.label);
  return row;
}

export function archiveVideo(id: string): ExamVideo | null {
  const row = state().videos.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "video.archive", id);
  return row;
}

export function listExams(opts?: {
  videoId?: string;
  siteId?: string;
  protocolId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ExamSession[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().exams];
  if (opts?.videoId) {
    items = items.filter((r) => r.videoId === opts.videoId);
  }
  if (opts?.siteId) {
    items = items.filter((r) => r.siteId === opts.siteId);
  }
  if (opts?.protocolId) {
    items = items.filter((r) => r.protocolId === opts.protocolId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createExam(input: {
  videoId: string;
  siteId: string;
  protocolId: string;
  protocolFidelity: number;
  siteConsistency: number;
  videoCompleteness: number;
  packReadiness: number;
  runNotes?: string;
}): ExamSession | null {
  if (!state().videos.some((c) => c.id === input.videoId)) {
    return null;
  }
  if (!state().sites.some((m) => m.id === input.siteId)) {
    return null;
  }
  if (!state().protocols.some((m) => m.id === input.protocolId)) {
    return null;
  }
  const run: ExamSession = {
    id: randomUUID(),
    videoId: input.videoId,
    siteId: input.siteId,
    protocolId: input.protocolId,
    protocolFidelity: clamp(input.protocolFidelity, 0, 1),
    siteConsistency: clamp(input.siteConsistency, 0, 1),
    videoCompleteness: clamp(input.videoCompleteness, 0, 1),
    packReadiness: clamp(input.packReadiness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().exams.unshift(run);
  const row = state().videos.find((c) => c.id === input.videoId);
  if (row) row.status = "scored";
  audit("evaluator", "exam.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): AsyncNeuroCompare[] {
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
  videoId: string;
  siteId: string;
  protocolId: string;
  examId: string;
  examBias?: ExamBias;
  bias?: ExamBias;
  adHocAdherence?: number;
  examinerDrift?: number;
  captureNoise?: number;
  overclaimRisk?: number;
}): AsyncNeuroCompare | null {
  const video = state().videos.find((c) => c.id === input.videoId);
  const site = state().sites.find((m) => m.id === input.siteId);
  const protocol = state().protocols.find((m) => m.id === input.protocolId);
  const exam = state().exams.find((r) => r.id === input.examId);
  if (!video || !site || !protocol || !exam) return null;

  const goldWeight = outcomeWeight(String(video.lockCondition));
  const span = Math.max(0.05, site.consistencyMax - site.consistencyMin);
  const anInput: AsyncNeuroInput = {
    protocolFidelity: clamp(exam.protocolFidelity, 0, 1),
    siteConsistency: clamp(exam.siteConsistency, 0, 1),
    videoCompleteness: clamp(exam.videoCompleteness, 0, 1),
    packReadiness: clamp((exam.packReadiness + goldWeight) / 2, 0, 1),
    adHocAdherence: input.adHocAdherence ?? 0.82,
    examinerDrift: input.examinerDrift ?? 0.7,
    captureNoise: input.captureNoise ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    examBias: input.examBias ?? input.bias ?? state().org.defaultExamBias,
    profile: "standardized_async_video_exam",
  };

  const standardized = scoreStandardizedAsyncVideoExam({
    ...anInput,
    profile: "standardized_async_video_exam",
  });
  const adHoc = scoreAdHocExamBaseline({
    ...anInput,
    profile: "ad_hoc_exam_baseline",
  });
  const gap = Math.abs(standardized.overall - adHoc.overall);
  let winner: AsyncNeuroCompare["winner"] = "tie";
  if (standardized.overall > adHoc.overall + 0.5) {
    winner = "standardized_async_video_exam";
  } else if (adHoc.overall > standardized.overall + 0.5) {
    winner = "ad_hoc_exam_baseline";
  }

  const compare: AsyncNeuroCompare = {
    id: randomUUID(),
    name: input.name,
    videoId: video.id,
    siteId: site.id,
    protocolId: protocol.id,
    examId: exam.id,
    input: anInput,
    standardized,
    adHoc,
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

export function getScoreboard(): AsyncNeuroCompare[] {
  return [...state().compares].sort(
    (a, b) => b.standardized.overall - a.standardized.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      sites: state().sites,
      protocols: state().protocols,
      videos: state().videos,
      exams: state().exams,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,standardizedOverall,adHocOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.standardized.overall},${c.adHoc.overall},${c.createdAt}`,
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
    { id: "exam-packs", name: "Exam pack registry" },
    { id: "pack-versions", name: "Versioned exam packs" },
    { id: "sites", name: "Study site configs" },
    { id: "site-editor", name: "Multi-site editor" },
    { id: "site-search", name: "Site search and filter" },
    { id: "protocols", name: "Exam protocol configs" },
    { id: "protocol-editor", name: "Async protocol editor" },
    { id: "videos", name: "Async video registry" },
    { id: "video-filters", name: "Video filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "exam-sessions", name: "Exam session soft-sim runs" },
    { id: "exam-bias", name: "Exam bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Standardized async video vs ad-hoc exam compare",
    },
    { id: "delta-view", name: "Exam delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not clinical diagnostic / not telehealth write-back / not FDA / not VANE",
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

export function scorePreview(input: AsyncNeuroInput): {
  standardized: AsyncNeuroQuality;
  adHoc: AsyncNeuroQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const standardized = scoreStandardizedAsyncVideoExam({
    ...input,
    profile: "standardized_async_video_exam",
  });
  const adHoc = scoreAdHocExamBaseline({
    ...input,
    profile: "ad_hoc_exam_baseline",
  });
  return {
    standardized,
    adHoc,
    readiness: readinessFromQuality(standardized.overall),
  };
}
