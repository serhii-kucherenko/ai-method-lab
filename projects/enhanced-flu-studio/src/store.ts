import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import { scoreCurrentPolicy, scoreExpandedEiv } from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type CountryKind,
  type FluInput,
  type FluQuality,
  type OutcomeKind,
  type ProgramBias,
  type ProgramKind,
  type ScoreMode,
} from "./domain/types";

export type {
  CountryKind,
  FluInput,
  FluQuality,
  OutcomeKind,
  ProgramBias,
  ProgramKind,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ProgramPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  seasonBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type CountrySpec = {
  id: string;
  packId: string;
  label: string;
  kind: CountryKind;
  regionHint: string;
  coverageFloor: number;
  parityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type ProgramSpec = {
  id: string;
  packId: string;
  label: string;
  kind: ProgramKind;
  eivHint: string;
  eivFloor: number;
  stickinessCeiling: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type OutcomeRun = {
  id: string;
  packId: string;
  countryId: string;
  programId: string;
  label: string;
  kind: OutcomeKind;
  coverage65Plus: number;
  eivUptakeShare: number;
  winterBurdenIndex: number;
  assaySignal: number;
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
  defaultProgramBias: ProgramBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type FluCompare = {
  id: string;
  name: string;
  packId: string;
  countryId: string;
  programId: string;
  outcomeId: string;
  input: FluInput;
  expanded: FluQuality;
  baseline: FluQuality;
  winner:
    | "expanded_eiv_program"
    | "current_policy_baseline"
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
  packs: ProgramPack[];
  countries: CountrySpec[];
  programs: ProgramSpec[];
  outcomes: OutcomeRun[];
  auditEvents: AuditEvent[];
  compares: FluCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __enhancedFluStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const countryId = "country-demo";
  const programId = "program-demo";
  const outcomeId = "outcome-demo";
  return {
    org: {
      name: "Enhanced Flu Org",
      webhookUrl: "",
      webhookSecret: "enhanced-flu-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultProgramBias: "balanced",
      defaultMode: "expanded_eiv_program",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@enhanced-flu.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Nordic EIV Expansion Soft-Sim Pack",
        version: "2026.1",
        programFocus:
          "Expanded EIV for adults ≥65 vs current policy baseline",
        seasonBudget: 36,
        status: "active",
        notes:
          "Seed pack for country scenarios, program specs, and outcome soft-sim vs current policy",
        createdAt: now(),
      },
    ],
    countries: [
      {
        id: countryId,
        packId,
        label: "Sweden adults ≥65 draft",
        kind: "sweden",
        regionHint: "nordic-65plus",
        coverageFloor: 0.45,
        parityFloor: 0.4,
        metricHint: "Country soft-sim",
        status: "active",
        notes:
          "Soft-sim country scenarios — not live immunization logistics",
        createdAt: now(),
      },
    ],
    programs: [
      {
        id: programId,
        packId,
        label: "Expanded EIV 65+ draft",
        kind: "expanded_eiv_65plus",
        eivHint: "high-dose-adjuvanted-mix",
        eivFloor: 0.4,
        stickinessCeiling: 0.35,
        metricHint: "Program soft-sim",
        status: "active",
        notes: "Soft-sim program design — not clinical prescribing",
        createdAt: now(),
      },
    ],
    outcomes: [
      {
        id: outcomeId,
        packId,
        countryId,
        programId,
        label: "Hospitalizations averted soft-sim",
        kind: "hospitalizations_averted",
        coverage65Plus: 0.72,
        eivUptakeShare: 0.68,
        winterBurdenIndex: 0.28,
        assaySignal: 0.7,
        runNotes:
          "Expanded EIV looks strong but current policy still leads when stickiness is high",
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
        detail: "Demo pack, countries, programs, and outcomes seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__enhancedFluStore) g.__enhancedFluStore = seed();
  return g.__enhancedFluStore;
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
  g.__enhancedFluStore = seed();
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
  if (patch.defaultProgramBias !== undefined) {
    org.defaultProgramBias = patch.defaultProgramBias;
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
  items: ProgramPack[];
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
        p.programFocus.toLowerCase().includes(q) ||
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
  programFocus: string;
  seasonBudget?: number;
  notes?: string;
}): ProgramPack {
  const pack: ProgramPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    seasonBudget: input.seasonBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ProgramPack | null {
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

export function listCountries(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().countries, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.regionHint.toLowerCase().includes(q),
  });
}

export function createCountry(input: {
  packId: string;
  label: string;
  kind: CountryKind;
  regionHint: string;
  coverageFloor: number;
  parityFloor: number;
  metricHint?: string;
  notes?: string;
}): CountrySpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: CountrySpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    regionHint: input.regionHint,
    coverageFloor: input.coverageFloor,
    parityFloor: input.parityFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().countries.unshift(row);
  audit("evaluator", "country.create", row.label);
  return row;
}

export function archiveCountry(id: string): CountrySpec | null {
  const row = state().countries.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "country.archive", id);
  return row;
}

export function listPrograms(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().programs, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.eivHint.toLowerCase().includes(q),
  });
}

export function createProgram(input: {
  packId: string;
  label: string;
  kind: ProgramKind;
  eivHint: string;
  eivFloor: number;
  stickinessCeiling: number;
  metricHint?: string;
  notes?: string;
}): ProgramSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ProgramSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    eivHint: input.eivHint,
    eivFloor: input.eivFloor,
    stickinessCeiling: input.stickinessCeiling,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().programs.unshift(row);
  audit("evaluator", "program.create", row.label);
  return row;
}

export function archiveProgram(id: string): ProgramSpec | null {
  const row = state().programs.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "program.archive", id);
  return row;
}

