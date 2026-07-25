import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreAiOnlyLabelingBaseline,
  scoreHumanAiColearningLabeling,
} from "./domain/colearn";
import {
  clamp,
  readinessFromQuality,
  round2,
  type LabelKind,
  type LabelingBias,
  type ScoreMode,
  type ColearnInput,
  type ColearnQuality,
} from "./domain/types";

export type {
  LabelKind,
  LabelingBias,
  ScoreMode,
  ColearnInput,
  ColearnQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ColearnPack = {
  id: string;
  label: string;
  version: string;
  colearnFocus: string;
  labelBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type LabelStatus = "draft" | "active" | "archived";

export type LabelSet = {
  id: string;
  packId: string;
  label: string;
  kind: LabelKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint: string;
  status: LabelStatus;
  notes: string;
  createdAt: string;
};

export type ReviewerStatus = "draft" | "open" | "scored" | "archived";

export type Reviewer = {
  id: string;
  packId?: string;
  label: string;
  specialtyText: string;
  lockCondition: string;
  reviewChannel: string;
  status: ReviewerStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type ColearnRun = {
  id: string;
  reviewerId: string;
  labelSetId: string;
  clinicianAgreement: number;
  activitySignal: number;
  ehrCompleteness: number;
  labelStability: number;
  reviewerNotes: string;
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
  defaultLabelingBias: LabelingBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ColearnCompare = {
  id: string;
  name: string;
  reviewerId: string;
  labelSetId: string;
  runId: string;
  input: ColearnInput;
  humanAi: ColearnQuality;
  aiOnly: ColearnQuality;
  winner:
    | "human_ai_colearning_labeling"
    | "ai_only_labeling_baseline"
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
  packs: ColearnPack[];
  labels: LabelSet[];
  reviewers: Reviewer[];
  runs: ColearnRun[];
  audits: AuditEvent[];
  compares: ColearnCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __shareColearnStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const labelSetId = "label-demo";
  const reviewerId = "reviewer-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Share Colearn Org",
      webhookUrl: "",
      webhookSecret: "share-colearn-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultLabelingBias: "balanced",
      defaultMode: "human_ai_colearning_labeling",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@share-colearn.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "SHARE Colearn Soft-Sim Pack",
        version: "2026.1",
        colearnFocus:
          "Human–AI co-learning disease activity labeling soft-sim",
        labelBudget: 36,
        status: "active",
        notes:
          "Seed pack for human–AI co-learning vs AI-only labeling baseline soft-sim",
        createdAt: now(),
      },
    ],
    labels: [
      {
        id: labelSetId,
        packId,
        label: "DAS28 composite activity set",
        kind: "composite",
        channelHint:
          "clinician_agreement,activity_signal,ehr_completeness,label_stability",
        seriesCount: 4,
        fidelityMin: 0.4,
        fidelityMax: 0.95,
        metricHint:
          "Agreement, activity, EHR completeness, and stability for colearn soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim labels — not clinical diagnosis / not live EHR write-back",
        createdAt: now(),
      },
    ],
    reviewers: [
      {
        id: reviewerId,
        packId,
        label: "Rheumatology reviewer soft-sim",
        specialtyText:
          "Given human–AI colearn context, run disease activity soft-sim against the colearn pack.",
        lockCondition: "lock_soft_sim",
        reviewChannel: "soft_sim_colearn_signal",
        status: "scored",
        notes: "Seed reviewer for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        reviewerId,
        labelSetId,
        clinicianAgreement: 0.62,
        activitySignal: 0.7,
        ehrCompleteness: 0.74,
        labelStability: 0.68,
        reviewerNotes:
          "Human–AI path looks trustworthy but AI-only needs colearn depth",
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
        detail: "Demo pack, labels, reviewers, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__shareColearnStore) g.__shareColearnStore = seed();
  return g.__shareColearnStore;
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
  g.__shareColearnStore = seed();
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
  if (patch.defaultLabelingBias !== undefined) {
    org.defaultLabelingBias = patch.defaultLabelingBias;
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
  items: ColearnPack[];
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
        p.colearnFocus.toLowerCase().includes(q) ||
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
  colearnFocus: string;
  labelBudget?: number;
  notes?: string;
}): ColearnPack {
  const pack: ColearnPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    colearnFocus: input.colearnFocus,
    labelBudget: input.labelBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ColearnPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listLabels(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: LabelSet[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().labels];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.channelHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createLabel(input: {
  packId: string;
  label: string;
  kind: LabelKind;
  channelHint: string;
  seriesCount: number;
  fidelityMin: number;
  fidelityMax: number;
  metricHint?: string;
  notes?: string;
}): LabelSet | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: LabelSet = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    channelHint: input.channelHint,
    seriesCount: input.seriesCount,
    fidelityMin: input.fidelityMin,
    fidelityMax: input.fidelityMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().labels.unshift(row);
  audit("evaluator", "label.create", row.label);
  return row;
}

export function archiveLabel(id: string): LabelSet | null {
  const row = state().labels.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "label.archive", id);
  return row;
}

export function listReviewers(opts?: {
  q?: string;
  reviewChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: Reviewer[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().reviewers];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.specialtyText.toLowerCase().includes(q) ||
        c.reviewChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.reviewChannel) {
    items = items.filter((c) => c.reviewChannel === opts.reviewChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createReviewer(input: {
  packId?: string;
  label: string;
  specialtyText: string;
  lockCondition: string;
  reviewChannel: string;
  notes?: string;
}): Reviewer {
  const row: Reviewer = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    specialtyText: input.specialtyText,
    lockCondition: input.lockCondition,
    reviewChannel: input.reviewChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().reviewers.unshift(row);
  audit("evaluator", "reviewer.create", row.label);
  return row;
}

export function archiveReviewer(id: string): Reviewer | null {
  const row = state().reviewers.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "reviewer.archive", id);
  return row;
}

export function listRuns(opts?: {
  reviewerId?: string;
  labelSetId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ColearnRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.reviewerId) {
    items = items.filter((r) => r.reviewerId === opts.reviewerId);
  }
  if (opts?.labelSetId) {
    items = items.filter((r) => r.labelSetId === opts.labelSetId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  reviewerId: string;
  labelSetId: string;
  clinicianAgreement: number;
  activitySignal: number;
  ehrCompleteness: number;
  labelStability: number;
  reviewerNotes?: string;
}): ColearnRun | null {
  if (!state().reviewers.some((c) => c.id === input.reviewerId)) {
    return null;
  }
  if (!state().labels.some((m) => m.id === input.labelSetId)) {
    return null;
  }
  const run: ColearnRun = {
    id: randomUUID(),
    reviewerId: input.reviewerId,
    labelSetId: input.labelSetId,
    clinicianAgreement: clamp(input.clinicianAgreement, 0, 1),
    activitySignal: clamp(input.activitySignal, 0, 1),
    ehrCompleteness: clamp(input.ehrCompleteness, 0, 1),
    labelStability: clamp(input.labelStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().reviewers.find((c) => c.id === input.reviewerId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): ColearnCompare[] {
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
  reviewerId: string;
  labelSetId: string;
  runId: string;
  labelingBias?: LabelingBias;
  bias?: LabelingBias;
  aiOnlyConfidence?: number;
  baselineOptimism?: number;
  labelingHardness?: number;
  overclaimRisk?: number;
}): ColearnCompare | null {
  const reviewer = state().reviewers.find((c) => c.id === input.reviewerId);
  const labelSet = state().labels.find((m) => m.id === input.labelSetId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!reviewer || !labelSet || !run) return null;

  const goldWeight = outcomeWeight(String(reviewer.lockCondition));
  const span = Math.max(0.05, labelSet.fidelityMax - labelSet.fidelityMin);
  const colearnInput: ColearnInput = {
    clinicianAgreement: clamp(run.clinicianAgreement, 0, 1),
    activitySignal: clamp(run.activitySignal, 0, 1),
    ehrCompleteness: clamp(run.ehrCompleteness, 0, 1),
    labelStability: clamp((run.labelStability + goldWeight) / 2, 0, 1),
    aiOnlyConfidence: input.aiOnlyConfidence ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    labelingHardness:
      input.labelingHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    labelingBias:
      input.labelingBias ?? input.bias ?? state().org.defaultLabelingBias,
    profile: "human_ai_colearning_labeling",
  };

  const humanAi = scoreHumanAiColearningLabeling({
    ...colearnInput,
    profile: "human_ai_colearning_labeling",
  });
  const aiOnly = scoreAiOnlyLabelingBaseline({
    ...colearnInput,
    profile: "ai_only_labeling_baseline",
  });
  const gap = Math.abs(humanAi.overall - aiOnly.overall);
  let winner: ColearnCompare["winner"] = "tie";
  if (humanAi.overall > aiOnly.overall + 0.5) {
    winner = "human_ai_colearning_labeling";
  } else if (aiOnly.overall > humanAi.overall + 0.5) {
    winner = "ai_only_labeling_baseline";
  }

  const compare: ColearnCompare = {
    id: randomUUID(),
    name: input.name,
    reviewerId: reviewer.id,
    labelSetId: labelSet.id,
    runId: run.id,
    input: colearnInput,
    humanAi,
    aiOnly,
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

export function getScoreboard(): ColearnCompare[] {
  return [...state().compares].sort(
    (a, b) => b.humanAi.overall - a.humanAi.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      labels: state().labels,
      reviewers: state().reviewers,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,humanAiOverall,aiOnlyOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.humanAi.overall},${c.aiOnly.overall},${c.createdAt}`,
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
    { id: "colearn-packs", name: "Colearn pack registry" },
    { id: "pack-versions", name: "Versioned colearn packs" },
    { id: "labels", name: "Disease activity label workspace" },
    { id: "label-editor", name: "Label channel / fidelity editor" },
    { id: "label-search", name: "Label search and filter" },
    { id: "seed-packs", name: "Seed colearn packs" },
    { id: "reviewers", name: "Human reviewer registry" },
    { id: "reviewer-filters", name: "Reviewer filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "colearn-runs", name: "Colearn soft-sim runs" },
    { id: "labeling-bias", name: "Labeling bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Human–AI co-learning vs AI-only labeling baseline compare",
    },
    { id: "delta-view", name: "Colearn delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not diagnostic / not live EHR write-back / not FDA / not authors' system",
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

export function scorePreview(input: ColearnInput): {
  humanAi: ColearnQuality;
  aiOnly: ColearnQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const humanAi = scoreHumanAiColearningLabeling({
    ...input,
    profile: "human_ai_colearning_labeling",
  });
  const aiOnly = scoreAiOnlyLabelingBaseline({
    ...input,
    profile: "ai_only_labeling_baseline",
  });
  return {
    humanAi,
    aiOnly,
    readiness: readinessFromQuality(humanAi.overall),
  };
}
