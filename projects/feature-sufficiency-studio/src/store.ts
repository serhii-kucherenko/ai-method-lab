import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreFullFeatureBaseline,
  scorePartialObservation,
} from "./domain/scoreA";
import {
  clamp,
  readinessFromQuality,
  round2,
  type FeatureSufficiencyInput,
  type FeatureSufficiencyQuality,
  type OutcomeLabel,
  type ScoreMode,
  type SufficiencyBias,
} from "./domain/types";

export type {
  FeatureSufficiencyInput,
  FeatureSufficiencyQuality,
  OutcomeLabel,
  ScoreMode,
  SufficiencyBias,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type FeaturePack = {
  id: string;
  label: string;
  version: string;
  clinicalDomain: string;
  featureCount: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type MaskStatus = "draft" | "active" | "archived";

export type ObservationMask = {
  id: string;
  packId: string;
  label: string;
  presentFeatures: string[];
  coverageRatio: number;
  salienceHint: number;
  status: MaskStatus;
  notes: string;
  createdAt: string;
};

export type CaseStatus = "draft" | "open" | "scored" | "archived";

export type CohortCase = {
  id: string;
  packId?: string;
  label: string;
  caseSummary: string;
  goldOutcome: OutcomeLabel;
  cohortSegment: string;
  status: CaseStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type SufficiencyRun = {
  id: string;
  caseId: string;
  maskId: string;
  maskCoverage: number;
  featureSalience: number;
  cohortFit: number;
  labelAgreement: number;
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
  defaultSufficiencyBias: SufficiencyBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type SufficiencyCompare = {
  id: string;
  name: string;
  caseId: string;
  maskId: string;
  sufficiencyRunId: string;
  input: FeatureSufficiencyInput;
  partialObservation: FeatureSufficiencyQuality;
  fullFeature: FeatureSufficiencyQuality;
  winner: "partial_observation" | "full_feature" | "tie";
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
  packs: FeaturePack[];
  masks: ObservationMask[];
  cohorts: CohortCase[];
  sufficiencyRuns: SufficiencyRun[];
  audits: AuditEntry[];
  compares: SufficiencyCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & { __fssStore?: StoreState };

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const maskId = "mask-demo";
  const caseId = "case-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Feature Sufficiency Org",
      webhookUrl: "",
      webhookSecret: "fss-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultSufficiencyBias: "balanced",
      defaultMode: "partial_observation",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "eval-lead@feature-sufficiency.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Cardiometabolic Feature Pack",
        version: "2026.1",
        clinicalDomain: "cardiology",
        featureCount: 12,
        status: "active",
        notes: "Seed pack for demo sufficiency compare",
        createdAt: now(),
      },
    ],
    masks: [
      {
        id: maskId,
        packId,
        label: "Labs-only observation mask",
        presentFeatures: ["ldl", "hba1c", "creatinine", "bp_systolic"],
        coverageRatio: 0.42,
        salienceHint: 0.68,
        status: "active",
        notes: "Partial labs without imaging or meds history",
        createdAt: now(),
      },
    ],
    cohorts: [
      {
        id: caseId,
        packId,
        label: "Elevated lipids with sparse vitals",
        caseSummary:
          "Outpatient labs show LDL 168 and HbA1c 7.1; no echo, no meds fill history in the window.",
        goldOutcome: "positive",
        cohortSegment: "outpatient_cardiometabolic",
        status: "scored",
        notes: "Seed cohort for demo compare",
        createdAt: now(),
      },
    ],
    sufficiencyRuns: [
      {
        id: runId,
        caseId,
        maskId,
        maskCoverage: 0.42,
        featureSalience: 0.7,
        cohortFit: 0.74,
        labelAgreement: 0.68,
        reviewerNotes: "Partial labs look informative but miss imaging context",
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
        detail: "Demo pack, mask, cohort, and sufficiency run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__fssStore) g.__fssStore = seed();
  return g.__fssStore;
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
  g.__fssStore = seed();
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
  if (patch.defaultSufficiencyBias !== undefined) {
    org.defaultSufficiencyBias = patch.defaultSufficiencyBias;
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
}): { items: FeaturePack[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().packs];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.clinicalDomain.toLowerCase().includes(q) ||
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
  clinicalDomain: string;
  featureCount?: number;
  notes?: string;
}): FeaturePack {
  const pack: FeaturePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    clinicalDomain: input.clinicalDomain,
    featureCount: input.featureCount ?? 8,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): FeaturePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listMasks(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ObservationMask[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().masks];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.presentFeatures.some((f) => f.toLowerCase().includes(q)) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createMask(input: {
  packId: string;
  label: string;
  presentFeatures: string[];
  coverageRatio: number;
  salienceHint?: number;
  notes?: string;
}): ObservationMask | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const mask: ObservationMask = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    presentFeatures: input.presentFeatures,
    coverageRatio: clamp(input.coverageRatio, 0, 1),
    salienceHint: clamp(input.salienceHint ?? 0.5, 0, 1),
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().masks.unshift(mask);
  audit("evaluator", "mask.create", mask.label);
  return mask;
}

export function archiveMask(id: string): ObservationMask | null {
  const mask = state().masks.find((m) => m.id === id);
  if (!mask) return null;
  mask.status = "archived";
  audit("evaluator", "mask.archive", id);
  return mask;
}

export function listCohorts(opts?: {
  q?: string;
  segment?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): { items: CohortCase[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().cohorts];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.caseSummary.toLowerCase().includes(q) ||
        c.cohortSegment.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.segment) {
    items = items.filter((c) => c.cohortSegment === opts.segment);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCohort(input: {
  packId?: string;
  label: string;
  caseSummary: string;
  goldOutcome: OutcomeLabel;
  cohortSegment: string;
  notes?: string;
}): CohortCase {
  const cohort: CohortCase = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    caseSummary: input.caseSummary,
    goldOutcome: input.goldOutcome,
    cohortSegment: input.cohortSegment,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().cohorts.unshift(cohort);
  audit("evaluator", "cohort.create", cohort.label);
  return cohort;
}

export function archiveCohort(id: string): CohortCase | null {
  const cohort = state().cohorts.find((c) => c.id === id);
  if (!cohort) return null;
  cohort.status = "archived";
  audit("evaluator", "cohort.archive", id);
  return cohort;
}

export function listSufficiencyRuns(opts?: {
  caseId?: string;
  maskId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SufficiencyRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().sufficiencyRuns];
  if (opts?.caseId) items = items.filter((r) => r.caseId === opts.caseId);
  if (opts?.maskId) items = items.filter((r) => r.maskId === opts.maskId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSufficiencyRun(input: {
  caseId: string;
  maskId: string;
  maskCoverage: number;
  featureSalience: number;
  cohortFit: number;
  labelAgreement: number;
  reviewerNotes?: string;
}): SufficiencyRun | null {
  if (!state().cohorts.some((c) => c.id === input.caseId)) return null;
  if (!state().masks.some((m) => m.id === input.maskId)) return null;
  const run: SufficiencyRun = {
    id: randomUUID(),
    caseId: input.caseId,
    maskId: input.maskId,
    maskCoverage: clamp(input.maskCoverage, 0, 1),
    featureSalience: clamp(input.featureSalience, 0, 1),
    cohortFit: clamp(input.cohortFit, 0, 1),
    labelAgreement: clamp(input.labelAgreement, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().sufficiencyRuns.unshift(run);
  const cohort = state().cohorts.find((c) => c.id === input.caseId);
  if (cohort) cohort.status = "scored";
  audit("evaluator", "sufficiency_run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): SufficiencyCompare[] {
  return [...state().compares];
}

function outcomeWeight(label: OutcomeLabel): number {
  switch (label) {
    case "negative":
      return 0.2;
    case "indeterminate":
      return 0.45;
    case "positive":
      return 0.7;
    case "critical":
      return 0.92;
    default: {
      const exhaustive: never = label;
      return exhaustive;
    }
  }
}

export function runCompare(input: {
  name: string;
  caseId: string;
  maskId: string;
  sufficiencyRunId: string;
  sufficiencyBias?: SufficiencyBias;
  fullFeatureAccuracy?: number;
  imputationOptimism?: number;
  missingnessPressure?: number;
  leakageRisk?: number;
}): SufficiencyCompare | null {
  const cohort = state().cohorts.find((c) => c.id === input.caseId);
  const mask = state().masks.find((m) => m.id === input.maskId);
  const run = state().sufficiencyRuns.find(
    (r) => r.id === input.sufficiencyRunId,
  );
  if (!cohort || !mask || !run) return null;

  const goldWeight = outcomeWeight(cohort.goldOutcome);
  const sufficiencyInput: FeatureSufficiencyInput = {
    maskCoverage: clamp(run.maskCoverage, 0, 1),
    featureSalience: clamp(run.featureSalience, 0, 1),
    cohortFit: clamp(run.cohortFit, 0, 1),
    labelAgreement: clamp((run.labelAgreement + goldWeight) / 2, 0, 1),
    fullFeatureAccuracy: input.fullFeatureAccuracy ?? 0.82,
    imputationOptimism: input.imputationOptimism ?? 0.7,
    missingnessPressure:
      input.missingnessPressure ??
      clamp(1 - mask.coverageRatio + 0.15, 0, 1),
    leakageRisk:
      input.leakageRisk ??
      clamp(mask.presentFeatures.length > 6 ? 0.55 : 0.28, 0, 1),
    sufficiencyBias: input.sufficiencyBias ?? state().org.defaultSufficiencyBias,
    profile: "partial_observation",
  };

  const partialObservation = scorePartialObservation({
    ...sufficiencyInput,
    profile: "partial_observation",
  });
  const fullFeature = scoreFullFeatureBaseline({
    ...sufficiencyInput,
    profile: "full_feature",
  });
  const gap = Math.abs(partialObservation.overall - fullFeature.overall);
  let winner: SufficiencyCompare["winner"] = "tie";
  if (partialObservation.overall > fullFeature.overall + 0.5) {
    winner = "partial_observation";
  } else if (fullFeature.overall > partialObservation.overall + 0.5) {
    winner = "full_feature";
  }

  const compare: SufficiencyCompare = {
    id: randomUUID(),
    name: input.name,
    caseId: cohort.id,
    maskId: mask.id,
    sufficiencyRunId: run.id,
    input: sufficiencyInput,
    partialObservation,
    fullFeature,
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

export function getScoreboard(): SufficiencyCompare[] {
  return [...state().compares].sort(
    (a, b) => b.partialObservation.overall - a.partialObservation.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      masks: state().masks,
      cohorts: state().cohorts,
      sufficiencyRuns: state().sufficiencyRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,partialOverall,fullOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.partialObservation.overall},${c.fullFeature.overall},${c.createdAt}`,
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
    { id: "feature-packs", name: "Feature pack registry" },
    { id: "pack-versions", name: "Versioned feature packs" },
    { id: "masks", name: "Observation mask registry" },
    { id: "mask-editor", name: "Mask feature presence editor" },
    { id: "mask-search", name: "Mask search and filter" },
    { id: "seed-packs", name: "Seed feature packs" },
    { id: "cohorts", name: "Cohort case workspace" },
    { id: "cohort-filters", name: "Cohort segment filters" },
    { id: "gold-outcomes", name: "Gold outcome labels" },
    { id: "sufficiency-runs", name: "Sufficiency assessment runs" },
    { id: "sufficiency-bias", name: "Sufficiency bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Partial vs full-feature compare" },
    { id: "delta-view", name: "Sufficiency delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not-clinical-advice notes" },
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

export function scorePreview(input: FeatureSufficiencyInput): {
  partialObservation: FeatureSufficiencyQuality;
  fullFeature: FeatureSufficiencyQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const partialObservation = scorePartialObservation({
    ...input,
    profile: "partial_observation",
  });
  const fullFeature = scoreFullFeatureBaseline({
    ...input,
    profile: "full_feature",
  });
  return {
    partialObservation,
    fullFeature,
    readiness: readinessFromQuality(partialObservation.overall),
  };
}
