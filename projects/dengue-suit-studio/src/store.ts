import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreCmip6Thermal,
  scoreStaticHistorical,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type ClimateBias,
  type PopulationKind,
  type ScenarioKind,
  type ScoreMode,
  type SpeciesKind,
  type SuitInput,
  type SuitQuality,
} from "./domain/types";

export type {
  ClimateBias,
  PopulationKind,
  ScenarioKind,
  ScoreMode,
  SpeciesKind,
  SuitInput,
  SuitQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type RiskPack = {
  id: string;
  label: string;
  version: string;
  riskFocus: string;
  gridBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type ScenarioSpec = {
  id: string;
  packId: string;
  label: string;
  kind: ScenarioKind;
  horizonHint: string;
  thermalFloor: number;
  shiftFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type SpeciesSpec = {
  id: string;
  packId: string;
  label: string;
  kind: SpeciesKind;
  nicheHint: string;
  nicheFloor: number;
  stickinessCeiling: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type PopulationOverlay = {
  id: string;
  packId: string;
  scenarioId: string;
  speciesId: string;
  label: string;
  kind: PopulationKind;
  thermalSuitIndex: number;
  populationAtRisk: number;
  climateShiftSignal: number;
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
  defaultClimateBias: ClimateBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type SuitCompare = {
  id: string;
  name: string;
  packId: string;
  scenarioId: string;
  speciesId: string;
  populationId: string;
  input: SuitInput;
  cmip6: SuitQuality;
  historical: SuitQuality;
  winner:
    | "cmip6_thermal_suitability"
    | "static_historical_baseline"
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
  packs: RiskPack[];
  scenarios: ScenarioSpec[];
  species: SpeciesSpec[];
  populations: PopulationOverlay[];
  auditEvents: AuditEvent[];
  compares: SuitCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __dengueSuitStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const scenarioId = "scenario-demo";
  const speciesId = "species-demo";
  const populationId = "population-demo";
  return {
    org: {
      name: "Dengue Suit Org",
      webhookUrl: "",
      webhookSecret: "dengue-suit-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultClimateBias: "balanced",
      defaultMode: "cmip6_thermal_suitability",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@dengue-suit.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "CMIP6 Dengue Thermal Suit Soft-Sim Pack",
        version: "2026.1",
        riskFocus:
          "CMIP6 thermal suitability vs static historical baseline",
        gridBudget: 36,
        status: "active",
        notes:
          "Seed pack for scenarios, species, and population soft-sim vs historical baseline",
        createdAt: now(),
      },
    ],
    scenarios: [
      {
        id: scenarioId,
        packId,
        label: "SSP5-8.5 mid-century draft",
        kind: "ssp585",
        horizonHint: "2040-2060,CMIP6-ensemble",
        thermalFloor: 0.45,
        shiftFloor: 0.4,
        metricHint: "Scenario soft-sim",
        status: "active",
        notes:
          "Soft-sim climate scenarios — not live outbreak forecast layers",
        createdAt: now(),
      },
    ],
    species: [
      {
        id: speciesId,
        packId,
        label: "Aedes aegypti niche draft",
        kind: "aedes_aegypti",
        nicheHint: "urban-container-breeder",
        nicheFloor: 0.4,
        stickinessCeiling: 0.35,
        metricHint: "Species-niche soft-sim",
        status: "active",
        notes: "Soft-sim vector niche — not operational control deployment",
        createdAt: now(),
      },
    ],
    populations: [
      {
        id: populationId,
        packId,
        scenarioId,
        speciesId,
        label: "Urban density overlay soft-sim",
        kind: "urban_density",
        thermalSuitIndex: 0.72,
        populationAtRisk: 0.68,
        climateShiftSignal: 0.74,
        assaySignal: 0.7,
        runNotes:
          "CMIP6 thermal shift looks strong but historical baseline still leads when stickiness is high",
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
        detail: "Demo pack, scenarios, species, and population seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__dengueSuitStore) g.__dengueSuitStore = seed();
  return g.__dengueSuitStore;
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
  g.__dengueSuitStore = seed();
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
  if (patch.defaultClimateBias !== undefined) {
    org.defaultClimateBias = patch.defaultClimateBias;
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
  items: RiskPack[];
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
        p.riskFocus.toLowerCase().includes(q) ||
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
  riskFocus: string;
  gridBudget?: number;
  notes?: string;
}): RiskPack {
  const pack: RiskPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    riskFocus: input.riskFocus,
    gridBudget: input.gridBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): RiskPack | null {
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

export function listScenarios(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().scenarios, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.horizonHint.toLowerCase().includes(q),
  });
}

export function createScenario(input: {
  packId: string;
  label: string;
  kind: ScenarioKind;
  horizonHint: string;
  thermalFloor: number;
  shiftFloor: number;
  metricHint?: string;
  notes?: string;
}): ScenarioSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ScenarioSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    horizonHint: input.horizonHint,
    thermalFloor: input.thermalFloor,
    shiftFloor: input.shiftFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().scenarios.unshift(row);
  audit("evaluator", "scenario.create", row.label);
  return row;
}

export function archiveScenario(id: string): ScenarioSpec | null {
  const row = state().scenarios.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "scenario.archive", id);
  return row;
}

export function listSpecies(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().species, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) || m.nicheHint.toLowerCase().includes(q),
  });
}

export function createSpecies(input: {
  packId: string;
  label: string;
  kind: SpeciesKind;
  nicheHint: string;
  nicheFloor: number;
  stickinessCeiling: number;
  metricHint?: string;
  notes?: string;
}): SpeciesSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: SpeciesSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    nicheHint: input.nicheHint,
    nicheFloor: input.nicheFloor,
    stickinessCeiling: input.stickinessCeiling,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().species.unshift(row);
  audit("evaluator", "species.create", row.label);
  return row;
}

