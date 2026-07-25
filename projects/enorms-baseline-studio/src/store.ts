import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scorePatientSpecificEnorms,
  scorePopulationNormBaseline,
} from "./domain/enorms";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ChannelKind,
  type EnormsBias,
  type ScoreMode,
  type EnormsInput,
  type EnormsQuality,
} from "./domain/types";

export type {
  ChannelKind,
  EnormsBias,
  ScoreMode,
  EnormsInput,
  EnormsQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type BaselinePack = {
  id: string;
  label: string;
  version: string;
  cohortTarget: string;
  channelBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ChannelStatus = "draft" | "active" | "archived";

export type ChannelConfig = {
  id: string;
  packId: string;
  label: string;
  kind: ChannelKind;
  montage: string;
  channelCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: ChannelStatus;
  notes: string;
  createdAt: string;
};

export type DetectionStatus = "draft" | "open" | "scored" | "archived";

export type DetectionConfig = {
  id: string;
  packId?: string;
  label: string;
  detectionText: string;
  successCondition: string;
  taskChannel: string;
  status: DetectionStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type DetectionRun = {
  id: string;
  detectionId: string;
  channelId: string;
  patientNormFit: number;
  channelCoverage: number;
  enormsStability: number;
  detectionSensitivity: number;
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
  defaultEnormsBias: EnormsBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type EnormsCompare = {
  id: string;
  name: string;
  detectionId: string;
  channelId: string;
  runId: string;
  input: EnormsInput;
  patientSpecific: EnormsQuality;
  populationBaseline: EnormsQuality;
  winner:
    | "patient_specific_enorms"
    | "population_norm_baseline"
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
  packs: BaselinePack[];
  channels: ChannelConfig[];
  detections: DetectionConfig[];
  runs: DetectionRun[];
  audits: AuditEntry[];
  compares: EnormsCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __enormsBaselineStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const channelId = "channel-demo";
  const detectionId = "detection-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Enorms Baseline Org",
      webhookUrl: "",
      webhookSecret: "enorms-baseline-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultEnormsBias: "balanced",
      defaultMode: "patient_specific_enorms",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@enorms-baseline.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Pediatric EEG Soft-Sim Baseline Pack",
        version: "2026.1",
        cohortTarget: "Pediatric EEG soft-sim channels + E-norms seizure cues",
        channelBudget: 36,
        status: "active",
        notes:
          "Seed pack for patient-specific E-norms vs population-norm baseline compare",
        createdAt: now(),
      },
    ],
    channels: [
      {
        id: channelId,
        packId,
        label: "Bipolar temporal montage",
        kind: "bipolar",
        montage: "patient_fit,coverage,stability,detection",
        channelCount: 4,
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint:
          "Patient-specific E-norms for seizure detection under soft-sim honesty",
        status: "active",
        notes: "Soft-sim channel config — not clinical diagnostic use",
        createdAt: now(),
      },
    ],
    detections: [
      {
        id: detectionId,
        packId,
        label: "E-norms seizure detection config",
        detectionText:
          "Given patient-specific E-norms, detect seizure-like soft-sim events against the baseline pack.",
        successCondition: "lock_soft_sim",
        taskChannel: "soft_sim_eeg_enorms",
        status: "scored",
        notes: "Seed detection config for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        detectionId,
        channelId,
        patientNormFit: 0.62,
        channelCoverage: 0.7,
        enormsStability: 0.74,
        detectionSensitivity: 0.68,
        reviewerNotes:
          "Patient-specific E-norms look trustworthy but population norms miss pediatric baselines",
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
        detail: "Demo pack, channel config, detection, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__enormsBaselineStore) g.__enormsBaselineStore = seed();
  return g.__enormsBaselineStore;
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
  g.__enormsBaselineStore = seed();
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
  if (patch.defaultEnormsBias !== undefined) {
    org.defaultEnormsBias = patch.defaultEnormsBias;
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
  items: BaselinePack[];
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
        p.cohortTarget.toLowerCase().includes(q) ||
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
  cohortTarget: string;
  channelBudget?: number;
  notes?: string;
}): BaselinePack {
  const pack: BaselinePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    cohortTarget: input.cohortTarget,
    channelBudget: input.channelBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): BaselinePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listChannels(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ChannelConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().channels];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.montage.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createChannel(input: {
  packId: string;
  label: string;
  kind: ChannelKind;
  montage: string;
  channelCount: number;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): ChannelConfig | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const channel: ChannelConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    montage: input.montage,
    channelCount: input.channelCount,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().channels.unshift(channel);
  audit("evaluator", "channel.create", channel.label);
  return channel;
}

export function archiveChannel(id: string): ChannelConfig | null {
  const channel = state().channels.find((m) => m.id === id);
  if (!channel) return null;
  channel.status = "archived";
  audit("evaluator", "channel.archive", id);
  return channel;
}

export function listDetections(opts?: {
  q?: string;
  taskChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DetectionConfig[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().detections];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.detectionText.toLowerCase().includes(q) ||
        c.taskChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.taskChannel) {
    items = items.filter((c) => c.taskChannel === opts.taskChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createDetection(input: {
  packId?: string;
  label: string;
  detectionText: string;
  successCondition: string;
  taskChannel: string;
  notes?: string;
}): DetectionConfig {
  const row: DetectionConfig = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    detectionText: input.detectionText,
    successCondition: input.successCondition,
    taskChannel: input.taskChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().detections.unshift(row);
  audit("evaluator", "detection.create", row.label);
  return row;
}

export function archiveDetection(id: string): DetectionConfig | null {
  const row = state().detections.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "detection.archive", id);
  return row;
}

export function listRuns(opts?: {
  detectionId?: string;
  channelId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DetectionRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.detectionId) {
    items = items.filter((r) => r.detectionId === opts.detectionId);
  }
  if (opts?.channelId) {
    items = items.filter((r) => r.channelId === opts.channelId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  detectionId: string;
  channelId: string;
  patientNormFit: number;
  channelCoverage: number;
  enormsStability: number;
  detectionSensitivity: number;
  reviewerNotes?: string;
}): DetectionRun | null {
  if (!state().detections.some((c) => c.id === input.detectionId)) {
    return null;
  }
  if (!state().channels.some((m) => m.id === input.channelId)) return null;
  const run: DetectionRun = {
    id: randomUUID(),
    detectionId: input.detectionId,
    channelId: input.channelId,
    patientNormFit: clamp(input.patientNormFit, 0, 1),
    channelCoverage: clamp(input.channelCoverage, 0, 1),
    enormsStability: clamp(input.enormsStability, 0, 1),
    detectionSensitivity: clamp(input.detectionSensitivity, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().detections.find((c) => c.id === input.detectionId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): EnormsCompare[] {
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
  detectionId: string;
  channelId: string;
  runId: string;
  enormsBias?: EnormsBias;
  bias?: EnormsBias;
  populationMatchRate?: number;
  populationOptimism?: number;
  seizureHardness?: number;
  overclaimRisk?: number;
}): EnormsCompare | null {
  const detection = state().detections.find((c) => c.id === input.detectionId);
  const channel = state().channels.find((m) => m.id === input.channelId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!detection || !channel || !run) return null;

  const goldWeight = outcomeWeight(String(detection.successCondition));
  const span = Math.max(0.05, channel.coverageMax - channel.coverageMin);
  const enormsInput: EnormsInput = {
    patientNormFit: clamp(run.patientNormFit, 0, 1),
    channelCoverage: clamp(run.channelCoverage, 0, 1),
    enormsStability: clamp(run.enormsStability, 0, 1),
    detectionSensitivity: clamp((run.detectionSensitivity + goldWeight) / 2, 0, 1),
    populationMatchRate: input.populationMatchRate ?? 0.82,
    populationOptimism: input.populationOptimism ?? 0.7,
    seizureHardness: input.seizureHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    enormsBias:
      input.enormsBias ?? input.bias ?? state().org.defaultEnormsBias,
    profile: "patient_specific_enorms",
  };

  const patientSpecific = scorePatientSpecificEnorms({
    ...enormsInput,
    profile: "patient_specific_enorms",
  });
  const populationBaseline = scorePopulationNormBaseline({
    ...enormsInput,
    profile: "population_norm_baseline",
  });
  const gap = Math.abs(patientSpecific.overall - populationBaseline.overall);
  let winner: EnormsCompare["winner"] = "tie";
  if (patientSpecific.overall > populationBaseline.overall + 0.5) {
    winner = "patient_specific_enorms";
  } else if (populationBaseline.overall > patientSpecific.overall + 0.5) {
    winner = "population_norm_baseline";
  }

  const compare: EnormsCompare = {
    id: randomUUID(),
    name: input.name,
    detectionId: detection.id,
    channelId: channel.id,
    runId: run.id,
    input: enormsInput,
    patientSpecific,
    populationBaseline,
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

export function getScoreboard(): EnormsCompare[] {
  return [...state().compares].sort(
    (a, b) => b.patientSpecific.overall - a.patientSpecific.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      channels: state().channels,
      detections: state().detections,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,patientOverall,populationOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.patientSpecific.overall},${c.populationBaseline.overall},${c.createdAt}`,
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
    { id: "baseline-packs", name: "Baseline pack registry" },
    { id: "pack-versions", name: "Versioned baseline packs" },
    { id: "channel-configs", name: "Channel montage configs" },
    { id: "channel-editor", name: "Channel montage / coverage editor" },
    { id: "channel-search", name: "Channel search and filter" },
    { id: "seed-packs", name: "Seed baseline packs" },
    { id: "detections", name: "Seizure detection workspace" },
    { id: "detection-filters", name: "Detection filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "detection-runs", name: "Detection soft-sim runs" },
    { id: "enorms-bias", name: "E-norms bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Patient-specific E-norms vs population-norm baseline compare",
    },
    { id: "delta-view", name: "Baseline delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not clinical / not live EEG / not FDA / not authors' system",
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

export function scorePreview(input: EnormsInput): {
  patientSpecific: EnormsQuality;
  populationBaseline: EnormsQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const patientSpecific = scorePatientSpecificEnorms({
    ...input,
    profile: "patient_specific_enorms",
  });
  const populationBaseline = scorePopulationNormBaseline({
    ...input,
    profile: "population_norm_baseline",
  });
  return {
    patientSpecific,
    populationBaseline,
    readiness: readinessFromQuality(patientSpecific.overall),
  };
}
