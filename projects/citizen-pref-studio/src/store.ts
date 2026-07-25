import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreSafetyFirstPublicOversight,
  scoreInnovationFirstSelfRegulation,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type PrefBias,
  type OptionKind,
  type ScoreMode,
  type CountryRegion,
  type SurveyMode,
  type CitizenPrefInput,
  type CitizenPrefQuality,
} from "./domain/types";

export type {
  PrefBias,
  OptionKind,
  ScoreMode,
  CountryRegion,
  SurveyMode,
  CitizenPrefInput,
  CitizenPrefQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type PolicyPack = {
  id: string;
  label: string;
  version: string;
  studyFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type CountryStatus = "draft" | "active" | "archived";

export type CountryCohort = {
  id: string;
  packId: string;
  label: string;
  region: CountryRegion;
  countryHint: string;
  strataCount: number;
  prefMin: number;
  prefMax: number;
  metricHint: string;
  status: CountryStatus;
  notes: string;
  createdAt: string;
};

export type OptionStatus = "draft" | "active" | "archived";

export type RegOption = {
  id: string;
  packId: string;
  label: string;
  kind: OptionKind;
  oversightHint: string;
  attributeCount: number;
  safetyFloor: number;
  metricHint: string;
  status: OptionStatus;
  notes: string;
  createdAt: string;
};

export type SurveyStatus = "draft" | "active" | "archived";

export type SurveyBatch = {
  id: string;
  packId: string;
  label: string;
  mode: SurveyMode;
  instrumentHint: string;
  itemCount: number;
  responseFloor: number;
  metricHint: string;
  status: SurveyStatus;
  notes: string;
  createdAt: string;
};

export type PrefRunStatus = "draft" | "active" | "archived";

export type PrefRun = {
  id: string;
  packId: string;
  optionId: string;
  countryId: string;
  surveyId: string;
  safetyPreference: number;
  oversightSupport: number;
  coordinationPreference: number;
  packReadiness: number;
  runNotes: string;
  status: PrefRunStatus;
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
  defaultPrefBias: PrefBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CitizenPrefCompare = {
  id: string;
  name: string;
  packId: string;
  optionId: string;
  countryId: string;
  surveyId: string;
  prefRunId: string;
  input: CitizenPrefInput;
  safetyOversight: CitizenPrefQuality;
  innovationSelf: CitizenPrefQuality;
  winner:
    | "safety_first_public_oversight"
    | "innovation_first_self_regulation"
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
  packs: PolicyPack[];
  countries: CountryCohort[];
  options: RegOption[];
  surveys: SurveyBatch[];
  prefRuns: PrefRun[];
  auditEvents: AuditEvent[];
  compares: CitizenPrefCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __citizenPrefStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const countryId = "country-demo";
  const optionId = "option-demo";
  const surveyId = "survey-demo";
  const prefRunId = "run-demo";
  return {
    org: {
      name: "Citizen Pref Org",
      webhookUrl: "",
      webhookSecret: "citizen-pref-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultPrefBias: "balanced",
      defaultMode: "safety_first_public_oversight",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@citizen-pref.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Safety-First Public Oversight Soft-Sim Pack",
        version: "2026.1",
        studyFocus:
          "Safety-first public oversight vs innovation-first self-regulation",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for citizen preference regulatory options vs innovation soft-sim",
        createdAt: now(),
      },
    ],
    countries: [
      {
        id: countryId,
        packId,
        label: "Seven-country preference cohort",
        region: "multi_country",
        countryHint: "multi_country,conjoint,ai_governance",
        strataCount: 7,
        prefMin: 0.4,
        prefMax: 0.95,
        metricHint:
          "Country coverage and safety preference for citizen soft-sim",
        status: "active",
        notes:
          "Soft-sim cohorts — not certified public-opinion polling",
        createdAt: now(),
      },
    ],
    options: [
      {
        id: optionId,
        packId,
        label: "Public oversight regulatory option",
        kind: "public_oversight",
        oversightHint: "agency_review,safety_floor,intl_coord",
        attributeCount: 5,
        safetyFloor: 0.35,
        metricHint: "Option clarity and safety floors",
        status: "active",
        notes:
          "Soft-sim options — not live regulatory authority / not government deployment",
        createdAt: now(),
      },
    ],
    surveys: [
      {
        id: surveyId,
        packId,
        label: "Conjoint preference batch",
        mode: "conjoint",
        instrumentHint: "conjoint,ranking,safety_vs_innovation",
        itemCount: 12,
        responseFloor: 0.35,
        metricHint: "Survey fidelity and noise controls",
        status: "active",
        notes:
          "Soft-sim surveys — not certified polling / not authors’ survey brand",
        createdAt: now(),
      },
    ],
    prefRuns: [
      {
        id: prefRunId,
        packId,
        optionId,
        countryId,
        surveyId,
        safetyPreference: 0.62,
        oversightSupport: 0.7,
        coordinationPreference: 0.74,
        packReadiness: 0.68,
        runNotes:
          "Safety-first looks strong but innovation-first still leads when oversight is thin",
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
        detail:
          "Demo pack, countries, options, surveys, and pref run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__citizenPrefStore) g.__citizenPrefStore = seed();
  return g.__citizenPrefStore;
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
  g.__citizenPrefStore = seed();
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
  if (patch.defaultPrefBias !== undefined) {
    org.defaultPrefBias = patch.defaultPrefBias;
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
  items: PolicyPack[];
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
}): PolicyPack {
  const pack: PolicyPack = {
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

export function archivePack(id: string): PolicyPack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

export function listCountries(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: CountryCohort[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().countries];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.region.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.countryHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createCountry(input: {
  packId: string;
  label: string;
  region: CountryRegion;
  countryHint: string;
  strataCount: number;
  prefMin: number;
  prefMax: number;
  metricHint?: string;
  notes?: string;
}): CountryCohort | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: CountryCohort = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    region: input.region,
    countryHint: input.countryHint,
    strataCount: input.strataCount,
    prefMin: input.prefMin,
    prefMax: input.prefMax,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().countries.unshift(row);
  audit("evaluator", "country.create", row.label);
  return row;
}

export function archiveCountry(id: string): CountryCohort | null {
  const row = state().countries.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "country.archive", id);
  return row;
}

export function listOptions(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: RegOption[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().options];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.kind.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.oversightHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createOption(input: {
  packId: string;
  label: string;
  kind: OptionKind;
  oversightHint: string;
  attributeCount: number;
  safetyFloor: number;
  metricHint?: string;
  notes?: string;
}): RegOption | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: RegOption = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    oversightHint: input.oversightHint,
    attributeCount: input.attributeCount,
    safetyFloor: input.safetyFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().options.unshift(row);
  audit("evaluator", "option.create", row.label);
  return row;
}

export function archiveOption(id: string): RegOption | null {
  const row = state().options.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "option.archive", id);
  return row;
}

export function listSurveys(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SurveyBatch[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().surveys];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.mode.toLowerCase().includes(q) ||
        m.metricHint.toLowerCase().includes(q) ||
        m.instrumentHint.toLowerCase().includes(q) ||
        m.id.includes(q),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSurvey(input: {
  packId: string;
  label: string;
  mode: SurveyMode;
  instrumentHint: string;
  itemCount: number;
  responseFloor: number;
  metricHint?: string;
  notes?: string;
}): SurveyBatch | null {
  const pack = state().packs.find((p) => p.id === input.packId);
  if (!pack) return null;
  const row: SurveyBatch = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    mode: input.mode,
    instrumentHint: input.instrumentHint,
    itemCount: input.itemCount,
    responseFloor: input.responseFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().surveys.unshift(row);
  audit("evaluator", "survey.create", row.label);
  return row;
}

export function archiveSurvey(id: string): SurveyBatch | null {
  const row = state().surveys.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "survey.archive", id);
  return row;
}

export function listPrefRuns(opts?: {
  packId?: string;
  optionId?: string;
  countryId?: string;
  surveyId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PrefRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().prefRuns];
  if (opts?.packId) {
    items = items.filter((r) => r.packId === opts.packId);
  }
  if (opts?.optionId) {
    items = items.filter((r) => r.optionId === opts.optionId);
  }
  if (opts?.countryId) {
    items = items.filter((r) => r.countryId === opts.countryId);
  }
  if (opts?.surveyId) {
    items = items.filter((r) => r.surveyId === opts.surveyId);
  }
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPrefRun(input: {
  packId: string;
  optionId: string;
  countryId: string;
  surveyId: string;
  safetyPreference: number;
  oversightSupport: number;
  coordinationPreference: number;
  packReadiness: number;
  runNotes?: string;
}): PrefRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) {
    return null;
  }
  if (!state().options.some((m) => m.id === input.optionId)) {
    return null;
  }
  if (!state().countries.some((m) => m.id === input.countryId)) {
    return null;
  }
  if (!state().surveys.some((m) => m.id === input.surveyId)) {
    return null;
  }
  const run: PrefRun = {
    id: randomUUID(),
    packId: input.packId,
    optionId: input.optionId,
    countryId: input.countryId,
    surveyId: input.surveyId,
    safetyPreference: clamp(input.safetyPreference, 0, 1),
    oversightSupport: clamp(input.oversightSupport, 0, 1),
    coordinationPreference: clamp(input.coordinationPreference, 0, 1),
    packReadiness: clamp(input.packReadiness, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().prefRuns.unshift(run);
  audit("evaluator", "run.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): CitizenPrefCompare[] {
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
  packId: string;
  optionId: string;
  countryId: string;
  surveyId: string;
  prefRunId: string;
  prefBias?: PrefBias;
  bias?: PrefBias;
  innovationAdherence?: number;
  innovationTunnel?: number;
  surveyNoise?: number;
  overclaimRisk?: number;
}): CitizenPrefCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const option = state().options.find((m) => m.id === input.optionId);
  const country = state().countries.find((m) => m.id === input.countryId);
  const survey = state().surveys.find((m) => m.id === input.surveyId);
  const prefRun = state().prefRuns.find((r) => r.id === input.prefRunId);
  if (!pack || !option || !country || !survey || !prefRun) return null;

  const goldWeight = outcomeWeight("review");
  const span = Math.max(0.05, country.prefMax - country.prefMin);
  const cpInput: CitizenPrefInput = {
    safetyPreference: clamp(prefRun.safetyPreference, 0, 1),
    oversightSupport: clamp(prefRun.oversightSupport, 0, 1),
    coordinationPreference: clamp(prefRun.coordinationPreference, 0, 1),
    packReadiness: clamp((prefRun.packReadiness + goldWeight) / 2, 0, 1),
    innovationAdherence: input.innovationAdherence ?? 0.82,
    innovationTunnel: input.innovationTunnel ?? 0.7,
    surveyNoise: input.surveyNoise ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    prefBias: input.prefBias ?? input.bias ?? state().org.defaultPrefBias,
    profile: "safety_first_public_oversight",
  };

  const safetyOversight = scoreSafetyFirstPublicOversight({
    ...cpInput,
    profile: "safety_first_public_oversight",
  });
  const innovationSelf = scoreInnovationFirstSelfRegulation({
    ...cpInput,
    profile: "innovation_first_self_regulation",
  });
  const gap = Math.abs(safetyOversight.overall - innovationSelf.overall);
  let winner: CitizenPrefCompare["winner"] = "tie";
  if (safetyOversight.overall > innovationSelf.overall + 0.5) {
    winner = "safety_first_public_oversight";
  } else if (innovationSelf.overall > safetyOversight.overall + 0.5) {
    winner = "innovation_first_self_regulation";
  }

  const compare: CitizenPrefCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    optionId: option.id,
    countryId: country.id,
    surveyId: survey.id,
    prefRunId: prefRun.id,
    input: cpInput,
    safetyOversight,
    innovationSelf,
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

export function getScoreboard(): CitizenPrefCompare[] {
  return [...state().compares].sort(
    (a, b) => b.safetyOversight.overall - a.safetyOversight.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      countries: state().countries,
      options: state().options,
      surveys: state().surveys,
      prefRuns: state().prefRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,safetyOversightOverall,innovationSelfOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.safetyOversight.overall},${c.innovationSelf.overall},${c.createdAt}`,
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
    { id: "policy-packs", name: "Policy pack registry" },
    { id: "pack-versions", name: "Versioned policy packs" },
    { id: "reg-options", name: "Regulatory option configs" },
    { id: "option-editor", name: "Regulatory option editor" },
    { id: "option-search", name: "Option search and filter" },
    { id: "countries", name: "Country cohort configs" },
    { id: "country-editor", name: "Multi-country cohort editor" },
    { id: "surveys", name: "Survey batch registry" },
    { id: "survey-filters", name: "Survey batch filters" },
    { id: "pref-runs", name: "Preference run soft-sim" },
    { id: "pref-bias", name: "Preference bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Safety-first public oversight vs innovation-first compare",
    },
    { id: "delta-view", name: "Preference delta view" },
    { id: "scoreboard", name: "Delta scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not live authority / not government / not certified polling / not authors’ brand",
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
    { id: "search", name: "Search across packs and options" },
    { id: "prefs-page", name: "Preference runs workspace" },
  ];
}

export function scorePreview(input: CitizenPrefInput): {
  safetyOversight: CitizenPrefQuality;
  innovationSelf: CitizenPrefQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const safetyOversight = scoreSafetyFirstPublicOversight({
    ...input,
    profile: "safety_first_public_oversight",
  });
  const innovationSelf = scoreInnovationFirstSelfRegulation({
    ...input,
    profile: "innovation_first_self_regulation",
  });
  return {
    safetyOversight,
    innovationSelf,
    readiness: readinessFromQuality(safetyOversight.overall),
  };
}