export function listOutcomes(opts?: {
  packId?: string;
  countryId?: string;
  programId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: OutcomeRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().outcomes];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.countryId)
    items = items.filter((r) => r.countryId === opts.countryId);
  if (opts?.programId)
    items = items.filter((r) => r.programId === opts.programId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createOutcome(input: {
  packId: string;
  countryId: string;
  programId: string;
  label: string;
  kind: OutcomeKind;
  coverage65Plus: number;
  eivUptakeShare: number;
  winterBurdenIndex: number;
  assaySignal: number;
  runNotes?: string;
}): OutcomeRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().countries.some((m) => m.id === input.countryId)) return null;
  if (!state().programs.some((m) => m.id === input.programId)) return null;
  const run: OutcomeRun = {
    id: randomUUID(),
    packId: input.packId,
    countryId: input.countryId,
    programId: input.programId,
    label: input.label,
    kind: input.kind,
    coverage65Plus: clamp(input.coverage65Plus, 0, 1),
    eivUptakeShare: clamp(input.eivUptakeShare, 0, 1),
    winterBurdenIndex: clamp(input.winterBurdenIndex, 0, 1),
    assaySignal: clamp(input.assaySignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().outcomes.unshift(run);
  audit("evaluator", "outcome.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): FluCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  countryId: string;
  programId: string;
  outcomeId: string;
  programBias?: ProgramBias;
  bias?: ProgramBias;
  overclaimRisk?: number;
  hospitalPressure?: number;
  policyStickiness?: number;
  nordicParity?: number;
}): FluCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const country = state().countries.find((m) => m.id === input.countryId);
  const program = state().programs.find((m) => m.id === input.programId);
  const outcome = state().outcomes.find((r) => r.id === input.outcomeId);
  if (!pack || !country || !program || !outcome) return null;

  const fluInput: FluInput = {
    coverage65Plus: clamp(outcome.coverage65Plus, 0, 1),
    eivUptakeShare: clamp(outcome.eivUptakeShare, 0, 1),
    winterBurdenIndex: clamp(outcome.winterBurdenIndex, 0, 1),
    hospitalPressure: clamp(
      input.hospitalPressure ?? 1 - country.parityFloor,
      0,
      1,
    ),
    policyStickiness: clamp(
      input.policyStickiness ?? program.stickinessCeiling,
      0,
      1,
    ),
    nordicParity: clamp(
      input.nordicParity ?? country.parityFloor,
      0,
      1,
    ),
    assaySignal: clamp(outcome.assaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - country.coverageFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    programBias:
      input.programBias ?? input.bias ?? state().org.defaultProgramBias,
    profile: "expanded_eiv_program",
  };

  const expanded = scoreExpandedEiv({
    ...fluInput,
    profile: "expanded_eiv_program",
  });
  const baseline = scoreCurrentPolicy({
    ...fluInput,
    profile: "current_policy_baseline",
  });
  const gap = Math.abs(expanded.overall - baseline.overall);
  let winner: FluCompare["winner"] = "tie";
  if (expanded.overall > baseline.overall + 0.5) {
    winner = "expanded_eiv_program";
  } else if (baseline.overall > expanded.overall + 0.5) {
    winner = "current_policy_baseline";
  }

  const compare: FluCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    countryId: country.id,
    programId: program.id,
    outcomeId: outcome.id,
    input: fluInput,
    expanded,
    baseline,
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

export function getScoreboard(): FluCompare[] {
  return [...state().compares].sort(
    (a, b) => b.expanded.overall - a.expanded.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      countries: state().countries,
      programs: state().programs,
      outcomes: state().outcomes,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,expandedOverall,baselineOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.expanded.overall},${c.baseline.overall},${c.createdAt}`,
    ),
  ];
  return rows.join("\n");
}

export function checkBearer(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice("Bearer ".length).trim();
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
  const org = state().org;
  const bucket = state().rateBucket;
  const nowMs = Date.now();
  if (nowMs - bucket.windowStart > 60_000) {
    bucket.windowStart = nowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  const remaining = Math.max(0, org.rateLimitPerMinute - bucket.count);
  return { ok: bucket.count <= org.rateLimitPerMinute, remaining };
}

export function ingestWebhook(
  idempotencyKey: string,
  payload: unknown,
  signature: string | null,
): { ok: boolean; duplicate?: boolean; id?: string; error?: string } {
  const secret = state().org.webhookSecret;
  if (signature) {
    const expected = createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");
    const provided = signature.replace(/^sha256=/, "");
    try {
      const a = Buffer.from(expected);
      const b = Buffer.from(provided);
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return { ok: false, error: "bad_signature" };
      }
    } catch {
      return { ok: false, error: "bad_signature" };
    }
  }
  const existing = state().webhookEvents.find(
    (e) => e.idempotencyKey === idempotencyKey,
  );
  if (existing) {
    return { ok: true, duplicate: true, id: existing.id };
  }
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

export function featureInventory(): { id: string; label: string }[] {
  return [
    { id: "landing", label: "Marketing landing with buyer outcome" },
    { id: "pricing", label: "Pricing tiers" },
    { id: "demo", label: "Step-by-step guided demo" },
    { id: "onboarding", label: "Onboarding checklist" },
    { id: "flows", label: "Multi-flow index (≥5)" },
    { id: "honesty", label: "Honesty fence" },
    { id: "packs", label: "Program pack registry CRUD" },
    { id: "countries", label: "Country scenario workspace" },
    { id: "programs", label: "EIV program specs" },
    { id: "outcomes", label: "Outcome metric runs" },
    { id: "compare", label: "Dual A/B compare" },
    { id: "scoreboard", label: "Compare scoreboard" },
    { id: "settings", label: "Org settings" },
    { id: "members", label: "Member invite" },
    { id: "audit", label: "Audit trail" },
    { id: "export-json", label: "JSON pack export" },
    { id: "export-csv", label: "CSV compare export" },
    { id: "webhook", label: "Idempotent webhook ingest" },
    { id: "auth", label: "Bearer token auth" },
    { id: "rate-limit", label: "Rate-limit feedback" },
    { id: "search", label: "Pack/country search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "expanded_eiv_program scorer" },
    { id: "scorer-b", label: "current_policy_baseline scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "program-bias", label: "Program bias controls" },
    { id: "archive", label: "Archive packs/countries/programs" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "nordic-kinds", label: "Nordic country kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
