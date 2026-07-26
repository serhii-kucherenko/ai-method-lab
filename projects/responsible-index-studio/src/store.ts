import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreNaiveCommitmentChecklist,
  scoreStructuredCountryIndex,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type CountryKind,
  type DimensionKind,
  type IndexInput,
  type IndexQuality,
  type IndicatorKind,
  type ScoreMode,
  type ScoringBias,
} from "./domain/types";

export type {
  CountryKind,
  DimensionKind,
  IndexInput,
  IndexQuality,
  IndicatorKind,
  ScoreMode,
  ScoringBias,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type CountryPack = {
  id: string;
  label: string;
  version: string;
  programFocus: string;
  countryBudget: number;
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
  dimensionFloor: number;
  fidelityFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type DimensionSpec = {
  id: string;
  packId: string;
  label: string;
  kind: DimensionKind;
  modelHint: string;
  structuredFloor: number;
  evidenceFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type IndicatorRun = {
  id: string;
  packId: string;
  countryId: string;
  dimensionId: string;
  label: string;
  kind: IndicatorKind;
  structuredDepth: number;
  checklistCoverage: number;
  indicatorFidelity: number;
  indicatorReadout: number;
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
  defaultScoringBias: ScoringBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type IndexCompare = {
  id: string;
  name: string;
  packId: string;
  countryId: string;
  dimensionId: string;
  indicatorId: string;
  input: IndexInput;
  structured: IndexQuality;
  checklist: IndexQuality;
  winner:
    | "structured_country_index"
    | "naive_commitment_checklist"
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
  packs: CountryPack[];
  countries: CountrySpec[];
  dimensions: DimensionSpec[];
  indicators: IndicatorRun[];
  auditEvents: AuditEvent[];
  compares: IndexCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __responsibleIndexStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const countryId = "country-demo";
  const dimensionId = "dimension-demo";
  const indicatorId = "indicator-demo";
  return {
    org: {
      name: "Responsible Index Org",
      webhookUrl: "",
      webhookSecret: "responsible-index-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultScoringBias: "balanced",
      defaultMode: "structured_country_index",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@responsible-index.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "OECD Peer Country Pack",
        version: "2026.1",
        programFocus:
          "Structured country index vs naive commitment checklist soft-sim",
        countryBudget: 36,
        status: "active",
        notes: "Seed pack for countries, dimensions, and indicator runs",
        createdAt: now(),
      },
    ],
    countries: [
      {
        id: countryId,
        packId,
        label: "Composite OECD peer draft",
        kind: "oecd_peer",
        regionHint: "region-oecd-a",
        dimensionFloor: 0.4,
        fidelityFloor: 0.45,
        metricHint: "Country soft-sim",
        status: "active",
        notes: "Soft-sim country panel — not live national policy authority",
        createdAt: now(),
      },
    ],
    dimensions: [
      {
        id: dimensionId,
        packId,
        label: "Governance oversight dimension draft",
        kind: "governance_oversight",
        modelHint: "structured-country-index",
        structuredFloor: 0.4,
        evidenceFloor: 0.35,
        metricHint: "Dimension soft-sim",
        status: "active",
        notes: "Soft-sim dimension — not certified AI audit",
        createdAt: now(),
      },
    ],
    indicators: [
      {
        id: indicatorId,
        packId,
        countryId,
        dimensionId,
        label: "Commitment evidence / dual-gate soft-sim",
        kind: "dual_gate_soft_sim",
        structuredDepth: 0.42,
        checklistCoverage: 0.32,
        indicatorFidelity: 0.7,
        indicatorReadout: 0.68,
        runNotes:
          "Structured path looks strong on multi-dimension depth but checklist still leads when dimensions are ignored",
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
        detail: "Demo pack, countries, dimensions, and indicators seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__responsibleIndexStore) g.__responsibleIndexStore = seed();
  return g.__responsibleIndexStore;
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
  g.__responsibleIndexStore = seed();
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
  if (patch.defaultScoringBias !== undefined) {
    org.defaultScoringBias = patch.defaultScoringBias;
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
  items: CountryPack[];
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
  countryBudget?: number;
  notes?: string;
}): CountryPack {
  const pack: CountryPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    programFocus: input.programFocus,
    countryBudget: input.countryBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): CountryPack | null {
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
  dimensionFloor: number;
  fidelityFloor: number;
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
    dimensionFloor: input.dimensionFloor,
    fidelityFloor: input.fidelityFloor,
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

export function listDimensions(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().dimensions, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.modelHint.toLowerCase().includes(q),
  });
}

export function createDimension(input: {
  packId: string;
  label: string;
  kind: DimensionKind;
  modelHint: string;
  structuredFloor: number;
  evidenceFloor: number;
  metricHint?: string;
  notes?: string;
}): DimensionSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: DimensionSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    modelHint: input.modelHint,
    structuredFloor: input.structuredFloor,
    evidenceFloor: input.evidenceFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().dimensions.unshift(row);
  audit("evaluator", "dimension.create", row.label);
  return row;
}

export function archiveDimension(id: string): DimensionSpec | null {
  const row = state().dimensions.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "dimension.archive", id);
  return row;
}

export function listIndicators(opts?: {
  packId?: string;
  countryId?: string;
  dimensionId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: IndicatorRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().indicators];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.countryId)
    items = items.filter((r) => r.countryId === opts.countryId);
  if (opts?.dimensionId)
    items = items.filter((r) => r.dimensionId === opts.dimensionId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createIndicator(input: {
  packId: string;
  countryId: string;
  dimensionId: string;
  label: string;
  kind: IndicatorKind;
  structuredDepth: number;
  checklistCoverage: number;
  indicatorFidelity: number;
  indicatorReadout: number;
  runNotes?: string;
}): IndicatorRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().countries.some((m) => m.id === input.countryId)) return null;
  if (!state().dimensions.some((m) => m.id === input.dimensionId)) return null;
  const run: IndicatorRun = {
    id: randomUUID(),
    packId: input.packId,
    countryId: input.countryId,
    dimensionId: input.dimensionId,
    label: input.label,
    kind: input.kind,
    structuredDepth: clamp(input.structuredDepth, 0, 1),
    checklistCoverage: clamp(input.checklistCoverage, 0, 1),
    indicatorFidelity: clamp(input.indicatorFidelity, 0, 1),
    indicatorReadout: clamp(input.indicatorReadout, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().indicators.unshift(run);
  audit("evaluator", "indicator.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): IndexCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  countryId: string;
  dimensionId: string;
  indicatorId: string;
  scoringBias?: ScoringBias;
  bias?: ScoringBias;
  overclaimRisk?: number;
  dimensionCompleteness?: number;
  evidenceStrength?: number;
  countryFollowThrough?: number;
}): IndexCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const country = state().countries.find((m) => m.id === input.countryId);
  const dimension = state().dimensions.find((m) => m.id === input.dimensionId);
  const indicator = state().indicators.find((r) => r.id === input.indicatorId);
  if (!pack || !country || !dimension || !indicator) return null;

  const indexInput: IndexInput = {
    structuredDepth: clamp(indicator.structuredDepth, 0, 1),
    checklistCoverage: clamp(indicator.checklistCoverage, 0, 1),
    indicatorFidelity: clamp(indicator.indicatorFidelity, 0, 1),
    dimensionCompleteness: clamp(
      input.dimensionCompleteness ?? country.dimensionFloor,
      0,
      1,
    ),
    evidenceStrength: clamp(
      input.evidenceStrength ?? dimension.evidenceFloor,
      0,
      1,
    ),
    countryFollowThrough: clamp(
      input.countryFollowThrough ?? country.fidelityFloor,
      0,
      1,
    ),
    indicatorReadout: clamp(indicator.indicatorReadout, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - dimension.structuredFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    scoringBias:
      input.scoringBias ?? input.bias ?? state().org.defaultScoringBias,
    profile: "structured_country_index",
  };

  const structured = scoreStructuredCountryIndex({
    ...indexInput,
    profile: "structured_country_index",
  });
  const checklist = scoreNaiveCommitmentChecklist({
    ...indexInput,
    profile: "naive_commitment_checklist",
  });
  const gap = Math.abs(structured.overall - checklist.overall);
  let winner: IndexCompare["winner"] = "tie";
  if (structured.overall > checklist.overall + 0.5) {
    winner = "structured_country_index";
  } else if (checklist.overall > structured.overall + 0.5) {
    winner = "naive_commitment_checklist";
  }

  const compare: IndexCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    countryId: country.id,
    dimensionId: dimension.id,
    indicatorId: indicator.id,
    input: indexInput,
    structured,
    checklist,
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

export function getScoreboard(): IndexCompare[] {
  return [...state().compares].sort(
    (a, b) => b.structured.overall - a.structured.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      countries: state().countries,
      dimensions: state().dimensions,
      indicators: state().indicators,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,structuredOverall,checklistOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.structured.overall},${c.checklist.overall},${c.createdAt}`,
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
    { id: "packs", label: "Country pack registry CRUD" },
    { id: "countries", label: "Country workspace" },
    { id: "dimensions", label: "Index dimension specs" },
    { id: "indicators", label: "Indicator runs" },
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
    { id: "scorer-a", label: "structured_country_index scorer" },
    { id: "scorer-b", label: "naive_commitment_checklist scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "scoring-bias", label: "Scoring bias controls" },
    { id: "archive", label: "Archive packs/countries/dimensions" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "country-kinds", label: "Country cohort kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
