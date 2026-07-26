import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreCoverageOnly,
  scoreImmunizationLinked,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type AntigenKind,
  type CountryKind,
  type ImpactBias,
  type ImpactInput,
  type ImpactQuality,
  type PanelKind,
  type ScoreMode,
} from "./domain/types";

export type {
  AntigenKind,
  CountryKind,
  ImpactBias,
  ImpactInput,
  ImpactQuality,
  PanelKind,
  ScoreMode,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type ImpactPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  panelBudget: number;
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
  equityCeiling: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AntigenSpec = {
  id: string;
  packId: string;
  label: string;
  kind: AntigenKind;
  scheduleHint: string;
  coverageFloor: number;
  breadthFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type PanelRun = {
  id: string;
  packId: string;
  countryId: string;
  antigenId: string;
  label: string;
  kind: PanelKind;
  dtp3Coverage: number;
  measlesCoverage: number;
  underFiveMortality: number;
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
  defaultImpactBias: ImpactBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type ImpactCompare = {
  id: string;
  name: string;
  packId: string;
  countryId: string;
  antigenId: string;
  panelId: string;
  input: ImpactInput;
  linked: ImpactQuality;
  coverageOnly: ImpactQuality;
  winner:
    | "immunization_linked_mortality"
    | "coverage_only_dashboard"
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
  packs: ImpactPack[];
  countries: CountrySpec[];
  antigens: AntigenSpec[];
  panels: PanelRun[];
  auditEvents: AuditEvent[];
  compares: ImpactCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __immunizeImpactStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const countryId = "country-demo";
  const antigenId = "antigen-demo";
  const panelId = "panel-demo";
  return {
    org: {
      name: "Immunize Impact Org",
      webhookUrl: "",
      webhookSecret: "immunize-impact-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultImpactBias: "balanced",
      defaultMode: "immunization_linked_mortality",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@immunize-impact.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "SSA Childhood Immunization Impact Soft-Sim Pack",
        version: "2026.1",
        programFocus:
          "Immunization-linked under-five mortality vs coverage-only dashboard",
        panelBudget: 36,
        status: "active",
        notes:
          "Seed pack for country panels, antigen specs, and mortality soft-sim vs coverage-only",
        createdAt: now(),
      },
    ],
    countries: [
      {
        id: countryId,
        packId,
        label: "Kenya under-five panel draft",
        kind: "kenya",
        regionHint: "ssa-east",
        coverageFloor: 0.45,
        equityCeiling: 0.4,
        metricHint: "Country soft-sim",
        status: "active",
        notes:
          "Soft-sim country panels — not live immunization logistics",
        createdAt: now(),
      },
    ],
    antigens: [
      {
        id: antigenId,
        packId,
        label: "DTP3 schedule draft",
        kind: "dtp3",
        scheduleHint: "routine-childhood",
        coverageFloor: 0.4,
        breadthFloor: 0.35,
        metricHint: "Antigen soft-sim",
        status: "active",
        notes: "Soft-sim antigen coverage — not clinical prescribing",
        createdAt: now(),
      },
    ],
    panels: [
      {
        id: panelId,
        packId,
        countryId,
        antigenId,
        label: "Under-five mortality soft-sim",
        kind: "under_five_mortality",
        dtp3Coverage: 0.72,
        measlesCoverage: 0.68,
        underFiveMortality: 0.28,
        assaySignal: 0.7,
        runNotes:
          "Immunization-linked looks strong but coverage-only still leads when equity gap is ignored",
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
        detail: "Demo pack, countries, antigens, and panels seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__immunizeImpactStore) g.__immunizeImpactStore = seed();
  return g.__immunizeImpactStore;
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
  g.__immunizeImpactStore = seed();
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
  if (patch.defaultImpactBias !== undefined) {
    org.defaultImpactBias = patch.defaultImpactBias;
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
  items: ImpactPack[];
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
  panelBudget?: number;
  notes?: string;
}): ImpactPack {
  const pack: ImpactPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    panelBudget: input.panelBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): ImpactPack | null {
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
  equityCeiling: number;
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
    equityCeiling: input.equityCeiling,
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

export function listAntigens(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().antigens, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.scheduleHint.toLowerCase().includes(q),
  });
}

export function createAntigen(input: {
  packId: string;
  label: string;
  kind: AntigenKind;
  scheduleHint: string;
  coverageFloor: number;
  breadthFloor: number;
  metricHint?: string;
  notes?: string;
}): AntigenSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: AntigenSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    scheduleHint: input.scheduleHint,
    coverageFloor: input.coverageFloor,
    breadthFloor: input.breadthFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().antigens.unshift(row);
  audit("evaluator", "antigen.create", row.label);
  return row;
}

export function archiveAntigen(id: string): AntigenSpec | null {
  const row = state().antigens.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "antigen.archive", id);
  return row;
}

export function listPanels(opts?: {
  packId?: string;
  countryId?: string;
  antigenId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PanelRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().panels];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.countryId)
    items = items.filter((r) => r.countryId === opts.countryId);
  if (opts?.antigenId)
    items = items.filter((r) => r.antigenId === opts.antigenId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPanel(input: {
  packId: string;
  countryId: string;
  antigenId: string;
  label: string;
  kind: PanelKind;
  dtp3Coverage: number;
  measlesCoverage: number;
  underFiveMortality: number;
  assaySignal: number;
  runNotes?: string;
}): PanelRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().countries.some((m) => m.id === input.countryId)) return null;
  if (!state().antigens.some((m) => m.id === input.antigenId)) return null;
  const run: PanelRun = {
    id: randomUUID(),
    packId: input.packId,
    countryId: input.countryId,
    antigenId: input.antigenId,
    label: input.label,
    kind: input.kind,
    dtp3Coverage: clamp(input.dtp3Coverage, 0, 1),
    measlesCoverage: clamp(input.measlesCoverage, 0, 1),
    underFiveMortality: clamp(input.underFiveMortality, 0, 1),
    assaySignal: clamp(input.assaySignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().panels.unshift(run);
  audit("evaluator", "panel.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): ImpactCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  countryId: string;
  antigenId: string;
  panelId: string;
  impactBias?: ImpactBias;
  bias?: ImpactBias;
  overclaimRisk?: number;
  equityGap?: number;
  panelYears?: number;
  antigenBreadth?: number;
}): ImpactCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const country = state().countries.find((m) => m.id === input.countryId);
  const antigen = state().antigens.find((m) => m.id === input.antigenId);
  const panel = state().panels.find((r) => r.id === input.panelId);
  if (!pack || !country || !antigen || !panel) return null;

  const impactInput: ImpactInput = {
    dtp3Coverage: clamp(panel.dtp3Coverage, 0, 1),
    measlesCoverage: clamp(panel.measlesCoverage, 0, 1),
    underFiveMortality: clamp(panel.underFiveMortality, 0, 1),
    panelYears: clamp(input.panelYears ?? country.coverageFloor, 0, 1),
    equityGap: clamp(
      input.equityGap ?? country.equityCeiling,
      0,
      1,
    ),
    antigenBreadth: clamp(
      input.antigenBreadth ?? antigen.breadthFloor,
      0,
      1,
    ),
    assaySignal: clamp(panel.assaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - country.coverageFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    impactBias:
      input.impactBias ?? input.bias ?? state().org.defaultImpactBias,
    profile: "immunization_linked_mortality",
  };

  const linked = scoreImmunizationLinked({
    ...impactInput,
    profile: "immunization_linked_mortality",
  });
  const coverageOnly = scoreCoverageOnly({
    ...impactInput,
    profile: "coverage_only_dashboard",
  });
  const gap = Math.abs(linked.overall - coverageOnly.overall);
  let winner: ImpactCompare["winner"] = "tie";
  if (linked.overall > coverageOnly.overall + 0.5) {
    winner = "immunization_linked_mortality";
  } else if (coverageOnly.overall > linked.overall + 0.5) {
    winner = "coverage_only_dashboard";
  }

  const compare: ImpactCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    countryId: country.id,
    antigenId: antigen.id,
    panelId: panel.id,
    input: impactInput,
    linked,
    coverageOnly,
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

export function getScoreboard(): ImpactCompare[] {
  return [...state().compares].sort(
    (a, b) => b.linked.overall - a.linked.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      countries: state().countries,
      antigens: state().antigens,
      panels: state().panels,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,linkedOverall,coverageOnlyOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.linked.overall},${c.coverageOnly.overall},${c.createdAt}`,
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
    { id: "packs", label: "Impact pack registry CRUD" },
    { id: "countries", label: "Country panel workspace" },
    { id: "antigens", label: "Antigen coverage specs" },
    { id: "panels", label: "Mortality / coverage panel runs" },
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
    { id: "scorer-a", label: "immunization_linked_mortality scorer" },
    { id: "scorer-b", label: "coverage_only_dashboard scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "impact-bias", label: "Impact bias controls" },
    { id: "archive", label: "Archive packs/countries/antigens" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "ssa-kinds", label: "SSA country kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