export function archiveSpecies(id: string): SpeciesSpec | null {
  const row = state().species.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "species.archive", id);
  return row;
}

export function listPopulations(opts?: {
  packId?: string;
  scenarioId?: string;
  speciesId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PopulationOverlay[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().populations];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.scenarioId)
    items = items.filter((r) => r.scenarioId === opts.scenarioId);
  if (opts?.speciesId)
    items = items.filter((r) => r.speciesId === opts.speciesId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createPopulation(input: {
  packId: string;
  scenarioId: string;
  speciesId: string;
  label: string;
  kind: PopulationKind;
  thermalSuitIndex: number;
  populationAtRisk: number;
  climateShiftSignal: number;
  assaySignal: number;
  runNotes?: string;
}): PopulationOverlay | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().scenarios.some((m) => m.id === input.scenarioId)) return null;
  if (!state().species.some((m) => m.id === input.speciesId)) return null;
  const run: PopulationOverlay = {
    id: randomUUID(),
    packId: input.packId,
    scenarioId: input.scenarioId,
    speciesId: input.speciesId,
    label: input.label,
    kind: input.kind,
    thermalSuitIndex: clamp(input.thermalSuitIndex, 0, 1),
    populationAtRisk: clamp(input.populationAtRisk, 0, 1),
    climateShiftSignal: clamp(input.climateShiftSignal, 0, 1),
    assaySignal: clamp(input.assaySignal, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().populations.unshift(run);
  audit("evaluator", "population.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): SuitCompare[] {
  return [...state().compares];
}

export function runCompare(input: {
  name: string;
  packId: string;
  scenarioId: string;
  speciesId: string;
  populationId: string;
  climateBias?: ClimateBias;
  bias?: ClimateBias;
  overclaimRisk?: number;
  vectorNicheFidelity?: number;
  spatialCoverage?: number;
  historicalStickiness?: number;
}): SuitCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const scenario = state().scenarios.find((m) => m.id === input.scenarioId);
  const species = state().species.find((m) => m.id === input.speciesId);
  const population = state().populations.find(
    (r) => r.id === input.populationId,
  );
  if (!pack || !scenario || !species || !population) return null;

  const suitInput: SuitInput = {
    thermalSuitIndex: clamp(population.thermalSuitIndex, 0, 1),
    populationAtRisk: clamp(population.populationAtRisk, 0, 1),
    climateShiftSignal: clamp(population.climateShiftSignal, 0, 1),
    vectorNicheFidelity: clamp(
      input.vectorNicheFidelity ?? species.nicheFloor,
      0,
      1,
    ),
    spatialCoverage: clamp(
      input.spatialCoverage ?? scenario.thermalFloor,
      0,
      1,
    ),
    historicalStickiness: clamp(
      input.historicalStickiness ?? species.stickinessCeiling,
      0,
      1,
    ),
    assaySignal: clamp(population.assaySignal, 0, 1),
    overclaimRisk:
      input.overclaimRisk ??
      clamp(1 - scenario.shiftFloor > 0.5 ? 0.55 : 0.28, 0, 1),
    climateBias:
      input.climateBias ?? input.bias ?? state().org.defaultClimateBias,
    profile: "cmip6_thermal_suitability",
  };

  const cmip6 = scoreCmip6Thermal({
    ...suitInput,
    profile: "cmip6_thermal_suitability",
  });
  const historical = scoreStaticHistorical({
    ...suitInput,
    profile: "static_historical_baseline",
  });
  const gap = Math.abs(cmip6.overall - historical.overall);
  let winner: SuitCompare["winner"] = "tie";
  if (cmip6.overall > historical.overall + 0.5) {
    winner = "cmip6_thermal_suitability";
  } else if (historical.overall > cmip6.overall + 0.5) {
    winner = "static_historical_baseline";
  }

  const compare: SuitCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    scenarioId: scenario.id,
    speciesId: species.id,
    populationId: population.id,
    input: suitInput,
    cmip6,
    historical,
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

export function getScoreboard(): SuitCompare[] {
  return [...state().compares].sort(
    (a, b) => b.cmip6.overall - a.cmip6.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      scenarios: state().scenarios,
      species: state().species,
      populations: state().populations,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,cmip6Overall,historicalOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.cmip6.overall},${c.historical.overall},${c.createdAt}`,
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
    { id: "packs", label: "Risk pack registry CRUD" },
    { id: "scenarios", label: "CMIP6 scenario workspace" },
    { id: "species", label: "Vector species niche specs" },
    { id: "populations", label: "Population-at-risk overlays" },
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
    { id: "search", label: "Pack/scenario search" },
    { id: "pagination", label: "List pagination" },
    { id: "goldens", label: "≥30 dual-impl goldens" },
    { id: "scorer-a", label: "cmip6_thermal_suitability scorer" },
    { id: "scorer-b", label: "static_historical_baseline scorer" },
    { id: "try-html", label: "Offline try.html demo" },
    { id: "readiness", label: "Pack lock readiness" },
    { id: "features-api", label: "Feature inventory API" },
    {
      id: "readiness-helper",
      label: `Readiness helper (${readinessFromQuality(80)})`,
    },
    { id: "climate-bias", label: "Climate bias controls" },
    { id: "archive", label: "Archive packs/scenarios/species" },
    { id: "hmac", label: "HMAC webhook signatures" },
    { id: "goldens-sample", label: "Goldens sample API" },
    { id: "multi-tenant", label: "Org-scoped soft-sim store" },
    { id: "guide", label: "In-app guide link" },
    { id: "ssp-kinds", label: "SSP126–SSP585 scenario kinds" },
  ];
}

export { readinessFromQuality, round2, clamp };
