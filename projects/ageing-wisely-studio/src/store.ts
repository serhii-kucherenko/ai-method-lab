import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreTherapistSupported,
  scoreWaitlistSelfGuided,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type CareBias,
  type CareInput,
  type CareQuality,
  type CohortKind,
  type ModuleKind,
  type ScoreMode,
  type SessionKind,
} from "./domain/types";

export type {
  CareBias,
  CareInput,
  CareQuality,
  CohortKind,
  ModuleKind,
  ScoreMode,
  SessionKind,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CarePack = {
  id: string;
  label: string;
  version: string;
  careFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type CohortSpec = {
  id: string;
  packId: string;
  label: string;
  kind: CohortKind;
  inclusionHint: string;
  supportFloor: number;
  completionFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type ModuleSpec = {
  id: string;
  packId: string;
  label: string;
  kind: ModuleKind;
  pathHint: string;
  engagementFloor: number;
  dropoutCeiling: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type SessionRun = {
  id: string;
  packId: string;
  cohortId: string;
  moduleId: string;
  label: string;
  kind: SessionKind;
  therapistSupportFidelity: number;
  moduleCompletion: number;
  engagementAdherence: number;
  sessionSignal: number;
  runNotes: string;
  status: EntityStatus;
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
  defaultCareBias: CareBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type CareCompare = {
  id: string;
  name: string;
  packId: string;
  cohortId: string;
  moduleId: string;
  sessionRunId: string;
  input: CareInput;
  therapist: CareQuality;
  waitlist: CareQuality;
  winner:
    | "therapist_supported_icbt"
    | "waitlist_self_guided_baseline"
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
  packs: CarePack[];
  cohorts: CohortSpec[];
  modules: ModuleSpec[];
  sessionRuns: SessionRun[];
  auditEvents: AuditEvent[];
  compares: CareCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __ageingWiselyStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const cohortId = "cohort-demo";
  const moduleId = "module-demo";
  const sessionRunId = "session-demo";
  return {
    org: {
      name: "Ageing Wisely Org",
      webhookUrl: "",
      webhookSecret: "ageing-wisely-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultCareBias: "balanced",
      defaultMode: "therapist_supported_icbt",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@ageing-wisely.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Older-Adult Therapist-Supported iCBT Soft-Sim Pack",
        version: "2026.1",
        careFocus:
          "Therapist-supported iCBT vs waitlist / self-guided baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for cohorts, modules, and session soft-sim vs waitlist baseline",
        createdAt: now(),
      },
    ],
    cohorts: [
      {
        id: cohortId,
        packId,
        label: "Community older adults draft",
        kind: "community_older_adults",
        inclusionHint: "age65plus,anxiety-or-depression",
        supportFloor: 0.45,
        completionFloor: 0.4,
        metricHint: "Cohort soft-sim",
        status: "active",
        notes:
          "Soft-sim cohorts — not clinical enrollment or diagnosis criteria",
        createdAt: now(),
      },
    ],
    modules: [
      {
        id: moduleId,
        packId,
        label: "Behavioral activation draft",
        kind: "behavioral_activation",
        pathHint: "psychoeducation-then-activation",
        engagementFloor: 0.4,
        dropoutCeiling: 0.35,
        metricHint: "Module-path soft-sim",
        status: "active",
        notes: "Soft-sim module path — not live therapist delivery",
        createdAt: now(),
      },
    ],
    sessionRuns: [
      {
        id: sessionRunId,
        packId,
        cohortId,
        moduleId,
        label: "Guided check-in soft-sim",
        kind: "guided_checkin",
        therapistSupportFidelity: 0.72,
        moduleCompletion: 0.68,
        engagementAdherence: 0.74,
        sessionSignal: 0.7,
        runNotes:
          "Therapist support looks strong but waitlist still leads when dropout risk is high",
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
        detail: "Demo pack, cohorts, modules, and session seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__ageingWiselyStore) g.__ageingWiselyStore = seed();
  return g.__ageingWiselyStore;
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
  g.__ageingWiselyStore = seed();
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
  if (patch.defaultCareBias !== undefined) {
    org.defaultCareBias = patch.defaultCareBias;
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
  items: CarePack[];
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
  sessionBudget?: number;
  notes?: string;
}): CarePack {
  const pack: CarePack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    careFocus: input.careFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CarePack | null {
  const pack = state().packs.find((p) => p.id === id);
  if (!pack) return null;
  pack.status = "archived";
  audit("owner", "pack.archive", id);
  return pack;
}

function listEntity<
  T extends {
    label: string;
    id: string;
    packId: string;
    status: string;
    metricHint?: string;
  },
>(
  rows: T[],
  opts?: {
    q?: string;
    packId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    extra?: (row: T, q: string) => boolean;
  },
): { items: T[]; total: number; page: number; pageSize: number } {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...rows];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        (m.metricHint?.toLowerCase().includes(q) ?? false) ||
        m.id.includes(q) ||
        (opts.extra?.(m, q) ?? false),
    );
  }
  if (opts?.packId) items = items.filter((m) => m.packId === opts.packId);
  if (opts?.status) items = items.filter((m) => m.status === opts.status);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function listCohorts(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().cohorts, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.inclusionHint.toLowerCase().includes(q),
  });
}

export function createCohort(input: {
  packId: string;
  label: string;
  kind: CohortKind;
  inclusionHint: string;
  supportFloor: number;
  completionFloor: number;
  metricHint?: string;
  notes?: string;
}): CohortSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: CohortSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    inclusionHint: input.inclusionHint,
    supportFloor: input.supportFloor,
    completionFloor: input.completionFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().cohorts.unshift(row);
  audit("evaluator", "cohort.create", row.label);
  return row;
}

export function archiveCohort(id: string): CohortSpec | null {
  const row = state().cohorts.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "cohort.archive", id);
  return row;
}

export function listModules(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().modules, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.pathHint.toLowerCase().includes(q),
  });
}

