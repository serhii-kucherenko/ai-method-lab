import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { DEV_TOKEN } from "./claim";
import {
  scoreFastIsotopicExchange,
  scoreMultistepProstheticBaseline,
} from "./domain/scoring";
import {
  clamp,
  readinessFromQuality,
  round2,
  type LabelBias,
  type ExchangeKind,
  type ScoreMode,
  type PrecursorKind,
  type TracerKind,
  type FluorideInput,
  type FluorideQuality,
} from "./domain/types";

export type {
  LabelBias,
  ExchangeKind,
  ScoreMode,
  PrecursorKind,
  TracerKind,
  FluorideInput,
  FluorideQuality,
};

export type MemberRole = "owner" | "evaluator" | "viewer";

export type Member = {
  id: string;
  email: string;
  role: MemberRole;
};

export type PackStatus = "active" | "archived" | "draft";

export type LabelPack = {
  id: string;
  label: string;
  version: string;
  tracerFocus: string;
  sessionBudget: number;
  status: PackStatus;
  notes: string;
  createdAt: string;
};

export type EntityStatus = "draft" | "active" | "archived";

export type PrecursorSpec = {
  id: string;
  packId: string;
  label: string;
  kind: PrecursorKind;
  scaffoldHint: string;
  purityFloor: number;
  amineCount: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type ExchangeRun = {
  id: string;
  packId: string;
  label: string;
  kind: ExchangeKind;
  exchangeHint: string;
  cycleMinutes: number;
  exchangeFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type TracerDef = {
  id: string;
  packId: string;
  label: string;
  kind: TracerKind;
  targetHint: string;
  specificActivityFloor: number;
  yieldFloor: number;
  metricHint: string;
  status: EntityStatus;
  notes: string;
  createdAt: string;
};

export type AssayRun = {
  id: string;
  packId: string;
  precursorId: string;
  exchangeId: string;
  tracerId: string;
  exchangeRate: number;
  precursorPurity: number;
  leavingGroupEase: number;
  amineAvailability: number;
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
  defaultLabelBias: LabelBias;
  defaultMode: ScoreMode;
  rateLimitPerMinute: number;
};

export type FluorideCompare = {
  id: string;
  name: string;
  packId: string;
  precursorId: string;
  exchangeId: string;
  tracerId: string;
  assayRunId: string;
  input: FluorideInput;
  exchange: FluorideQuality;
  prosthetic: FluorideQuality;
  winner:
    | "fast_isotopic_exchange"
    | "multistep_prosthetic_baseline"
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
  packs: LabelPack[];
  precursors: PrecursorSpec[];
  exchanges: ExchangeRun[];
  tracers: TracerDef[];
  assayRuns: AssayRun[];
  auditEvents: AuditEvent[];
  compares: FluorideCompare[];
  webhookEvents: WebhookEvent[];
  rateBucket: { windowStart: number; count: number };
};

const g = globalThis as typeof globalThis & {
  __fluorideLabelStore?: StoreState;
};

function now(): string {
  return new Date().toISOString();
}

function seed(): StoreState {
  const packId = "pack-demo";
  const precursorId = "precursor-demo";
  const exchangeId = "exchange-demo";
  const tracerId = "tracer-demo";
  const assayRunId = "assay-demo";
  return {
    org: {
      name: "Fluoride Label Org",
      webhookUrl: "",
      webhookSecret: "fluoride-label-webhook-secret",
      bearerToken: DEV_TOKEN,
      defaultLabelBias: "balanced",
      defaultMode: "fast_isotopic_exchange",
      rateLimitPerMinute: 120,
    },
    members: [
      {
        id: "member-owner",
        email: "lab-auto@fluoride-label.local",
        role: "owner",
      },
    ],
    packs: [
      {
        id: packId,
        label: "Iminosulfur 18F Soft-Sim Pack",
        version: "2026.1",
        tracerFocus:
          "Fast isotopic exchange vs multistep prosthetic baseline",
        sessionBudget: 36,
        status: "active",
        notes:
          "Seed pack for precursors and exchange runs vs prosthetic soft-sim",
        createdAt: now(),
      },
    ],
    precursors: [
      {
        id: precursorId,
        packId,
        label: "Iminosulfur oxydifluoride precursor",
        kind: "iminosulfur_oxydifluoride",
        scaffoldHint: "SuFEx,primary-amine,18F-exchange",
        purityFloor: 0.35,
        amineCount: 1,
        metricHint: "Precursor purity and amine soft-sim",
        status: "active",
        notes:
          "Soft-sim precursors — not wet-lab validated radiopharmaceutical GMP",
        createdAt: now(),
      },
    ],
    exchanges: [
      {
        id: exchangeId,
        packId,
        label: "Late-stage 18F isotopic swap",
        kind: "isotopic_18f_swap",
        exchangeHint: "exchange,cassette,late-stage",
        cycleMinutes: 12,
        exchangeFloor: 0.4,
        metricHint: "Exchange rate and cycle soft-sim",
        status: "active",
        notes: "Soft-sim exchanges — not live cyclotron control",
        createdAt: now(),
      },
    ],
    tracers: [
      {
        id: tracerId,
        packId,
        label: "Small-molecule PET tracer draft",
        kind: "small_molecule_pet",
        targetHint: "CNS,oncology,PET",
        specificActivityFloor: 0.35,
        yieldFloor: 0.4,
        metricHint: "Tracer yield and activity soft-sim",
        status: "active",
        notes:
          "Soft-sim tracers — not clinical PET dosing / not authors’ labeling system",
        createdAt: now(),
      },
    ],
    assayRuns: [
      {
        id: assayRunId,
        packId,
        precursorId,
        exchangeId,
        tracerId,
        exchangeRate: 0.62,
        precursorPurity: 0.7,
        leavingGroupEase: 0.74,
        amineAvailability: 0.68,
        runNotes:
          "Fast exchange looks strong but prosthetic still leads when leaving-group ease is thin",
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
          "Demo pack, precursors, exchanges, tracers, and assay run seeded",
      },
    ],
    compares: [],
    webhookEvents: [],
    rateBucket: { windowStart: Date.now(), count: 0 },
  };
}

function state(): StoreState {
  if (!g.__fluorideLabelStore) g.__fluorideLabelStore = seed();
  return g.__fluorideLabelStore;
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
  g.__fluorideLabelStore = seed();
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
  if (patch.defaultLabelBias !== undefined) {
    org.defaultLabelBias = patch.defaultLabelBias;
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
  items: LabelPack[];
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
        p.tracerFocus.toLowerCase().includes(q) ||
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
  tracerFocus: string;
  sessionBudget?: number;
  notes?: string;
}): LabelPack {
  const pack: LabelPack = {
    id: randomUUID(),
    label: input.label,
    version: input.version,
    tracerFocus: input.tracerFocus,
    sessionBudget: input.sessionBudget ?? 24,
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().packs.unshift(pack);
  audit("owner", "pack.create", pack.label);
  return pack;
}

export function archivePack(id: string): LabelPack | null {
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

export function listPrecursors(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().precursors, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.scaffoldHint.toLowerCase().includes(q),
  });
}

export function createPrecursor(input: {
  packId: string;
  label: string;
  kind: PrecursorKind;
  scaffoldHint: string;
  purityFloor: number;
  amineCount: number;
  metricHint?: string;
  notes?: string;
}): PrecursorSpec | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: PrecursorSpec = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    scaffoldHint: input.scaffoldHint,
    purityFloor: input.purityFloor,
    amineCount: input.amineCount,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().precursors.unshift(row);
  audit("evaluator", "precursor.create", row.label);
  return row;
}

export function archivePrecursor(id: string): PrecursorSpec | null {
  const row = state().precursors.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "precursor.archive", id);
  return row;
}

