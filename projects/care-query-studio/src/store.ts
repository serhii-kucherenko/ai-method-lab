import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreMultilingualPocLlmAnswers,
  scoreLocalClinicianBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type LocaleKind,
  type QueryBias,
  type ScoreMode,
  type CareQueryInput,
  type CareQueryQuality,
} from "./domain/types";

export type {
  LocaleKind,
  QueryBias,
  ScoreMode,
  CareQueryInput,
  CareQueryQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type QueryPack = {
  id: string;
  label: string;
  version: string;
  careFocus: string;
  localeBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type LocaleStatus = "draft" | "active" | "archived";

export type LocaleSuite = {
  id: string;
  packId: string;
  label: string;
  kind: LocaleKind;
  dialectHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint: string;
  status: LocaleStatus;
  notes: string;
  createdAt: string;
};

export type RubricStatus = "draft" | "open" | "scored" | "archived";

export type AnswerRubric = {
  id: string;
  packId?: string;
  label: string;
  architecture: string;
  lockCondition: string;
  answerChannel: string;
  status: RubricStatus;
  notes: string;
  createdAt: string;
};

export type RunStatus = "draft" | "active" | "archived";

export type QueryRun = {
  id: string;
  rubricId: string;
  localeId: string;
  languageCoverage: number;
  clinicalFidelity: number;
  localeGrounding: number;
  answerCompleteness: number;
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
  defaultQueryBias: QueryBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CareQueryCompare = {
  id: string;
  name: string;
  rubricId: string;
  localeId: string;
  runId: string;
  input: CareQueryInput;
  llm: CareQueryQuality;
  clinician: CareQueryQuality;
  winner:
    | "multilingual_poc_llm_answers"
    | "local_clinician_baseline"
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
  packs: QueryPack[];
  locales: LocaleSuite[];
  rubrics: AnswerRubric[];
  runs: QueryRun[];
  audits: AuditEvent[];
  compares: CareQueryCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __careQueryStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const localeId = "locale-demo";
  const rubricId = "rubric-demo";
  const runId = "run-demo";
  return {
    org: {
      name: "Care Query Org",
      webhookUrl: "",
      webhookSecret: "care-query-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultQueryBias: "balanced",
      defaultMode: "multilingual_poc_llm_answers",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@care-query.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Multilingual POC Soft-Sim Pack",
        version: "2026.1",
        careFocus:
          "Multilingual point-of-care medical query soft-sim vs local clinician baseline",
        localeBudget: 36,
        status: "active",
        notes:
          "Seed pack for multilingual POC LLM answers vs local clinician baseline soft-sim",
        createdAt: now(),
      },
    ],
    locales: [
      {
        id: localeId,
        packId,
        label: "Yoruba + Pidgin POC locale suite",
        kind: "yoruba",
        dialectHint:
          "language_coverage,locale_grounding,clinical_fidelity,answer_completeness",
        caseCount: 4,
        hardnessMin: 0.4,
        hardnessMax: 0.95,
        metricHint:
          "Language, locale grounding, fidelity, and completeness for POC soft-sim honesty",
        status: "active",
        notes:
          "Soft-sim multilingual locales — not diagnostic / not NigBench / not live EHR",
        createdAt: now(),
      },
    ],
    rubrics: [
      {
        id: rubricId,
        packId,
        label: "POC answer rubric set",
        architecture:
          "Comparative multilingual POC answer soft-sim (LLM vs clinician)",
        lockCondition: "lock_soft_sim",
        answerChannel: "soft_sim_poc_answer_signal",
        status: "scored",
        notes: "Seed rubrics for demo compare",
        createdAt: now(),
      },
    ],
    runs: [
      {
        id: runId,
        rubricId,
        localeId,
        languageCoverage: 0.62,
        clinicalFidelity: 0.7,
        localeGrounding: 0.74,
        answerCompleteness: 0.68,
        runNotes:
          "Multilingual LLM pack looks strong but local clinician baseline still leads on hard bedside queries",
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
        detail: "Demo pack, locales, rubrics, and run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__careQueryStore) g.__careQueryStore = seed();
  return g.__careQueryStore;
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
  g.__careQueryStore = seed();
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
  items: QueryPack[];
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
        p.careFocus.toLowerCase().includes(q) ||
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
  careFocus: string;
  localeBudget?: number;
  notes?: string;
}): QueryPack {
  const pack: QueryPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    careFocus: input.careFocus,
    localeBudget: input.localeBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): QueryPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listLocales(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: LocaleSuite[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().locales];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.dialectHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createLocale(input: {
  packId: string;
  label: string;
  kind: LocaleKind;
  dialectHint: string;
  caseCount: number;
  hardnessMin: number;
  hardnessMax: number;
  metricHint?: string;
  notes?: string;
}): LocaleSuite | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: LocaleSuite = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    dialectHint: input.dialectHint,
    caseCount: input.caseCount,
    hardnessMin: input.hardnessMin,
    hardnessMax: input.hardnessMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().locales.unshift(row);
  audit("evaluator", "locale.create", row.label);
  return row;
}

export function archiveLocale(id: string): LocaleSuite | null {
  const row = state().locales.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "locale.archive", id);
  return row;
}

export function listRubrics(opts?: {
  q?: string;
  answerChannel?: string;
  status?: string;
  packId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AnswerRubric[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().rubrics];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.architecture.toLowerCase().includes(q) ||
        c.answerChannel.toLowerCase().includes(q) ||
        c.id.includes(q),
    );
  }
  if (opts?.answerChannel) {
    items = items.filter((c) => c.answerChannel === opts.answerChannel);
  }
  if (opts?.status) items = items.filter((c) => c.status === opts.status);
  if (opts?.packId) items = items.filter((c) => c.packId === opts.packId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRubric(input: {
  packId?: string;
  label: string;
  architecture: string;
  lockCondition: string;
  answerChannel: string;
  notes?: string;
}): AnswerRubric {
  const row: AnswerRubric = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    architecture: input.architecture,
    lockCondition: input.lockCondition,
    answerChannel: input.answerChannel,
    status: "open",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().rubrics.unshift(row);
  audit("evaluator", "rubric.create", row.label);
  return row;
}

export function archiveRubric(id: string): AnswerRubric | null {
  const row = state().rubrics.find((c) => c.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "rubric.archive", id);
  return row;
}

export function listRuns(opts?: {
  rubricId?: string;
  localeId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: QueryRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().runs];
  if (opts?.rubricId) {
    items = items.filter((r) => r.rubricId === opts.rubricId);
  }
  if (opts?.localeId) {
    items = items.filter((r) => r.localeId === opts.localeId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createRun(input: {
  rubricId: string;
  localeId: string;
  languageCoverage: number;
  clinicalFidelity: number;
  localeGrounding: number;
  answerCompleteness: number;
  runNotes?: string;
}): QueryRun | null {
  if (!state().rubrics.some((c) => c.id === input.rubricId)) {
    return null;
  }
  if (!state().locales.some((m) => m.id === input.localeId)) {
    return null;
  }
  const run: QueryRun = {
    id: randomUUID(),
    rubricId: input.rubricId,
    localeId: input.localeId,
    languageCoverage: clamp(input.languageCoverage, 0, 1),
    clinicalFidelity: clamp(input.clinicalFidelity, 0, 1),
    localeGrounding: clamp(input.localeGrounding, 0, 1),
    answerCompleteness: clamp(input.answerCompleteness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().runs.unshift(run);
  const row = state().rubrics.find((c) => c.id === input.rubricId);
  if (row) row.status = "scored";
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().audits.slice(0, limit);
}

export function listCompares(): CareQueryCompare[] {
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
  rubricId: string;
  localeId: string;
  runId: string;
  queryBias?: QueryBias;
  bias?: QueryBias;
  clinicianConfidence?: number;
  baselineOptimism?: number;
  queryHardness?: number;
  overclaimRisk?: number;
}): CareQueryCompare | null {
  const rubric = state().rubrics.find((c) => c.id === input.rubricId);
  const locale = state().locales.find((m) => m.id === input.localeId);
  const run = state().runs.find((r) => r.id === input.runId);
  if (!rubric || !locale || !run) return null;

  const goldWeight = outcomeWeight(String(rubric.lockCondition));
  const span = Math.max(0.05, locale.hardnessMax - locale.hardnessMin);
  const careInput: CareQueryInput = {
    languageCoverage: clamp(run.languageCoverage, 0, 1),
    clinicalFidelity: clamp(run.clinicalFidelity, 0, 1),
    localeGrounding: clamp(run.localeGrounding, 0, 1),
    answerCompleteness: clamp(
      (run.answerCompleteness + goldWeight) / 2,
      0,
      1,
    ),
    clinicianConfidence: input.clinicianConfidence ?? 0.82,
    baselineOptimism: input.baselineOptimism ?? 0.7,
    queryHardness: input.queryHardness ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    queryBias: input.queryBias ?? input.bias ?? state().org.defaultQueryBias,
    profile: "multilingual_poc_llm_answers",
  };

  const llm = scoreMultilingualPocLlmAnswers({
    ...careInput,
    profile: "multilingual_poc_llm_answers",
  });
  const clinician = scoreLocalClinicianBaseline({
    ...careInput,
    profile: "local_clinician_baseline",
  });
  const gap = Math.abs(llm.overall - clinician.overall);
  let winner: CareQueryCompare["winner"] = "tie";
  if (llm.overall > clinician.overall + 0.5) {
    winner = "multilingual_poc_llm_answers";
  } else if (clinician.overall > llm.overall + 0.5) {
    winner = "local_clinician_baseline";
  }

  const compare: CareQueryCompare = {
    id: randomUUID(),
    name: input.name,
    rubricId: rubric.id,
    localeId: locale.id,
    runId: run.id,
    input: careInput,
    llm,
    clinician,
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

export function getScoreboard(): CareQueryCompare[] {
  return [...state().compares].sort((a, b) => b.llm.overall - a.llm.overall);
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      locales: state().locales,
      rubrics: state().rubrics,
      runs: state().runs,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,llmOverall,clinicianOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.llm.overall},${c.clinician.overall},${c.createdAt}`,
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
    { id: "query-packs", name: "Query pack registry" },
    { id: "pack-versions", name: "Versioned query packs" },
    { id: "locales", name: "Multilingual POC locale suites" },
    { id: "locale-editor", name: "Locale dialect / case editor" },
    { id: "locale-search", name: "Locale search and filter" },
    { id: "seed-packs", name: "Seed query packs" },
    { id: "answers", name: "Answer rubric registry" },
    { id: "rubric-filters", name: "Answer rubric filters" },
    { id: "lock-conditions", name: "Pack lock success conditions" },
    { id: "query-runs", name: "POC medical query soft-sim runs" },
    { id: "query-bias", name: "Query bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Multilingual POC LLM answers vs local clinician baseline compare",
    },
    { id: "delta-view", name: "Care-query delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not diagnostic / not live EHR / not FDA / not NigBench / not authors' system",
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

export function scorePreview(input: CareQueryInput): {
  llm: CareQueryQuality;
  clinician: CareQueryQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const llm = scoreMultilingualPocLlmAnswers({
    ...input,
    profile: "multilingual_poc_llm_answers",
  });
  const clinician = scoreLocalClinicianBaseline({
    ...input,
    profile: "local_clinician_baseline",
  });
  return {
    llm,
    clinician,
    readiness: readinessFromQuality(llm.overall),
  };
}
