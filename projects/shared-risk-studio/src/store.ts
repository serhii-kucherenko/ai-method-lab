import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreDiseaseSpecific, scoreSharedMultiDisease } from "./domain/risk";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ModalityKind,
  type QueryBias,
  type RiskInput,
  type RiskQuality,
  type ScoreMode,
} from "./domain/types";

export type {
  ModalityKind,
  QueryBias,
  RiskInput,
  RiskQuality,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CohortPack = {
  id: string;
  label: string;
  version: string;
  diseaseHorizon: string;
  queryBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type ModalityStatus = "draft" | "active" | "archived";

export type ModalitySchema = {
  id: string;
  packId: string;
  label: string;
  kind: ModalityKind;
  featureSet: string;
  timeWindow: string;
  coverageMin: number;
  coverageMax: number;
  metricHint: string;
  status: ModalityStatus;
  notes: string;
  createdAt: string;
};

export type QueryStatus = "draft" | "open" | "scored" | "archived";

export type RiskQuery = {
  id: string;
  packId?: string;
  label: string;
  queryText: string;
  successCondition: string;
  diseaseChannel: string;
  status: QueryStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type SharedRun = {
  id: string;
  queryId: string;
  modalityId: string;
  cohortCoverage: number;
  modalityFidelity: number;
  queryClarity: number;
  runStability: number;
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
  defaultQueryBias: QueryBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type RiskCompare = {
  id: string;
  name: string;
  queryId: string;
  modalityId: string;
  runId: string;
  input: RiskInput;
  sharedMultiDisease: RiskQuality;
  diseaseSpecific: RiskQuality;
  winner: "shared_multi_disease" | "disease_specific_baseline" | "tie";
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
  packs: CohortPack[];
  modalities: ModalitySchema[];
  queries: RiskQuery[];
  runs: SharedRun[];
  audits: AuditEntry[];
  compares: RiskCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __sharedRiskStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const modalityId = "modality-demo";
  const queryId = "query-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Shared Risk Org",
      webhookUrl: "",
      webhookSecret: "shared-risk-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultQueryBias: "balanced",
      defaultMode: "shared_multi_disease",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@shared-risk.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Multi-Disease Soft-Sim Cohort Pack",
        version: "2026.1",
        diseaseHorizon: "CVD + T2D + CKD shared representation",
        queryBudget: 36,
        status: "active",
        notes: "Seed pack for shared vs disease-specific compare",
        createdAt: now(),
      },
    ],
    modalities: [
      {
        id: modalityId,
        packId,
        label: "EHR + imaging soft-sim schema",
        kind: "mixed",
        featureSet: "labs,vitals,imaging_embeddings",
        timeWindow: "5y_rolling",
        coverageMin: 0.4,
        coverageMax: 0.95,
        metricHint: "Shared risk AUROC under soft-sim honesty",
        status: "active",
        notes: "Soft-sim modality schema — not live EHR",
        createdAt: now(),
      },
    ],
    queries: [
      {
        id: queryId,
        packId,
        label: "Shared multi-disease risk query",
        queryText:
          "What is 5-year shared risk across CVD, T2D, and CKD for this cohort?",
        successCondition: "lock_soft_sim",
        diseaseChannel: "soft_sim_shared",
        status: "scored",
        notes: "Seed query for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        queryId,
        modalityId,
        cohortCoverage: 0.62,
        modalityFidelity: 0.7,
        queryClarity: 0.74,
        runStability: 0.68,
        reviewerNotes:
          "Shared path looks informative but disease-specific drifts under sparse modalities",
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
        detail: "Demo pack, modality, query, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__sharedRiskStore) g.__sharedRiskStore = seed();
  return g.__sharedRiskStore;
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
  g.__sharedRiskStore = seed();
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
  if (patch.defaultQueryBias !== undefined) {
    org.defaultQueryBias = patch.defaultQueryBias;
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
  items: CohortPack[];
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
        p.diseaseHorizon.toLowerCase().includes(q) ||
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
  diseaseHorizon: string;
  queryBudget?: number;
  notes?: string;
}): CohortPack {
  const pack: CohortPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    diseaseHorizon: input.diseaseHorizon,
    queryBudget: input.queryBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CohortPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listModalities(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: ModalitySchema[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().modalities];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.featureSet.toLowerCase().includes(q) ||
        m.timeWindow.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createModality(input: {
  packId: string;
  label: string;
  kind: ModalityKind;
  featureSet: string;
  timeWindow: string;
  coverageMin: number;
  coverageMax: number;
  metricHint?: string;
  notes?: string;
}): ModalitySchema | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const modality: ModalitySchema = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    featureSet: input.featureSet,
    timeWindow: input.timeWindow,
    coverageMin: input.coverageMin,
    coverageMax: input.coverageMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().modalities.unshift(modality);
  audit("evaluator", "modality.create", modality.label);
  return modality;
}

export function archiveModality(id: string): ModalitySchema | null {
  const modality = state().modalities.find((m) => m.id === id);
  if (!modality) return null;
  modality.status = "archived";
  audit("evaluator", "modality.archive", id);
  return modality;
}

export function listQueries(opts?: {
  q?: string;
  diseaseChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: RiskQuery[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().queries];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.queryText.toLowerCase().includes(q) ||
        c.diseaseChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.diseaseChannel) {
    items = items.filter((c) => c.diseaseChannel === opts.diseaseChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createQuery(input: {
  packId?: string;
  label: string;
  queryText: string;
  successCondition: string;
  diseaseChannel: string;
  notes?: string;
}): RiskQuery {
  const query: RiskQuery = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    queryText: input.queryText,
    successCondition: input.successCondition,
    diseaseChannel: input.diseaseChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().queries.unshift(query);
  audit("evaluator", "query.create", query.label);
  return query;
}

export function archiveQuery(id: string): RiskQuery | null {
  const query = state().queries.find((c) => c.id === id);
  if (!query) return null;
  query.status = "archived";
  audit("evaluator", "query.archive", id);
  return query;
}

export function listRuns(opts?: {
  queryId?: string;
  modalityId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SharedRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.queryId) {
    items = items.filter((r) => r.queryId === opts.queryId);
  }
  if (opts?.modalityId) {
    items = items.filter((r) => r.modalityId === opts.modalityId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  queryId: string;
  modalityId: string;
  cohortCoverage: number;
  modalityFidelity: number;
  queryClarity: number;
  runStability: number;
  reviewerNotes?: string;
}): SharedRun | null {
  if (!state().queries.some((c) => c.id === input.queryId)) {
    return null;
  }
  if (!state().modalities.some((m) => m.id === input.modalityId)) return null;
  const run: SharedRun = {
    id: randomUUID(),
    queryId: input.queryId,
    modalityId: input.modalityId,
    cohortCoverage: clamp(input.cohortCoverage, 0, 1),
    modalityFidelity: clamp(input.modalityFidelity, 0, 1),
    queryClarity: clamp(input.queryClarity, 0, 1),
    runStability: clamp(input.runStability, 0, 1),
    reviewerNotes: input.reviewerNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const query = state().queries.find((c) => c.id === input.queryId);
  if (query) query.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEntry[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): RiskCompare[] {
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
  queryId: string;
  modalityId: string;
  runId: string;
  queryBias?: QueryBias;
  bias?: QueryBias;
  diseaseBaselineRate?: number;
  skipOptimism?: number;
  diseaseHardness?: number;
  overclaimRisk?: number;
}): RiskCompare | null {
  const query = state().queries.find((c) => c.id === input.queryId);
  const modality = state().modalities.find((m) => m.id === input.modalityId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!query || !modality || !run) return null;

  const goldWeight = outcomeWeight(String(query.successCondition));
  const span = Math.max(0.05, modality.coverageMax - modality.coverageMin);
  const riskInput: RiskInput = {
    cohortCoverage: clamp(run.cohortCoverage, 0, 1),
    modalityFidelity: clamp(run.modalityFidelity, 0, 1),
    queryClarity: clamp(run.queryClarity, 0, 1),
    runStability: clamp((run.runStability + goldWeight) / 2, 0, 1),
    diseaseBaselineRate: input.diseaseBaselineRate ?? 0.82,
    skipOptimism: input.skipOptimism ?? 0.7,
    diseaseHardness:
      input.diseaseHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    queryBias: input.queryBias ?? input.bias ?? state().org.defaultQueryBias,
    profile: "shared_multi_disease",
  };

  const sharedMultiDisease = scoreSharedMultiDisease({
    ...riskInput,
    profile: "shared_multi_disease",
  });
  const diseaseSpecific = scoreDiseaseSpecific({
    ...riskInput,
    profile: "disease_specific_baseline",
  });
  const gap = Math.abs(sharedMultiDisease.overall - diseaseSpecific.overall);
  let winner: RiskCompare["winner"] = "tie";
  if (sharedMultiDisease.overall > diseaseSpecific.overall + 0.5) {
    winner = "shared_multi_disease";
  } else if (diseaseSpecific.overall > sharedMultiDisease.overall + 0.5) {
    winner = "disease_specific_baseline";
  }

  const compare: RiskCompare = {
    id: randomUUID(),
    name: input.name,
    queryId: query.id,
    modalityId: modality.id,
    runId: run.id,
    input: riskInput,
    sharedMultiDisease,
    diseaseSpecific,
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

export function getScoreboard(): RiskCompare[] {
  return [...state().compares].sort(
    (a, b) => b.sharedMultiDisease.overall - a.sharedMultiDisease.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      modalities: state().modalities,
      queries: state().queries,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,sharedOverall,diseaseOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.sharedMultiDisease.overall},${c.diseaseSpecific.overall},${c.createdAt}`,
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
    { id: "cohort-packs", name: "Cohort pack registry" },
    { id: "pack-versions", name: "Versioned cohort packs" },
    { id: "modality-schemas", name: "Modality-schema definitions" },
    { id: "modality-editor", name: "Feature / time-window editor" },
    { id: "modality-search", name: "Modality search and filter" },
    { id: "seed-packs", name: "Seed cohort packs" },
    { id: "risk-queries", name: "Risk-query workspace" },
    { id: "query-filters", name: "Risk query filters" },
    { id: "success-conditions", name: "Pack lock success conditions" },
    { id: "shared-runs", name: "Shared risk soft-sim runs" },
    { id: "query-bias", name: "Query bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    { id: "compare", name: "Shared vs disease-specific compare" },
    { id: "delta-view", name: "Representation delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    { id: "soft-sim", name: "Soft-sim not CDS / not live EHR notes" },
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

export function scorePreview(input: RiskInput): {
  sharedMultiDisease: RiskQuality;
  diseaseSpecific: RiskQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const sharedMultiDisease = scoreSharedMultiDisease({
    ...input,
    profile: "shared_multi_disease",
  });
  const diseaseSpecific = scoreDiseaseSpecific({
    ...input,
    profile: "disease_specific_baseline",
  });
  return {
    sharedMultiDisease,
    diseaseSpecific,
    readiness: readinessFromQuality(sharedMultiDisease.overall),
  };
}