export function listExchanges(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().exchanges, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.exchangeHint.toLowerCase().includes(q),
  });
}

export function createExchange(input: {
  packId: string;
  label: string;
  kind: ExchangeKind;
  exchangeHint: string;
  cycleMinutes: number;
  exchangeFloor: number;
  metricHint?: string;
  notes?: string;
}): ExchangeRun | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: ExchangeRun = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    exchangeHint: input.exchangeHint,
    cycleMinutes: input.cycleMinutes,
    exchangeFloor: input.exchangeFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().exchanges.unshift(row);
  audit("evaluator", "exchange.create", row.label);
  return row;
}

export function archiveExchange(id: string): ExchangeRun | null {
  const row = state().exchanges.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "exchange.archive", id);
  return row;
}

export function listTracers(opts?: {
  q?: string;
  packId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return listEntity(state().tracers, {
    ...opts,
    extra: (m, q) =>
      m.kind.toLowerCase().includes(q) ||
      m.targetHint.toLowerCase().includes(q),
  });
}

export function createTracer(input: {
  packId: string;
  label: string;
  kind: TracerKind;
  targetHint: string;
  specificActivityFloor: number;
  yieldFloor: number;
  metricHint?: string;
  notes?: string;
}): TracerDef | null {
  if (!state().packs.some((p) => p.id === input.packId)) return null;
  const row: TracerDef = {
    id: randomUUID(),
    packId: input.packId,
    label: input.label,
    kind: input.kind,
    targetHint: input.targetHint,
    specificActivityFloor: input.specificActivityFloor,
    yieldFloor: input.yieldFloor,
    metricHint: input.metricHint ?? "",
    status: "active",
    notes: input.notes ?? "",
    createdAt: now(),
  };
  state().tracers.unshift(row);
  audit("evaluator", "tracer.create", row.label);
  return row;
}

export function archiveTracer(id: string): TracerDef | null {
  const row = state().tracers.find((m) => m.id === id);
  if (!row) return null;
  row.status = "archived";
  audit("evaluator", "tracer.archive", id);
  return row;
}

export function listAssayRuns(opts?: {
  packId?: string;
  precursorId?: string;
  exchangeId?: string;
  tracerId?: string;
  page?: number;
  pageSize?: number;
}): {
  items: AssayRun[];
  total: number;
  page: number;
  pageSize: number;
} {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  let items = [...state().assayRuns];
  if (opts?.packId) items = items.filter((r) => r.packId === opts.packId);
  if (opts?.precursorId)
    items = items.filter((r) => r.precursorId === opts.precursorId);
  if (opts?.exchangeId)
    items = items.filter((r) => r.exchangeId === opts.exchangeId);
  if (opts?.tracerId) items = items.filter((r) => r.tracerId === opts.tracerId);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export function createAssayRun(input: {
  packId: string;
  precursorId: string;
  exchangeId: string;
  tracerId: string;
  exchangeRate: number;
  precursorPurity: number;
  leavingGroupEase: number;
  amineAvailability: number;
  runNotes?: string;
}): AssayRun | null {
  if (!state().packs.some((c) => c.id === input.packId)) return null;
  if (!state().precursors.some((m) => m.id === input.precursorId)) return null;
  if (!state().exchanges.some((m) => m.id === input.exchangeId)) return null;
  if (!state().tracers.some((m) => m.id === input.tracerId)) return null;
  const run: AssayRun = {
    id: randomUUID(),
    packId: input.packId,
    precursorId: input.precursorId,
    exchangeId: input.exchangeId,
    tracerId: input.tracerId,
    exchangeRate: clamp(input.exchangeRate, 0, 1),
    precursorPurity: clamp(input.precursorPurity, 0, 1),
    leavingGroupEase: clamp(input.leavingGroupEase, 0, 1),
    amineAvailability: clamp(input.amineAvailability, 0, 1),
    runNotes: input.runNotes ?? "",
    status: "active",
    createdAt: now(),
  };
  state().assayRuns.unshift(run);
  audit("evaluator", "assay.create", run.id);
  return run;
}

export function listAudits(limit = 50): AuditEvent[] {
  return state().auditEvents.slice(0, limit);
}

export function listCompares(): FluorideCompare[] {
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
  precursorId: string;
  exchangeId: string;
  tracerId: string;
  assayRunId: string;
  labelBias?: LabelBias;
  bias?: LabelBias;
  prostheticStepBurden?: number;
  solventHarshness?: number;
  activationBarrier?: number;
  overclaimRisk?: number;
}): FluorideCompare | null {
  const pack = state().packs.find((c) => c.id === input.packId);
  const precursor = state().precursors.find((m) => m.id === input.precursorId);
  const exchange = state().exchanges.find((m) => m.id === input.exchangeId);
  const tracer = state().tracers.find((m) => m.id === input.tracerId);
  const assayRun = state().assayRuns.find((r) => r.id === input.assayRunId);
  if (!pack || !precursor || !exchange || !tracer || !assayRun) return null;

  const goldWeight = outcomeWeight("review");
  const span = Math.max(0.05, 1 - exchange.exchangeFloor);
  const fluorideInput: FluorideInput = {
    exchangeRate: clamp(assayRun.exchangeRate, 0, 1),
    precursorPurity: clamp(assayRun.precursorPurity, 0, 1),
    leavingGroupEase: clamp(assayRun.leavingGroupEase, 0, 1),
    amineAvailability: clamp(
      (assayRun.amineAvailability + goldWeight) / 2,
      0,
      1,
    ),
    prostheticStepBurden: input.prostheticStepBurden ?? 0.82,
    solventHarshness: input.solventHarshness ?? 0.7,
    activationBarrier:
      input.activationBarrier ?? clamp(0.2 + span * 0.5, 0, 1),
    overclaimRisk: input.overclaimRisk ?? clamp(span > 0.7 ? 0.55 : 0.28, 0, 1),
    labelBias: input.labelBias ?? input.bias ?? state().org.defaultLabelBias,
    profile: "fast_isotopic_exchange",
  };

  const exchangeScore = scoreFastIsotopicExchange({
    ...fluorideInput,
    profile: "fast_isotopic_exchange",
  });
  const prosthetic = scoreMultistepProstheticBaseline({
    ...fluorideInput,
    profile: "multistep_prosthetic_baseline",
  });
  const gap = Math.abs(exchangeScore.overall - prosthetic.overall);
  let winner: FluorideCompare["winner"] = "tie";
  if (exchangeScore.overall > prosthetic.overall + 0.5) {
    winner = "fast_isotopic_exchange";
  } else if (prosthetic.overall > exchangeScore.overall + 0.5) {
    winner = "multistep_prosthetic_baseline";
  }

  const compare: FluorideCompare = {
    id: randomUUID(),
    name: input.name,
    packId: pack.id,
    precursorId: precursor.id,
    exchangeId: exchange.id,
    tracerId: tracer.id,
    assayRunId: assayRun.id,
    input: fluorideInput,
    exchange: exchangeScore,
    prosthetic,
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

export function getScoreboard(): FluorideCompare[] {
  return [...state().compares].sort(
    (a, b) => b.exchange.overall - a.exchange.overall,
  );
}

export function exportPacksJson(): string {
  return JSON.stringify(
    {
      exportedAt: now(),
      packs: state().packs,
      precursors: state().precursors,
      exchanges: state().exchanges,
      tracers: state().tracers,
      assayRuns: state().assayRuns,
    },
    null,
    2,
  );
}

export function exportComparesCsv(): string {
  const rows = [
    "id,name,winner,gap,exchangeOverall,prostheticOverall,createdAt",
    ...state().compares.map(
      (c) =>
        `${c.id},${JSON.stringify(c.name)},${c.winner},${c.gap},${c.exchange.overall},${c.prosthetic.overall},${c.createdAt}`,
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
    { id: "label-packs", name: "Label pack registry" },
    { id: "pack-versions", name: "Versioned label packs" },
    { id: "precursors", name: "Precursor registry" },
    { id: "precursor-editor", name: "Precursor scaffold editor" },
    { id: "precursor-search", name: "Precursor search and filter" },
    { id: "exchanges", name: "Exchange run configs" },
    { id: "exchange-editor", name: "Exchange run editor" },
    { id: "tracers", name: "Tracer registry" },
    { id: "tracer-filters", name: "Tracer target filters" },
    { id: "assay-runs", name: "Assay run soft-sim" },
    { id: "label-bias", name: "Label bias controls" },
    { id: "dual-score", name: "Dual score panel A vs B" },
    {
      id: "compare",
      name: "Fast isotopic exchange vs multistep prosthetic baseline compare",
    },
    { id: "delta-view", name: "Labeling delta view" },
    { id: "scoreboard", name: "Labeling scoreboard" },
    { id: "honesty", name: "Honesty fence" },
    {
      id: "soft-sim",
      name: "Soft-sim not GMP batch release / not live cyclotron / not clinical PET dosing",
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
    { id: "search", name: "Search across packs and precursors" },
    { id: "assays-page", name: "Assay runs workspace" },
  ];
}

export function scorePreview(input: FluorideInput): {
  exchange: FluorideQuality;
  prosthetic: FluorideQuality;
  readiness: ReturnType<typeof readinessFromQuality>;
} {
  const exchange = scoreFastIsotopicExchange({
    ...input,
    profile: "fast_isotopic_exchange",
  });
  const prosthetic = scoreMultistepProstheticBaseline({
    ...input,
    profile: "multistep_prosthetic_baseline",
  });
  return {
    exchange,
    prosthetic,
    readiness: readinessFromQuality(exchange.overall),
  };
}