export function createModule(input: {
  packId: string;
  label: string;
  kind: ModuleKind;
  pathHint: string;
  engagementFloor: number;
  dropoutCeiling: number;
  metricHint?: string;
  notes?: string;
}): ModuleSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ModuleSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    pathHint: input.pathHint,
    engagementFloor: input.engagementFloor,
    dropoutCeiling: input.dropoutCeiling,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().modules.unshift(row);
  audit("evaluator", "module.create", row.label);
  return row;
}

export function archiveModule(id: string): ModuleSpec | null {
  const row = state().modules.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "module.archive", id);
  return row;
}

export function listSessionRuns(opts?: {
  packId?: string;
  cohortId?: string;
  moduleId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: SessionRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().sessionRuns];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.cohortId)
    items = items.filter((r) => r.cohortId === opts.cohortId);
  if (opts?.moduleId) items = items.filter((r) => r.moduleId === opts.moduleId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createSessionRun(input: {
  packId: string;
  cohortId: string;
  moduleId: string;
  label: string;
  kind: SessionKind;
  therapistSupportFidelity: number;
  moduleCompletion: number;
  engagementAdherence: number;
  sessionSignal: number;
  runNotes?: string;
}): SessionRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().cohorts.some((m) => m.id === input.cohortId)) return null;
  if (!state().modules.some((m) => m.id === input.moduleId)) return null;
  const run: SessionRun = {
    id: randomUUID(),
    packId: input.packId,
    cohortId: input.cohortId,
    moduleId: input.moduleId,
    label: input.label,
    kind: input.kind,
    therapistSupportFidelity: clamp(input.therapistSupportFidelity, 0, 1),
    moduleCompletion: clamp(input.moduleCompletion, 0, 1),
    engagementAdherence: clamp(input.engagementAdherence, 0, 1),
    sessionSignal: clamp(input.sessionSignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().sessionRuns.unshift(run);
  audit("evaluator", "session.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): CareCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  cohortId: string;
  moduleId: string;
  sessionRunId: string;
  careBias?: CareBias;
  bias?: CareBias;
  overclaimRisk?: number;
  coDesignFit?: number;
  symptomReliefSignal?: number;
  dropoutRisk?: number;
}): CareCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const cohort = state().cohorts.find((m) => m.id === input.cohortId);
  const module = state().modules.find((m) => m.id === input.moduleId);
  const sessionRun = state().sessionRuns.find((r) => r.id === input.sessionRunId);
  if (!pack || !cohort || !module || !sessionRun) return null;

  const careInput: CareInput = {
    therapistSupportFidelity: clamp(sessionRun.therapistSupportFidelity, 0, 1),
    moduleCompletion: clamp(sessionRun.moduleCompletion, 0, 1),
    engagementAdherence: clamp(sessionRun.engagementAdherence, 0, 1),
    coDesignFit: clamp(input.coDesignFit ?? cohort.supportFloor, 0, 1),
    symptomReliefSignal: clamp(
      input.symptomReliefSignal ?? module.engagementFloor,
      0,
      1,
    ),
    dropoutRisk: clamp(input.dropoutRisk ?? module.dropoutCeiling, 0, 1),
    sessionSignal: clamp(sessionRun.sessionSignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - cohort.completionFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    careBias: input.careBias ?? input.bias ?? state().org.defaultCareBias,
    profile: "therapist_supported_icbt",
  };

  const therapist = scoreTherapistSupported({
    ...careInput,
    profile: "therapist_supported_icbt",
  });
  const waitlist = scoreWaitlistSelfGuided({
    ...careInput,
    profile: "waitlist_self_guided_baseline",
  });
  const gap = Math.abs(therapist.overall - waitlist.overall);
  let winner: CareCompare["winner"] = "tie";
  if (therapist.overall > waitlist.overall + 0.5) {
    winner = "therapist_supported_icbt";
  } else if (waitlist.overall > therapist.overall + 0.5) {
    winner = "waitlist_self_guided_baseline";
  }

  const compare: CareCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    cohortId: cohort.id,
    moduleId: module.id,
    sessionRunId: sessionRun.id,
    input: careInput,
    therapist,
    waitlist,
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

export function getScoreboard(): CareCompare[] {
  return [...state().compares].sort(
    (a, b) => b.therapist.overall - a.therapist.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      cohorts: state().cohorts,
      modules: state().modules,
      sessionRuns: state().sessionRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,therapistOverall,waitlistOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.therapist.overall},${c.waitlist.overall},${c.createdAt}`,
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
    { id: "care-packs", name: "Care pack registry" },
    { id: "pack-versions", name: "Versioned care packs" },
    { id: "cohorts", name: "Cohort registry" },
    { id: "cohort-editor", name: "Cohort inclusion editor" },
    { id: "cohort-search", name: "Cohort search and filter" },
    { id: "modules", name: "Module path configs" },
    { id: "module-editor", name: "Module path editor" },
    { id: "sessions", name: "Session run soft-sim" },
    { id: "session-filters", name: "Session filters" },
    { id: "care-bias", name: "Care bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Therapist-supported iCBT vs waitlist/self-guided compare",
    },
    { id: "delta-view", name: "Support delta view" },
    { id: "scoreboard", name: "Care scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not diagnosis / not therapist replacement / not digital therapeutic clearance",
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
    { id: "search", name: "Search across packs and cohorts" },
    { id: "sessions-page", name: "Sessions workspace" },
  ];
}

export function scorePreview(input: CareInput): {
  therapist: CareQuality;
  waitlist: CareQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const therapist = scoreTherapistSupported({
    ...input,
    profile: "therapist_supported_icbt",
  });
  const waitlist = scoreWaitlistSelfGuided({
    ...input,
    profile: "waitlist_self_guided_baseline",
  });
  return {
    therapist,
    waitlist,
    readiness: readinessFromQuality(therapist.overall),
  };
}
